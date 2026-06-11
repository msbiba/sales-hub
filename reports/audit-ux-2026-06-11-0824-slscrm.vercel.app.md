---
target_url: "https://slscrm.vercel.app/landing"
audited_at: "2026-06-11T08:24:11.446Z"
tool: "playwright-mcp"
audit_type: "ux-visual-design"
downstream: "21st.dev Magic agent"
pages_audited: 1
counts_by_quadrant: { quick_win: 6, strategic_bet: 4, incremental: 3, deprioritize: 0 }
counts_by_track: { component: 10, global_token: 3 }
design_grade: "C"
---

# UX & Visual Design Audit — slscrm.vercel.app/landing

## Executive Summary
- Pages audited: 1 (single landing page, `MAX_DEPTH=0`).
- Recommendations: total 13 (quick_win 6, strategic_bet 4, incremental 3, deprioritize 0).
- Design grade: **C** — five high-value gaps. The brand palette + warm cream paper + amber CTA already feel deliberate and B2B-appropriate, but the calculator and form controls fall back to raw native browser styling, the type scale is gappy/inconsistent, and the proof/comparison sections under-use visual hierarchy.
- Design personality (as observed): editorial / engineered B2B. Warm cream background (`#f7f6f2`), graphite ink (`#0e1116`), warm amber accent (`#e8a33d`), steel-blue secondary (`#2c3e4c`), forest leaf (`#3d7a5c`). Typography: Geist + Inter + JetBrains Mono. Reads as serious-craft, not SaaS-template — that is a real asset to protect, not erase.
- Single biggest opportunity: replace native sliders / select / checkbox in the ROI calculator with branded controls — the calculator is the page's most-interacted-with surface and currently ships browser defaults.
- Top 3 highest value-for-effort fixes: (1) Custom slider/select/checkbox in calculator (UX-001), (2) Normalize type scale to a modular ramp (UX-002), (3) Promote hero stats + section "Warum jetzt" cards into a real bento layout (UX-005).

## Extracted Design System (de-facto, from computed styles)
- **Typography:** three families — Inter (body), Geist (display via `--font-geist-sans`), JetBrains Mono (numerals/eyebrows). Weights only 400/500/600 — no display-weight (700/800). Type scale spans 18 sizes (10, 11, 12, 13, 14, 15, 16, 17, 18, 22, 24, 30, 36, 40, 52, 56, 64, 68) — gappy, not a modular ramp. Raw: `assets/raw/tokens-landing.json`.
- **Color & palette:** tokens exposed as CSS custom props — `--ink #0e1116`, `--paper #f7f6f2`, `--steel #2c3e4c`, `--solar #e8a33d`, `--solar-hover #d8902a`, `--leaf #3d7a5c`, `--line #d8d4c8`, `--muted #6b7280`. Coherent, restrained, warm-neutral. Two semantic accents (solar = action, leaf = positive/eco).
- **Spacing & grid:** gaps observed: 8, 12, 16, 20, 24, 40, 64 px — broadly 8-step rhythm with a couple of off-grid values (`12px 24px`, `8px 20px`).
- **Shape & elevation:** radii are 0 / 6 / 8 / fully-rounded — minimal, slightly under-developed (no 4 or 12). Only two shadow recipes: amber-glow CTA (`rgba(232,163,61,0.6) 0 10px 30px -10px`) and neutral elevation (`rgba(14,17,22,0.25) 0 10px 40px -15px`). Borders use `--line` warm-grey at 0.8px (sub-pixel — fine on hi-dpi, fragile on integer-DPI screens).
- **Motion:** four transitions captured — 150 ms `cubic-bezier(0.4,0,0.2,1)` for color/transform, 600 ms `cubic-bezier(0.22,1,0.36,1)` for opacity reveals. Tasteful curves, sparse application.
- **Gradients:** a warm yellow-highlighter underline (`linear-gradient(... 62%, rgba(232,163,61,0.55) 62%)`) — a signature device worth preserving. Also subtle paper-on-ink dim gradients and a 1px grid pattern.
- **CSS custom properties exposed:** yes — see list above.

## What Works (credit first)
- The **warm cream paper + amber accent** palette is distinctive in a sea of cobalt-blue SaaS landings. Keep.
- **JetBrains Mono on numerals + metric eyebrows** (`Tag 1–3`, `01–04`, ct/kWh values) gives engineering credibility — sample evidence in `assets/process-steps.png`, `assets/landing-fullpage.png`.
- The **amber highlighter underline gradient** on key claims is a real signature device.
- The **amber-glow drop shadow** on the primary CTA is genuinely on-brand, not a generic Tailwind shadow — `assets/cta-primary-default.png`.
- **Heading hierarchy is clean and sequential** (h1 → h2 → h3) — no `level` jumps. Skim-friendly.

## Site Map
| URL | Depth | Reachable from |
|-----|-------|----------------|
| https://slscrm.vercel.app/landing | 0 | start |

`MAX_DEPTH=0` — no traversal. External: `/login`, `/datenschutz`, `/impressum`, `tel:+49821000000`, `mailto:kontakt@solarwerk-sued.de`, Cal.com (lazy-loaded on click) — listed, not visited.

## Detailed Findings (per page)
### https://slscrm.vercel.app/landing
- **Components captured:** header (`assets/header-default.png`), hero (`assets/hero-default.png`), primary CTA (`assets/cta-primary-default.png` / `assets/cta-primary-hover.png`), secondary link CTA (`assets/cta-secondary-default.png`), hero form text input (`assets/textinput-default.png`), submit button (`assets/submit-satellite-default.png`), Förder-status bar (`assets/foerderstatus-bar.png`), 4-step process (`assets/process-steps.png`), proof stats block (`assets/proof-stats.png`), testimonial card (`assets/testimonial-card.png`), differentiator list (`assets/diff-section.png`), calculator (`assets/calculator-block.png` + `assets/calc-results-aside.png`), FAQ accordion (`assets/faq-list.png` + `assets/faq-item-expanded.png` + `assets/faq-item-collapsed.png` + `assets/faq-item-hover.png`), comparison table (`assets/comparison-table.png`), Cal.com CTA placeholder (`assets/cal-cta-block.png`), above-fold (`assets/landing-abovefold.png`), full page (`assets/landing-fullpage.png`).
- **Hover/interaction states captured:** hero primary CTA hover, nav link "Termin buchen" hover, FAQ button hover.
- **Controls inventoried:** text inputs (3), email inputs (2), submit buttons (3), native range sliders (3), native `<select>` (1), native checkbox (1), accordion expand buttons (5), CTA buttons (cookie + Cal.com gate). Raw: `assets/raw/controls-landing.json`.
- **Control states captured:** primary CTA default/hover, slider default + focused after click + arrow-key moved, checkbox default + checked, FAQ item default + hover + expanded + collapsed, nav link hover, text input default.
- **Findings:** UX-001 … UX-013.

## Recommendations (prioritized by value-for-effort)
Sorted by descending (ux_value − implementation_complexity).

| ID | Page | Observation | Recommendation | Category | Track | UX value | Complexity | Quadrant | Reference pattern | Evidence | Locator |
|----|------|-------------|----------------|----------|-------|----------|------------|----------|-------------------|----------|---------|
| UX-001 | /landing | Calculator sliders / select / checkbox render with raw native browser styling — slider is a 16px-tall default range with OS-painted thumb, select shows OS chevron, checkbox is a 13×16 px native box only re-tinted by `accent-color: #e8a33d`. This is the page's most-interacted-with block and reads "template" against the rest of the editorial design. | Build branded slider, select and checkbox primitives that match the token language (paper bg, line border, amber thumb/check, JetBrains-Mono value bubble on slider). | control_design | component | 5 | 3 | quick_win | Linear / Vercel sliders; Radix Select; Headless UI Checkbox | `assets/calculator-block.png`, `assets/slider-default.png`, `assets/slider-focus.png`, `assets/select-default.png`, `assets/checkbox-default.png`, `assets/checkbox-checked.png`, `assets/raw/controls-landing.json` | `getByRole('slider', { name: 'Dachfläche' })` / `getByLabel('Dach-Typ')` / `getByRole('checkbox', { name: 'Es ist bereits PV' })` |
| UX-002 | /landing | 18 distinct font sizes used (10, 11, 12, 13, 14, 15, 16, 17, 18, 22, 24, 30, 36, 40, 52, 56, 64, 68). Adjacent pairs (10/11/12, 14/15, 22/24, 52/56, 64/68) are visually indistinguishable yet duplicated. | Collapse to a 9-step modular type ramp (e.g. 12, 14, 16, 18, 22, 28, 36, 48, 64) exposed as Tailwind/CSS-var tokens, then sweep usages. Pure token edit, no component changes. | typography | global_token | 5 | 2 | quick_win | Tailwind `text-*` semantic scale; Vercel Geist type scale | `assets/raw/tokens-landing.json` (`typeScale` field) | n/a (token layer) |
| UX-003 | /landing | Eyebrow paragraphs like "Photovoltaik · Gewerbe · Süddeutschland", "Warum jetzt", "Vergleich", "Selbst nachrechnen" are plain `<p>` text — same weight as body. They visually outrank nothing and add no system-language cue. | Promote section eyebrows to a `<SectionEyebrow>` chip: 11–12 px, uppercase, JetBrains Mono, tracking +1, `--leaf` or `--steel` text, optional 6 px bullet dot. Same component reused everywhere. | typography | component | 4 | 1 | quick_win | Stripe / Vercel section eyebrows; Linear "label" pattern | `assets/hero-default.png` (above H1), `assets/diff-section.png`, `assets/calculator-block.png` | `p:has-text("Warum jetzt")`, `p:has-text("Photovoltaik · Gewerbe · Süddeutschland")` |
| UX-004 | /landing | Primary CTA only swaps `background-color` on hover (transition: `color, background-color, border-color, … 0.15s cubic-bezier(0.4,0,0.2,1)`). Modern hero CTAs lift, glow, or shift the arrow icon. | Add a 2-axis hover: (a) `translateY(-1px)` + intensify the existing amber glow shadow from `0.6` to `0.75` opacity, (b) animate the trailing `→` 4 px right via `group-hover:translate-x-1`. Keep 150 ms. | motion | component | 4 | 1 | quick_win | Vercel / Linear / Resend primary CTA pattern | `assets/cta-primary-default.png`, `assets/cta-primary-hover.png` | `getByRole('link', { name: 'Kostenlose Dach-Analyse buchen' })` |
| UX-005 | /landing | Hero stats (`480+`, `142 MWp`, `8 Wo.`) render as a tight inline `<dl>` row of three terms — small, low contrast, easy to miss. The "Warum jetzt" section likewise stacks two stat blurbs (`+38%`, `31.12.26`) as adjacent paragraphs without card framing. | Convert both into a **bento metric grid**: 3-up at desktop, cards with `--paper` bg, 1 px `--line` border, 6 px radius, large JetBrains-Mono numeral (40 px), 12 px caption beneath. Reuse the same card for both sections. | hierarchy | component | 5 | 2 | quick_win | Apple metric cards; Stripe homepage bento; Linear stat row | `assets/hero-default.png`, `assets/proof-stats.png`, snapshot refs `e31` / `e83` / `e131` | `dl` directly under hero copy; `section` containing "Strompreis-Anstieg" |
| UX-006 | /landing | Calculator output `<aside>` lists 8 metrics (Anlagengröße, Jahresertrag, Einsparung, Einspeise-Vergütung, Ertrag gesamt, Investition, Amortisation, CO₂) as same-weight `<dt>/<dd>` pairs. Eye has no anchor. | Visually rank: promote **Amortisation** and **Ertrag gesamt** to display-size (28–32 px, Geist 600, `--solar` underline gradient) at the top, group remaining six in a 2-col `--muted` mini-table below. Preserve all data. | hierarchy | component | 4 | 2 | quick_win | Notion finance dashboards; Stripe ROI calculators | `assets/calc-results-aside.png`, snapshot `e252`–`e278` | `aside:has-text("Richtwerte Ihre Anlage")` |
| UX-007 | /landing | Comparison table treats the "Solarwerk-Süd" winning column with no visual emphasis beyond the inline check-icon — column header is a flat text cell, column background is white like the others. Eye has to read row-by-row. | Tint the "Solarwerk-Süd" column with a 4 %–6 % `--solar` background wash and round its top corners; thicken its column border to 2 px `--solar`. Keep competitor columns plain. | hierarchy | component | 4 | 2 | quick_win | Stripe / Linear pricing-style "this is us" column highlight | `assets/comparison-table.png`, snapshot `e338`–`e386` | `table` after "Vergleich" eyebrow |
| UX-008 | /landing | FAQ accordion items are flat rows with only a top/bottom border and a chevron — no card surface, no hover lift, hover state visually identical to default (`assets/faq-item-hover.png` vs `assets/faq-item-collapsed.png`). | Wrap each item in a `--paper` card (1 px `--line`, 8 px radius, 16 px padding), hover raises `box-shadow` to neutral-elevation + tints border to `--ink/10`, expanded state shifts background to `--paper/60` and rotates chevron 180° in 200 ms. | depth | component | 4 | 2 | quick_win | Linear FAQ; Vercel docs accordion | `assets/faq-list.png`, `assets/faq-item-expanded.png`, `assets/faq-item-collapsed.png`, `assets/faq-item-hover.png` | `ul:has(button[aria-expanded])` containing FAQ items |
| UX-009 | /landing | Submit buttons inside forms ("Satelliten-Vorschau anfordern", "Anfordern", "Termin wählen") use ink-dark (`#0e1116`) background, while the hero primary CTA uses solar amber. Two competing "primary" languages — users see a dark button and a bright button on the same page and can't tell which is more important. | Adopt a 3-tier button system as tokens: **primary** = amber `--solar`, dark text, glow shadow (hero CTA + final Cal.com CTA); **secondary** = ink `--ink`, white text, no glow (form submits); **ghost** = transparent + `--line` border (cookie "Nur essenziell", "Erst rechnen lassen"). Document the rule, then sweep usage. | system_coherence | global_token | 4 | 2 | strategic_bet | Stripe / GitHub Primer button tiers | `assets/cta-primary-default.png`, `assets/submit-satellite-default.png`, `assets/cal-cta-block.png`, `assets/raw/controls-landing.json` (mix of `#e8a33d` vs `#0e1116` button bg) | `getByRole('button', { name: 'Satelliten-Vorschau' })`, `getByRole('button', { name: 'Termin wählen' })` |
| UX-010 | /landing | "[DEMO]" markers on testimonial cards render as plain inline `[DEMO]` text inside the header — visually noisy and breaks the editorial tone. | Replace with a small uppercase pill (10 px, JetBrains Mono, `--muted` text on `--paper` background, 2 px `--line` border, fully rounded) labelled `DEMO`. Same component reused on the "Demo-Daten" caption below the client list. | brand | component | 3 | 1 | quick_win | Linear / Vercel "BETA" / "PREVIEW" badges | `assets/testimonial-card.png`, snapshot `e150` / `e165` | `article:has-text("Maier Logistik")` |
| UX-011 | /landing | Cal.com placeholder section ("Terminbuchung wird beim Laden …" + a single dark button) reads as a fallback, not as a moment in the customer journey. It's the page's *closing* action and currently has the least visual investment. | Re-frame as a **consent-gate card**: `--ink` background, white text, amber CTA inside, calendar-icon glyph, 16:9 aspect, subtle paper-noise overlay. Wire to the same primary-CTA spec (UX-004). One click loads the iframe. | clarity | component | 4 | 3 | strategic_bet | Cal.com's own embed-gate card; Vercel preview gates | `assets/cal-cta-block.png`, snapshot `e397`–`e401` | `section:has-text("Jetzt unverbindlich")` |
| UX-012 | /landing | Hero form (PLZ / Nr. / E-Mail) inputs are 42 px tall, 6 px radius, 0.8 px `--line` border — clean but no focus ring observed in token output and no inset cue. On a warm paper bg they recede. | Establish a token-level focus style: `2px solid --solar` outline at `outline-offset: 2px` (already half-defined via `.focus-ring` Tailwind class — make it the default for **all** form controls, sliders, selects, and the new branded controls in UX-001). Add subtle inset `box-shadow: 0 1px 0 rgba(14,17,22,0.04)` for default depth. | control_design | global_token | 3 | 2 | incremental | Vercel design system input focus | `assets/textinput-default.png`, `assets/raw/tokens-landing.json` (no `focus` shadow recipe) | all `input`, `select`, `textarea`, `[role=slider]`, `[role=checkbox]` |
| UX-013 | /landing | The "Förder-Status live" bar (KfW 270, §6 EEG) is interesting data presented as flat inline text in a 1-line ribbon — wasted real estate for proof-of-urgency. | Re-design as a 3-card mini-bar (status pill, value, deadline) right below hero. Reuse the bento metric card from UX-005, add a pulsing leaf-green status dot to signal "live". | hierarchy | component | 3 | 2 | incremental | Linear status banner; Stripe deadline strip | `assets/foerderstatus-bar.png`, snapshot `e64`–`e73` | `div:has-text("Förder-Status live")` |

## Handoff to the 21st.dev Magic agent — READ THIS
You are the Magic agent consuming this file. Apply the `machine_readable` items below, in
`prioritized_order`, following these rules:
- **track = "component"** → this is a self-contained component to generate. Use its `magic_prompt`
  verbatim as your `/ui` generation input; it already encodes the design tokens to honor. Save output
  for review, then integrate at the named `target_component` call sites. Do not delete the old
  component in the same pass.
- **track = "global_token"** → this is NOT a component generation. It is a change to the design-token
  layer (Tailwind config / CSS variables / shared primitives). Do not call `/ui`; flag it for the
  IDE agent or apply directly as a token edit. `magic_prompt` is null for these.
- Apply ALL `quick_win` items before any `strategic_bet`. Pause for human confirmation before any
  `strategic_bet`. One recommendation per commit. Honor the global `design_tokens_to_honor` so new
  components match the existing visual language. Stay out of accessibility, responsiveness,
  performance, and functional scope — this audit deliberately excluded them.

## Machine-readable recommendations (for the Magic agent)
```json
{
  "design_tokens_to_honor": "Paper #f7f6f2 bg, ink #0e1116 text, solar amber #e8a33d primary (hover #d8902a), steel #2c3e4c secondary, leaf #3d7a5c positive, line #d8d4c8 borders, muted #6b7280. Fonts: Geist (display), Inter (body), JetBrains Mono (numerals/eyebrows). Weights 400/500/600 only. Radii 6 or 8 px (pill only for chips). Shadows: amber-glow CTA (rgba(232,163,61,0.6) 0 10px 30px -10px), neutral elevation (rgba(14,17,22,0.25) 0 10px 40px -15px). Motion 150 ms cubic-bezier(0.4,0,0.2,1) for state, 600 ms cubic-bezier(0.22,1,0.36,1) for reveals. Signature: 62%-stop amber highlighter underline gradient on key spans.",
  "prioritized_order": ["UX-002", "UX-003", "UX-004", "UX-010", "UX-001", "UX-005", "UX-006", "UX-007", "UX-008", "UX-012", "UX-013", "UX-009", "UX-011"],
  "recommendations": [
    {
      "id": "UX-001",
      "title": "Branded slider, select and checkbox for the ROI calculator",
      "track": "component",
      "category": "control_design",
      "url": "https://slscrm.vercel.app/landing",
      "locator": "section:has(input[type=range][aria-label='Dachfläche'])",
      "a11y_ref": "e219 (calculator), e225/e233/e241 (sliders), e248 (select), e250 (checkbox)",
      "control_kind": "slider",
      "states_observed": ["default", "focus", "moved-via-arrow-key"],
      "target_component": "Calculator controls inside `app/landing/.../calculator-*.tsx` (or wherever the calculator block is rendered)",
      "observation": "Native HTML range / select / checkbox shipped raw. Slider is 16 px tall with default OS thumb; only `accent-color: #e8a33d` applied. Select shows OS chevron. Checkbox is 13×16 px native box.",
      "recommendation": "Replace all three with branded primitives that match the editorial token language (paper bg, line border, amber accent, JetBrains Mono numerals).",
      "reference_pattern": "Linear / Vercel sliders; Radix UI Select; Headless UI Checkbox",
      "ux_value": 5,
      "implementation_complexity": 3,
      "priority_quadrant": "quick_win",
      "magic_prompt": "Create three matching form-control primitives for a B2B solar/PV calculator. Match this project's tokens: paper bg #f7f6f2, ink text #0e1116, solar accent #e8a33d (hover #d8902a), line border #d8d4c8, muted #6b7280, leaf #3d7a5c. Fonts: Inter body, JetBrains Mono numerals. Radii 6/8 px. Motion 150 ms cubic-bezier(0.4,0,0.2,1).\\n\\n(1) BrandedSlider — horizontal range, track 4 px tall #d8d4c8 with rounded ends, filled portion #e8a33d, thumb 20 px circle white with 1 px #d8d4c8 border and `rgba(232,163,61,0.6) 0 4px 12px -2px` shadow, thumb scales to 1.1 on hover/active. Above the track on the right, render a value bubble: JetBrains Mono 14 px, ink text on paper background, 6 px radius, 2 px 8 px padding. States required: default, hover (thumb shadow intensifies), focus (2 px #e8a33d ring at 2 px offset around thumb), active/dragging (thumb scale 1.1), disabled (40 % opacity, no pointer). 150 ms ease-in-out for thumb position, scale, color, shadow.\\n\\n(2) BrandedSelect — built on Radix UI Select. Trigger 40 px tall, paper bg, 0.8 px #d8d4c8 border, 6 px radius, ink text Inter 15 px, custom chevron-down icon in #6b7280 that rotates 180° when open. Menu pops with `rgba(14,17,22,0.25) 0 10px 40px -15px` shadow, 8 px radius, 4 px inner padding, options 36 px tall with 12 px horizontal padding, highlighted option gets #e8a33d/8 % bg, selected option gets #e8a33d/12 % bg and a leaf-#3d7a5c check on the right. States required: default, hover (border darkens to #b5b09c), focus (2 px #e8a33d outline at 2 px offset), open (border becomes #e8a33d), disabled (40 % opacity).\\n\\n(3) BrandedCheckbox — 18×18 px box, 4 px radius, 0.8 px #d8d4c8 border, paper bg. States: default (empty), hover (border #b5b09c, paper darkens 2 %), focus (2 px #e8a33d ring at 2 px offset), checked (bg #e8a33d, ink-color check glyph, 100 ms scale-in), disabled (40 % opacity), indeterminate (#e8a33d bg, ink-color minus glyph). Label sits 8 px right of box, Inter 15 px ink.\\n\\nReact + TypeScript + Tailwind v4 with CSS custom properties --solar, --ink, --paper, --line, --muted, --leaf. No extra UI deps beyond Radix Select. Ship as `components/branded-slider.tsx`, `components/branded-select.tsx`, `components/branded-checkbox.tsx`, each with a default export.",
      "evidence": "assets/calculator-block.png, assets/slider-default.png, assets/slider-focus.png, assets/select-default.png, assets/checkbox-default.png, assets/checkbox-checked.png, assets/raw/controls-landing.json",
      "confidence": "high"
    },
    {
      "id": "UX-002",
      "title": "Normalize type scale to a 9-step modular ramp",
      "track": "global_token",
      "category": "typography",
      "url": "https://slscrm.vercel.app/landing",
      "locator": "tailwind.config / globals.css (font-size tokens)",
      "a11y_ref": "n/a (token layer)",
      "control_kind": null,
      "states_observed": null,
      "target_component": null,
      "observation": "18 distinct font sizes in use (10, 11, 12, 13, 14, 15, 16, 17, 18, 22, 24, 30, 36, 40, 52, 56, 64, 68). Adjacent pairs like 10/11/12, 14/15, 22/24, 52/56, 64/68 are visually indistinguishable yet duplicated. No modular ramp.",
      "recommendation": "Collapse to a 9-step ramp: 12, 14, 16, 18, 22, 28, 36, 48, 64. Expose as Tailwind theme tokens or CSS custom properties (`--fs-xs` … `--fs-7xl`). Sweep all `text-[XYpx]` and inline font-size declarations to the nearest step.",
      "reference_pattern": "Tailwind default text-* scale; Vercel Geist scale",
      "ux_value": 5,
      "implementation_complexity": 2,
      "priority_quadrant": "quick_win",
      "magic_prompt": null,
      "evidence": "assets/raw/tokens-landing.json (typeScale field)",
      "confidence": "high"
    },
    {
      "id": "UX-003",
      "title": "SectionEyebrow chip",
      "track": "component",
      "category": "typography",
      "url": "https://slscrm.vercel.app/landing",
      "locator": "p:has-text('Warum jetzt'), p:has-text('Photovoltaik · Gewerbe · Süddeutschland'), p:has-text('Vergleich'), p:has-text('Selbst nachrechnen'), p:has-text('Was uns unterscheidet')",
      "a11y_ref": "e23, e78/e79, e98, e129, e190, e216, e288, e335, e392",
      "control_kind": null,
      "states_observed": null,
      "target_component": "Inline eyebrow paragraph above each section heading throughout `app/landing/page.tsx` and partials",
      "observation": "Section eyebrows are plain `<p>` tags at body weight — visually indistinguishable from supporting copy, no system-language cue.",
      "recommendation": "Introduce a reusable SectionEyebrow component that renders as a small uppercase JetBrains Mono label, optionally with a 6 px leaf-green dot prefix. One component, one prop (`tone: 'leaf' | 'steel' | 'muted'`).",
      "reference_pattern": "Stripe / Vercel section eyebrows; Linear label",
      "ux_value": 4,
      "implementation_complexity": 1,
      "priority_quadrant": "quick_win",
      "magic_prompt": "Create a SectionEyebrow component for a B2B solar landing page. Token palette: ink #0e1116, paper #f7f6f2, solar #e8a33d, leaf #3d7a5c, steel #2c3e4c, muted #6b7280, line #d8d4c8. Font: JetBrains Mono 11 px, uppercase, letter-spacing 0.08em, weight 500. Default text color uses --leaf, configurable via prop `tone: 'leaf' | 'steel' | 'muted'`. Optional 6 px circle dot 8 px to the left of the text, same color as the text, with a soft 4 px outer halo (`box-shadow: 0 0 0 3px currentColor/15%`). No background fill, no border. Used above an h1/h2/h3 with 16 px margin-bottom. React + TypeScript + Tailwind v4. Props: `tone?: 'leaf'|'steel'|'muted'`, `dot?: boolean`, `children: React.ReactNode`. Ship as `components/section-eyebrow.tsx`.",
      "evidence": "assets/hero-default.png, assets/diff-section.png, assets/calculator-block.png, assets/proof-stats.png",
      "confidence": "high"
    },
    {
      "id": "UX-004",
      "title": "Lift + arrow-shift on primary CTA hover",
      "track": "component",
      "category": "motion",
      "url": "https://slscrm.vercel.app/landing",
      "locator": "a[href='#termin'].bg-\\[var\\(--solar\\)\\]",
      "a11y_ref": "e28",
      "control_kind": null,
      "states_observed": ["default", "hover"],
      "target_component": "Primary CTA in `app/landing/page.tsx` hero + Cal.com section",
      "observation": "Primary CTA only swaps background-color on hover. The trailing arrow does not move; the button does not lift; the existing amber glow shadow does not intensify.",
      "recommendation": "Add `transform: translateY(-1px)` on hover with shadow intensified from `0.6` to `0.75` alpha, and animate the trailing `→` 4 px right via `group-hover:translate-x-1`. Keep the existing 150 ms cubic-bezier(0.4,0,0.2,1) curve.",
      "reference_pattern": "Vercel / Linear / Resend primary CTA",
      "ux_value": 4,
      "implementation_complexity": 1,
      "priority_quadrant": "quick_win",
      "magic_prompt": "Create a PrimaryCTA button/link component for a B2B solar landing page hero. Tokens: solar amber #e8a33d bg (hover #d8902a), ink #0e1116 text, 6 px radius, 24 px horizontal padding, 14 px vertical padding, font Inter 15 px weight 600. Default shadow: `0 10px 30px -10px rgba(232,163,61,0.6)`. Trailing arrow `→` (lucide ArrowRight, 16 px). States required: default, hover (translateY(-1px), shadow alpha 0.6 → 0.75, arrow translateX +4 px), focus (2 px #e8a33d ring at 2 px offset), active (translateY(0), shadow back to 0.6, arrow at +2 px), disabled (40 % opacity, no shadow, no transform). All transitions 150 ms cubic-bezier(0.4,0,0.2,1). Render as `<a>` by default, `as` prop to switch to `<button>`. React + TypeScript + Tailwind v4, `group` parent so arrow uses `group-hover:translate-x-1`. Ship as `components/primary-cta.tsx`.",
      "evidence": "assets/cta-primary-default.png, assets/cta-primary-hover.png",
      "confidence": "high"
    },
    {
      "id": "UX-005",
      "title": "Bento metric card grid (hero stats + Warum-jetzt + proof block)",
      "track": "component",
      "category": "hierarchy",
      "url": "https://slscrm.vercel.app/landing",
      "locator": "dl:has(dt:text('Gewerbeanlagen')), section:has-text('Strompreis-Anstieg'), section:has-text('480 Anlagen.')",
      "a11y_ref": "e31, e83, e131",
      "control_kind": null,
      "states_observed": null,
      "target_component": "Three sections in `app/landing/page.tsx`: hero stat row, Warum-jetzt stat row, proof stats above testimonials",
      "observation": "Hero shows three KPIs (`480+`, `142 MWp`, `8 Wo.`) as a tight inline `<dl>` row — small, low contrast. Warum-jetzt section repeats two more stats (`+38%`, `31.12.26`) as plain stacked paragraphs. Proof block uses a slightly larger version of the same flat pattern. No card framing, no visual anchor.",
      "recommendation": "Introduce a reusable BentoMetric card and group them in 2-up or 3-up grids. Big JetBrains Mono numeral, small Inter caption, optional muted footnote.",
      "reference_pattern": "Apple metric cards; Stripe bento; Linear stat row",
      "ux_value": 5,
      "implementation_complexity": 2,
      "priority_quadrant": "quick_win",
      "magic_prompt": "Create a BentoMetric card for a B2B solar landing page. Tokens: paper bg #f7f6f2, ink text #0e1116, muted #6b7280, line #d8d4c8, solar #e8a33d, leaf #3d7a5c. Fonts: JetBrains Mono for the big number, Inter for caption + footnote. Card: 1 px solid --line, 6 px radius, 24 px padding, no shadow at rest. Composition top-to-bottom: (1) optional 11 px uppercase JetBrains Mono eyebrow in --muted; (2) the metric in JetBrains Mono 40 px weight 500, ink color; (3) Inter 14 px --muted caption beneath; (4) optional 12 px Inter --muted footnote with a leaf bullet for 'live' status. Variants via prop `tone: 'neutral' | 'solar' | 'leaf'` — solar variant tints the numeral with --solar, leaf variant adds a 6 px pulsing dot before the eyebrow. Hover: border darkens to ink/15. Container: a `BentoGrid` wrapper that lays cards out in 2 / 3 / 4 columns at md+ via CSS grid with 16 px gap; collapses to 1 column below md. React + TypeScript + Tailwind v4. Props for BentoMetric: `eyebrow?: string`, `value: string`, `caption?: string`, `footnote?: string`, `tone?: 'neutral'|'solar'|'leaf'`, `live?: boolean`. Ship as `components/bento-metric.tsx` (with BentoGrid wrapper in same file).",
      "evidence": "assets/hero-default.png, assets/proof-stats.png, assets/landing-fullpage.png",
      "confidence": "high"
    },
    {
      "id": "UX-006",
      "title": "Visually rank calculator output: promote Amortisation + Ertrag, mute the rest",
      "track": "component",
      "category": "hierarchy",
      "url": "https://slscrm.vercel.app/landing",
      "locator": "aside:has-text('Richtwerte Ihre Anlage')",
      "a11y_ref": "e252-e278",
      "control_kind": null,
      "states_observed": null,
      "target_component": "Calculator output panel beside the sliders",
      "observation": "Eight metrics shown as same-weight `<dt>/<dd>` pairs. No anchor for the eye — Amortisation and Ertrag gesamt are the two values that close the sale and they read no louder than CO₂-vermieden.",
      "recommendation": "Promote Amortisation + Ertrag gesamt to display size at the top of the panel with a solar-amber highlighter underline; demote the other six metrics to a 2-col --muted mini-table beneath.",
      "reference_pattern": "Notion finance dashboards; Stripe ROI calculators",
      "ux_value": 4,
      "implementation_complexity": 2,
      "priority_quadrant": "quick_win",
      "magic_prompt": "Create a CalculatorOutputPanel component for a solar/PV ROI calculator. Tokens: paper bg #f7f6f2, ink #0e1116, muted #6b7280, line #d8d4c8, solar #e8a33d, leaf #3d7a5c. Fonts: Geist 600 for primary numerals, JetBrains Mono for secondary numerals, Inter 14 px for labels. Panel: 1 px --line, 6 px radius, 28 px padding, paper bg.\\n\\nLayout: section title 'Richtwerte Ihre Anlage' (11 px JetBrains Mono uppercase --muted, tracking +1) → two **hero metrics** stacked: Amortisation (32 px Geist 600 with the signature amber highlighter underline gradient `linear-gradient(transparent 62%, rgba(232,163,61,0.55) 62%)` running under the value) and Ertrag gesamt (same style). 12 px label above each in --muted Inter 13 px. 16 px gap between the two.\\n\\nBelow a 1 px --line divider, render a 2-column grid of six secondary metrics (Anlagengröße, Jahresertrag, Einsparung Strom, Einspeise-Vergütung, Investition, CO₂ vermieden) — each as label/value pair in JetBrains Mono 15 px ink value, Inter 13 px --muted label, 12 px row gap, 24 px column gap.\\n\\nBelow the grid, an email capture row: Inter 13 px --muted caption 'Detail-Berechnung per E-Mail erhalten' + a 40 px tall paper-bg input (border 0.8 px --line, 6 px radius, --solar focus ring 2 px offset 2 px) + an ink-bg button 'Anfordern' (white text, 6 px radius). Below, 11 px --muted Inter footnote slot for assumptions.\\n\\nProps: `metrics: { primary: {label, value}[], secondary: {label, value}[] }`, `footnote?: string`, `onEmailSubmit?: (email: string) => void`. React + TypeScript + Tailwind v4. Ship as `components/calculator-output-panel.tsx`.",
      "evidence": "assets/calc-results-aside.png",
      "confidence": "high"
    },
    {
      "id": "UX-007",
      "title": "Highlight winning column in the comparison table",
      "track": "component",
      "category": "hierarchy",
      "url": "https://slscrm.vercel.app/landing",
      "locator": "table:near(:text('Vergleich'))",
      "a11y_ref": "e338",
      "control_kind": null,
      "states_observed": null,
      "target_component": "Comparison table block in `app/landing/page.tsx`",
      "observation": "Comparison table treats the 'Solarwerk-Süd' column the same as the two competitor columns aside from a check-icon — column header is flat, column background is white. Reader has no visual anchor for the 'this is us' column.",
      "recommendation": "Tint the Solarwerk-Süd column with a 4 %–6 % --solar background, thicken its column border to 2 px --solar, and pin the column header to ink/Geist 600.",
      "reference_pattern": "Stripe / Linear pricing 'this is us' column",
      "ux_value": 4,
      "implementation_complexity": 2,
      "priority_quadrant": "quick_win",
      "magic_prompt": "Create a ComparisonTable component for a B2B solar landing page comparing 'Us' vs N competitors. Tokens: paper #f7f6f2, ink #0e1116, muted #6b7280, line #d8d4c8, solar #e8a33d, leaf #3d7a5c. Fonts: Geist 600 for headers, Inter 15 px for cells, JetBrains Mono for any numerical cells.\\n\\nLayout: a single semantic `<table>` with one row-header column on the left (criteria) and N data columns. The 'us' column (passed via prop `highlightIndex: number`) gets: column background `rgba(232,163,61,0.05)`, 2 px --solar left+right border (other column dividers are 1 px --line), top corners 8 px radius, column header gets ink color + Geist 600 + a 6 px circle --solar dot to the left of the brand name. Other column headers use --muted Inter 14 px uppercase tracking +1. Row headers (criteria) are sticky-left at md+ widths.\\n\\nCell content supports two variants: a positive cell renders a lucide `Check` icon in --leaf followed by the label in ink Inter 15 px; a neutral/competitor cell renders the label in --muted Inter 15 px (no icon). Row vertical padding 14 px, horizontal 16 px. Zebra: even rows get bg `rgba(14,17,22,0.02)` only outside the highlighted column.\\n\\nProps: `columns: { name: string; isUs?: boolean }[]`, `rows: { criterion: string; cells: { kind: 'positive'|'neutral'; label: string }[] }[]`. React + TypeScript + Tailwind v4. Ship as `components/comparison-table.tsx`.",
      "evidence": "assets/comparison-table.png",
      "confidence": "high"
    },
    {
      "id": "UX-008",
      "title": "Card-framed FAQ accordion with hover lift + chevron rotation",
      "track": "component",
      "category": "depth",
      "url": "https://slscrm.vercel.app/landing",
      "locator": "ul:has(button[aria-expanded]):near(:text('Fragen, die zuerst'))",
      "a11y_ref": "e290",
      "control_kind": null,
      "states_observed": ["default", "hover", "expanded", "collapsed"],
      "target_component": "FAQ section in `app/landing/page.tsx`",
      "observation": "Accordion items are flat rows separated by hairlines only. Hover state is visually identical to default. No card surface, no shadow, no chevron animation observed.",
      "recommendation": "Re-design each item as a `--paper` card with `--line` border. Hover raises a neutral-elevation shadow + darkens border to ink/15. Expanded state shifts background and rotates chevron 180° in 200 ms.",
      "reference_pattern": "Linear FAQ; Vercel docs accordion",
      "ux_value": 4,
      "implementation_complexity": 2,
      "priority_quadrant": "quick_win",
      "magic_prompt": "Create a BrandedAccordion component (FAQ) for a B2B solar landing page. Tokens: paper #f7f6f2, ink #0e1116, muted #6b7280, line #d8d4c8, solar #e8a33d. Fonts: Inter, JetBrains Mono for the leading 2-digit number.\\n\\nEach item: card with paper bg, 1 px --line border, 8 px radius, 16 px vertical padding, 24 px horizontal padding. Trigger row uses a left-aligned 2-digit JetBrains Mono 14 px --muted number (`01`, `02`, …) followed by 16 px of space and the question in Inter 16 px weight 500 ink. Right-aligned chevron-down icon 16 px in --muted.\\n\\nStates required: default (border --line, no shadow, chevron at 0°), hover (border darkens to `rgba(14,17,22,0.15)`, neutral-elevation shadow `0 10px 40px -15px rgba(14,17,22,0.25)` lifts the card, chevron --ink), focus-visible (2 px --solar outline at 2 px offset on the trigger button), expanded (background subtly darkens to `rgba(247,246,242,0.6)`, chevron rotates 180°, answer panel slides down with opacity 0→1 + translateY(-4px)→0 in 220 ms cubic-bezier(0.22,1,0.36,1)), disabled (40 % opacity).\\n\\nAnswer panel: Inter 15 px ink/0.75 line-height 1.6, 16 px top padding, 8 px bottom padding. Use Radix UI Accordion under the hood. Container `BrandedAccordion`, item `BrandedAccordionItem`. Props: item takes `n: string`, `question: string`, `children: React.ReactNode`. React + TypeScript + Tailwind v4 + Radix. Ship as `components/branded-accordion.tsx`.",
      "evidence": "assets/faq-list.png, assets/faq-item-expanded.png, assets/faq-item-collapsed.png, assets/faq-item-hover.png",
      "confidence": "high"
    },
    {
      "id": "UX-009",
      "title": "Three-tier button token system",
      "track": "global_token",
      "category": "system_coherence",
      "url": "https://slscrm.vercel.app/landing",
      "locator": "tailwind.config.js + a `components/ui/button.tsx` (if absent, create at token level)",
      "a11y_ref": "e28, e60, e283, e401, e435, e436",
      "control_kind": null,
      "states_observed": null,
      "target_component": null,
      "observation": "Page mixes two 'primary' button styles: amber (hero CTA) and ink-dark (form submits, Cal.com gate). Without a documented tier, designers and engineers will keep picking either at random.",
      "recommendation": "Codify a 3-tier button token system at the design-token layer: **primary** = solar amber + glow shadow (hero CTA + closing Cal.com CTA only); **secondary** = ink + white text (form submits, in-page jumps); **ghost** = transparent + line border (cookie dismiss, 'rechnen lassen'). Then sweep usages.",
      "reference_pattern": "Stripe primary/secondary/ghost tiers; GitHub Primer button",
      "ux_value": 4,
      "implementation_complexity": 2,
      "priority_quadrant": "strategic_bet",
      "magic_prompt": null,
      "evidence": "assets/cta-primary-default.png, assets/submit-satellite-default.png, assets/cal-cta-block.png, assets/raw/controls-landing.json",
      "confidence": "high"
    },
    {
      "id": "UX-010",
      "title": "DemoTag pill",
      "track": "component",
      "category": "brand",
      "url": "https://slscrm.vercel.app/landing",
      "locator": "article:has-text('Maier Logistik') span:text('[DEMO]')",
      "a11y_ref": "e150, e165",
      "control_kind": null,
      "states_observed": null,
      "target_component": "Testimonial cards + footer demo-disclaimer in `app/landing/page.tsx`",
      "observation": "'[DEMO]' is plain inline bracket text inside the testimonial card header. Visually loud (brackets), brand-incongruent (raw text).",
      "recommendation": "Replace with a small pill chip — single, reusable component used wherever demo data is displayed.",
      "reference_pattern": "Linear 'BETA' badges; Vercel 'PREVIEW' tags",
      "ux_value": 3,
      "implementation_complexity": 1,
      "priority_quadrant": "quick_win",
      "magic_prompt": "Create a DemoTag pill component for a B2B landing page that wants to flag illustrative content. Tokens: paper #f7f6f2, ink #0e1116, muted #6b7280, line #d8d4c8. Font: JetBrains Mono 10 px weight 500, uppercase, letter-spacing 0.1em. Render as an inline-flex span with: paper bg, 0.8 px --line border, 4 px vertical padding, 8 px horizontal padding, fully rounded (`border-radius: 9999px`), --muted text color. Optional 4 px circle dot prefix in --muted. Variants via prop `tone: 'muted' | 'leaf' | 'solar'`. No interactive states required (it's static metadata). React + TypeScript + Tailwind v4. Props: `tone?: 'muted'|'leaf'|'solar'`, `dot?: boolean`, `children: React.ReactNode`. Ship as `components/demo-tag.tsx`.",
      "evidence": "assets/testimonial-card.png",
      "confidence": "high"
    },
    {
      "id": "UX-011",
      "title": "Cal.com consent-gate card",
      "track": "component",
      "category": "clarity",
      "url": "https://slscrm.vercel.app/landing",
      "locator": "section:has-text('Jetzt unverbindlich und persönlich beraten lassen')",
      "a11y_ref": "e397-e401",
      "control_kind": null,
      "states_observed": null,
      "target_component": "Final booking section in `app/landing/page.tsx` — replaces the current text + dark button placeholder",
      "observation": "The page's closing action is a faint text block with a single dark button. Visually under-invested for what is the conversion endpoint.",
      "recommendation": "Replace with an ink-bg consent-gate card: white text on ink, amber CTA inside, calendar glyph, 16:9 aspect at desktop, subtle noise overlay. Clicking loads the Cal.com iframe.",
      "reference_pattern": "Cal.com's own embed gate; Vercel preview gates",
      "ux_value": 4,
      "implementation_complexity": 3,
      "priority_quadrant": "strategic_bet",
      "magic_prompt": "Create a ConsentGateCard component to lazy-load a third-party booking iframe (Cal.com) only after user consent. Tokens: ink #0e1116, paper #f7f6f2, solar #e8a33d (hover #d8902a), muted #6b7280, line #d8d4c8, leaf #3d7a5c. Fonts: Geist for the heading, Inter for body, JetBrains Mono for footnote.\\n\\nCard: 16:9 aspect at md+, full width below md. ink bg, 8 px radius, neutral-elevation shadow at rest. Optional subtle SVG noise overlay at 4 % opacity. Inside, centered: (1) lucide CalendarDays icon 28 px in --solar, (2) 22 px Geist 600 white heading slot, (3) 14 px Inter white/0.7 body slot (max 56 ch), (4) primary CTA — solar bg, ink text, 6 px radius, glow shadow `0 10px 30px -10px rgba(232,163,61,0.6)`, hover translateY(-1px) and shadow alpha 0.6→0.75, trailing arrow translateX +4 px on group-hover, 150 ms cubic-bezier(0.4,0,0.2,1).\\n\\nStates required: default (gate visible), hover (cta lifts), loading (spinner replaces cta label, button disabled), loaded (entire card swaps for the live iframe at the same aspect). Below the card, 12 px JetBrains Mono --muted footnote slot for legal/privacy text.\\n\\nProps: `heading: string`, `body: string`, `ctaLabel: string`, `onConsent: () => Promise<void>`, `footnote?: React.ReactNode`. React + TypeScript + Tailwind v4. Ship as `components/consent-gate-card.tsx`.",
      "evidence": "assets/cal-cta-block.png",
      "confidence": "high"
    },
    {
      "id": "UX-012",
      "title": "Unified focus-ring + inset depth token for all inputs",
      "track": "global_token",
      "category": "control_design",
      "url": "https://slscrm.vercel.app/landing",
      "locator": "globals.css `.focus-ring` utility / `input`, `select`, `textarea`, `[role=slider]`, `[role=checkbox]`",
      "a11y_ref": "e57, e58, e59, e225, e233, e241, e248, e250, e282",
      "control_kind": "text_input",
      "states_observed": ["default"],
      "target_component": null,
      "observation": "Inputs use 0.8 px --line border on warm paper bg with no focus-ring recipe in computed styles and no inset-depth cue. They recede.",
      "recommendation": "Make the existing `.focus-ring` Tailwind class the default for **all** form controls (input, select, textarea, slider, checkbox, the new branded primitives in UX-001): `outline: 2px solid var(--solar); outline-offset: 2px`. Add a uniform inset depth shadow `box-shadow: inset 0 1px 0 rgba(14,17,22,0.04)` for default depth on light-bg controls.",
      "reference_pattern": "Vercel design system input focus",
      "ux_value": 3,
      "implementation_complexity": 2,
      "priority_quadrant": "incremental",
      "magic_prompt": null,
      "evidence": "assets/textinput-default.png, assets/raw/tokens-landing.json",
      "confidence": "high"
    },
    {
      "id": "UX-013",
      "title": "Live Förder-status mini-bento",
      "track": "component",
      "category": "hierarchy",
      "url": "https://slscrm.vercel.app/landing",
      "locator": "div:has-text('Förder-Status live')",
      "a11y_ref": "e64",
      "control_kind": null,
      "states_observed": null,
      "target_component": "Förder-status ribbon directly below hero in `app/landing/page.tsx`",
      "observation": "The 'Förder-Status live' bar (KfW 270, §6 EEG, Stand-Datum) is flat single-line text — wasted real estate for proof-of-urgency.",
      "recommendation": "Re-design as a 3-card mini-bento (Status pill / Programm + Restbudget / Deadline) using the BentoMetric component from UX-005, with a pulsing leaf-green status dot to signal 'live'.",
      "reference_pattern": "Linear status banner; Stripe deadline strip",
      "ux_value": 3,
      "implementation_complexity": 2,
      "priority_quadrant": "incremental",
      "magic_prompt": "Create a FoerderStatusBar component composed of 3 BentoMetric cards in a row. Reuses the BentoMetric primitive (UX-005). Card 1: tone='leaf', live=true, eyebrow='Status', value='Live', caption='Stand 01.06.2026'. Card 2: tone='neutral', eyebrow='KfW 270', value='12,3 Mio €', caption='Restbudget verfügbar'. Card 3: tone='solar', eyebrow='§6 EEG', value='31.12.2026', caption='Förderfenster endet'. Add a pulsing 6 px leaf-#3d7a5c dot when `live=true` via CSS keyframe (opacity 0.4→1→0.4 in 1.6 s ease-in-out infinite). Container is a CSS grid 3 cols at md+, stacked below md. Wrapper has a 1 px --line top + bottom border instead of full card borders, padding 12 px vertical, paper bg. Props mostly inherited from BentoMetric. React + TypeScript + Tailwind v4. Ship as `components/foerder-status-bar.tsx`.",
      "evidence": "assets/foerderstatus-bar.png",
      "confidence": "medium"
    }
  ]
}
```
