# Frontend theme redesign — design spec

**Date:** 2026-04-30  
**Status:** Approved for implementation planning (user sign-off on design sections + refinements below).

## 1. Goals

- **Dark mode:** Minimal chroma — effectively **black / charcoal / silver / white** only in design tokens and shared glass. Preserve **glassmorphism** on cards (blur, saturation, translucent fills, thin highlights).
- **Light mode:** **Bright and colorful** using option **B** — near-white base with **lime or chartreuse** plus **emerald** accents. No purple, blue-purple, violet, or indigo-forward branding on themed surfaces.
- **Avoid “AI default” palettes:** No site-wide indigo–violet–purple neon, no blue-purple gradient primaries, no `rgb(99, 102, 241)`-style accents in **global** utilities or marketing shells (see §6 for navbar specifics).

## 2. Dark mode — tokens and glass

- **CSS variables (`:root` / `.dark` in `frontend/app/globals.css`):** Remap `--background`, `--foreground`, `--primary`, `--ring`, `--border`, `--muted`, charts, and sidebar tokens to **achromatic OKLCH** (chroma at or near **0**, small lightness steps). No hue-based “primary” in dark except optional **white / silver** for focus and primary actions.
- **Shared utilities:** Update `.glass`, `.glass-card`, `.glass-enhanced`, `.neon-glow`, `.neon-glow-enhanced`, and scrollbar thumb rules to use **white/silver/black alpha** borders and shadows — not indigo.
- **Cards:** Keep structure: `backdrop-filter` blur + optional `saturate`, semi-transparent dark fill, **subtle** inner top highlight, soft outer shadow. Read as glass, not flat panels.

## 3. Light mode — palette B (lime + emerald)

- **Background / surfaces:** Very light neutrals with optional **hint of yellow-green** (low chroma) so the page feels fresh, not cold gray-purple.
- **Primary / ring / interactive defaults:** **Emerald** family (OKLCH hue roughly **150–165°**).
- **Secondary accent / gradients / pills:** **Chartreuse / lime** (hue roughly **115–130°**), used for badges, secondary buttons, and small highlights so the UI feels lively without purple.
- **Charts (`--chart-1` …):** Analogous greens / yellow-greens; avoid purple and blue-violet endpoints.

## 4. Per-route and per-condition accents

| Area | Direction |
|------|-----------|
| **Heart** | Keep **red** as the clinical signal; replace **purple–pink** progress or icon accents that exist only as generic defaults with **red / rose / neutral** as appropriate. |
| **Parkinson’s** | Replace **purple / indigo / violet** hero and shell styling with **deep teal or forest** (cool but not on purple axis). |
| **Diabetes** | Replace **blue–violet** identity with **teal / cyan** distinct from global emerald primary. |
| **Common diseases** | Keep **green** or nudge toward emerald so it does not fight the global primary. |
| **Home, contact, prediction tabs, auth, forms, subscription modal** | Remove blue / indigo / violet / purple **chrome** in favor of palette B or condition-local accents as above. |

## 5. Interactive glow and cursor-follow (user refinement)

- **Navbar (`floating-navbar.tsx`):** **Keep** the existing **orange** cursor-follow radial layers and their **motion timing** (`opacity` / `scale` / `duration` / `ease`). **Keep** the behavior where hover intensifies warm border glow.
- **Forbidden hues in pointer-linked effects:** Any **mouse-position-driven** glow, radial spotlight, or animated wash that currently uses **blue, pink, or purple** (including indigo/violet) must be **recolored to match the nearest parent UI** — e.g. primary CTA uses **emerald/lime** radials and shadows; neutral/ghost controls use **slate / white** radials only.
- **Non-follow chrome:** Static borders and shadows on the nav pill that are purely **indigo** may be shifted to **neutral silver / warm-neutral** so dark mode stays minimal, as long as **orange follow** and **hover motion** behavior remain unchanged.

**Known implementation today (audit):**

- **Home CTA** (`page.tsx` — “Start Prediction”): cursor-follow radial and `boxShadow` use blue/indigo/violet — remap to **emerald/lime** to match the updated button surface.
- **Prediction tab cards** (`prediction-tabs.tsx`): gradient wash and pulse use `rgba(99, 102, 241, …)` — remap to **active card / tab accent** (emerald–lime or condition color), not purple-blue.
- **Navbar:** Orange follow **unchanged**; indigo in **idle** border/shadow/logo may be updated per §2 and §4 brand, without altering orange follow layers.

## 6. Scope — files

| In scope | Notes |
|----------|--------|
| `frontend/app/globals.css` | Tokens; glass; neon; scrollbar. |
| `frontend/app/page.tsx` | Hero, pills, CTA gradients, cursor-follow, trust icons as needed. |
| `frontend/components/prediction-tabs.tsx` | Headers, gradients, card hover, glow. |
| `frontend/components/contact-section.tsx` | Headings, buttons, decorative blurs, inline borders. |
| `frontend/components/floating-navbar.tsx` | Orange follow **preserved**; indigo/violet in logo/wordmark/idle chrome per §5. |
| `frontend/components/user-menu.tsx`, `subscription-modal.tsx`, `auth-guard.tsx` | Replace purple/blue gradient chrome. |
| `frontend/app/predict/*/page.tsx` | Hero blobs, titles, glass borders per §4. |
| `frontend/components/forms/*.tsx` | Replace generic purple/pink/indigo accents with condition-appropriate or neutral colors. |

**Out of scope for this spec:** Backend, API routes, analytics, new components, font family changes.

## 7. Accessibility and QA

- **Contrast:** WCAG **AA** minimum for text and interactive states on both themes.
- **Focus:** `ring` color must remain obvious on dark (e.g. light ring) and on light (emerald).
- **Manual smoke:** Toggle dark/light; home; one predict page per condition family; contact form; signed-in header if applicable.

## 8. Anti-patterns (explicit)

- Purple, violet, indigo, and blue-purple **gradients** as global marketing or primary CTA (except tiny unavoidable third-party assets — none planned).
- **Cursor-follow** or **hover spotlight** using blue / pink / purple where a local accent exists — must match **parent** control colors per §5.
- Reintroducing `rgb(99, 102, 241)` (or equivalent) in **global** glass/neon after this change.

## 9. Implementation note

After this document is accepted in the repo, the next step is a separate **implementation plan** (per project workflow: `writing-plans` skill), then coding and tests — not part of this design file.
