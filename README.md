# ofranco.top — Personal Website
**Hector O'Franco** · A.I. Consultant & Software Engineer

Live at: [ofranco.top](http://ofranco.top/) | GitHub Pages hosted

---

## Overview

This is the personal portfolio website of Hector O'Franco (Hector Hugo Franco-Penya), showcasing AI consulting experience, entrepreneurial ventures, interactive demonstrations, and games.

### Versions
| Version | Location | Description |
|---------|----------|-------------|
| **v2026** | `/` (root) | Current version — dark theme, GitHub calendar background, responsive |
| **v2024** | `/2024/` | Original version — preserved for reference |

---

## Site Structure

```
web/
├── index.html              <- Main landing page (v2026)
├── styles.css              <- Design system (v2026)
├── script.js               <- Main JavaScript (calendar BG, startups, nav)
├── CNAME                   <- Domain: ofranco.top
├── README.md               <- This file
├── LICENSE
│
├── demos/                  <- All interactive demos & games
│   ├── GPT/                <- GPT Explorer v1 (single message + cost)
│   ├── GPT2/               <- GPT Explorer v2 (multi-message + cost)
│   ├── GPT3/               <- Vector Store Uploader (experimental)
│   ├── gemini/             <- Google Gemini API Explorer
│   ├── claude/             <- Anthropic Claude API Explorer
│   ├── GOL/                <- Conway's Game of Life
│   ├── Hanoi/              <- Towers of Hanoi solver
│   ├── numbers/            <- Number Mnemonic System (rule-based)
│   ├── numbersGPT/         <- Number Mnemonic System (AI-powered)
│   ├── ikey-test/          <- iKey Application Mock Demo
│   ├── games/
│   │   ├── minesweeper.html <- Minesweeper (AI-generated, themed)
│   │   └── snake.html       <- Snake (AI-generated, themed)
│   ├── hanoi.html          <- Towers of Hanoi v2 (drag-and-drop)
│   └── game-of-life.html   <- Game of Life v2 (drawing controls)
│
├── documents/              <- Non-web files & development docs
│   ├── master-thesis.pdf   <- Master Thesis (downloadable from site)
│   ├── CHANGES.md          <- Full change log (v2026 redesign)
│   ├── TIMESTAMP_DIARY.md  <- Development diary with timestamps
│   ├── QUESTIONS.md        <- Open questions for next iteration
│   └── ...
│
├── img/                    <- Images (profile photo, backgrounds, logos)
│   ├── logo.svg            <- Site favicon (HF monogram, SVG)
│   ├── logo.png            <- Site favicon (fallback, PNG)
│   ├── HectorFranco.jpg    <- Profile photo
│   └── background*.jpg     <- Background images
│
└── 2024/                   <- Full backup of original 2024 version
```

---

## Key Features (v2026)

### Visual Design
- **Theme:** Dark navy (#0f172a) with GitHub-green accent palette
- **Background:** Animated contribution calendar canvas — green streak highlights over a grid of cells in 5 intensity levels matching GitHub's contribution graph
- **Typography:** Inter (body) + JetBrains Mono (numbers, code, metrics)
- **Logo:** HF monogram favicon with Google-colored gradient accent
- **Fully responsive:** desktop, tablet, and mobile layouts

### Sections
1. **Hero** — Name with Google-colored letters, stats, CTA buttons, social links
2. **About** — 5 skill cards + biography
3. **Start-ups** — 11 ventures (2009–2025), click-to-expand cards with colour-coded status
4. **Demos** — 16 demo cards: API explorers, algorithms, games, and research
5. **Footer** — Copyright, social links, link to v2024

---

## Demos

### API Explorers
- **GPT Explorer v1** — Single-message ChatGPT interface with real-time cost tracking
- **GPT Explorer v2** — Multi-message conversation with system/user messages
- **Claude Explorer** — Anthropic Claude API explorer (Sonnet, Opus, Haiku)
- **Gemini Explorer** — Google Gemini API explorer with content safety ratings

### Algorithms & Simulations
- **Game of Life** (v1 & v2) — Conway's cellular automaton
- **Towers of Hanoi** (v1 & v2) — Recursive solver and drag-and-drop game
- **Mnemonic System** — Rule-based number-to-word converter
- **AI Mnemonic** — AI-powered mnemonic generation (7 languages)

### Games
- **Minesweeper** — Easy/Medium/Hard, flag mode, chord reveal, timer
- **Snake** — Adjustable speed & grid, mobile d-pad controls

### Research
- **PhD Thesis** — Semantic Role Labeling using HPC clusters (Trinity College Dublin, 2013)
- **Master Thesis** — Prediction of binding sites in protein structures (UPV, 2010) — downloadable PDF

---

## Documentation

Development documentation is stored in `/documents/`:
- **CHANGES.md** — Detailed explanation of every change made and why
- **TIMESTAMP_DIARY.md** — Development diary with per-section time estimates
- **QUESTIONS.md** — Open questions and documented assumptions for next iteration

---

## Author
**Hector O'Franco** (Hector Hugo Franco-Penya)
- ofranco.top
- linkedin.com/in/ofrancophd
- github.com/hecfran
- leetcode.com/u/francoph

&copy; 2026 Hector O'Franco. All rights reserved.
