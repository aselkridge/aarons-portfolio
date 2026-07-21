# The Games of Aaronautics

> **Purpose of this file:** the reader-facing explanation of the two playable
> experiences in this repo — what they are, how they play, and why they exist.
> If you're a person (or an LLM) trying to understand the games from the code
> alone, start here. For *maintenance* (which file owns which feature, live
> bugs, roadmap), read [`orbit/HANDOFF.md`](orbit/HANDOFF.md) instead. For the
> project's overall memory and design decisions, read
> [`DESIGN-BRIEF.md`](DESIGN-BRIEF.md).

Aaronautics is Aaron Selkridge's portfolio, built as a *place you operate*
rather than a page you scroll. Two games live in it:

1. **Orbit** — the portfolio itself, played as a spaceship you fly. This IS
   the site; the games/portfolio distinction is deliberately blurred.
2. **The Coldest Call** — a self-contained teaching game about go-to-market
   (GTM) engineering, reached from inside Orbit.

Live at: `https://aselkridge.github.io/aarons-portfolio/docs/orbit/`
(the game routes directly at `…/orbit/coldest-call/`).

---

## 1. Orbit — the portfolio you fly

**Where:** `docs/orbit/` (entry `index.html`, logic split across
`js/01-config.js` … `js/10-content-viewer.js`, load order matters).

**Premise.** You arrive at a doorway, pick a ship, and get dropped into a
top-down solar system. The sun is Aaron's mission statement; everything else
orbits it — literally the site's thesis rendered as physics. Flying to a
planet and landing on it opens that section of the portfolio as a painted,
explorable scene.

### The two themes / ships

Everything — palette, star density, weapon, music mood, film grain — swaps
with the ship you choose:

| Theme key | Ship | Vibe | Accent | Weapon |
|---|---|---|---|---|
| `sword` | **Swordfish II** | Cowboy Bebop: warm amber, jazz, heavy grain + scanlines | `#f0a63c` | cannon |
| `roci` | **Rocinante** | The Expanse: cold blue, ambient, clean | `#4fb8e8` | PDC |

You can swap ships mid-session via the hangar-bay animation (`08-ui.js`).

### The map (stations = portfolio sections)

- **01 · Mission (the sun)** — "The tech is the byproduct. The people are the
  point." Aaron: engineer + artist from the Bronx, Lead Automation Analyst,
  AI-native GTM architect.
- **02 · AlphaForge (the proof)** — the real GTM system Aaron built end to end
  in Clay's AlphaForge cohort: 199 schools sourced → 148 qualified → 40
  verified head-of-school contacts (~93% reachability) — and then the **held
  send**: with the whole outbound machine ready, he chose not to fire it,
  because the first email real people get from you matters more than a
  deadline. Judgment over volume. *This station hosts the mission door into
  The Coldest Call.*
- **03 · Life (the human)** — anime, games, music, food, physics, fatherhood.
- **04 · Oromugai (the form)** — Aaron's original poetic form: one line,
  exactly eight syllables. The station's parchment artifact window is the
  site's visual quality bar (see CLAUDE.md).
- **05 · Notes (the signal)** — essays and teaching.

### How it plays

- **Fly** with the mouse; the ship follows with momentum. **Fire** at
  asteroids; they split, and kills pay **bounty (₩)**, styled after Bebop's
  wanted posters.
- **Bounty milestones** pop achievements (₩5,000 / ₩25,000 / ₩100,000
  "MOST WANTED — see you, space cowboy…"), spawn rare **gold asteroids**, and
  at **₩20,000 unlock a secret sixth planet** (the Ronin's desert).
- **Proximity lock-on**: drift near a planet, get "TARGET · LOCKED," and a
  landing sequence takes you down into that station's painted scene
  (`07-environments.js` draws every one: city neon grid, forest canopy, ocean
  loop, graffiti lot, desert).
- **Rewards system** (`03-progress.js`): exploring and playing earns
  categorized drops — facts, stats, and quotes about Aaron — via a
  category-picker signal modal, plus an achievements log. Session-only by
  design: a fresh visit is a fresh run.
- A CSS-3D **Walkman music player** handles the soundtrack; the ◈ LOG panel
  tracks what you've found.

**The point:** a recruiter or friend can just read the stations like pages —
but the site rewards play, and the play itself demonstrates the craft the
portfolio is claiming.

---

## 2. The Coldest Call — the GTM teaching game

**Where:** `docs/orbit/coldest-call/index.html` — one fully self-contained
page (all CSS/JS inline; art in `coldest-call/assets/`; fonts shared from
`docs/assets/fonts/`). No build step needed to read it: the file IS the game.
**Entry:** the glowing **mission door** on the AlphaForge station rail, or the
`PLAYABLE · BUILD 05` deck card, both opening a mission briefing whose CTA
routes here. Direct link works too. Theme follows the site
(`?t=roci` / `#roci` for Expanse; Bebop default), and the end screen returns
to `../#alphaforge`.

**Title card:** *The Coldest Call — "a playable outreach run. help a stranded
astronaut introduce ice cream to a moon."*

### Premise

An astronaut crashed on a far moon two years ago. On the moon's far side is a
town of neighbors who have never tasted ice cream. He radios four people —
you and three rivals — and offers a deal: whoever gets the most townsfolk to
actually *reply* to an introduction wins him as a client. It's a cold-email
campaign wearing a spacesuit: the town is a market, the citizens are leads,
and "introducing ice cream" is your outreach.

### How a run plays (10–15 minutes)

1. **Intro transmission** on your wrist unit, then **suit select**: Pilot,
   Engineer, Off-Duty, or Ronin (cosmetic + flavor; each ties to a reward
   category from Orbit). Type a callsign, drop to the surface.
2. **Walk the strip.** The world is a vertical pixel-art terrain you climb
   through four fixed stations (landing site → market district → the big
   dome / clay workstation → the mast). Stations are pixel-anchored to
   landmarks in the art, so the layout is identical on every screen size.
   Rivals (Jordan the Broadcaster, Natalie the Delegator, Adam the Archivist
   — friendly first-name nods to AlphaForge coaches, plus a Yash cameo) are
   met along the way, each personifying a strategy.
3. **The economy: 100 credits.** Knocking on a door to ask someone a question
   costs 1 credit per person. There are 24 citizens. Do the math — you cannot
   brute-force it. Reading the posted town survey is free.
4. **The clay workstation** (the game's centerpiece — a full console takeover
   with a live 24-row table, CRT styling per theme). You choose which data
   columns to gather about the citizens. The trap: three columns are **free
   public survey data**, and paying a "claygent" to fetch them anyway burns
   credits for nothing. The interface will happily let you. If you do it, the
   debrief hands you THE RECEIPT.
5. **Cut the list.** Strike citizens who were never going to say yes. Cutting
   is free; sending is not (2 credits per send). Order of operations is a
   lesson in itself: enrich → cut → send beats send → regret.
6. **The seam.** Six opening lines, all written by the human (you) — three
   fully hand-written, three written as templates with `{field}` merge chips
   filled from your gathered data, previewed live against a real citizen.
   You pick the *approach*, not "human vs machine": the machine never writes;
   it only fills in what you wrote.
7. **Send and debrief.** Replies are computed by a fixed, deterministic
   formula (fit of your list × quality of your questions × line multiplier ×
   how many you sent) — no AI, no randomness, so the lesson is inspectable.
   The debrief is a reward-card: headline result, your best line with the
   load-bearing phrase highlighted, THE POINT / AND THE TRUTH, and the honest
   caveat that in reality *nobody* can predict what will work — you can only
   stack the odds. Send to zero people, or to a bad list, and you get the
   real ending: "THE SILENCE HAS A REASON," with the reasons.

### The teaching layer

- **Insights** (7 of them: free data, order of operations, the zero, the old
  way, the agent, the human, the blend) drop as toasts at the exact moment
  you earn them and collect in a **NOTEBOOK** drawer with an unread badge —
  every player leaves with the full set regardless of score.
- All player-facing language is **plain English** — no GTM jargon in the
  game voice (jargon lives only in the notebook's field notes). The tone
  never mocks the tools ("positive affirmation" rule: the game teaches what
  each approach is *for*, it doesn't bash anything).
- The game is the playable proof of the AlphaForge station's thesis:
  **judgment over volume**. The station shows the held send; the game makes
  you feel *why* it was held.

### Art & tech notes

- Terrain: two AI-generated top-down pixel strips (Bebop mining-town and
  Expanse grey-moon skins), world height derived from the art's real aspect.
- Characters: five sprites Aaron picked from a 21-candidate live "sprite
  audition" (each candidate run under the real in-game treatment before
  choosing). The crowd uses one generic sprite re-tinted per person via a
  CSS mask. The parked ships are the same Swordfish II / Rocinante art Orbit
  uses, with theme-colored "this is ours" glows.
- Everything self-hosted (house rule: no CDNs). WebAudio synth for sound.
- Dialogue engine, typewriter text, camera, and economy are all in the one
  file; a `#fast` URL flag speeds text for testing.

---

## 3. Where things live (quick map)

| Thing | Path |
|---|---|
| Orbit game (the site) | `docs/orbit/index.html` + `docs/orbit/js/` |
| Orbit maintenance doc | `docs/orbit/HANDOFF.md` |
| The Coldest Call (whole game) | `docs/orbit/coldest-call/index.html` |
| Coldest Call art | `docs/orbit/coldest-call/assets/` |
| Shared fonts | `docs/assets/fonts/` |
| Orbit ship/station art | `docs/orbit/assets/` |
| Project memory / design brief | `docs/DESIGN-BRIEF.md` |
| Art & quality operating rules | `CLAUDE.md` (repo root) |

GitHub Pages serves `docs/`, so everything under it is the live site.
