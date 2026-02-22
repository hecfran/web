# Open Questions & Assumptions
> ofranco.top — v2026 Redesign
> For Hector O'Franco to review before next iteration

---

## Priority Questions

### Q1 — Profile Photo
**Question:** The current profile photo (`img/HectorFranco.jpg`) is used in the hero section. Is this still the preferred photo, or do you have a more recent/professional image you'd like to use instead?

**Current assumption:** Using the existing photo as-is.

---

### Q2 — Current Job Title / Status
**Question:** The LinkedIn profile shows you are currently at Google in Warsaw. However, the site still reads "A.I. Consultant". Would you like to update this to reflect your current role (e.g., "Software Engineer at Google · A.I. Consultant" or similar)?

**Current assumption:** Keeping "A.I. Consultant" as the main positioning since that's the site's focus and historical brand. But this may be worth revisiting.

---

### Q3 — iKey Demo — Confirm Removal
**Question:** I have removed ikey-test from the 2026 main page navigation, as instructed. The files are still in the repo. Should the ikey-test folder be deleted entirely, or kept in the repo but just not linked?

**Current assumption:** Files preserved but not linked.

---

### Q4 — GPT3 Vector Store Tool
**Question:** GPT3 (vector store uploader) is not linked in the new 2026 main page. Should it be included in the Demos section, or is it too experimental/broken for public display?

**Current assumption:** Not linked (not visible to visitors) but files preserved.

---

### Q5 — Gemini Explorer Restyling
**Question:** The Gemini explorer (`gemini/`) was not restyled in this iteration (it still has the old white theme). Would you like it to be upgraded to match the new dark green theme in the next iteration?

**Current assumption:** Out of scope for this iteration, preserved as-is.

---

### Q6 — GOL and Hanoi Restyling
**Question:** The Game of Life (`GOL/`) and Towers of Hanoi (`Hanoi/`) are linked in demos but not restyled. Should they be moved to the `games/` folder and given the same dark green treatment as Minesweeper and Snake?

**Current assumption:** Out of scope for this iteration.

---

### Q7 — Startup Card URLs
**Question:** Some startups have no active website (e.g., Contrastify, CrowdLending Friends, Poem Editor, Digital Lab Notebook). Should these cards have any link, or remain URL-free as currently implemented?

**Current assumption:** Cards without URLs show no link in the expanded view. This is the current behaviour.

---

### Q8 — onceover.ai — More Detail?
**Question:** onceover.ai (2024-*) is your most recent active venture. Would you like a more prominent card or dedicated section for it, perhaps with a larger preview or a call-to-action button?

**Current assumption:** Listed equally with all other startup cards in chronological order.

---

### Q9 — GitHub Contribution Calendar Colour
**Question:** The background uses GitHub's standard green palette for the calendar effect. You mentioned "different green intensity tails alike a calendar tracking code submission" — this is what was implemented. Do you want:
- (A) Exactly this — GitHub calendar greens on dark navy ✓ (current)
- (B) A different colour scheme (e.g., blue-to-green, or matching your personal brand colour)?
- (C) The animation speed adjusted (currently ~60fps, streaks fall at ~2–12 cells/second)?

---

### Q10 — iKey vs onceover Branding
**Question:** Your LinkedIn shows you at Google but your profile bio says "A.I. consultant with over a decade of experience." Is this intentional positioning (i.e., the site is for your consulting identity separate from your employment)? This affects how prominently to display the Google role, if at all.

---

### Q11 — Cookie Policy / Privacy
**Question:** The site uses cookies to save API keys in the GPT tools. Should a cookie consent banner be added for GDPR compliance (the site is hosted from Ireland and you're based in Poland — both EU jurisdictions)?

**Current assumption:** No banner (same as 2024 version). Worth considering.

---

### Q12 — Language
**Question:** The mnemonic tool supports Spanish, and your profile mentions Spanish/Catalan as native languages. Should the main website have any multi-language support or at minimum a note in Spanish/Catalan?

**Current assumption:** English only (same as 2024).

---

### Q13 — Social Meta Tags (OG / Twitter Cards)
**Question:** The current site has no Open Graph tags. When you share `ofranco.top` on LinkedIn or Twitter, no preview image/description appears. Should these be added?

**Suggested tags to add:**
```html
<meta property="og:title" content="Hector O'Franco — A.I. Consultant">
<meta property="og:description" content="...">
<meta property="og:image" content="https://ofranco.top/img/HectorFranco.jpg">
<meta property="og:url" content="https://ofranco.top">
```

**Current assumption:** Not added in this iteration.

---

### Q14 — Animations Accessibility
**Question:** The background animation (canvas) and card hover effects could cause discomfort for users with motion sensitivity. Should a `prefers-reduced-motion` media query be added to disable animations for those users?

**Current assumption:** Not implemented (same as 2024 version).

---

### Q15 — GPT Explorer — o1 Model Warning
**Question:** The `o1` and `o3-mini` models do not support `temperature` parameter in some versions of the API. Should the temperature input be automatically disabled when these models are selected?

**Current assumption:** Temperature input remains always enabled. The API will return an error if temperature is not supported — the user will see this in the error message.

---

## Assumptions Made (No Question Needed)

| # | Assumption | Reasoning |
|---|-----------|-----------|
| A1 | 2024 version preserved at `web/2024/` and linked in footer | User said "keep the original version under subfolder 2024" |
| A2 | ikey-test files kept but not linked | "Ignore the ikey demo" — interpreted as hiding, not deleting |
| A3 | Games placed in `games/` subfolder | Separation of concerns; links updated accordingly |
| A4 | Google Analytics tags kept unchanged | No instructions to change them |
| A5 | CNAME domain config unchanged | `ofranco.top` is the live domain |
| A6 | No new images downloaded | Instructed to only download copyright-free images; opted for pure CSS/canvas design instead to avoid any legal risk |
| A7 | GPT pricing in USD (not cents) | Original used cents which was confusing (`cost.toFixed(2)c`); changed to dollars |
| A8 | "AI generator" badge in purple | Distinguishes game origin from other demo tags without being dismissive |
| A9 | Startup data hardcoded in JS | No CMS required; simpler maintenance for single-person site |
| A10 | Gemini and GPT3 tools not restyled | Large scope; not explicitly requested in this iteration |
