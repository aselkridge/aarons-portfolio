# Content Inventory — REAL vs PLACEHOLDER (R3a)

> Every word and content slot on the orbit site, walked surface by surface,
> 2026-07-21. This is the working checklist for the content phase (R3).
> **Legend:**
> - ✅ **REAL** — verified fact or Aaron's own confirmed material; ships as-is
> - 🟡 **CONFIRM** — written in Aaron's voice from real facts (by build/design
>   sessions), reads finished, but Aaron hasn't explicitly signed off the
>   wording. Needs a read-through, not new material. (R3e covers these.)
> - 🔴 **PLACEHOLDER** — sample/stub/empty slot. Needs real material from
>   Aaron. Nothing else unblocks these.

## The shortlist — things only Aaron can supply (the real R3 work)

| # | What | Unlocks | Where it lands |
|---|------|---------|----------------|
| 1 | **Résumé PDF** | flips 3 "▤ RÉSUMÉ · SOON" slots (console, contact card, dossier area) to live links | `docs/orbit/assets/resume.pdf` |
| 2 | **The 9 AlphaForge builds (001–009)** — a few sentences + metrics each | replaces the "sequence incoming" stub card; fills the blueprint riffle | `SECTIONS.alphaforge` build items (`07-environments.js`) |
| 3 | **Real Oromugais** — the actual poems | replaces the 3 sample lines on the parchment sheets | `SECTIONS.craft` poems (`07-environments.js`) |
| 4 | **4+ Life photos + captions** | fills the `[ photo ]` polaroid slots | `SECTIONS.life` items (`07-environments.js`) |
| 5 | **Clay table screenshots** | fills the "Clay tables" gallery (currently `soon`) | `SECTIONS.alphaforge` gallery |
| 6 | **Eating/grilling + fatherhood content** | flips two `soon` Life tabs live | `SECTIONS.life` |
| 7 | **Music decision** — keep Kevin MacLeod placeholders or supply owned/licensed mp3s | the whole soundtrack | `docs/orbit/audio/` + `tracks.js` |

Everything else on the site is ✅ or 🟡 — i.e., a read-through problem, not a
missing-material problem.

---

## Surface-by-surface

### 1. Doorway + ship picker (front door)
| Item | Status | Notes |
|------|--------|-------|
| "AARONAUTICS / LAUNCH" gate copy | 🟡 | design-brief wording |
| Ground Control gate "opening soon" | ✅ intentional | unlocks at R4a, not a content gap |
| Ship picker names/copy (Swordfish II / Rocinante) | ✅ | Aaron picked the homage names |
| Boot loader cycle words (ANALYZING SIGNAL… etc.) | 🟡 | flavor text |

### 2. Captain's Dossier (`index.html` ~1595)
| Item | Status | Notes |
|------|--------|-------|
| Name / role "Lead Automation Analyst · HubSpot" | ✅ | corrected 2026-07-20 per Aaron |
| STATUS "Active duty" / SECTORS "GTM · AI" | ✅ | Aaron-directed |
| Bio line "Bronx-born, aerospace by degree…" | 🟡 | reads done; confirm wording |
| LinkedIn URL, mailto | ✅ | real links |
| Photo `assets/aaron.jpg` | ✅ | landed via Drive |

### 3. Profile / contact window (T15)
| Item | Status | Notes |
|------|--------|-------|
| Bio + "engineer · artist · space cowboy" tag | 🟡 | |
| Email + LinkedIn | ✅ | |
| **Résumé · soon** | 🔴 | shortlist #1 |
| Other builds: Walkman link | ✅ but **changes with R1a** (repo split) | |
| Other builds: GitHub link | ✅ | |
| "more soon" chip | ✅ intentional | until there are more builds |

### 4. Station overview copy (`01-config.js`)
| Station | Status | Notes |
|---------|--------|-------|
| Mission (sun) — thesis, 3 paragraphs | 🟡 | built from Aaron's real thesis lines |
| AlphaForge — 199→148→40, held send | ✅ facts / 🟡 wording | numbers are real cohort results |
| Life — "multidimensional by design" | 🟡 | |
| Oromugai — form definition, roots | ✅ | Aaron's own invention, his framing |
| Notes — "essays, lessons, transmissions" | 🟡 | |

### 5. Station section tabs (`07-environments.js` SECTIONS)
**Mission:** patch artifact 🟡 · "Why Aaronautics" 🟡 · "The road here" 🟡
(real biography) · "Lantern" 🟡 (real venture) · "Now" 🟡
**AlphaForge:** 4 build cards ✅ (real, from the cohort work) · Coldest Call
card ✅ (live, playable) · **"001–009 sequence incoming"** 🔴 shortlist #2 ·
"held send"/"classifier"/"fragile signal" essays 🟡 · **Clay tables gallery**
🔴 shortlist #5
**Life:** polaroid captions 🟡 · **4× `[ photo ]` slots** 🔴 shortlist #4 ·
Watching/Playing/Listening lists ✅ (Aaron's actual lists) · **Eating +
grilling** 🔴 `soon` · **Fatherhood + marriage** 🔴 `soon` · Physics /
Everything else 🟡
**Oromugai:** "How to write one" ✅ · "The roots" ✅ · **3 sample poems** 🔴
shortlist #3 (explicitly labeled samples in the intro)
**Notes:** 3 dispatches (Fossil records / The cleaning is the build / The
held send) 🟡 — distilled from Aaron's real AlphaForge thinking; confirm as
"essays in his name" · **"On deck"** 🔴 `soon` (future essays; fine to stay)

### 6. Rewards pool (`data/facts.js` — hand-editable, header says so)
| Category | Count | Status | Notes |
|----------|-------|--------|-------|
| Pilot facts | 17 | 🟡 | all believed-real biography; one read-through |
| Career (incl. 4 STAR cards) | 12 | ✅ facts / 🟡 wording | metrics from real work |
| Random facts | 20 | 🟡 | general science/culture — verify none are wrong |
| Quotes | 14 | 🟡 | 6 are "— Aaron": confirm he owns each line; rest are cited |

### 7. Meta / share
| Item | Status | Notes |
|------|--------|-------|
| `<title>` "Aaronautics — Orbit" | 🟡 | |
| og:description "…flight-systems portfolio. Fly the system…" | 🟡 | shows in every share preview — worth one deliberate pass |
| og.png share card | ✅ | rebuilt 2026-07-20 |

### 8. Music (`audio/tracks.js`)
| Item | Status | Notes |
|------|--------|-------|
| 5 Kevin MacLeod tracks (3 jazz / 2 ambient) | 🔴 **placeholder by design** | CC BY 4.0, credited. Real Bebop OST can NOT be legally hosted — options: keep MacLeod, buy/licence, or source royalty-free jazz closer to the Bebop feel. Shortlist #7 — Aaron decides. |

### 9. Everything else
| Item | Status | Notes |
|------|--------|-------|
| Signoff "SEE YOU, SPACE COWBOY…" | ✅ intentional homage | |
| Flight manual copy | 🟡 | "run the tutorial · soon" is R5, not content |
| Coldest Call (full game content) | ✅ | shipped + Aaron-approved in its own thread |
| HUD/console labels (NAV·COM, BOUNTY, etc.) | ✅ | system chrome, not content |

---

## Suggested R3 order (Aaron's effort, smallest→largest)
1. Résumé PDF (one file, instant win — 3 slots go live)
2. Real Oromugais (you already have these — paste-in job)
3. Life photos + captions (phone camera roll job)
4. Clay screenshots (screenshot job)
5. Quotes/pilot-facts read-through — kill anything that isn't yours (R3e can cover)
6. The 9 AlphaForge build write-ups (real writing time)
7. Eating/grilling + fatherhood tabs (real writing time)
8. Music decision
