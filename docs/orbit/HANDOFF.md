# Orbit — Handoff

> **This file is rewritten (not appended to) every shipment.** It is the single
> source of truth for: what's broken right now, what changed last time, and
> which file owns which visible piece of the page. If you are a new session
> (or Aaron editing by hand), start here before touching code.

Last updated: 2026-07-18 (issue #1 — diagnostic overlay shipped, root cause not yet confirmed)

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
| 10 | `10-diag.js` | **Temporary.** A diagnostic overlay for issue 1c below — only turns on with `?diag=1` in the URL, invisible otherwise. Delete this file (and its `<script>` tag in `index.html`) once that issue is root-caused. | N/A — not a gameplay file |

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
| ~~1a~~ | ~~Shot direction not connected to the ship~~ **FIXED 2026-07-17** | Was: two independent calculations for "forward" that didn't have to agree — the ship's visual rotation (`ra`) is smoothed/eased toward the cursor each frame, but the bullet's old `aimDir()` computed a fresh, unsmoothed bearing straight to the raw cursor position, ignoring `ra` entirely. While turning, those two numbers are rarely equal. **Fix:** `aimDir()` now just returns `noseDir()` — the exact same value that rotates the sprite — so a shot can no longer disagree with where the ship is visibly pointing. Verified numerically: angle between shot direction and nose direction is exactly 0° in settled/still, mid-turn, and continuously-moving tests. | `05-combat.js` (`aimDir`/`spawnProj`) |
| ~~1b~~ | ~~Speed-line "thrust" effect disconnected from the ship~~ **FIXED 2026-07-17** | Separate bug, found from Aaron's screen recording: the anime speed-line effect (shown when flying fast) deliberately started each line 90–470px *away* from the ship and drew it extending even further away — meaning it was never touching the ship at all, by design. Looked exactly like a disconnected effect because it was. **Fix:** lines now start 14–34px from the ship (right at the hull) and extend a shorter, more modest distance. Verified visually: lines now visibly fan out from the ship's position instead of floating in the background. | `09-main.js` (speed-line block) |
| 1c | Shots, thrust lines, AND planet shields all appear offset from their real object (ship/ship/planet) by "the exact same amount," only on Aaron's machine — **NOT FIXED, actively being diagnosed** | The DPR/resize-drift fix shipped 2026-07-17 (below, kept for the record) turned out to be real but **incomplete** — Aaron confirmed the problem persists after it shipped. Structural re-analysis (2026-07-18): shots/thrust are pixels painted on the `#fx` canvas at logical coords; the shield check is pure JS math (`hypot(P.x-(S.x+plx), P.y-(S.y+ply))`) using those same logical coords — no rendering involved. Since planets themselves aren't reported as visually mispositioned, the collision math is very likely firing at the mathematically-correct point; what's misaligned is *where the canvas's pixels physically land on screen relative to the DOM*. That single canvas-vs-DOM display offset would explain all three symptoms at once — this matches Aaron's own read of it ("built on a separate layer that's off"). Cannot reproduce locally, so instead of guessing a 4th theory, shipped `10-diag.js` — a live overlay (add `?diag=1` to the URL) that reads `innerWidth/innerHeight`, `devicePixelRatio`, `visualViewport`, the `#fx` canvas's actual rect vs. its buffer size, and — critically — compares the ship's and first planet's **logical** position (`rx,ry` / `s.x+plx,s.y+ply`) against their **actual on-screen** position via `getBoundingClientRect()`. Waiting on Aaron to load it on the affected machine and report the numbers (or click "[copy diagnostic]" and paste them) before touching any fix code. *Old, superseded entry, kept for context:* ~~The real root cause, found once Aaron clarified BOTH effects were offset together, consistently, and only in his real browser (never in a fresh test load): `metrics()` (viewport W/H/center) and the canvas pixel buffers were only ever recalculated once at page load and reactively on the browser's native `resize` event. That event does not reliably fire for every situation that changes effective layout/DPI — the classic case is dragging a browser window between two displays with different pixel density (e.g. a Retina MacBook screen ↔ an external monitor), which can change `devicePixelRatio` with no `resize` event at all.~~ **Fix shipped (confirmed insufficient on its own):** the main loop checks every frame whether `innerWidth`/`innerHeight`/`devicePixelRatio` have drifted from what the canvases were last sized for, and resyncs if so. Verified via CDP to actually catch a DPR change without a `resize` event — but this was evidently not the (or not the only) cause of what Aaron is seeing. | `01-config.js` (`metrics`), `04-world.js` (`sizeCanvases`), `09-main.js` (per-frame drift check), `10-diag.js` (new, temporary) |
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
- Aaron reported the shot/thrust position-offset bug (1c) persists even after
  the DPR/resize-drift fix shipped last time, and — new information — that
  planet shields now appear to trigger at a similarly offset distance from
  the planet, "the exact same amount" as the ship offset. He explicitly asked
  to diagnose before fixing this time, so **no fix was attempted this
  shipment.**
- Re-traced the full coordinate pipeline (DOM ship position, DOM planet
  position via `#system`'s parallax transform, canvas-drawn shots/thrust,
  and the shield collision math) to check whether one structural cause could
  explain all three symptoms together. Conclusion: since planets aren't
  reported as visually mispositioned, the shield collision math (pure JS,
  no rendering) is very likely firing at the correct logical point — what's
  actually misaligned is where the `#fx` canvas's pixels land on screen
  relative to the DOM. A canvas-vs-DOM display offset would produce all
  three symptoms at once, which matches Aaron's own read of it ("built on a
  separate layer that's off"). Full reasoning is in the 1c row of §2.
- This still can't be reproduced locally, and two prior theories (frame lag;
  then DPR/resize drift) already turned out wrong or incomplete once Aaron's
  own testing checked them — so rather than ship a third guess, shipped
  `10-diag.js`: a live, hidden-by-default overlay (`?diag=1` in the URL) that
  reads the exact values needed to confirm or kill this theory — comparing
  the ship's and a planet's *logical* position against their *actual
  on-screen* position (`getBoundingClientRect()`), plus `devicePixelRatio`,
  `visualViewport`, and the `#fx` canvas's rect vs. its internal buffer size.
  Verified the overlay itself works (loads only with `?diag=1`, shows live
  numbers, has a "copy diagnostic" button) via a headless-browser check —
  but obviously cannot verify the *bug* itself since it doesn't reproduce
  here. **Waiting on Aaron to load it on the affected machine and share the
  numbers before any fix is written.**

**Explicitly NOT touched this shipment** (per Aaron: work one issue at a time,
and diagnose 1c before fixing it): issues #2–12 in §2.

**Process note for whoever picks this up next:** this is the third round on
issue 1c. Round 1 (frame lag) and round 2 (DPR/resize drift) were each
verified by *some* method before shipping, but neither method was the right
one to catch what Aaron was actually seeing — both were disproven by his own
testing after the fact, not by any check done before shipping. Don't repeat
that pattern a third time: get real numbers from Aaron's own machine (that's
what `10-diag.js` is for) before writing a fix, and don't delete/replace this
overlay until his numbers have actually confirmed a specific cause.
