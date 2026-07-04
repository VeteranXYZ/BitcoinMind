# BitcoinMind Agent Guide

This file defines how AI coding agents and automated editing tools should work in this repository.

BitcoinMind is an Astro-based editorial study site for Bitcoin as money, protocol, custody practice, and sovereignty. The project depends on stable information architecture, curated content, restrained visual design, and static-first implementation.

Before changing UI, layout, copy, routes, or content structure, read:

```text
DESIGN.md
```

## 1. Operating Model

Think of the repository in four layers:

```text
Content layer        src/data/**, selected src/pages/** copy
Design layer         DESIGN.md, src/styles/design-system.css, src/styles/styles.css
Application layer    Astro pages, components, Preact islands, browser scripts
Deployment layer     package.json, astro.config.mjs, wrangler.jsonc, public/_headers, CI
```

Make changes in the correct layer.

Do not solve:

- a content problem with global CSS
- a token problem with one-off component overrides
- a route problem by rewriting unrelated pages
- a local UI issue by replacing the whole design system
- a documentation mismatch by ignoring the actual codebase

## 2. Current Stack

The current stack is defined by `package.json`. At this snapshot, the project uses:

```text
Astro 6
@astrojs/preact 5
Preact 10 islands
TypeScript 5
CSS custom properties
Fontsource: Literata, Inter, Geist Mono
GitHub Actions CI
Cloudflare Workers static assets via Wrangler
```

Important files:

```text
package.json
astro.config.mjs
wrangler.jsonc
public/_headers
src/layouts/Base.astro
src/styles/design-system.css
src/styles/styles.css
src/components/Nav.astro
src/components/*.astro
src/components/*.tsx
src/data/*.ts
src/lib/seo.ts
src/pages/**/*.astro
src/pages/sitemap.xml.ts
src/scripts/*.ts
scripts-build/*.mjs
```

If this section disagrees with `package.json`, `astro.config.mjs`, or `wrangler.jsonc`, trust the codebase and update this file.

## 3. Commands

Install dependencies:

```bash
npm ci
```

Run local development:

```bash
npm run dev
```

Run validation:

```bash
npm run check
npm run build
```

Refresh generated data and assets:

```bash
npm run refresh-data
```

Preview production output:

```bash
npm run preview
```

Before reporting completion for source-code changes, run:

```bash
npm run check
npm run build
```

If a command cannot be run, state exactly which command was not run and why.

## 4. Task Types

Classify the task before editing.

### Documentation-Only Task

Likely files:

```text
README.md
DESIGN.md
AGENTS.md
```

Rules:

- Do not modify source code.
- Keep technical claims aligned with current files.
- Avoid turning project documentation into promotional copy.
- If describing routes or dependencies, verify them against the repository.

### Design-System Task

Likely files:

```text
src/styles/design-system.css
src/styles/styles.css
src/layouts/Base.astro
src/components/*.astro
```

Rules:

- Use existing tokens first.
- Add tokens only for recurring roles.
- Do not hardcode colors in components.
- Preserve Literata / Inter / Geist Mono unless changing the font system is the explicit task.
- Preserve the quiet editorial identity.

### Content or Curation Task

Likely files:

```text
src/data/*.ts
src/pages/notes.astro
src/pages/about.astro
```

Rules:

- Preserve TypeScript shapes.
- Do not reorder curated lists unless the task asks for sequencing work.
- Do not bulk-generate filler resources.
- Keep tone precise, non-hype, and source-aware.
- Prefer adding content to datasets rather than duplicating it inside pages.

### Information Architecture Task

Likely files:

```text
src/pages/**
src/components/Nav.astro
src/lib/seo.ts
public/robots.txt
```

Rules:

- Treat route changes as high risk.
- Preserve canonical metadata unless intentionally changing it.
- Update navigation, page metadata, sitemap behavior, and internal links together.
- Do not rename routes as an opportunistic cleanup.

### Interactive Behavior Task

Likely files:

```text
src/components/*.tsx
src/scripts/*.ts
src/pages/frames/*.astro
scripts-build/*.mjs
public/pulse.json
```

Rules:

- Keep islands small and purposeful.
- Do not convert static pages into a broad client-side app.
- Preserve accessible labels, keyboard behavior, and mobile behavior.
- Keep Frames educational rather than trading-oriented.
- Handle unavailable live data with fallbacks.

### Deployment or Build Task

Likely files:

```text
package.json
package-lock.json
astro.config.mjs
wrangler.jsonc
public/_headers
.github/workflows/*
scripts-build/*.mjs
```

Rules:

- Avoid changing dependency versions casually.
- Keep CI commands aligned with `package.json`.
- Preserve Cloudflare static-assets behavior unless deployment strategy changes.
- Do not remove defensive fallback behavior from data-refresh scripts.

## 5. Route Constraints

The current public routes are defined by `src/pages/**`. At this snapshot they include:

```text
/
/primer
/library
/texts
/toolkit
/paths
/frames
/frames/1
/frames/2
/timeline
/glossary
/objections
/stack
/notes
/questions
/about
/404
/sitemap.xml
```

Navigation is defined primarily in:

```text
src/components/Nav.astro
```

Do not rename, remove, redirect, or reorder routes unless the task explicitly asks for information architecture work.

If route changes are required, also check:

```text
src/lib/seo.ts
src/components/Nav.astro
internal links in src/pages/** and src/data/**
public/robots.txt
sitemap behavior
```

## 6. Brand and Writing Constraints

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

The site should not become:

- a crypto news site
- a trading dashboard
- a price tracker
- a generic Web3 landing page
- a SaaS marketing site
- a personal resume page

Keep writing:

- quiet
- precise
- editorial
- non-promotional
- honest about tradeoffs
- respectful toward serious objections

Avoid:

- hype language
- price predictions
- financial advice
- maximalist slogans
- vague motivational copy

## 7. CSS and Design Rules

Primary styling files:

```text
src/styles/design-system.css
src/styles/styles.css
```

Rules:

- Use tokens from `design-system.css`.
- Add new tokens only for recurring semantic roles.
- Avoid one-off hex values.
- Avoid broad CSS rewrites for local changes.
- Keep global styles predictable.
- Preserve mobile behavior and prevent horizontal overflow.
- Preserve visible focus states.

If adding component-level CSS, keep it scoped to the component and aligned with existing tokens.

## 8. Data Rules

Primary content lives in `src/data/**`.

Rules:

- Keep exported names and item shapes stable.
- Preserve IDs unless the task explicitly requires migration.
- Keep internal links valid.
- Avoid duplicating the same resource copy across pages.
- Prefer explicit fields over hidden parsing conventions.
- Check dependent filters/cards if adding or changing fields.

## 9. SEO and Metadata Rules

SEO helpers live in:

```text
src/lib/seo.ts
src/layouts/Base.astro
```

Rules:

- Preserve canonical URL behavior.
- Keep titles and descriptions page-specific.
- Do not remove Open Graph or Twitter metadata casually.
- Keep structured data factual and minimal.
- Do not add keyword-stuffed copy.

## 10. Generated Data and Assets

Generated or refreshed outputs include:

```text
public/pulse.json
public/grain.png
src/lib/block-height.ts
```

Build scripts live in:

```text
scripts-build/fetch-block-height.mjs
scripts-build/fetch-pulse.mjs
scripts-build/generate-grain.mjs
```

Rules:

- Do not hand-edit generated files unless the task explicitly requires it.
- Prefer updating scripts and rerunning `npm run refresh-data`.
- Preserve fallback behavior for network failures.
- Do not make the static site depend on live API availability at runtime unless explicitly required.

## 11. Review Checklist

Before finishing a change, check:

- Does the change fit `DESIGN.md`?
- Are routes and navigation still valid?
- Are metadata and internal links still correct?
- Did the change avoid unnecessary rewrites?
- Are colors and typography using tokens?
- Is mobile behavior preserved?
- Did `npm run check` pass?
- Did `npm run build` pass?

For documentation-only changes, check:

- Are stack claims current?
- Are route lists current?
- Is the tone normal project documentation rather than promotional copy?
- Does the documentation avoid duplicating stale facts from older versions?

## 12. Source-of-Truth Rule

When files disagree, use this priority order:

1. Current codebase files
2. `package.json`, `astro.config.mjs`, `wrangler.jsonc`, and CI config for stack/build/deploy facts
3. `src/pages/**` and `Nav.astro` for routes/navigation
4. `src/styles/design-system.css` and `styles.css` for visual implementation
5. `src/data/**` for content inventory
6. `README.md`, `DESIGN.md`, and this file for documented intent

If documentation is stale, update it as part of the task or clearly report the mismatch.
