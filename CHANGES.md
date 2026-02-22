# Changes Document — v2026 Redesign
> ofranco.top — Hector O'Franco
> Generated: 2026-02-21

---

## Summary
A full visual and structural redesign of the personal portfolio website, maintaining all original content while dramatically improving visual quality, mobile responsiveness, and user experience. The original 2024 version is preserved in full at `web/2024/`.

---

## File Structure Changes

### New Files Created
| File | Purpose |
|------|---------|
| `index.html` | Completely rewritten main page (v2026) |
| `styles.css` | Completely rewritten design system |
| `script.js` | New main JavaScript (startup data, background, navigation, animations) |
| `games/minesweeper.html` | Minesweeper game with new theme |
| `games/snake.html` | Snake game with new theme |
| `GPT/style.css` | Rewritten dark theme for GPT Explorer |
| `GPT/script.js` | Rewritten with new models and better UI |
| `GPT2/index.html` | Updated v2 explorer with new layout |
| `GPT2/script.js` | Rewritten with new models |
| `GPT2/style.css` | Copied from GPT/ (shared theme) |
| `2024/` | Full backup of original 2024 website |
| `TIMESTAMP_DIARY.md` | Development diary with timestamps |
| `CHANGES.md` | This document |
| `QUESTIONS.md` | Open questions for next iteration |
| `README.md` | Updated project README |

### Unchanged Files
- `GPT3/` — Vector store uploader (preserved as-is)
- `gemini/` — Gemini explorer (preserved as-is)
- `GOL/` — Game of Life (preserved as-is)
- `Hanoi/` — Towers of Hanoi (preserved as-is)
- `numbers/` — Rule-based mnemonic (preserved as-is)
- `numbersGPT/` — GPT mnemonic (preserved as-is)
- `img/` — All images unchanged (profile photo, backgrounds, logos)
- `CNAME` — Domain configuration unchanged
- `LICENSE` — Unchanged

---

## Detailed Change Log

### 1. Navigation
**Before:** Static `<header>` with plain text links and horizontal rule separators.
**After:**
- Fixed glassmorphism navbar (blurs background behind it)
- Logo badge "HF" with gradient
- Compact name display
- `.scrolled` class reduces padding on scroll
- Mobile: hamburger menu → full-height slide-in panel
- Active section highlighted via IntersectionObserver / scroll position
- Smooth scroll to sections with offset accounting for navbar height

**Why:** The original header was functional but visually plain. A sticky navbar is standard UX for portfolio sites and eliminates the need to scroll back to navigate.

---

### 2. Background
**Before:** Random selection from 38 background `.jpg` images rotating on page load.
**After:**
- Animated canvas background inspired by the GitHub contribution calendar
- Grid of 14×14px rounded squares in 5 shades of green:
  - `#161b22` = empty cell
  - `#0e4429` = low activity
  - `#006d32` = medium-low
  - `#26a641` = medium-high
  - `#39d353` = peak activity
- "Streak" system: falling highlights in each column (like Matrix rain, but green) — the head cell is brightest, fading over 8–12 cells of tail
- Organic pulse: each non-empty cell's opacity gently oscillates
- Streaks randomly activate/deactivate to keep the animation lively without being distracting
- Dark overlay: `radial-gradient` adds subtle indigo/cyan/purple depth behind the grid

**Why:** The rotating JPEG backgrounds were attractive but made text panels harder to read and were inconsistent across devices. The calendar animation is thematically relevant (GitHub usage is prominent in the profile), purely CSS+canvas (no external requests), and provides consistent dark-mode contrast for all text content. It also connects to the developer/coding identity.

---

### 3. Hero Section (replaces Biography section)
**Before:** Static biography section with inline image + 3 paragraphs of text.
**After:**
- 2-column grid: left = text, right = circular profile photo with animated rings
- Badge: "A.I. Consultant & Software Engineer" (types on load)
- Headline with gradient text for "Hector O'Franco"
- Subtitle: condensed professional summary
- Stats row: 10+ years, 10 startups, 600+ LeetCode
- CTA buttons: "Learn More" → `#about`, "View Demos" → `#demos`
- Social links: LinkedIn, GitHub, LeetCode, Google Scholar (SVG icons, no external libraries)

**Why:** Modern portfolios open with a strong visual introduction that communicates key facts at a glance. The 2024 version buried the user in paragraphs without hierarchy. The hero format is mobile-first, bold, and scannable.

---

### 4. About Section (new, below hero)
**Before:** Biography panel was the only "about" content.
**After:**
- 4 skill cards: Machine Learning, Computer Vision, Entrepreneurship, Research (icon + title + description)
- Extended biography paragraphs below cards (same content as 2024, retained for SEO)

**Why:** Card grids communicate areas of expertise at a glance. Recruiters and collaborators can quickly assess fit without reading everything.

---

### 5. Start-ups Section (expanded)
**Before:** Static HTML table with 10 rows (year, problem, solution, fate).
**After:**
- JavaScript-rendered card grid (responsive 2-column → 1-column mobile)
- Each card shows: year badge (monospace), status pill (colour-coded), startup name, short description
- Click to expand: CSS `max-height` transition reveals full long description + URL link
- Expand/collapse text: "Read more" ↔ "Show less"
- Status colours: active = green, trading = cyan, confidential = purple, closed = red

**Why:** Tables are hard to read on mobile. The card-with-expand pattern is more engaging and lets users quickly scan 10 ventures without being overwhelmed. Colour-coded status pills make the outcome of each venture immediately visible.

---

### 6. Demonstrators Section
**Before:** Static HTML table with link + description columns.
**After:**
- Icon card grid (icon + title + short description + tag pill)
- GPT Explorer v1, v2, Gemini Explorer, Mnemonic System (rule + AI), Game of Life, Towers of Hanoi, LeetCode, GitHub, PhD Thesis
- All cards open in-page or external link as appropriate
- Tags indicate technology category

**Why:** Cards are scannable and work better on all screen sizes than tables.

---

### 7. Games Section (NEW)
**Before:** No dedicated games section. Hanoi and GOL existed as separate demo links.
**After:**
- New `#games` section with 2-column grid
- `games/minesweeper.html` — Minesweeper with calendar background, green theme, difficulty selector, flag mode, chord reveal
- `games/snake.html` — Snake with calendar background, green gradient body, d-pad for mobile, speed + grid size controls
- Both carry "Created via AI generator" badge (purple pill)
- Both have prominent "← Back" link to main page

**Why:** User requested Minesweeper and Snake to be added as part of the redesign. A dedicated section separates "tools" (demos) from "games" conceptually. The AI-generator badge is as requested.

---

### 8. iKey Demo — REMOVED
**Before:** ikey-test/ was listed under Demos with links to register.html, ikey.html, compare.html.
**After:** Not linked from new 2026 index.html.

**Why:** User explicitly requested: "On the new version ignore the ikey demo."
Note: The files are preserved in `web/ikey-test/` and in the `web/2024/` backup.

---

### 9. GPT Explorer — Upgraded (v1 and v2)
**Before:**
- Models: gpt-4o, gpt-4-turbo, gpt-4, gpt-3.5-turbo, gpt-4o-mini
- Plain white background
- Cost tracked in cents
- No model pricing label
- Syntax error in v1 calculateCost function (missing closing brace)

**After:**
- **New models added:** `o1` ($15/$60/1M), `o1-mini` ($1.10/$4.40/1M), `o3-mini` ($1.10/$4.40/1M)
- **Updated prices** for gpt-4o ($2.50/$10.00 — corrected from old $5/$15)
- Calendar background animation (matching main site)
- Dark theme UI with glassmorphism header
- Cost bar: running session total in USD (not cents), model pricing shown live
- Per-message stats line: time, tokens in/out, message cost, session total
- Copy buttons for code blocks and full responses
- Enter to send (Shift+Enter for newline in v1)
- v2: separate user/system textareas per message (maintained from original)
- Fixed syntax error in calculateCost

**Why:** The 2024 GPT Explorer was functional but visually dated and missing newer models. o1, o1-mini, and o3-mini are important 2025/2026 additions. The cost tracking was in cents which was confusing.

---

### 10. Footer
**Before:** Fixed position, dark, just copyright text.
**After:**
- Non-fixed (scrolls with page), appears after content
- Brand logo + copyright
- Links: LinkedIn, GitHub, LeetCode, 2024 Version (archive link)
- Version note
- Consistent styling with navbar

**Why:** Fixed footer wasted screen space. The 2024 archive link is important so returning users can compare.

---

### 11. Mobile Responsiveness
**Before:** Basic CSS with `max-width: 800px` section, minimal mobile adaptation.
**After:**
- CSS custom properties drive a consistent design system
- 3 breakpoints: 1024px (tablet), 768px (mobile), 480px (small phone)
- Hero: 2-column → 1-column (image on top, text below)
- Nav: hamburger menu with full-height slide-in on mobile
- Grids: all use `auto-fill` + `minmax()` to reflow naturally
- Buttons: fill width on small screens
- Font sizes: `clamp()` for fluid scaling on hero title
- Games: d-pad shown on mobile (`display: none` above 640px)
- Canvas background: resizes on window resize event

---

### 12. Performance
- No external JavaScript libraries loaded
- Google Fonts loaded via preconnect + `display=swap`
- SVG icons inline (no icon font requests)
- Canvas animation uses `requestAnimationFrame` with browser-native scheduling
- `IntersectionObserver` for lazy scroll animations (no scroll event listener)

---

## What Was NOT Changed (Iteration 1)
- Google Analytics tracking code (G-M3TV3Z6VV7 on main, G-RXJ3R3P4BH on GPT tools)
- All content (biographies, startup descriptions, demo descriptions) — only formatting changed
- External links (LinkedIn, GitHub, LeetCode, Scholar, Bitbucket, onceover.ai, ikey.ie, loylap.com)
- Domain configuration (CNAME: ofranco.top)
- GPT3 vector store uploader (not linked in 2026 main nav but preserved)
- Gemini explorer (linked in demos, not restyled — addressed in Iteration 2)

---

# Iteration 2 Changes — v2026 (February 2026)
> User reviewed iteration 1 and provided detailed feedback. All 15 open questions answered.

---

## 1. Background Animation — Revised
**Before (Iteration 1):** Vertical falling streaks (Matrix-rain style), bright neon greens, ~60fps.
**After (Iteration 2):**
- Vertical streaks completely removed
- Each cell pulses **independently** via `Math.sin(phase)` — no coordinated falling motion
- Darker green palette: from `rgba(8,36,20,0.6)` to `rgba(20,90,44,0.75)` — much more subdued
- Half-speed phase increment: `0.003–0.006` (was `0.003–0.007` with streak velocity on top)
- `prefers-reduced-motion`: if user has motion sensitivity preference, canvas renders a static frame only (no animation loop)

**Why:** User found vertical streaks too distracting. Horizontal/independent pulsing is more like a "breathing" calendar effect and less aggressive visually.

---

## 2. Name — Google Colors
**Before:** Hero title in white (`var(--text-primary)`)
**After:** Each letter of "Hector O'Franco" wrapped in `<span class="google-text">` with rotating classes `.g2` (red), `.g3` (yellow), `.g4` (green) cycling through Google brand colors: #4285F4, #EA4335, #FBBC04, #34A853.

**Why:** User requested Google-colored name, tying the visual to his current employer identity.

---

## 3. Social Icons — Enlarged with Labels
**Before:** Small SVG icon links (18px), no text
**After:** `.social-big` class: 22px SVG icons + text label (LinkedIn / GitHub / LeetCode / Scholar), styled as pill buttons with hover lift effect. On screens <480px, labels hide (icons only).

**Why:** User said social icons were "not visible enough". Larger icons with labels are much more prominent.

---

## 4. Text Contrast — Increased
**Before:** `--bg-card: rgba(30,41,59,0.7)`, `--text-primary: #f1f5f9`
**After:** `--bg-card: rgba(14,24,42,0.88)`, `--text-primary: #f4f8ff`
- Card backgrounds are darker and more opaque → text reads better against the green canvas
- Text is slightly brighter/cooler white

---

## 5. Games Merged Into Demos Section
**Before:** Separate `#games` section below demos
**After:** Games (Minesweeper, Snake) added as cards inside the Demos section. No separate games section. Total: 13 demo cards.

**Why:** User requested no separate section — keeps the page structure simpler.

---

## 6. Demo Links — Explicit index.html Paths
**Before:** Demo cards linked to `./GPT/`, `./GPT2/`, etc.
**After:** All demo links now use explicit `./GPT/index.html`, `./GPT2/index.html` paths.

**Why:** User prefers explicit paths for clarity and to avoid potential redirect issues on some servers.

---

## 7. Year Labels on Demos
All demo cards now show a year badge: `2024` (for original tools) or `2026` (new tools). Games show `2026`. Claude explorer shows `2026`.

---

## 8. Multiple Tags Per Demo Card
**Before:** Single tag per demo
**After:** Flex row of `.demo-tag` spans with category-specific colors:
- `.tag-edu` (blue) — Educational tools
- `.tag-game` (green) — Games
- `.tag-ai` (purple) — AI-powered
- `.tag-year` (gray) — Year label
- `.tag-anthropic` (orange) — Claude/Anthropic tools

---

## 9. GDPR Cookie Consent Banner (Q11)
**Added:** Fixed bottom banner appears on first visit. Buttons: "Accept All" (saves `cookieConsent=accepted` to `localStorage`) and "Reject Non-Essential" (saves `cookieConsent=rejected` and sets `window['ga-disable-G-M3TV3Z6VV7'] = true` to block Google Analytics). Banner hides with CSS transition after choice. Does not appear again if consent is already stored.

---

## 10. Language Switcher (Q12)
**Added to navbar:** Three buttons:
1. **EN** — English (default)
2. **Castilian** — Cruz de Borgoña SVG flag (diagonal red cross on white field)
3. **Valencian** — Senyera Valenciana SVG flag (red/yellow stripes + blue bar)

All translatable text has `data-i18n="key"` attributes. `switchLanguage(lang)` in script.js finds all elements and updates `textContent` from `TRANSLATIONS[lang]` object. Current translations cover: nav links, section titles, hero badge, CTA buttons, footer copyright.

---

## 11. Open Graph / Twitter Card Meta Tags (Q13)
**Added to index.html `<head>`:**
```html
<meta property="og:title" content="Hector O'Franco — A.I. Consultant & Software Engineer">
<meta property="og:description" content="...">
<meta property="og:image" content="https://ofranco.top/img/HectorFranco.jpg">
<meta property="og:url" content="https://ofranco.top">
<meta name="twitter:card" content="summary_large_image">
```
Now when shared on LinkedIn/Twitter, a preview card with the profile photo appears.

---

## 12. onceover.ai Status Changed
**Before:** `status: "active"`, `statusLabel: "Active"`
**After:** `status: "closed"`, `statusLabel: "Aborted"`

---

## 13. GPT Explorer — Temperature Fix (Q15)
`NO_TEMP_MODELS = new Set(['o1', 'o1-mini', 'o3-mini'])` added to both `GPT/script.js` and `GPT2/script.js`. When one of these models is selected: temperature input shows as visually disabled (opacity 0.4, `disabled` attribute, tooltip "Temperature not supported"). The parameter is conditionally excluded from the API request body using `...(useTemp && { temperature: temp })`.

---

## 14. Claude API Explorer — New Tool (claude/)
**New files:** `claude/index.html`, `claude/script.js`, `claude/style.css`
- Anthropic Messages API explorer matching GPT Explorer v1 in structure
- Orange Anthropic accent theme
- Models: claude-3-5-sonnet ($3/$15/M ★), claude-3-5-haiku ($0.80/$4/M), claude-3-opus ($15/$75/M), claude-3-sonnet ($3/$15/M), claude-3-haiku ($0.25/$1.25/M)
- Includes `anthropic-dangerous-direct-browser-access: true` header for CORS
- Max tokens input (required by Anthropic API)
- Streaming via SSE with `content_block_delta` events
- CORS notice bar in UI
- Linked in main page Demos section with Anthropic orange tag

---

## 15. Gemini Explorer Restyled (Q5)
**Files changed:** `gemini/index.html` (rewritten), `gemini/style.css` (rewritten)
`gemini/script.js` preserved unchanged.
- Dark theme with Google blue (`#4285F4`) accent
- Calendar background animation (inline IIFE)
- Header with back link + HF logo (blue/green gradient)
- Dual textarea layout: user message + model/instructions stacked, with send button spanning both
- Fixed HTML id mismatch (`id="instructions"` renamed to `id="model-message"` to match existing script.js)
- Google Fonts + Analytics added

---

## 16. GOL and Hanoi Restyled (Q6)
**2024 originals preserved** at `web/2024/GOL/` and `web/2024/Hanoi/`.
Current versions at `web/GOL/` and `web/Hanoi/` restyled.

**GOL/index.html:**
- Canvas cells: alive = `#39d353` (bright green), dead = faint green glow (instead of black/grey)
- Body background `#0a1120`, header dark with back link and "2024" year badge
- Grid capped at 800×800px (square) instead of the original 200×2000 scrolling canvas

**Hanoi/index.html:**
- Disk colors: gradient per disk size from indigo (small) to cyan (large)
- Tower has CSS pseudo-element central rod
- Info section in styled dark card
- Dark background, header with back link and "2024" year badge
