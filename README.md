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
│
├── games/
│   ├── minesweeper.html    <- Minesweeper game (AI-generated, themed)
│   └── snake.html          <- Snake game (AI-generated, themed)
│
├── GPT/                    <- GPT Explorer v1 (single message + cost)
├── GPT2/                   <- GPT Explorer v2 (multi-message + cost)
├── GPT3/                   <- Vector Store Uploader (experimental)
├── gemini/                 <- Google Gemini API Explorer
├── GOL/                    <- Conway's Game of Life
├── Hanoi/                  <- Towers of Hanoi solver
├── numbers/                <- Number Mnemonic System (rule-based)
├── numbersGPT/             <- Number Mnemonic System (AI-powered)
├── img/                    <- Images (profile photo, backgrounds, logos)
├── 2024/                   <- Full backup of original 2024 version
│
├── README.md               <- This file
├── CHANGES.md              <- Full change log (v2026 redesign)
├── TIMESTAMP_DIARY.md      <- Development diary with timestamps
└── QUESTIONS.md            <- Open questions for next iteration
```

---

## Key Features (v2026)

### Visual Design
- **Theme:** Dark navy (#0f172a) with GitHub-green accent palette
- **Background:** Animated contribution calendar canvas — falling green streak highlights over a grid of cells in 5 intensity levels matching GitHub's contribution graph
- **Typography:** Inter (body) + JetBrains Mono (numbers, code, metrics)
- **Fully responsive:** desktop, tablet, and mobile layouts

### Sections
1. **Hero** — Name, badge (typed animation), stats, CTA buttons, social links
2. **About** — 4 skill cards + biography
3. **Start-ups** — 10 ventures (2009-2024), click-to-expand cards with colour-coded status
4. **Demos** — 10 icon cards linking to tools and profiles
5. **Games** — Minesweeper + Snake (AI-generated badge)

---

## GPT Explorer Tools

### Supported Models (v2026 pricing)
| Model | Input $/1M | Output $/1M |
|-------|-----------|------------|
| gpt-4o | $2.50 | $10.00 |
| gpt-4o-mini | $0.15 | $0.60 |
| o1 | $15.00 | $60.00 |
| o1-mini | $1.10 | $4.40 |
| o3-mini | $1.10 | $4.40 |
| gpt-4-turbo | $10.00 | $30.00 |
| gpt-4 | $30.00 | $60.00 |
| gpt-3.5-turbo | $0.50 | $1.50 |

> Check [openai.com/pricing](https://openai.com/pricing) for current rates.

---

## Background Animation — GitHub Calendar Effect

The canvas background renders a grid of rounded squares in GitHub's contribution calendar colours:

- Level 0: #161b22 (empty)
- Level 1: #0e4429 (low)
- Level 2: #006d32 (medium-low)
- Level 3: #26a641 (medium-high)
- Level 4: #39d353 (peak / brightest)

Falling streak highlights travel down columns independently. The head cell is brightest (level 4), the tail fades over 8-12 cells. This shared animation runs on: main page, GPT Explorer, and both games.

---

## Games

### Minesweeper (/games/minesweeper.html)
- Difficulties: Easy 9x9/10 mines, Medium 16x16/40, Hard 16x30/99
- Flag mode, chord reveal, timer
- Created via AI generator

### Snake (/games/snake.html)
- Adjustable speed (4-20 fps) and grid size (15-35)
- On-screen d-pad for mobile, keyboard (arrows/WASD/Space)
- Created via AI generator

---

## Documentation
- **CHANGES.md** — Detailed explanation of every change made and why
- **TIMESTAMP_DIARY.md** — Development diary with per-section time estimates
- **QUESTIONS.md** — 15 open questions + 10 documented assumptions for next iteration

---

## Author
**Hector O'Franco** (Hector Hugo Franco-Penya)
- ofranco.top
- linkedin.com/in/ofrancophd
- github.com/hecfran
- leetcode.com/u/francoph

&copy; 2026 Hector O'Franco. All rights reserved.
