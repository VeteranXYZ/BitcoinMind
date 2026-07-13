# BitcoinMind Optimization Roadmap

Baseline date: 2026-07-12

Status: `PHASES_0_TO_4_COMPLETE`

## Product Thesis

BitcoinMind should help a serious reader form a durable mental model of Bitcoin, verify important claims, make safer custody decisions, and return with better questions.

The reader's job is not to collect more Bitcoin links. It is to move through a repeatable learning loop:

```text
Orient -> Understand -> Verify -> Practice -> Reflect
```

Every route, dataset, interaction, and operational process should strengthen at least one part of that loop. Features that do not improve comprehension, verification, trust, or return value should remain out of scope.

## Audit Baseline

The existing foundation is healthy and should be evolved rather than replaced:

- The initial audit began on Astro 6; the completed project now uses Astro 7 and still produces 17 static pages, including the governed 404 document.
- The 16 intended indexable routes are present in the sitemap and retain stable canonicals.
- Every audited content route returns one H1, a page-specific title and description, and a self-canonical URL.
- The internal route and fragment crawl found no broken anchor links.
- The curated datasets showed no duplicate IDs or insecure external URLs in the source audit.
- `npm run check` and `npm run build` passed before the first optimization changes.
- The visual system is coherent, restrained, responsive, and aligned with `DESIGN.md`.

Measured homepage baseline:

| Environment | LCP | CLS | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: | ---: |
| Desktop, local production build, no throttling | 168 ms | 0.06 | 95 | 100 | 100 |
| Mobile, 4x CPU and Slow 4G emulation | 1,351 ms | 0.105 | 95 | 100 | 100 |

The baseline is already fast. The first performance priority is therefore layout stability and semantic accuracy, not an indiscriminate CSS or framework rewrite.

## Problem Map

### 1. Orientation is present but not yet a full learning contract

The homepage, Primer, and Paths all provide entry points, but the relationship between them is implicit. A reader can begin, but the site does not consistently state what they will understand, what to read next, or how to know they are ready to advance.

### 2. Curation is strong; evidence context is uneven

Resource descriptions explain why items belong, but factual claims across editorial pages do not yet share a consistent provenance pattern. Trust currently depends heavily on tone and the curator's identity.

### 3. Dynamic-looking data must communicate its actual freshness

The network panel reads a generated first-party snapshot. Calling it live overstates its runtime behavior, especially when the generated file is old. Freshness and source context should be visible wherever time-sensitive data appears.

### 4. The site has navigation, but limited return mechanics

There are good reasons to explore once, but few durable reasons to return and continue. Any future return mechanic should remain local-first and privacy-preserving before accounts or server-side personalization are considered.

### 5. Quality checks are strong but partly manual

Type checking, build validation, canonical routing, and CI are in place. Content integrity, internal fragments, data freshness, and selected accessibility checks should become repeatable repository checks.

## Roadmap

### Phase 0 — Truth, stability, and access

Goal: remove avoidable trust and rendering defects without changing public routes or the visual identity.

- Render the daily recommendation as static HTML instead of a client-only island.
- Seed the network island with the generated snapshot so hydration does not insert major blocks of content.
- Label the network data as a dated snapshot rather than live data.
- Preserve the prior snapshot timestamp when every refresh source fails.
- Keep the server-rendered snapshot visible when a browser refresh attempt fails.
- Fix the audited low-contrast status label.
- Add a keyboard skip link to the shared layout.
- Re-run type checks, production build, mobile trace, and Lighthouse.

Exit criteria:

- Mobile homepage CLS is at or below 0.10 in the same throttled lab profile.
- Lighthouse reports no known color-contrast failure on the homepage.
- The daily recommendation does not ship a dedicated client bundle.
- The first rendered network panel includes the available generated metrics.

Phase result, 2026-07-12:

- Mobile CLS reached `0.00` under the same 4x CPU and Slow 4G profile.
- Mobile LCP remained good at `1,399 ms`.
- Lighthouse Accessibility, Best Practices, SEO, and Agentic Browsing each reached `100`, with zero failed audits.
- The daily recommendation is present in static HTML and no longer has a dedicated client bundle.
- The generated network snapshot is present in static HTML with a UTC date and four protocol-stat blocks.
- The mobile menu still opens as a named dialog, closes with Escape, and restores its expanded state correctly.

### Phase 1 — Make the learning loop explicit

Goal: turn the current content map into a legible study system.

- Define a small shared stage vocabulary across Primer, Library, Texts, Toolkit, and Paths.
- Add concise outcomes and prerequisites to each guided path.
- Add contextual previous/next study links where sequencing is editorially meaningful.
- Distinguish foundational, practical, critical, and reflective work consistently.
- Preserve route names and curated ordering unless sequencing is the explicit task.

Exit criteria:

- A first-time reader can choose a route based on a question, not only a content format.
- Every guided path states its expected outcome and next step.
- Shared resources are referenced from datasets rather than duplicated in page copy.

Phase result, 2026-07-12:

- Primer, Library, Texts, Toolkit, and Paths now share the five-stage learning vocabulary.
- Every path exposes a prerequisite, expected outcome, ordered work, and an editorial next step.
- Internal path steps resolve canonical Library, Texts, and Toolkit records by stable resource ID.
- Contextual previous/continue navigation now connects the principal study sequence without changing public routes.

### Phase 2 — Build a visible evidence and freshness system

Goal: make source quality and time sensitivity inspectable.

- Add explicit source/provenance fields where factual editorial claims require them.
- Establish reviewed-at and time-sensitive markers for tools, custody guidance, and network data.
- Show source and snapshot timestamps in Frames and generated-data surfaces.
- Add a light editorial review policy for objections, tools, and operational guidance.
- Keep citations selective and primary-source oriented rather than decorating every sentence.

Exit criteria:

- Time-sensitive claims expose their review or snapshot date.
- Practical recommendations make tradeoffs and verification steps visible.
- Objections link to representative primary or high-quality critical sources.

Phase result, 2026-07-12:

- Every Toolkit item carries a review date, time-sensitivity flag, and first-party source label.
- Objections now expose representative critical, technical, and contextual sources with a visible review date.
- Both Frames identify source material; Frame 2 also explains interpolation, cached pricing, and the date boundary of its data.
- Stack and Toolkit publish a concise operational review policy and direct readers back to current first-party documentation.
- The network clock preserves and labels its generated UTC snapshot rather than implying runtime liveness.

### Phase 3 — Automate content and release integrity

Goal: make the current standard reproducible as the site grows.

- Add a deterministic site audit command for routes, canonicals, H1s, internal fragments, duplicate IDs, and insecure URLs.
- Add generated-data freshness reporting without making production builds depend on live APIs.
- Add focused browser checks for navigation, filters, mobile menu focus, and Frames fallbacks.
- Set performance budgets around actual shipped CSS, JavaScript, fonts, LCP, and CLS.
- Keep network refresh failures defensive and observable.

Exit criteria:

- CI catches broken internal links, duplicate content IDs, and metadata regressions.
- Stale generated data is reported explicitly.
- Performance regressions have agreed thresholds instead of subjective review.

Phase result, 2026-07-12:

- `npm run audit` verifies the 16-route sitemap, built documents, one-H1 structure, metadata, canonicals, internal routes and fragments, duplicate IDs, selected accessibility/interaction contracts, pulse freshness, and asset budgets.
- `npm run test:browser` runs three Chrome checks for the modal mobile menu, resource filtering, and the Frame 2 no-JavaScript reading experience.
- `npm run validate` composes type checking, production build, deterministic audit, and browser tests; GitHub Actions now runs that single contract.
- Direct and transitive dependencies were updated, followed by a dedicated Astro 7 migration. Astro 7.0.7, `@astrojs/preact` 6.0.1, Vite 8.1.4, and esbuild 0.28.1 now install with zero reported npm vulnerabilities.
- Generated-data fallback remains a warning instead of a build failure. The current `partial-snapshot` warning records an upstream node-count failure while keeping the cached metric behavior explicit.

### Phase 4 — Add selective return value

Goal: keep BitcoinMind display-first and avoid account-shaped features.

- Evaluate a citation-grounded question interface only within the curated corpus.
- Keep all AI output source-linked, bounded, and explicit about uncertainty.

Exit criteria:

- No feature changes the site into a generic chatbot, feed, dashboard, or trading product.

Phase result, 2026-07-12:

- The browser-local study desk was removed after it proved misaligned with the site's display-first role.
- The site remains server-rendered and static-first.
- A citation-grounded question interface was evaluated and deliberately deferred. The curated corpus does not yet have the claim-level citation manifest and coverage gate required to make runtime answers more trustworthy than the existing editorial Questions route.

## Completion Verification

Final local production verification, 2026-07-12:

| Check | Result |
| --- | --- |
| Astro / TypeScript | 60 files, 0 errors, 0 warnings |
| Production build | 17 pages generated |
| Deterministic audit | 16 public routes passed; 1 explicit partial-snapshot warning |
| Browser regression suite | 3 of 3 mobile Chrome tests passed |
| Mobile performance trace | LCP 1,401 ms; CLS 0.00 under 4x CPU and Slow 4G after Astro 7 migration |
| Lighthouse mobile | Accessibility 100; Best Practices 100; SEO 100; Agentic Browsing 100; 0 failed audits |

The Astro 7 migration is complete. A later editorial pass rebuilt the content hierarchy around five first-principles questions, narrowed overconfident claims, pruned duplicate reference and market-dashboard entries, expanded objections and glossary coverage, and added page-level structured data plus sitemap modification dates. Remaining work is recurring editorial maintenance: refresh generated data, verify external sources, and re-review time-sensitive guidance.

## Explicit Non-Goals

- Price tracking, price predictions, portfolio analytics, or trading signals.
- A broad client-side rewrite.
- Route churn for cosmetic information-architecture cleanup.
- Bulk content generation to make the catalog appear larger.
- Engagement mechanics that reward scrolling or frequency instead of comprehension.
- Accounts, cloud sync, or runtime AI before a local-first use case proves useful.

## Decision Rules

Prioritize work using this order:

1. Truth and safety.
2. Comprehension and learning sequence.
3. Accessibility and resilience.
4. Measured performance.
5. Editorial maintainability.
6. Selective convenience.

When two ideas compete, choose the one that improves the learning loop with less permanent complexity.
