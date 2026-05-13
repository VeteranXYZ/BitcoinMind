# BitcoinMind DESIGN.md

BitcoinMind is a quiet, editorial study map for Bitcoin as money, protocol, and sovereignty. It should feel like a long-term reading room: serious, selective, and calm.

This document is the design source of truth for humans and AI agents. Read it before changing visual design, page structure, component behavior, typography, content presentation, or tone.

---

## 1. Product definition

### What BitcoinMind is

BitcoinMind is:

- A personal study map for Bitcoin as money, protocol, and sovereignty.
- A curated path through books, primary texts, tools, notes, and visual frames.
- A public record by Hiei, shaped by long-term curiosity since 2017.
- An editorial website designed for reading, judgment, and intellectual trust.
- A demonstration of AI-assisted design work with explicit constraints.

### What BitcoinMind is not

BitcoinMind is not:

- A trading dashboard.
- A crypto news site.
- A price prediction product.
- A token discovery tool.
- A generic Web3 marketing page.
- A loud fintech landing page.
- A personal resume disguised as a product.

The site should communicate seriousness through structure, restraint, typography, curation, and consistency.

---

## 2. Design architecture

BitcoinMind has three design layers:

```text
Brand layer        → name, tone, visual identity, trust
Editorial layer    → reading paths, curation, notes, explanations
Interface layer    → navigation, cards, filters, frames, responsive behavior
```

Changes should respect all three layers. A page can be visually polished only if it still preserves the brand and editorial layer.

---

## 3. Core principles

### 3.1 Quiet authority

Use restraint. The site should feel confident because it is clear and consistent, not because it is loud.

Prefer:

- Large editorial titles.
- Warm dark surfaces.
- Muted body text.
- Sparse gold accents.
- Thin borders.
- Strong reading rhythm.
- Selective use of interaction.

Avoid:

- Neon colors.
- Crypto exchange energy.
- Dashboard density where reading is the goal.
- Heavy gradients or glowing cards.
- Overactive animations.
- Decorative effects that do not clarify meaning.

### 3.2 Editorial over promotional

Write and design like an editor, not a growth marketer.

Prefer:

- “study map”
- “public record”
- “curated resources”
- “money, protocol, and sovereignty”
- “first principles”
- “long-term learning”

Avoid:

- “unlock alpha”
- “ultimate Bitcoin hub”
- “next-gen crypto platform”
- “start your journey today”
- “revolutionary Web3”
- “moonshot”

### 3.3 Curation over volume

The site should feel selected, not filled. More content is only better when it improves the study path.

When adding a book, essay, tool, or note, ask:

- What question does this answer?
- Why does it belong here?
- Is it foundational, practical, or personal?
- Does it improve the map or merely increase the count?

### 3.4 One system, not separate pages

The homepage, Start, Books, Essays, Tools, Frames, About, and Notes should feel like parts of one system.

Do not invent a separate visual language for a single page unless the content type truly requires it. Frame pages may be more interactive, but they still belong to the same editorial system.

---

## 4. Brand identity

### 4.1 Name

The brand name is always:

```text
BitcoinMind
```

Rules:

- Do not write “Bitcoin Mind”.
- Do not write “Bitcoinmind”.
- Do not write “Bitcoin-Mind”.
- Do not force a line break between Bitcoin and Mind.
- Do not rename the project to a generic phrase like “Bitcoin Study Hub”.

### 4.2 Visual brand treatment

The brand can use a two-tone treatment:

- “Bitcoin” uses the primary warm text color.
- “Mind” uses the restrained gold/highlight tone.

The current navigation pattern uses:

```html
Bitcoin<b>Mind</b>
```

The word should still read as one name. Do not introduce a visible space.

### 4.3 Positioning line

Preferred positioning:

```text
A personal map for studying Bitcoin as money, protocol, and sovereignty.
By Hiei · Since 2017
```

Keep the ownership line quiet and factual. Avoid stacking two adjacent lines that both begin with “A …”.

---

## 5. Color system

The source of truth is:

```text
src/styles/design-system.css
```

Use CSS custom properties. Do not hardcode new hex, RGB, HSL, or OKLCH values in components unless the task is explicitly to update the design system.

### 5.1 Color roles

Current design roles:

```css
--bg        main warm dark background
--bg-deep   deeper background layer
--surf      card / surface background
--surf-2    elevated surface background
--bdr       default border
--bdr-2     stronger border
--tx        primary warm text
--tx-2      secondary body text
--tx-3      muted metadata text
--gold      primary accent
--gold-dim  subtle accent wash
--gold-glow restrained hover glow
--gold-hi   bright highlight
--nav-glass fixed navigation glass layer
```

### 5.2 Accent discipline

Gold is a signal, not a decoration layer.

Use gold for:

- Brand emphasis.
- Active navigation states.
- Small metadata labels.
- Thin rules, dots, and highlights.
- Focus and hover borders.
- Minimal data highlights.

Avoid:

- Large gold panels.
- Gold-heavy card backgrounds.
- Repeated glowing elements.
- Making the site look “premium crypto”.

### 5.3 Background atmosphere

The site should keep:

- Warm dark depth.
- Subtle radial atmosphere.
- Low-opacity grain.
- Thin grid or rule details only where meaningful.

Do not make the site pure black, flat gray, bright blue, or exchange-style dark navy.

---

## 6. Typography

The source of truth is:

```text
src/styles/design-system.css
```

### 6.1 Font roles

Current font roles:

```css
--font-serif: Playfair Display, Playfair Fallback, Georgia, serif;
--font-body:  Lora, Lora Fallback, Georgia, serif;
--font-mono:  DM Mono, Courier New, monospace;
```

Use them by purpose:

- `--font-serif`: brand, hero titles, page titles, section titles, card titles.
- `--font-body`: descriptions, essays, notes, long-form prose.
- `--font-mono`: labels, metadata, filters, dates, navigation details.

Do not replace the serif-led system with a generic sans-serif product UI.

### 6.2 Hierarchy

The site depends on editorial hierarchy:

- Hero title: very large, serif, high contrast, compact line height.
- Page title: large serif, often with one restrained gold emphasis.
- Section title: serif, medium-large, calm.
- Card title: serif, compact and readable.
- Body copy: Lora, relaxed line height, muted warm tone.
- Metadata: DM Mono, small, uppercase or tightly structured.

### 6.3 Reading rhythm

Long prose should feel slow and readable.

Preserve:

- Comfortable line length.
- Relaxed paragraph spacing.
- Clear hierarchy between title, deck, body, and metadata.
- Muted text for long reading.

The About and Notes pages are especially sensitive. Do not compress them into dashboard blocks or resume sections.

---

## 7. Layout and components

### 7.1 Global shell

The current shell uses:

- Fixed top navigation.
- A consistent top offset for pages.
- `.page` as the page wrapper.
- `.c` as the centered content container.
- Width and spacing tokens from the design system.

Do not create competing global containers.

### 7.2 Spacing

Use the spacing tokens in `src/styles/design-system.css`.

Do not scatter arbitrary spacing values across pages. The site’s authority depends on stable vertical rhythm.

### 7.3 Page headers

Non-home pages should share the same page-header logic:

```text
.ph
.ph-eye
.ph-title
.ph-desc
```

Frame pages can use aliases, but they should remain visually related to the same system.

Do not create a new H1 style for every page.

### 7.4 Cards

Cards are editorial resource cards, not SaaS pricing cards.

Use the existing card system:

- Warm dark surface.
- Thin border.
- Small radius.
- Subtle hover lift.
- Restrained gold hover state.
- Serif title.
- Mono metadata.
- Muted explanation.

Avoid:

- Rounded 2xl app-store cards.
- Large colorful icons for every card.
- Heavy shadows.
- Bright borders.
- Image-heavy thumbnails unless the content requires imagery.

### 7.5 Filters and controls

Filters should feel like archive controls:

- Mono labels.
- Small uppercase buttons.
- Thin borders.
- Gold active state.
- Minimal motion.

Do not turn filters into colorful SaaS pills.

---

## 8. Page intent

### Home `/`

Purpose:

- Explain what BitcoinMind is.
- Show the three-door structure: start, study, practice.
- Preview important sections without becoming cluttered.
- Establish visual and intellectual identity.

Do not turn the homepage into a portal, dashboard, or sales landing page.

### Start `/start`

Purpose:

- A guided introduction path.
- Serious beginner orientation.
- A clear sequence, not a marketing funnel.

Preserve the ordered, step-by-step feeling.

### Books `/books`

Purpose:

- Curated Bitcoin library.
- Clear learning layers.
- Quality over quantity.

Do not turn it into a generic book database.

### Essays `/essays`

Purpose:

- Foundational essays and primary texts.
- Canonical, selective, historically aware.

Do not turn it into a blog feed.

### Tools `/tools`

Purpose:

- Sovereignty and intelligence tools.
- Help users verify, inspect, protect, and think.

Avoid app-store noise. Explain why each tool matters.

### Frames `/frames`, `/frames/1`, `/frames/2`

Purpose:

- Visual essays about money, history, time, and institutions.
- More interactive than the rest of the site, but still editorial.

Interactivity should clarify the idea, not become the point.

### About `/about`

Purpose:

- Personal context and philosophy.
- A public record, not a founder biography or resume.

Preserve reflective tone.

### Notes `/notes`

Purpose:

- Original writing.
- Essay-like reflections.

Do not make notes feel like social posts or snippets.

---

## 9. Content voice

The writing should be:

- English.
- Quiet.
- Precise.
- Reflective.
- Personal but not self-promotional.
- Skeptical of hype.
- Clear about Bitcoin without sounding tribal.

### Preferred sentence style

Prefer:

```text
BitcoinMind is my attempt to think that question through in public.
```

Avoid:

```text
BitcoinMind is the ultimate platform that empowers users to unlock Bitcoin’s revolutionary potential.
```

### Resource descriptions

Resource copy should explain:

- Why the item matters.
- What question it answers.
- Where it belongs in the learning path.
- Whether it remains useful over time.

Avoid pure summaries, SEO filler, and promotional blurbs.

---

## 10. Motion and interaction

Motion should be subtle and functional.

Allowed:

- Slight card lift on hover.
- Border-color changes.
- Soft hover glow when restrained.
- Reading progress indicator.
- Mobile menu transition.
- Frame-specific transitions that clarify sequence.

Avoid:

- Bounce effects.
- Confetti.
- Excessive scroll animation.
- Dramatic page transitions.
- Motion that makes reading harder.

Respect reduced-motion behavior already present in the codebase.

---

## 11. Responsive behavior

Mobile should remain readable and calm.

Preserve:

- Collapsed navigation.
- Single-column card flow.
- Comfortable touch targets.
- Clear page-header hierarchy.
- Long-form reading rhythm.

Avoid:

- Over-compressing text.
- Hiding essential content behind too many interactions.
- Letting the hero title dominate the mobile screen without context.

---

## 12. Accessibility and trust

Maintain:

- Semantic headings.
- Clear links.
- Keyboard-accessible controls.
- Visible focus states.
- Sufficient contrast within the dark palette.
- Descriptive page titles and metadata.
- Canonical URLs and structured data when relevant.

Do not sacrifice readability for minimalism.

---

## 13. Implementation boundaries

### Token-first styling

Use existing tokens in `src/styles/design-system.css`.

If a recurring visual role is needed, add a named token first, then use it.

### Source-of-truth files

```text
src/styles/design-system.css   design tokens
src/styles/styles.css          component and layout styles
src/layouts/Base.astro         global shell, fonts, metadata, scripts
src/components/Nav.astro       primary navigation
src/data/*.ts                  curated content data
src/lib/seo.ts                 site metadata helpers
```

### No broad rewrites

Small changes should produce small diffs. Do not rewrite entire files for targeted visual changes.

### Route caution

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

Do not rename or redirect routes unless the task is explicitly about information architecture.

---

## 14. Design review checklist

Before accepting a visual change, check:

- Does it still feel like a quiet study map?
- Does it preserve BitcoinMind as one word?
- Does it use existing tokens?
- Does it avoid exchange/dashboard/SaaS language?
- Does it improve reading or navigation?
- Does it avoid unnecessary visual noise?
- Does it preserve the current information architecture unless instructed otherwise?

The goal is not to make BitcoinMind louder. The goal is to make it more coherent.
