# BitcoinMind AGENTS.md

This file defines how AI coding agents should work in this repository.

BitcoinMind is an Astro-based editorial website: a personal study map for Bitcoin as money, protocol, and sovereignty. The project’s value comes from curation, information architecture, writing tone, visual consistency, and disciplined AI-assisted development.

Before changing UI, layout, copy, or structure, read:

```text
DESIGN.md
```

---

## 1. Operating model

Think of the repository in four layers:

```text
Content layer        src/data/*, src/pages/*, notes/about text
Design layer         DESIGN.md, src/styles/design-system.css, src/styles/styles.css
Application layer    Astro pages, components, Preact islands, scripts
Deployment layer     astro.config.mjs, wrangler.jsonc, public/_headers, package scripts
```

Make changes in the correct layer. Do not solve a content problem with global CSS. Do not solve a design-token problem with one-off component overrides. Do not solve a route problem by rewriting unrelated pages.

---

## 2. Tech stack

Current stack:

```text
Astro 5
Preact islands
TypeScript
Custom CSS variables
Cloudflare Pages
```

Important files:

```text
package.json
astro.config.mjs
src/layouts/Base.astro
src/styles/design-system.css
src/styles/styles.css
src/components/Nav.astro
src/components/*.astro
src/components/*.tsx
src/data/*.ts
src/lib/seo.ts
src/pages/*.astro
src/pages/frames/*.astro
src/scripts/*.ts
public/_headers
wrangler.jsonc
```

---

## 3. Commands

Use these commands when relevant:

```bash
npm install
npm run dev
npm run build
npm run preview
npm run refresh-data
```

Before reporting completion, run:

```bash
npm run build
```

If the build cannot be run, explicitly state that it was not run and why.

---

## 4. Task classification

Classify the requested work before editing.

### Documentation-only task

Allowed files usually include:

```text
README.md
DESIGN.md
AGENTS.md
```

Do not modify source code.

### Design-system task

Likely files:

```text
src/styles/design-system.css
src/styles/styles.css
src/layouts/Base.astro
src/components/*.astro
```

Rules:

- Use existing tokens first.
- Add new tokens only for recurring roles.
- Avoid hardcoded colors.
- Preserve the serif-led editorial identity.

### Content or curation task

Likely files:

```text
src/data/*.ts
src/pages/about.astro
src/pages/notes.astro
```

Rules:

- Preserve type shape.
- Preserve resource order unless asked.
- Do not bulk-generate filler content.
- Keep tone quiet, precise, and non-promotional.

### Information architecture task

Likely files:

```text
src/pages/*
src/components/Nav.astro
src/lib/seo.ts
public/robots.txt
```

Rules:

- Treat route changes as high risk.
- Preserve SEO metadata and canonical logic unless explicitly changing it.
- Do not rename routes casually.

### Interactive behavior task

Likely files:

```text
src/components/*.tsx
src/scripts/*.ts
src/pages/frames/*.astro
```

Rules:

- Keep islands small.
- Do not convert static pages into client-heavy apps.
- Preserve reduced-motion and mobile behavior.

---

## 5. Brand and product constraints

BitcoinMind is not:

- A crypto news site.
- A trading dashboard.
- A price tracker.
- A generic Web3 landing page.
- A SaaS marketing site.

The brand name is always:

```text
BitcoinMind
```

Do not write:

```text
Bitcoin Mind
Bitcoinmind
Bitcoin-Mind
Bitcoin Mindset
```

Do not rewrite the site into promotional crypto copy.

---

## 6. Route constraints

Current public routes:

```text
/
/start
/books
/essays
/tools
/frames
/frames/1
/frames/2
/about
/notes
```

Do not rename, delete, redirect, or reorder navigation routes unless the task explicitly asks for information architecture work.

Do not change navigation labels or hierarchy as an opportunistic improvement.

---

## 7. Design rules

Source of truth:

```text
src/styles/design-system.css
```

Shared component and layout styles:

```text
src/styles/styles.css
```

Rules:

- Use CSS custom properties.
- Do not hardcode new colors in components.
- Do not introduce Tailwind, shadcn, Bootstrap, or another UI system.
- Do not replace the serif-led identity with a generic sans-serif UI.
- Do not overuse gold accents.
- Do not add loud animation or decorative effects unless explicitly requested.
- Do not make the site look like an exchange, dashboard, or generic SaaS product.

Follow `DESIGN.md` for visual and editorial decisions.

---

## 8. Content voice

The site voice is:

- English.
- Quiet.
- Serious.
- Editorial.
- Reflective.
- Personal but not self-promotional.
- Skeptical of hype.

Avoid:

```text
ultimate platform
unlock alpha
next-gen crypto
revolutionary Web3
start your journey today
```

Prefer direct, precise language. When editing resources, explain why something matters rather than only what it is.

---

## 9. Change discipline

### Minimal diffs

Make the smallest safe change that satisfies the task.

Do not reformat unrelated files. Do not rewrite entire files for small edits.

### No opportunistic refactors

Do not refactor unrelated components, styles, scripts, routes, or data while completing a focused task.

If you notice a useful improvement outside the task, mention it separately instead of implementing it.

### Preserve working behavior

Be careful with:

- Astro transitions.
- Font preloads.
- Mobile menu scripts.
- Reading progress script.
- Frame interactions.
- Preact islands.
- Data imports.
- Cloudflare deployment configuration.

Do not remove code just because it appears unused without verifying usage.

---

## 10. File-specific guidance

### `src/styles/design-system.css`

Use this for tokens only.

Good changes:

- Add a named token for a recurring visual role.
- Adjust an existing token intentionally across the system.

Bad changes:

- Add component selectors.
- Add one-off values.
- Duplicate tokens.

### `src/styles/styles.css`

Use this for shared component and layout styles.

Good changes:

- Extend existing classes.
- Add styles that follow the token system.
- Keep sections organized.

Bad changes:

- Add large hardcoded one-off blocks.
- Create competing card/page-header systems.
- Override tokens casually.

### `src/layouts/Base.astro`

This controls global shell, fonts, metadata, scripts, and layout.

Edit carefully. Do not remove font preload logic, fallback font declarations, navigation, reading progress, or grain unless explicitly instructed.

### `src/components/Nav.astro`

Navigation is part of the brand system.

Do not change labels, route order, mobile behavior, or the BitcoinMind logo treatment without explicit instruction.

### `src/data/*.ts`

These files hold curated content.

Preserve:

- Type shape.
- Curation logic.
- Resource order where meaningful.
- Editorial tone.

Do not bulk-generate filler items.

### `src/pages/about.astro` and `src/pages/notes.astro`

These pages carry the personal record.

Avoid rewriting them into a resume, sales page, founder bio, or generic blog unless explicitly asked.

---

## 11. Quality bar

Maintain:

- Valid Astro and TypeScript.
- Semantic headings.
- Usable links and buttons.
- Keyboard-friendly controls.
- Reasonable contrast.
- Mobile readability.
- Reduced-motion compatibility.
- Existing SEO metadata unless intentionally changed.

Do not hide important content behind hover-only interactions.

---

## 12. Hard constraints

Do not do these unless explicitly asked:

- Rename routes.
- Change project name.
- Split “BitcoinMind” into two words.
- Replace the design system.
- Convert the site into Tailwind/shadcn or another UI framework.
- Rewrite all CSS.
- Replace Astro with another framework.
- Add analytics, tracking, ads, or third-party scripts.
- Add price widgets or speculative trading features.
- Bulk-add AI-generated content.

---

## 13. Completion response format

After work, summarize only what matters:

```text
Files changed:
- ...

What changed:
- ...

Validation:
- npm run build passed.

Notes:
- ...
```

If validation was not run, say so directly.

---

## 14. Best working style

For this repository, prefer:

- Small, reviewable changes.
- Clear diffs.
- Token consistency.
- Preservation of editorial tone.
- No surprise redesigns.
- Explicit validation.

The goal is not to make BitcoinMind louder. The goal is to make it more coherent and easier to maintain.
