# BitcoinMind Design Guide

BitcoinMind is a quiet editorial study map for Bitcoin as money, protocol, custody practice, and sovereignty. The site should feel like a long-term reading room: serious, selective, calm, and built for repeated study.

This document defines the product's design direction, content tone, visual constraints, and interface principles. Use it when changing layout, typography, color, page rhythm, navigation, content presentation, or UI behavior.

## 1. Product Definition

### What BitcoinMind Is

BitcoinMind is:

- a personal map for studying Bitcoin as money, protocol, and sovereignty
- a curated route through books, primary texts, tools, notes, objections, questions, and conceptual frames
- an editorial site designed for reading, comparison, and long-term reference
- a static-first product with selective interactive components
- a public record by Hiei, shaped by long-term study and curation

### What BitcoinMind Is Not

BitcoinMind is not:

- a trading dashboard
- a price prediction product
- a crypto news site
- a token discovery tool
- a generic Web3 landing page
- a fintech SaaS marketing page
- a maximalist resource dump

The site should communicate trust through structure, restraint, clarity, typography, and curation.

## 2. Design Principles

### Quiet Authority

The site should feel confident because it is consistent and clear, not because it is loud.

Prefer:

- large editorial titles
- warm dark backgrounds
- readable cream text
- muted secondary copy
- sparse amber highlights
- thin borders
- stable page rhythm
- clear hierarchy

Avoid:

- neon color systems
- heavy crypto-exchange energy
- high-density dashboards on reading pages
- large glowing cards
- glossy SaaS gradients
- decorative animation that does not clarify meaning

### Editorial Over Promotional

Write and design like an editor, not a growth marketer.

Prefer language such as:

- study map
- curated resources
- primary texts
- monetary history
- protocol design
- self-custody
- verification
- sovereignty

Avoid language such as:

- unlock alpha
- ultimate crypto hub
- next-gen Web3 platform
- moonshot
- start your journey today
- revolutionary

### Curation Over Volume

More content is only better when it improves the learning path.

Before adding a resource, ask:

- What question does this answer?
- Where does it belong in the learning sequence?
- Is it foundational, practical, historical, critical, or personal?
- Does it reduce confusion or only increase quantity?

### One System, Many Surfaces

The homepage, Primer, Library, Texts, Toolkit, Paths, Frames, Timeline, Glossary, Objections, Stack, Notes, Questions, and About should feel like one product.

Frames may be more interactive, but they should still share the same editorial DNA: restrained color, clear reading hierarchy, and conceptual usefulness.

### A Visible Learning Loop

Use the shared study sequence when a surface benefits from orientation or continuation:

```text
Orient -> Understand -> Verify -> Practice -> Reflect
```

The stages describe reader intent, not completion badges or a gamified funnel. Paths should state prerequisites, outcomes, and a meaningful next step. Resource cards may expose their stage and a quiet local save action, but reading must never depend on saved state.

## 3. Brand Rules

### Name

Always write the project name as:

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

Do not insert a visible space or forced line break between `Bitcoin` and `Mind`.

### Two-Tone Brand Treatment

When using the two-tone brand treatment:

- `Bitcoin` should use the primary warm text color.
- `Mind` should use the restrained amber accent.
- The word must still read as one name.

The current navigation pattern uses:

```html
Bitcoin<b>Mind</b>
```

Preserve this one-word identity unless the brand system is intentionally redesigned.

### Positioning Line

Preferred positioning:

```text
A personal map for studying Bitcoin as money, protocol, and sovereignty.
By Hiei · Since 2017
```

Keep ownership language factual and quiet. Do not turn it into a pitch, campaign, or personal branding slogan.

## 4. Color System

The token source of truth is:

```text
src/styles/design-system.css
```

Use CSS custom properties. Do not hardcode new hex, RGB, HSL, or OKLCH values inside components unless the task is explicitly to update the design system.

### Current Color Roles

Core roles include:

```css
--bg              main warm dark background
--surface         deeper surface layer
--card            card / panel background
--card-hover      elevated or hover surface

--text-heading    primary warm heading text
--text-body       main body text
--text-secondary  secondary copy
--text-muted      metadata and subdued labels
--text-faint      low-emphasis utility text

--accent          primary amber accent
--accent-bright   brighter amber highlight
--accent-muted    subdued amber

--border          default border
--border-strong   stronger border
--border-accent   accent border
--focus-ring      accessible focus indicator
```

Legacy aliases such as `--tx`, `--tx-2`, `--gold`, `--surf`, and `--bdr` exist for compatibility. Prefer the semantic role names for new work unless editing existing CSS that already uses aliases.

### Accent Discipline

Amber is a signal, not a decoration layer.

Use amber for:

- brand emphasis
- active navigation state
- small metadata labels
- thin rules and highlights
- focus and hover borders
- minimal data emphasis

Avoid:

- large amber backgrounds
- repeated glowing elements
- gold-heavy cards
- decorative accents with no informational role
- making the site look like a premium crypto product

## 5. Typography

The current font system is:

```css
--font-display: 'Literata', serif;
--font-body:    'Inter', sans-serif;
--font-mono:    'Geist Mono', monospace;
```

Use:

- Literata for display titles, major headings, and editorial identity.
- Inter for body copy, UI text, filters, navigation, and metadata.
- Geist Mono for numbers, labels, technical values, and compact data.

Do not reintroduce older font systems such as Playfair Display, Lora, or DM Mono unless the codebase intentionally changes back to them.

### Type Rhythm

Use the existing type tokens in `design-system.css`:

- display sizes: `--fz-hero`, `--fz-page`, `--fz-section`, `--fz-step`, `--fz-note`, `--fz-quote`
- fixed scale: `--text-xs` through `--text-6xl`
- line heights: `--lh-title`, `--lh-card`, `--lh-base`, `--lh-loose`
- tracking: `--ls-tighter`, `--ls-snug`, `--ls-normal`, `--ls-3`, `--ls-5`, `--ls-7`, `--ls-9`, `--ls-11`

Avoid oversized hero typography on inner pages. The site should feel archival and editorial, not like a launch-page template.

## 6. Layout and Components

### Page Rhythm

Maintain generous but controlled spacing. Reading pages should have enough air for long-form comprehension without feeling sparse or unfinished.

Use existing spacing and layout tokens:

```css
--max-w
--pad
--sp-1 through --sp-13
--radius
--radius-sm
--radius-lg
```

Avoid one-off page margins unless a layout genuinely needs a new reusable pattern.

### Cards

Cards should feel like quiet editorial containers, not product tiles.

Use cards for:

- resource entries
- study path steps
- toolkit items
- objections and responses
- glossary entries
- structured summaries

Cards should use restrained borders, muted metadata, readable titles, and limited hover motion.

### Navigation

Navigation should remain stable and simple. It should help readers understand the site map without turning the header into a dense application menu.

Do not rename, reorder, or remove public routes as a side effect of unrelated work.

Current public route structure is defined by `src/pages/**` and `src/components/Nav.astro`.

### Frames

Frames are conceptual views, not trading tools.

They may use charts, SVG, pointer inspection, and live or generated data, but the design goal is explanation rather than market action.

Frame UI should:

- support reading first
- keep labels clear
- avoid financial-advice framing
- avoid trading-terminal density
- preserve accessibility and mobile behavior

## 7. Content Tone

BitcoinMind should sound precise, calm, and intellectually honest.

Prefer:

- clear claims
- explicit tradeoffs
- practical sequencing
- direct explanations
- serious treatment of objections
- source-aware writing

Avoid:

- hype
- tribal language
- overconfident predictions
- anti-everything rhetoric
- vague motivational copy
- excessive personal branding

### Objections

Objection pages should not strawman critics. Each objection should first state what the criticism gets right, then respond with a narrower and more careful argument.

### Toolkit

Toolkit entries should explain why a tool belongs in the learning path. Avoid turning the Toolkit into a generic recommendation list.

Operational and time-sensitive entries should expose a review date and a primary or first-party source label. A review date communicates editorial maintenance; it is not a warranty, endorsement, or substitute for verifying the current release and documentation.

### Sources and Evidence

Use citations selectively where provenance changes how a claim should be judged. Prefer primary sources, official documentation, and representative critical work. Objections should expose more than one perspective where useful. Frames and generated network data should identify their source or snapshot context without turning the page into a bibliography wall.

### Notes

Personal notes can be more reflective, but they should remain connected to the site's larger study map.

## 8. Responsive Behavior

Mobile pages should preserve the same editorial identity:

- readable type
- stable spacing
- no horizontal overflow
- accessible controls
- filters that remain usable on small screens
- cards that do not become dense or cramped

Do not solve mobile issues by hiding important content unless a specific progressive-disclosure pattern is intended.

## 9. Accessibility

Maintain:

- semantic headings
- meaningful link text
- visible focus states
- keyboard-usable controls
- sufficient contrast
- reduced-motion behavior where relevant
- readable chart labels and fallbacks

Interactive charts and controls should be understandable without relying only on color.

Browser-local study controls must announce state changes, expose pressed state, remain keyboard usable, and degrade to the complete static reading experience when JavaScript or storage is unavailable. Local state must not be described as synced, private cloud storage, or an account.

## 10. AI-Assisted Work

AI tools may be used to propose code, copy, refactors, and design alternatives, but changes must be checked against this document and the current codebase.

Do not let AI output drift into:

- generic SaaS design
- crypto marketing copy
- route churn
- broad CSS rewrites
- unreviewed content expansion
- hardcoded visual values

The goal is not to preserve every existing line. The goal is to preserve the product identity while improving the implementation.

## 11. Source of Truth

When documentation and code disagree, inspect the current codebase before editing.

Use these files as source-of-truth references:

```text
package.json                    dependencies and commands
astro.config.mjs                Astro integrations and build behavior
wrangler.jsonc                  Cloudflare Workers static assets config
src/pages/**                    public routes
src/components/Nav.astro        navigation structure
src/styles/design-system.css    tokens
src/styles/styles.css           global styling
src/data/**                     curated datasets
src/lib/seo.ts                  metadata helpers
```

After project architecture changes, update this document so future work does not rely on stale rules.
