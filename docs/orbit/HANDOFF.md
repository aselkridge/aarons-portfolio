# Orbit — Handoff

> **This file is rewritten (not appended to) every shipment.** It is the single
> source of truth for: what's broken right now, what changed last time, and
> which file owns which visible piece of the page. If you are a new session
> (or Aaron editing by hand), start here before touching code.

Last updated: 2026-07-18 (Rewards Log redesign + full content pass: real station copy, Oromugai station, categorized reward drops)

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

**Pending content, not a bug**: the contact card's photo landed —
`docs/orbit/assets/aaron.jpg` now exists (pulled from a Google Drive link
Aaron shared; a directly-pasted chat image doesn't reach this session's
filesystem, so that first attempt couldn't be picked up, but a Drive link
or direct URL works fine). The "Other builds" section is still a
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
| 11 | Major-event banner shows before the player can find/reach it in time | Banner currently shows for 3.6s total; on a small/narrow browser window, or if the event is off in a corner of the map, that may not be enough time to register + react. (Partially mitigated now that every banner is also permanently in the Mission Log — see fixed #10 below — but the live-timing complaint itself is still open.) | `03-progress.js` |
| 12a | ₩20,000 threshold for the hidden planet is too high | Hard-coded number, unchanged — Aaron hasn't asked for a new value yet. | `01-config.js` (threshold check lives in `03-progress.js`) |
| ~~12b~~ | ~~New/hidden planet has no visual "this is new" treatment~~ **FIXED 2026-07-18** | The hidden planet (Ronin/`RONIN`) rendered through the exact same `buildPlanet()` path as every regular planet — no visual distinction once unlocked. **Fix:** `RONIN` now carries a `secret:true` flag; `buildPlanet()` checks it and adds a `.secret` class plus two new pieces of markup — `.secret-glow` (a soft pulsing radial glow in the planet's own gold color) and `.secret-rings` (two crossed rings at different angles/speeds, gyroscope-style) — all always-on once unlocked, independent of the normal `.live` proximity-hover state everything else uses. **Verified**: unlocked it live and confirmed the `.secret` class and both new elements exist with their animations actually running (`animationName` read back, not just "class present"); screenshotted the result to confirm it visually reads as a distinct, deliberate "this one's different" world rather than another regular planet. | `04-world.js` (`buildPlanet`, `RONIN`), `index.html` (`.secret-glow`/`.secret-rings` CSS) |
| ~~13~~ | ~~"LOCKED" text shows above the planet in the Expanse theme, not in Bebop~~ **FIXED 2026-07-18** | `setLock()` had a `themeId==='sword'` branch (anime title-card cut-in — never mentions "locked") and an `else` (Expanse) branch that set the on-planet reticle label (`#tgtlab`, in `.tgtbox`, positioned 22px above the target) to `NAME · LOCKED`. That's the theme-specific difference Aaron noticed — Bebop's cut-in never had that word to begin with, it wasn't removed there because it was never added there. **Fix:** the Expanse branch now sets `#tgtlab` to just the station name. The console's own "TGT" readout (top-right NAV·COM panel) still shows "· LOCKED" in both themes — Aaron only asked about the label floating above the planet, not that HUD field, so it was left alone. **Verified**: forced a lock-on in each theme and read back the live text content of both `#tgtlab` and `#target` — Expanse's on-planet label now reads just the name, the console field is unchanged, and the underlying lock-on/dock mechanic itself was untouched (same `setLock`/`positionTgtbox` flow). | `06-flight.js` (`setLock`) |
| ~~14~~ | ~~Expanse theme has no equivalent of Bebop's hover popout~~ **FIXED 2026-07-18** | Locking onto a planet in Bebop triggers `.titlecard`, a dark anime-style card that slides in from the left with "SESSION ##" + the station name; that element is explicitly hidden in Expanse (`body.t-roci .titlecard{display:none}`) and nothing replaced it, so Expanse had no equivalent moment at all. **Fix:** added `.scancard` — a new themed popout, not a reskin of the anime card: dark glass panel, `backdrop-filter` blur, icy-blue border/glow, and the same cut-corner `clip-path` this theme already uses on its banner and planet tags, so it reads as native to Expanse rather than borrowed. Shows "◈ TARGET ACQUIRED", the station name, and its short tagline; slides in from the left on lock-on and back out after 950ms, same timing as the anime card. **Verified**: forced lock-on in Expanse and read back that `.scancard` gains the `.on` class with the correct kicker/name/tag text, confirmed it auto-hides after the 950ms window, and re-checked Bebop afterward to confirm its title card and this new card don't interfere with each other. | `06-flight.js` (`setLock`), `index.html` (`.scancard` markup/CSS) |
| ~~15~~ | ~~Secret planet appears immediately on load, before reaching ₩20,000 in the current session~~ **FIXED 2026-07-18** | Root cause (explained last round): `unlockRonin` persisted `Progress.d.ronin=1` to `localStorage`, and boot code silently re-unlocked it on every future page load regardless of the *current* session's bounty. Confirmed as a real mechanism, not a guess — it meant Aaron's browser had genuinely crossed ₩20,000 in some earlier session. Aaron's call: it should be re-earned every session. **Fix:** removed the persistence entirely — `unlockRonin` no longer writes to `Progress.d`/`localStorage` at all; `RONIN.el` (unset until built, and `RONIN` is a fresh object every page load) is now the only guard against double-unlocking within a session; `checkBounty()`'s gate checks `!RONIN.el` instead of the old persisted flag; the boot-time `if(Progress.d.ronin) unlockRonin(true);` call is gone. The separate `ronin_found` *achievement* badge (a one-time "you did this" record) is untouched and still persists normally — only the planet's visibility resets each session, not the achievement history. **Verified**: simulated a prior session's saved achievement in `localStorage`, reloaded, and confirmed the planet is NOT built (`RONIN.el` falsy) despite that history; then crossed ₩20,000 within the same fresh session and confirmed it unlocks correctly. | `04-world.js` (`unlockRonin`), `03-progress.js` (`checkBounty`, default `d`), `09-main.js` (boot) |
| ~~16~~ | ~~Achievement/event banners felt too large and invasive~~ **FIXED 2026-07-18** | Aaron liked the banner's existing look (colors/border/glow per theme) but wanted it smaller and flatter — his call on exact sizing was "what do you think is best." **Fix:** kept every color/border/glow/clip-path exactly as-is, scaled down the geometry: max width 560px→440px, title font `clamp(1.5rem,3.4vw,2.4rem)`→`clamp(1.05rem,2.2vw,1.6rem)`, kicker/description shrunk to match, padding `16px 40px 18px`→`9px 26px 11px`, borders/shadows/clip-path corner-cut scaled proportionally down (e.g. Bebop border 3px→2px, Expanse corner-cut 18px→12px) so nothing looks disproportionately heavy at the smaller size. Net effect reads flatter/more rectangular, not just "shrunk." **Verified**: triggered a real banner and measured its actual rendered `getBoundingClientRect()` — meaningfully smaller footprint than before — and screenshotted it next to the header. | `index.html` (`#banner`/`.bnr` CSS) |
| ~~17~~ | ~~Wanted the "Aaronautics" wordmark + station nav links a bit bigger~~ **FIXED 2026-07-18** | Aaron: profile/branding should stay a clear focus, just "not too big." **Fix:** modest bump (~15%) to both the Bebop and Expanse wordmark font-size clamps and the station nav link clamp — sizing only, no layout/color changes. **Verified**: read back live computed `font-size` at a standard viewport to confirm the increase actually took effect (34.8px wordmark, 15.5px nav links, both at the new clamp ceiling), and screenshotted the header. | `index.html` (`.wordmark`, `body.t-roci .wordmark`, `.stnav a` CSS) |
| ~~18~~ | ~~Ship-swap hangar: doors open on the *outbound* leg but the bay looks empty — no visible "ship flies out" moment (docking/inbound leg works fine)~~ **FIXED 2026-07-18** | Root cause (confirmed with live measured computed styles, not source-reading): on the outbound leg, `bay-open` (550ms door reveal) and `ship-out` (500ms exit, but only **300ms opacity fade**) fired on the same tick with no stagger — measured mid-run, the ship's opacity had already hit ~0 by the time the doors were only ~56% open, so the bay always looked empty; the inbound leg works precisely because it staggers (doors get a 260ms head start on the ship). Additionally, `ship-in` was removed the instant the ship SVG swapped, so the new ship never sat visibly parked. **Fix (mirrors the working inbound stagger, in reverse):** the new ship now stays parked (`ship-in` kept) when the theme flips behind closed doors; doors open first at 2300ms revealing the parked ship; `ship-out` fires at 2850ms — 550ms later, once the doors are essentially fully open; the exit's opacity fade now holds full opacity for most of the climb (0.3s delay) and fades only near the top; sequence-end cleanup moved 3150→3700ms to fit. **Verified** by re-running the same 140ms-interval computed-style sampling that diagnosed the bug: doors ≥87% open with the ship parked at full opacity, then the ship visibly climbing at full opacity with doors wide open across multiple samples — the exact condition that never once occurred pre-fix — and the sequence still ends clean (all classes removed, `state==='free'`). | `08-ui.js` (`shipSwap`), `index.html` (`.ship-out` transition) |
| ~~10~~ | ~~Popups vanish too fast; no way to see what you've done~~ **FIXED 2026-07-18 (as the "Mission Log")** | Toasts self-remove after ~5.2s, banners after ~3.6s, and no history existed anywhere — this needed a new data structure, not a timer tweak. **Built:** `Progress.logEvent()` (`03-progress.js`) records every popup — achievements, transmissions/pilot facts, major-event banners — into `Progress.d.log` in `localStorage` (capped at 200 entries), hooked into `toast()` and `banner()` at the source so nothing that pops can escape being logged. New "◈ LOG" button in the header nav row (next to the "?" button) opens a scrollable Mission Log panel — same glass-panel styling family as the hint popover — listing everything newest-first with kind/title/description/timestamp; closes on outside-click or Escape; shows a friendly empty state on a fresh profile. Unlike the secret planet (session-only by design), the log deliberately **persists across sessions** — it's the "go back and see what you've done" record. **Verified**: fresh profile shows the empty state; generated real achievement/banner/fact events, **hard-reloaded the page**, and confirmed all three appear in the panel newest-first with correct kind labels (persistence proven, not assumed); Escape closes it; screenshotted the open panel. | `03-progress.js` (`logEvent`, hooks), `08-ui.js` (panel behavior), `index.html` (markup/CSS) |

---

## 3. This shipment — what changed / what didn't

**Changed — the Rewards Log redesign (per Aaron's spec):**
- The log is now **rewards only** — the previous version recorded every
  popup (achievements, banners, facts); Aaron wanted only the collectible
  reward drops. Achievements and banners still toast/banner as before, they
  just aren't logged anywhere anymore.
- `data/facts.js` is now `window.ORBIT_REWARDS`: four categories matching
  the log's four tabs — **Pilot** (17 facts about Aaron), **Career** (15
  GTM/automation/career facts), **Random** (19 physics/space/anime/music/
  games/mythology facts), **Quotes** (14 — Aaron's own lines + famous ones).
  All content follows the privacy rules (no employer name, no family names,
  nothing financial/psychological). The file is hand-editable; counts
  update automatically.
- `rewardDrop()` (03-progress.js) replaces `factDrop()`: each drop (gold
  asteroid crack, saucer kill — same triggers as before) awards a random
  **unearned** reward, toasts it with a category kicker, and records it
  permanently in `Progress.d.rw`. Once everything's earned, drops re-show
  random earned ones without re-logging.
- The LOG button now carries a bullet dot that **burns red and pulses**
  (plus a button glow) whenever there's an un-viewed reward — including
  across sessions (`Progress.d.rwNew` persists). Opening the log clears it.
- The log panel has **four tabs** with collected/total counts per category,
  newest-first entries, and per-tab empty states.

**Changed — the approved content pass (all pre-approved by Aaron):**
- **Mission (sun)**: "The tech is the byproduct. The people are the point."
  + the should-we-build-this statement + the AI-native-GTM-architect wedge
  (title only, no company, per Aaron's rule). New sections: The road here,
  Lantern, Now.
- **AlphaForge**: the real build story — 199→148→40 numbers, the held send,
  the deterministic classifier, the fragile-signal thesis. Clay-tables
  section is a marked placeholder until Aaron sends screenshots.
- **Life**: multidimensionality hub — Watching (real anime lists from
  Aaron's Drive doc), Playing (his PS5/Switch library), Listening, Eating
  (placeholder), Fatherhood+marriage (placeholder, lessons-only per privacy
  rules), Physics+space, Everything else (birding/Lego/snowboarding/R34).
- **Craft station is now Oromugai** (nav tab renamed; station id stays
  `craft` so deep links/env painting don't break): full definition,
  pronunciation, the four roots with honest coined-word framing (per the
  Oromugai doc's own accuracy guidance), how-to-write-one steps, and a
  Poems placeholder until Aaron sends poems.
- **Notes**: three real essay excerpts adapted from Aaron's AlphaForge
  writing (Fossil records / The cleaning is the build / The held send),
  company references removed; On-deck section for what's coming.
- **Contact card**: tagline now "engineer · artist · space cowboy" + the
  approved bio line added.

**Verified** (fresh-profile run, all via live state not source-reading):
4 categories load with correct counts; a drop sets the glow + persists;
opening clears the glow and `rwNew`; 11 drops = 11 unique rewards, all
surviving a hard reload with the glow correctly re-shown; per-tab counts
and items render; achievements/banners add **nothing** to the reward store;
nav shows "Oromugai"; new Mission title and contact card live; zero
console errors. Screenshotted the glowing LOG button and the open tabbed
panel.

**Still pending from Aaron:** Clay table screenshots (AlphaForge gallery),
poems (Oromugai), eating/fatherhood content (Life). All have marked
placeholder sections that need no code changes to fill.

**Explicitly NOT touched this shipment**: issues #2, #5–8, #11, #12a in §2,
all still outstanding.
