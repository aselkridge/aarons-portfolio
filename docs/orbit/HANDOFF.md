# Orbit — Handoff

> **This file is rewritten (not appended to) every shipment.** It is the single
> source of truth for: what's broken right now, what changed last time, and
> which file owns which visible piece of the page. If you are a new session
> (or Aaron editing by hand), start here before touching code.

Last updated: 2026-07-18 (issue #9 fixed, issue #12 visual half fixed; contact photo pending from Aaron)

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

**Pending content, not a bug**: the contact card (click "See you, space
cowboy…") expects a photo at `docs/orbit/assets/aaron.jpg` — that file
doesn't exist yet, so it currently shows an "AS" initials placeholder
(automatic fallback, no code change needed once the real file is dropped
in). Aaron pasted a photo directly into chat once already, but a pasted
chat image doesn't land anywhere on this session's filesystem — confirmed
by searching for it, nothing was found — so it couldn't be picked up. Next
attempt should go through something that actually produces a fetchable
file: a Google Drive share link (the pattern already used earlier for a
screen recording) or a direct URL. The "Other builds" section is also a
placeholder ("More coming soon…") until there are other sites to link —
see `.contact-more-list` in `index.html`.

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
| ~~3~~ | ~~Sun never reacts to being hit~~ **FIXED 2026-07-18** | The sun's hit-check used a made-up radius formula (`min(W,H)*0.052`) that had nothing to do with the sun's real rendered size (`SUN_STATION.r`, already correctly computed elsewhere in `sunMetrics()` from the sun's actual DOM width — just never used here). At a 1200×800 viewport that made-up radius was ~42px while the sun's real radius is 60px, so a shot could fly ~18px *into* the visible disc without registering a hit at all. It also reused the same generic single-color spark burst as everything else, so even when it did register, there was no dedicated "sun" reaction. **Fix:** the hit-check now uses `SUN_STATION.r` (matching the exact pattern planets already use, `S.r+9`), and a hit triggers a purpose-built "sizzle" reaction instead of the generic burst: `sunBurst()` (`05-combat.js`) spawns multi-color hot sparks (white → yellow → orange → red) plus a few slow rising wisps, so it reads as the shot evaporating rather than bouncing off; the sun's own DOM element gets a brief `sizzling` class (`index.html` CSS) that flashes brightness and blooms a warm glow — visually distinct from the cool-blue ring planets get when shielded; and a new `Sound.sizzle()` (`02-sound.js`, filtered noise + descending zap) replaces the generic shield-hit chime. Target readout shows "MISSION · SCORCHED" instead of "· SHIELDED". **Verified**: confirmed `SUN_STATION.r` (60px) vs. the old formula (~42px at a 1200×800 viewport) to prove the mismatch was real; fired a projectile at the sun's real edge and confirmed via the live game state that it's consumed exactly there (not 18px early), the `sizzling` class fires, the target text updates, and the particle burst uses the new warm, multi-color palette (not the old single flat color); screenshotted the sun before/during/after the reaction to confirm the flash is visible but not blown out and fades back to normal within half a second. | `09-main.js` (sun-hit check), `05-combat.js` (`sunBurst`), `02-sound.js` (`Sound.sizzle`), `index.html` (`.sizzle` markup/CSS) |
| ~~4~~ | ~~"See you, space cowboy" overlaps the hint sentence~~ **FIXED 2026-07-18** | Confirmed by Aaron (who wrote the original code): `.sign` is `position:fixed`, pinned to the viewport's bottom-left corner so it can deliberately bleed off the screen edge — pulling it completely out of normal document flow. `.hint` sat in normal flow in the same `.bl` container. Padding `.bl` (the prior, ineffective attempt) only pushes flow content around; `.sign` ignores that entirely and just paints on top of whatever's physically in that corner. No amount of flow padding could ever have separated them. **Fix:** stopped trying to make the two coexist in that corner. The hint sentence no longer lives in `.bl` at all — it moved to a hidden-by-default popover anchored next to the station nav links (`#stnav`) in the header, revealed by a new "?" button (`#help-btn`) and dismissible via outside-click or Escape. `.sign` is untouched and now has the corner to itself. **Verified**: confirmed the popover is `opacity:0`/non-interactive on load, becomes visible and positioned in the header (not the bottom-left) on click, and closes again on outside-click and on Escape; read back `.sign`'s and the popover's actual `getBoundingClientRect()` values live to confirm they're nowhere near each other (header vs. bottom-left corner); screenshotted the open popover to confirm it reads cleanly next to the nav links with no visual collision anywhere on screen. | `index.html` (markup: `.navrow`/`.help-btn`/`.hint`/`.bl`; CSS same), `08-ui.js` (popover open/close behavior) |
| 5 | Environments look like squares/circles, colors too dark | Human silhouettes are built from plain rectangles + circles (readable as a figure, but "blocky" up close); the forest's tree layers and background use closely-related dark greens with too little contrast between layers; the ship inside the hangar bay renders at ~40px, too small for detail to read. | `07-environments.js` |
| 6 | Environments don't visibly change between themes | The theme branch only swaps a handful of colors by one shade and toggles a thin outline — composition/layout/shapes are identical in both themes, so the difference is barely perceptible. | `07-environments.js` (`cel` branches) |
| 7 | Ship swap: "docks, then just appears by my cursor" | The whole hangar animation happens inside the small console panel; the actual cursor-following ship is simply hidden for the sequence and reappears wherever the cursor is when it ends — there's no connecting motion between "in the console" and "back at the cursor." | `08-ui.js` (`shipSwap`) |
| 8 | No popup ever seen in the Rocinante theme | CSS for both themes checked and is present/correct on both sides — no confirmed rendering defect. Leading (unconfirmed) theory: milestones are infrequent (gold asteroid every ₩2,500, saucer every 25–75s) and combined with issue #7 making that theme unpleasant to play in, Aaron may not have had a clean run of it. Needs real instrumentation, not another guess. | `03-progress.js` |
| ~~9~~ | ~~"Dock & enter" label should be removed~~ **FIXED 2026-07-18** | Was a hardcoded `<div class="dock">▶ dock &amp; enter</div>` appended to every planet in `buildPlanet()` (`04-world.js`) — theme-independent, so it showed under every planet in both themes. **Fix:** removed the div from the template and its now-dead CSS (`.planet .dock`, `.planet.live .dock`). **Verified**: queried the live DOM for `.planet .dock` elements and for the literal text anywhere on the page in both themes — zero matches in either. | `04-world.js` (`buildPlanet`), `index.html` (CSS removed) |
| 10 | Popups vanish too fast; want a persistent "see accomplishments" log | Toasts hard-remove after 5.2s, banners after 3.6s; there is currently **no data structure at all** that keeps a history of what's been unlocked — this needs to be built new, not just have a timer changed. | `03-progress.js` |
| 11 | Major-event banner shows before the player can find/reach it in time | Banner currently shows for 3.6s total; on a small/narrow browser window, or if the event is off in a corner of the map, that may not be enough time to register + react. | `03-progress.js` |
| 12a | ₩20,000 threshold for the hidden planet is too high | Hard-coded number, unchanged — Aaron hasn't asked for a new value yet. | `01-config.js` (threshold check lives in `03-progress.js`) |
| ~~12b~~ | ~~New/hidden planet has no visual "this is new" treatment~~ **FIXED 2026-07-18** | The hidden planet (Ronin/`RONIN`) rendered through the exact same `buildPlanet()` path as every regular planet — no visual distinction once unlocked. **Fix:** `RONIN` now carries a `secret:true` flag; `buildPlanet()` checks it and adds a `.secret` class plus two new pieces of markup — `.secret-glow` (a soft pulsing radial glow in the planet's own gold color) and `.secret-rings` (two crossed rings at different angles/speeds, gyroscope-style) — all always-on once unlocked, independent of the normal `.live` proximity-hover state everything else uses. **Verified**: unlocked it live and confirmed the `.secret` class and both new elements exist with their animations actually running (`animationName` read back, not just "class present"); screenshotted the result to confirm it visually reads as a distinct, deliberate "this one's different" world rather than another regular planet. | `04-world.js` (`buildPlanet`, `RONIN`), `index.html` (`.secret-glow`/`.secret-rings` CSS) |

---

## 3. This shipment — what changed / what didn't

**Changed:**
- **Fixed issue #9** (remove the "Dock & enter" label) and **the visual half
  of issue #12** (the hidden/secret planet now gets a distinguishing
  treatment once unlocked — a pulsing gold glow plus two crossed rings). See
  the strikethrough entries in §2 for full detail on each.
- Tried to receive Aaron's contact-card photo, pasted directly into chat.
  It doesn't reach this session's filesystem (confirmed by searching for
  it — nothing landed anywhere), so it couldn't be wired in this round. See
  the pending-content note in §1 for the two delivery methods that will
  actually work (Drive link or a direct URL).
- **Verified**: for #9, queried the live DOM for `.planet .dock` elements
  and for the literal label text anywhere on the page, in both themes —
  zero matches either way, not just "looks gone" in a screenshot. For #12b,
  unlocked the secret planet live and confirmed both new elements exist
  with their CSS animations actually running (read back `animationName`,
  not just class presence), then screenshotted it to confirm it visually
  reads as a distinct, deliberate discovery rather than another regular
  planet.

**Explicitly NOT touched this shipment** (per Aaron: work one issue at a
time): issues #2, #5–8, #10–11, #12a in §2, all still outstanding.
