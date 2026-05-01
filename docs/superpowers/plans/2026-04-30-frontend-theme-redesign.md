# Frontend theme redesign implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship approved dark (neutral glass) and light (emerald + lime) themes across the Next.js frontend, remove indigo/violet/purple global chrome, preserve navbar orange cursor-follow behavior, and align pointer-driven glows with parent control colors.

**Architecture:** Centralize appearance in `frontend/app/globals.css` OKLCH design tokens and shared `.glass*` / `.neon*` utilities; replace hardcoded Tailwind color classes and inline `rgba` in scoped components per `docs/superpowers/specs/2026-04-30-frontend-theme-design.md`. A small Node guard script enforces absence of the old indigo literal in the repo’s `frontend/` tree after the sweep.

**Tech stack:** Next.js 15, React 19, Tailwind CSS v4 (`@import "tailwindcss"`), shadcn-style CSS variables, Framer Motion, Node.js for the guard script (no extra npm deps).

**Source spec:** `docs/superpowers/specs/2026-04-30-frontend-theme-design.md`

---

## File map (what changes)

| File | Responsibility |
|------|----------------|
| `frontend/app/globals.css` | `:root` / `.dark` OKLCH tokens; `.glass`, `.glass-card`, `.glass-enhanced`, `.neon-glow*`, scrollbar rules |
| `frontend/components/floating-navbar.tsx` | Idle pill border/shadow/logo/wordmark neutrals + brand greens; **do not** edit orange `glowPosition` layers’ colors, positions, blur radii, or `animate` transitions |
| `frontend/app/page.tsx` | Hero, trust row, CTAs, Start Prediction cursor-follow + `boxShadow` |
| `frontend/components/prediction-tabs.tsx` | Section chrome, tab card borders, hover gradient, pulse keyframes colors |
| `frontend/components/contact-section.tsx` | Headings, icon tiles, submit button, decorative blurs, inline `border` styles |
| `frontend/components/user-menu.tsx` | Subscription CTA strip gradients |
| `frontend/components/subscription-modal.tsx` | Plan highlight gradients |
| `frontend/components/auth-guard.tsx` | Bullet / accent copy colors |
| `frontend/app/predict/heart/page.tsx` | Blobs, logo lockup, hero gradients, glass border (red family; drop pink where spec says) |
| `frontend/app/predict/diabetes/page.tsx` | Teal/cyan identity; remove blue–violet |
| `frontend/app/predict/parkinsons/page.tsx` | Forest/teal identity; remove purple/indigo/violet |
| `frontend/app/predict/common-diseases/page.tsx` | Align greens with emerald if needed |
| `frontend/components/forms/heart-prediction-form.tsx` | Replace purple/pink progress defaults with red/rose/neutral |
| `frontend/components/forms/diabetes-prediction-form.tsx` | Replace purple/pink bars/icons with teal/cyan |
| `frontend/components/forms/parkinsons-prediction-form.tsx` | Replace purple/indigo/pink with forest/teal |
| `frontend/components/forms/common-diseases-prediction-form.tsx` | Replace purple/pink with green/emerald |
| `frontend/scripts/verify-theme-palette.mjs` | CI-friendly guard: fail if forbidden indigo literal appears under `frontend/` |

---

### Task 1: Theme palette guard script

**Files:**
- Create: `frontend/scripts/verify-theme-palette.mjs`
- Modify: `frontend/package.json` (add `"verify:theme": "node scripts/verify-theme-palette.mjs"`)

- [ ] **Step 1: Add the script**

Create `frontend/scripts/verify-theme-palette.mjs`:

```javascript
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
```

- [ ] **Step 2: Wire npm script**

In `frontend/package.json`, inside `"scripts"`, add:

```json
"verify:theme": "node scripts/verify-theme-palette.mjs"
```

- [ ] **Step 3: Run guard on current tree (baseline)**

Run from repo root:

```bash
cd frontend
npm run verify:theme
```

**Expected before theme work:** Exit code **1** and a list of files (many), proving the guard fires.

- [ ] **Step 4: Commit**

```bash
git add frontend/scripts/verify-theme-palette.mjs frontend/package.json
git commit -m "Add frontend theme palette guard script and npm script."
```

---

### Task 2: `globals.css` — light tokens, dark tokens, glass, neon, scrollbar

**Files:**
- Modify: `frontend/app/globals.css` (replace `:root`, `.dark`, and utility blocks listed below)

- [ ] **Step 1: Replace `:root` block** (lines ~6–41) with light theme B — use these exact values:

```css
:root {
  --background: oklch(0.99 0.012 125);
  --foreground: oklch(0.18 0.02 150);
  --card: oklch(0.985 0.01 125);
  --card-foreground: oklch(0.18 0.02 150);
  --popover: oklch(0.985 0.01 125);
  --popover-foreground: oklch(0.18 0.02 150);
  --primary: oklch(0.52 0.14 158);
  --primary-foreground: oklch(0.99 0.01 125);
  --secondary: oklch(0.94 0.06 125);
  --secondary-foreground: oklch(0.22 0.04 150);
  --muted: oklch(0.94 0.02 125);
  --muted-foreground: oklch(0.45 0.03 150);
  --accent: oklch(0.92 0.08 125);
  --accent-foreground: oklch(0.2 0.04 150);
  --destructive: oklch(0.55 0.2 25);
  --destructive-foreground: oklch(0.99 0 0);
  --border: oklch(0.88 0.03 130);
  --input: oklch(0.9 0.025 130);
  --ring: oklch(0.52 0.14 158);
  --chart-1: oklch(0.52 0.14 158);
  --chart-2: oklch(0.65 0.16 125);
  --chart-3: oklch(0.72 0.14 115);
  --chart-4: oklch(0.48 0.12 170);
  --chart-5: oklch(0.58 0.1 145);
  --radius: 0.5rem;
  --sidebar: oklch(0.97 0.015 125);
  --sidebar-foreground: oklch(0.18 0.02 150);
  --sidebar-primary: oklch(0.52 0.14 158);
  --sidebar-primary-foreground: oklch(0.99 0.01 125);
  --sidebar-accent: oklch(0.92 0.08 125);
  --sidebar-accent-foreground: oklch(0.2 0.04 150);
  --sidebar-border: oklch(0.88 0.03 130);
  --sidebar-ring: oklch(0.52 0.14 158);
}
```

- [ ] **Step 2: Replace `.dark` block** (lines ~43–77) with achromatic dark:

```css
.dark {
  --background: oklch(0.06 0 0);
  --foreground: oklch(0.96 0 0);
  --card: oklch(0.1 0 0);
  --card-foreground: oklch(0.96 0 0);
  --popover: oklch(0.1 0 0);
  --popover-foreground: oklch(0.96 0 0);
  --primary: oklch(0.93 0 0);
  --primary-foreground: oklch(0.08 0 0);
  --secondary: oklch(0.14 0 0);
  --secondary-foreground: oklch(0.94 0 0);
  --muted: oklch(0.12 0 0);
  --muted-foreground: oklch(0.72 0 0);
  --accent: oklch(0.16 0 0);
  --accent-foreground: oklch(0.96 0 0);
  --destructive: oklch(0.55 0.2 25);
  --destructive-foreground: oklch(0.99 0 0);
  --border: oklch(0.22 0 0);
  --input: oklch(0.18 0 0);
  --ring: oklch(0.88 0 0);
  --chart-1: oklch(0.75 0 0);
  --chart-2: oklch(0.65 0 0);
  --chart-3: oklch(0.55 0 0);
  --chart-4: oklch(0.85 0 0);
  --chart-5: oklch(0.45 0 0);
  --sidebar: oklch(0.08 0 0);
  --sidebar-foreground: oklch(0.96 0 0);
  --sidebar-primary: oklch(0.93 0 0);
  --sidebar-primary-foreground: oklch(0.08 0 0);
  --sidebar-accent: oklch(0.14 0 0);
  --sidebar-accent-foreground: oklch(0.96 0 0);
  --sidebar-border: oklch(0.2 0 0);
  --sidebar-ring: oklch(0.88 0 0);
}
```

- [ ] **Step 3: Update glass and neon utilities** — replace indigo `rgba(99, 102, 241, …)` with neutral glass (example; tune alphas if contrast checks fail):

```css
.glass-enhanced {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(25px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.neon-glow {
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.25), 0 0 10px rgba(255, 255, 255, 0.15),
    0 0 15px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 0.06);
}

.neon-glow-enhanced {
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.2), 0 0 10px rgba(255, 255, 255, 0.12),
    0 0 15px rgba(255, 255, 255, 0.08), 0 0 20px rgba(255, 255, 255, 0.05), 0 0 35px rgba(255, 255, 255, 0.03);
  transition: box-shadow 0.3s ease;
}

.neon-glow-enhanced:hover {
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.35), 0 0 10px rgba(255, 255, 255, 0.22),
    0 0 15px rgba(255, 255, 255, 0.14), 0 0 20px rgba(255, 255, 255, 0.1), 0 0 35px rgba(255, 255, 255, 0.06);
}
```

Keep `.glass` / `.glass-card` structure; swap any slate/indigo tints to `rgba(255,255,255,…)` / `rgba(15,23,42,…)` as appropriate for light-on-dark glass.

- [ ] **Step 4: Run lint**

```bash
cd frontend
npm run lint
```

**Expected:** No new ESLint errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/app/globals.css
git commit -m "Remap theme tokens and neutral glass utilities for dark and light modes."
```

---

### Task 3: Floating navbar — idle chrome and brand, preserve orange follow

**Files:**
- Modify: `frontend/components/floating-navbar.tsx`

- [ ] **Step 1: Idle border and `boxShadow`** on the main `motion.div` (inline `style` ~127–133 and mobile menu ~316–318): replace `rgba(99, 102, 241, …)` with neutral silver, e.g. `rgba(255, 255, 255, 0.14)` (dark) and `rgba(15, 23, 42, 0.12)` (light).

- [ ] **Step 2: “Dynamic Orange Border Glow” layer** (~188–204): replace **non-hover** indigo `border` / `boxShadow` strings with the same neutral silver as Step 1; keep `isHovering` branches that switch to orange `rgba(255, 165, 0, …)` unchanged in behavior.

- [ ] **Step 3: Logo circle and wordmark** (~210–214): replace `from-blue-500 to-violet-500` and `from-blue-400 to-violet-400` with `from-emerald-500 to-lime-400` (or `to-teal-400`) so brand matches palette B.

- [ ] **Step 4: `navItems` accent dots** (~73–103): replace `text-purple-400`, `text-blue-400`, `text-indigo-400` with condition-appropriate hues (e.g. Parkinson’s `text-teal-400`, Diabetes `text-cyan-400`, Information `text-emerald-400`) — no purple/indigo.

- [ ] **Step 5: Verify orange follow blocks untouched** — the two `motion.div` layers using `glowPosition` and `rgba(255, 165, 0` / `rgba(255, 140, 0` / `rgba(255, 69, 0` must remain byte-identical in color strings and `animate` props.

- [ ] **Step 6: Commit**

```bash
git add frontend/components/floating-navbar.tsx
git commit -m "Retheme navbar idle chrome and logo while preserving orange cursor glow."
```

---

### Task 4: Home page — hero, pills, CTA, cursor-follow

**Files:**
- Modify: `frontend/app/page.tsx`

- [ ] **Step 1:** Replace hero icon gradient, title gradient, neon shadow, and feature pills (`blue` / `indigo` / `violet`) with **emerald** / **lime** / **teal** equivalents per spec §3.

- [ ] **Step 2:** “Start Prediction” button — `className` gradient: use `from-emerald-600 to-teal-600` (or `to-lime-600`); replace `style.boxShadow` blues with emerald/lime rgba, e.g. `0 0 25px rgba(16, 185, 129, 0.55), 0 0 50px rgba(132, 204, 22, 0.35)`.

- [ ] **Step 3:** Cursor-follow `motion.div` `background` radial (~192): use `rgba(16, 185, 129, 0.85)` → `rgba(132, 204, 22, 0.5)` → `transparent` stops (match parent CTA).

- [ ] **Step 4:** Trust row: change `bg-blue-500` / `text-blue-400` to **cyan or slate**; change `bg-purple-500` / `text-purple-400` to **lime or emerald** so no purple/blue-purple row.

- [ ] **Step 5:** Footer / secondary blocks that still use `from-blue-500 to-violet-500` → emerald/lime.

- [ ] **Step 6:** `npm run lint` then commit:

```bash
git add frontend/app/page.tsx
git commit -m "Retheme home page hero, CTAs, and cursor-follow to emerald and lime."
```

---

### Task 5: Prediction tabs — section chrome and card interactions

**Files:**
- Modify: `frontend/components/prediction-tabs.tsx`

- [ ] **Step 1:** Replace pill `from-blue-500/10 to-violet-500/10` and heading `from-blue-400 via-indigo-400 to-violet-400` with emerald/lime gradients.

- [ ] **Step 2:** Per-tab config: update `color` and `glowColor` Tailwind classes — Parkinson entry must not use `purple` / `indigo`; use `teal` / `emerald`.

- [ ] **Step 3:** Inline `border` and `linear-gradient` using `rgba(99, 102, 241` — replace with `rgba(16, 185, 129, …)` or the active card’s accent rgba.

- [ ] **Step 4:** `group-hover:from-blue-400 group-hover:to-violet-400` → emerald/lime; `animate-pulse` boxShadow rgba indigo → emerald.

- [ ] **Step 5:** Lint and commit:

```bash
git add frontend/components/prediction-tabs.tsx
git commit -m "Retheme prediction tabs headers and card hover glows away from indigo."
```

---

### Task 6: Contact section

**Files:**
- Modify: `frontend/components/contact-section.tsx`

- [ ] **Step 1:** Heading gradient, icon tile gradient, submit button, inline `border: "1px solid rgba(99, 102, 241`", decorative blurs — all emerald/lime/teal as appropriate; no `rgba(99, 102, 241`.

- [ ] **Step 2:** Lint and commit:

```bash
git add frontend/components/contact-section.tsx
git commit -m "Retheme contact section gradients and glass border to palette B."
```

---

### Task 7: User menu and subscription modal

**Files:**
- Modify: `frontend/components/user-menu.tsx`
- Modify: `frontend/components/subscription-modal.tsx`

- [ ] **Step 1:** Replace `from-blue-500/20 to-purple-500/20` (and hover variants) with `from-emerald-500/20 to-lime-500/20` and matching borders.

- [ ] **Step 2:** Lint and commit:

```bash
git add frontend/components/user-menu.tsx frontend/components/subscription-modal.tsx
git commit -m "Retheme user menu and subscription modal accent strips."
```

---

### Task 8: Auth guard

**Files:**
- Modify: `frontend/components/auth-guard.tsx`

- [ ] **Step 1:** Replace `purple-400` / `purple-300` bullets and labels with `emerald-400` / `emerald-300` (or neutral `slate`).

- [ ] **Step 2:** Commit:

```bash
git add frontend/components/auth-guard.tsx
git commit -m "Replace purple accents in auth guard with emerald neutrals."
```

---

### Task 9: Predict route pages (heart, diabetes, parkinsons, common-diseases)

**Files:**
- Modify: `frontend/app/predict/heart/page.tsx`
- Modify: `frontend/app/predict/diabetes/page.tsx`
- Modify: `frontend/app/predict/parkinsons/page.tsx`
- Modify: `frontend/app/predict/common-diseases/page.tsx`

- [ ] **Step 1 (heart):** Keep red/pink/rose hero story; replace logo `blue-violet` with **red–rose** or **emerald** for app mark only if you need a non-purple lockup; replace `bg-gradient-to-r from-blue-500 to-violet-500` icon with `from-rose-500 to-red-600`. Remove background blur blobs that are only `pink` if spec prefers red/neutral — keep soft `pink/rose` acceptable for heart; do **not** add purple.

- [ ] **Step 2 (diabetes):** Teal/cyan gradients and borders (`border-cyan-500/20`); remove `blue`/`violet` icon and titles.

- [ ] **Step 3 (parkinsons):** Deep teal/forest blobs and gradients; `border-teal-500/20` or `border-emerald-900/30`; remove all `purple`/`indigo`/`violet`.

- [ ] **Step 4 (common diseases):** Ensure greens align with `emerald` / `lime` family.

- [ ] **Step 5:** Lint and commit:

```bash
git add frontend/app/predict/heart/page.tsx frontend/app/predict/diabetes/page.tsx frontend/app/predict/parkinsons/page.tsx frontend/app/predict/common-diseases/page.tsx
git commit -m "Retheme predict landing pages per condition accent spec."
```

---

### Task 10: Forms (heart, diabetes, parkinsons, common-diseases)

**Files:**
- Modify: `frontend/components/forms/heart-prediction-form.tsx`
- Modify: `frontend/components/forms/diabetes-prediction-form.tsx`
- Modify: `frontend/components/forms/parkinsons-prediction-form.tsx`
- Modify: `frontend/components/forms/common-diseases-prediction-form.tsx`

- [ ] **Step 1:** Heart — replace `text-purple-400`, `from-purple-500 to-pink-400` progress with `rose`/`red`/`neutral` only.

- [ ] **Step 2:** Diabetes — purple/pink bars → `cyan`/`teal`.

- [ ] **Step 3:** Parkinsons — all `purple`/`indigo`/`pink` tabs, buttons, rings → `teal`/`emerald`/`slate`.

- [ ] **Step 4:** Common diseases — purple/pink → `emerald`/`green`.

- [ ] **Step 5:** Lint and commit:

```bash
git add frontend/components/forms/heart-prediction-form.tsx frontend/components/forms/diabetes-prediction-form.tsx frontend/components/forms/parkinsons-prediction-form.tsx frontend/components/forms/common-diseases-prediction-form.tsx
git commit -m "Align prediction form accents with non-purple condition palettes."
```

---

### Task 11: Repo-wide sweep and verification

**Files:**
- Grep under `frontend/` (excluding `.next`) for: `purple-`, `violet-`, `indigo-`, `from-blue-5`, `to-violet`, `99, 102, 241`

- [ ] **Step 1: Search**

```bash
cd frontend
rg "99, 102, 241|from-blue-500 to-violet|via-indigo|purple-500|violet-500|indigo-500" --glob '!**/.next/**'
```

**Expected:** No matches in in-scope UI files. If matches remain in `components/ui/*` shadcn primitives, only change them if they hardcode marketing colors; otherwise leave defaults that use CSS variables (they follow `globals.css`).

- [ ] **Step 2: Run guard**

```bash
npm run verify:theme
```

**Expected:** Exit code **0**.

- [ ] **Step 3: Production build**

```bash
npm run build
```

**Expected:** Compiled successfully.

- [ ] **Step 4: Manual smoke (human)** per spec §7: theme toggle, home, each predict page, contact, signed-in menu.

- [ ] **Step 5:** Final commit if any sweep fixes:

```bash
git add -A
git commit -m "Remove remaining indigo and purple chrome after theme sweep."
```

---

## Plan self-review (spec coverage)

| Spec section | Tasks covering it |
|----------------|-------------------|
| §1 Goals | Tasks 2–11 |
| §2 Dark tokens + glass | Task 2 |
| §3 Light palette B | Task 2 `:root` |
| §4 Per-route accents | Tasks 5, 9, 10 |
| §5 Interactive glow / navbar | Tasks 3, 4, 5 |
| §6 File scope | File map + tasks 2–10 |
| §7 A11y / QA | Task 2 values + Task 11 manual; adjust OKLCH if contrast fails |
| §8 Anti-patterns | Task 1 + Task 11 guard |

**Placeholder scan:** None.  
**Type consistency:** N/A (no shared TS types). Orange follow “byte-identical” check in Task 3 is intentional for spec compliance.

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-30-frontend-theme-redesign.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — Dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach do you want?**
