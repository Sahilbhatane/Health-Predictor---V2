import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")
const SKIP_DIR_NAMES = new Set([".next", "node_modules", ".git"])

/** @param {string} dir */
function* walkFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (SKIP_DIR_NAMES.has(e.name)) continue
      yield* walkFiles(full)
    } else if (/\.(tsx|ts|jsx|js|css|mdx)$/i.test(e.name)) {
      yield full
    }
  }
}

const NEEDLE = "99, 102, 241"
const hits = []
for (const file of walkFiles(ROOT)) {
  const text = fs.readFileSync(file, "utf8")
  if (text.includes(NEEDLE)) {
    hits.push(path.relative(ROOT, file))
  }
}

if (hits.length) {
  console.error(`Forbidden indigo literal "${NEEDLE}" found in:\n${hits.join("\n")}`)
  process.exit(1)
}
console.log("Theme palette guard: no forbidden indigo literal under frontend/.")
process.exit(0)
