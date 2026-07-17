# Orbit — Handoff

> **This file is rewritten (not appended to) every shipment.** It is the single
> source of truth for: what's broken right now, what changed last time, and
> which file owns which visible piece of the page. If you are a new session
> (or Aaron editing by hand), start here before touching code.

Last updated: 2026-07-17 (structural split + this doc — no gameplay behavior changed)

---

## 1. File map — "I want to change X, which file do I open?"

Orbit used to be one 1,072-line `orbit.js`. It is now split into labeled files
under `docs/orbit/js/`, loaded in this exact order (order matters — later files
call functions defined in earlier ones):

| # | File | Owns | Typical edits you'd make here |
|---|------|------|--------------------------------|
| 1 | `01-config.js` | Theme colors (Swordfish/Rocinante palettes), the 4 station definitions + copy, shared tiny helpers | Change a theme's accent color; edit station name/tagline/body copy; add a new station |
| 2 | `02-sound.js` | All synth sound effects + the music player (play/pause/next, track list wiring) | Change SFX pitch/volume; change how the player behaves |
| 3 | `03-progress.js` | Achievements/localStorage, the two popup systems (center banner + right-side stack), pilot-fact transmissions | Change popup timing/behavior, add new achievements, change milestone thresholds |
| 4 | `04-world.js` | Builds the planet/sun/ronin DOM + orbit rings, starfield canvas setup, **shared runtime state variables** (ship position, bounty, current theme, etc. — used by nearly every other file) | Add/remove a planet from the map; change orbit speed/size |
| 5 | `05-combat.js` | Fire input, weapon switching, asteroid spawn/split/reward, aim direction | Anything about shooting, asteroids, weapon behavior |
| 6 | `06-flight.js` | Proximity lock-on (the "TARGET · LOCKED" logic), the landing sequence, triggering hyperwarp | Change lock-on distance, landing animation timing |
| 7 | `07-environments.js` | The station side-panel (sections list) **and every painted planet scene** (Mission/sun, AlphaForge/city, Life/forest, Craft/ocean, Notes/lot, hidden desert) | Anything about what a planet's surface looks like — this is the biggest file, ~360 lines, all drawing code |
| 8 | `08-ui.js` | Theme/ship switching (incl. the hangar-bay swap animation) + minimize/expand behavior for the console and player | Change how ship-swap or minimize/expand works |
| 9 | `09-main.js` | The master per-frame loop (ship movement, stars, particles, warp streaks, HUD text updates) + page boot/resize/deep-link + the `window.__orbit` test hook | Ship movement feel, star density, anything that runs "every frame" |

Also: `index.html` holds all CSS (organized in the same rough order as the file
list above, with `/* ─── section ─── */` comment banners) and the page markup.
`audio/tracks.js` and `data/facts.js` are separate small data files you can
hand-edit directly (documented inline in each).

**Why this split exists:** the previous single-file version made it impractical
to find or safely change one system without scrolling past nine others. This
split is a *pure relocation* — every line of code was moved, not rewritten;
behavior is verified identical to before the split (see §3).

---

## 2. Known issues — diagnosed, root cause confirmed, NOT yet fixed

These were reported by Aaron and root-caused by reading the actual shipped
code (not guessed). Each will be worked **one at a time**, per Aaron's
instruction — do not batch-fix these without his go-ahead on each.

| # | Issue | Root cause (confirmed) | Lives in |
|---|-------|------------------------|----------|
| 1 | Shots don't look connected to the ship | The ship's visual rotation is smoothed/lagged toward the cursor each frame; the bullet's direction is computed fresh from the cursor at the instant of firing, bypassing that lag. Under motion, the nose and the shot point different ways. | `05-combat.js` (`aimDir`), `09-main.js` (ship rotation `ra`) |
| 2 | Planets seem to take "random" hits | Hit detection is a single point-in-circle check once per frame; a fast bullet can register from a position that looks like a near-miss between frames. | `09-main.js` (projectile/collision block) |
| 3 | Sun never reacts to being hit | The sun has its own hard-coded, disconnected hit-radius (unrelated to its real measured size) and reuses the same generic spark burst as everything else — no dedicated sun animation exists. | `09-main.js` (sun-hit check) |
| 4 | "See you, space cowboy" overlaps the hint sentence | The signoff is `position:fixed` (pinned to the viewport corner, outside normal page flow) while the hint sentence is positioned in normal flow above it; padding the flow container does nothing because the signoff isn't part of that flow. | `index.html` CSS (`.sign`, `.hint`, `.bl`) |
| 5 | Environments look like squares/circles, colors too dark | Human silhouettes are built from plain rectangles + circles (readable as a figure, but "blocky" up close); the forest's tree layers and background use closely-related dark greens with too little contrast between layers; the ship inside the hangar bay renders at ~40px, too small for detail to read. | `07-environments.js` |
| 6 | Environments don't visibly change between themes | The theme branch only swaps a handful of colors by one shade and toggles a thin outline — composition/layout/shapes are identical in both themes, so the difference is barely perceptible. | `07-environments.js` (`cel` branches) |
| 7 | Ship swap: "docks, then just appears by my cursor" | The whole hangar animation happens inside the small console panel; the actual cursor-following ship is simply hidden for the sequence and reappears wherever the cursor is when it ends — there's no connecting motion between "in the console" and "back at the cursor." | `08-ui.js` (`shipSwap`) |
| 8 | No popup ever seen in the Rocinante theme | CSS for both themes checked and is present/correct on both sides — no confirmed rendering defect. Leading (unconfirmed) theory: milestones are infrequent (gold asteroid every ₩2,500, saucer every 25–75s) and combined with issue #7 making that theme unpleasant to play in, Aaron may not have had a clean run of it. Needs real instrumentation, not another guess. | `03-progress.js` |
| 9 | "Dock & enter" label should be removed | Not yet done — trivial, one hardcoded string. | `07-environments.js` |
| 10 | Popups vanish too fast; want a persistent "see accomplishments" log | Toasts hard-remove after 5.2s, banners after 3.6s; there is currently **no data structure at all** that keeps a history of what's been unlocked — this needs to be built new, not just have a timer changed. | `03-progress.js` |
| 11 | Major-event banner shows before the player can find/reach it in time | Banner currently shows for 3.6s total; on a small/narrow browser window, or if the event is off in a corner of the map, that may not be enough time to register + react. | `03-progress.js` |
| 12 | ₩20,000 threshold for the hidden planet is too high; new planet has no visual "this is new" treatment | Hard-coded number, no special rendering. | `01-config.js` (threshold check lives in `03-progress.js`) |

---

## 3. This shipment — what changed / what didn't

**Changed:**
- Split `orbit.js` (1,072 lines, one file) into the 9 labeled files in `docs/orbit/js/` described in §1. **This was a byte-for-byte verified mechanical relocation** — every original line was accounted for (script-diffed against the original before deleting it), nothing was rewritten, no logic touched.
- Regression-tested after the split: firing, landing → warp → station panel, achievements/toasts, minimize/expand, and theme+ship swap all confirmed working identically to pre-split behavior.
- Created this file.

**Explicitly NOT touched this shipment** (per Aaron: work one issue at a time,
he has comments on the rest first): none of the 12 issues in §2 above. They
are diagnosed and documented, not fixed.

**Process note for whoever picks this up next:** the last shipment before this
one (v5) was reported as "done" based on code running without errors, not on
re-checking the actual visual against Aaron's original screenshots — several
things shipped as "fixed" were not. Going forward: before calling anything
fixed, re-screenshot the *exact* scenario from the complaint and compare, don't
just confirm the mechanism runs.
