# Orbit — Handoff

> **This file is rewritten (not appended to) every shipment.** It is the single
> source of truth for: what's broken right now, what changed last time, and
> which file owns which visible piece of the page. If you are a new session
> (or Aaron editing by hand), start here before touching code.

Last updated: 2026-07-18 (issue #1 — shots/thrust/shield offset — root-caused and fixed)

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
| ~~1a~~ | ~~Shot direction not connected to the ship~~ **FIXED 2026-07-17** | Was: two independent calculations for "forward" that didn't have to agree — the ship's visual rotation (`ra`) is smoothed/eased toward the cursor each frame, but the bullet's old `aimDir()` computed a fresh, unsmoothed bearing straight to the raw cursor position, ignoring `ra` entirely. While turning, those two numbers are rarely equal. **Fix:** `aimDir()` now just returns `noseDir()` — the exact same value that rotates the sprite — so a shot can no longer disagree with where the ship is visibly pointing. Verified numerically: angle between shot direction and nose direction is exactly 0° in settled/still, mid-turn, and continuously-moving tests. | `05-combat.js` (`aimDir`/`spawnProj`) |
| ~~1b~~ | ~~Speed-line "thrust" effect disconnected from the ship~~ **FIXED 2026-07-17** | Separate bug, found from Aaron's screen recording: the anime speed-line effect (shown when flying fast) deliberately started each line 90–470px *away* from the ship and drew it extending even further away — meaning it was never touching the ship at all, by design. Looked exactly like a disconnected effect because it was. **Fix:** lines now start 14–34px from the ship (right at the hull) and extend a shorter, more modest distance. Verified visually: lines now visibly fan out from the ship's position instead of floating in the background. | `09-main.js` (speed-line block) |
| ~~1c~~ | ~~Shots, thrust lines, AND planet shields all appear offset from their real object (ship/ship/planet) by "the exact same amount," only on Aaron's machine~~ **FIXED 2026-07-18** | Confirmed with real numbers from Aaron's own machine via the `10-diag.js` overlay: his `#fx`/`#stars` canvas elements were rendering at **exactly 2x the size of his actual viewport** (2698×1578 CSS pixels rendered, on a 1349×789 viewport) — and `2 = devicePixelRatio` on his machine. Root cause: `<canvas>` is a "replaced element" in CSS (like `<img>`/`<video>`). `#fx`/`#stars` were styled with only `position:fixed;inset:0` — no explicit CSS `width`/`height`. For an ordinary element that's enough to stretch it to fill the viewport, but for a replaced element with auto width/height, the CSS spec falls back to its *intrinsic* size instead — which for a canvas is its `width`/`height` HTML attributes, i.e. the drawing-buffer size. `sizeCanvases()` deliberately sets that buffer to `W*devicePixelRatio` (bigger than the viewport, for a crisp HiDPI image) and was relying on `inset:0` to downscale it back down via CSS — but that downscale never happens, per the rule above, so the canvas just displays its full buffer 1:1 with screen pixels. Since 1 drawn unit maps to `devicePixelRatio` buffer pixels, everything painted on the canvas (shots, thrust, stars) ends up rendered at `devicePixelRatio`× its intended on-screen position — always pushed away from the top-left corner, i.e. down-and-right, matching Aaron's very first report. The shield-offset symptom wasn't a separate bug at all: the shield's own collision math is plain JS on logical coordinates and fires correctly — it only *looked* wrong because the shot that triggered it was being displayed in the wrong place. This is invisible whenever `devicePixelRatio` is exactly 1 (true of my own test browser the whole time — the reason two prior fix attempts couldn't find it), and affects any real HiDPI/Retina-class display at any non-1 DPR, not just Aaron's machine. **Fix:** `sizeCanvases()` now also sets `c.style.width`/`c.style.height` explicitly to the logical viewport size, forcing the intended CSS downscale to actually happen. **Verified**, not guessed: (1) reproduced Aaron's exact broken numbers by emulating `devicePixelRatio=2` via CDP — confirmed the canvas rect was 2x the viewport before the fix, and exactly equals the viewport after; (2) fired an actual in-game shot under that same dpr=2 emulation and read the canvas's raw pixel data (`getImageData`) at the buffer coordinate corresponding to the shot's logical position — confirmed a fully-opaque drawn pixel exists exactly there, i.e. the shot visually renders exactly where the game logic says it is; (3) re-checked `devicePixelRatio=1` afterward to confirm no regression there. | `04-world.js` (`sizeCanvases`) |
| — | *(Superseded diagnosis, kept for context — the DPR/resize-drift fix from 2026-07-17 below was real but turned out to be treating a symptom, not this root cause)* ~~metrics()/canvas buffers only recalculated on the native `resize` event, which doesn't fire for e.g. dragging a window between displays of different pixel density~~ — fix from that round (the per-frame drift check) is still in place and still correct/useful, it just wasn't sufficient on its own. | `01-config.js` (`metrics`), `09-main.js` (per-frame drift check) |
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
- **Fixed issue #1c for real** (shots/thrust/shields all offset from their
  real object by the same amount, only on some machines) — see the
  strikethrough entry in §2 for the full root cause. Short version: `#fx`/
  `#stars` are `<canvas>` elements styled with only `position:fixed;inset:0`;
  because canvases are CSS "replaced elements," that combination falls back
  to the canvas's *intrinsic* size (its drawing-buffer dimensions) instead of
  stretching to the viewport, the way it would for an ordinary div. The
  buffer is deliberately sized to `viewport × devicePixelRatio` for a crisp
  HiDPI image — so on any screen where `devicePixelRatio ≠ 1`, the canvas
  silently rendered at that larger, wrong CSS size, and everything drawn on
  it landed at `devicePixelRatio`× its intended position. Invisible at
  `devicePixelRatio = 1` (my test browser, the whole time), which is why it
  never showed up here across two earlier fix attempts.
- Got there this time by asking Aaron to load a temporary diagnostic overlay
  (`10-diag.js`, `?diag=1` in the URL — now deleted, its job is done) and
  send back real numbers from his own machine, instead of shipping a third
  guess. His numbers showed `#fx`'s on-screen box at 2698×1578 pixels on a
  1349×789 viewport — exactly 2x, exactly his `devicePixelRatio`. That's what
  led straight to the cause above.
- **Fix:** `sizeCanvases()` (`04-world.js`) now also sets `c.style.width`/
  `c.style.height` explicitly to the logical viewport size, so the browser
  actually downscales the buffer as originally intended.
- **Verified, not guessed**, using the exact condition that had been hiding
  this the whole time: emulated `devicePixelRatio=2` via Chrome DevTools
  Protocol (reproducing Aaron's exact reported numbers first, to confirm the
  bug — then confirmed the canvas rect now equals the viewport after the
  fix); fired an actual in-game shot under that same emulation and read the
  canvas's raw pixel data at the buffer coordinate matching the shot's
  logical position — confirmed a fully-opaque pixel exists exactly there, so
  the shot visually renders exactly where the game logic says it is; then
  re-checked `devicePixelRatio=1` to confirm no regression there either.
- Also got a second opinion from Aaron pasting in a Microsoft Copilot
  analysis of the same bug. It hadn't actually found the real code (it read
  old prototype files, not the live game), so it wasn't a diagnosis of our
  bug — but its generic short list of "usual suspects" for coordinate-offset
  bugs did include canvas/devicePixelRatio mismatches, which is the same
  neighborhood as the actual cause. Treated as a sanity check, not a lead.
- Confirmed with Aaron up front, before shipping, that this fix is universal
  (any browser/OS where `devicePixelRatio ≠ 1` — most Retina Macs, most
  modern phones, many Windows displays with scaling above 100%), not
  something specific to his machine.

**Explicitly NOT touched this shipment** (per Aaron: work one issue at a
time): issues #2–12 in §2.

**Process note for whoever picks this up next:** this took three rounds.
Round 1 (frame lag) and round 2 (DPR/resize drift) were each verified by
*some* method before shipping, but neither method actually exercised the
condition that mattered (a real `devicePixelRatio ≠ 1` display) — both were
disproven by Aaron's own testing after the fact. What finally broke the
stalemate was asking for real numbers from the affected machine via a
throwaway diagnostic overlay, rather than reasoning from source or from a
test environment that couldn't reproduce it. If a future bug report is
machine-specific and doesn't reproduce here, reach for that pattern early
instead of guessing three times first.
