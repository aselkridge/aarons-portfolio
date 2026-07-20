# Orbit — Handoff

> **This file is rewritten (not appended to) every shipment.** It is the single
> source of truth for: what's broken right now, what changed last time, and
> which file owns which visible piece of the page. If you are a new session
> (or Aaron editing by hand), start here before touching code.

Last updated: 2026-07-20 late (THE COLDEST CALL IS LIVE: the full playable
game now replaces the placeholder at `docs/orbit/coldest-call/` — real terrain
strips, Aaron's five chosen character sprites, the orbit build's real ship art
(Swordfish II / Rocinante) parked at the landing site, full dialogue + clay
workstation + debrief loop. Entry: the AlphaForge mission door + PLAYABLE
BUILD 05 deck card (shipped earlier on-branch, now merged). See RCC in §3.
Merged with the main build's post-R2a state: scanner cursor shrink, Rocinante
mirror/launch direction, R2a ship art, R1c scanner cursor, R1b GitHub link,
employment-status correction — see SHIPPED below. R1a still blocked on Aaron:
`aarons-3d-portfolio` must be created by hand, then handed back. Full
remaining roadmap R1–R6 unchanged below; still paused except items Aaron
explicitly greenlit.)

Prior: 2026-07-19 late, R1 grew six items across two rounds (return-to-hangar,
master audio mute, readability→R4a, mobile rework→R4c, picker exit
directions, branded boot loader, manual auto-open, social share card); T14
folded into R4a; backlog section dissolved — everything lives in a phase.
Before that: the v3 design brief ("Design Notes 2.zip") landed and shipped in
one batch — Phase 2 Stage 5, Phase 4a/4b/4d/4e, the T15 profile window, the
§5 "5F" lockup, decoded nav, the T17A signoff.

---

## 1. File map — "I want to change X, which file do I open?"

Orbit used to be one 1,072-line `orbit.js`. It is now split into labeled files
under `docs/orbit/js/`, loaded in this exact order (order matters — later files
call functions defined in earlier ones):

| # | File | Owns | Typical edits you'd make here |
|---|------|------|--------------------------------|
| 1 | `01-config.js` | Theme colors (Swordfish/Rocinante palettes), the 4 station definitions + copy, shared tiny helpers | Change a theme's accent color; edit station name/tagline/body copy; add a new station |
| 2 | `02-sound.js` | All synth sound effects + the music player (play/pause/next, track list wiring) | Change SFX pitch/volume; change how the player behaves |
| 3 | `03-progress.js` | Achievements/localStorage, the two popup systems (center banner + right-side achievement-toast stack), and the rewards system (`earnFromCategory`/`factDrop` — categorized facts/stats/quotes) | Change popup timing/behavior, add new achievements, change milestone thresholds, change how a reward gets picked within a category |
| 4 | `04-world.js` | Builds the planet/sun/ronin DOM + orbit rings, starfield canvas setup, **shared runtime state variables** (ship position, bounty, current theme, etc. — used by nearly every other file) | Add/remove a planet from the map; change orbit speed/size |
| 5 | `05-combat.js` | Fire input, weapon switching, asteroid spawn/split/reward, aim direction | Anything about shooting, asteroids, weapon behavior |
| 6 | `06-flight.js` | Proximity lock-on (the "TARGET · LOCKED" logic), the landing sequence, triggering hyperwarp | Change lock-on distance, landing animation timing |
| 7 | `07-environments.js` | The station side-panel (sections list) **and every painted planet scene** (Mission/sun, AlphaForge/city, Life/forest, Craft/ocean, Notes/lot, hidden desert) | Anything about what a planet's surface looks like — this is the biggest file, ~360 lines, all drawing code |
| 8 | `08-ui.js` | Theme/ship switching (incl. the hangar-bay swap animation), minimize/expand behavior for the console and player, the next-reward bounty HUD, the ◈ LOG panel, and the reward signal modal (category picker + reveal) | Change how ship-swap or minimize/expand works, how the log or reward modal render/open/close |
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
| 19 | Log panel: the (badge/count) number is cut off in the Expanse (Rocinante) theme | Reported by Aaron with a screenshot 2026-07-18 — the numeric value in the ◈ LOG panel is clipped in the Expanse theme specifically (likely a theme-specific `clip-path`/padding/overflow on the badge or tab-count chip). NOT yet diagnosed against the live code — diagnose the exact element before touching it. Small, self-contained fix (fold into a quick-wins batch). | `08-ui.js` / `index.html` (log panel + `.tab-new` / badge CSS — TBC) |
| ~~20~~ | ~~Ships feel a little small~~ **FIXED 2026-07-20** | Landed as part of R2a's real-ship-art pass — `.rocket`'s box went 44×44 → 54×62 alongside the SVG→`<img>` swap, since both changes touched the exact same CSS rule. The hangar-bay docked ship (the other half of this note) stayed at its existing 40×46 — Aaron's note was specifically about the flying cursor's presence, not the bay. | `index.html` (`.rocket` sizing) |
| 21 | Mobile touch controls fight the device (LOW priority) | Reported by Aaron 2026-07-18: on a phone the page pans/zooms during play, and a *fire* touch and a *move* touch aren't distinguished — the game can't tell you're trying to do both, so multitouch flails. Two layers: (a) the true bug — the page isn't locking touch gestures (`touch-action:none` + preventDefault missing) and touch handling doesn't track fingers by pointer ID; (b) the bigger design question of whether precise dual-touch flight belongs on mobile at all. See the "MOBILE experience" cross-cutting item in §3 for the recommended direction (calmer tap-to-travel / assisted mobile mode, resolved alongside Phase 4 Ground Control). Do NOT ship an average patch here — Aaron cares about the mobile quality. | touch/pointer handling in `05-combat.js` / `06-flight.js` / `09-main.js`; `index.html` (`touch-action` CSS) |

---

## 3. The roadmap — consolidated phase order (rewritten 2026-07-19)

> This section is **rewritten, not appended to**, whenever the plan changes
> shape — it's the current, authoritative phase list. It now folds in both
> the original 2026-07-18 roadmap AND the 2026-07-19 redesign-brief decisions
> into one ordered set of phases. Historical shipment logs for already-shipped
> phases live in §3.1+ below; the redesign brief's provenance/governing rule
> is in §4.

> **Standing note:** Aaron has said more design material is coming from the
> same outside design source ("look out"). When it arrives: read it fully
> (README/brief first, per its own instructions) before folding anything in —
> it may reshape this list again, the way the 2026-07-19 brief did.

### ✅ SHIPPED (history in §3.1–3.2 + git log)
- **Phase 1 + 1.5** — quick wins, reward presentation, log polish.
- **Phase 2 Stages 1–5** — the full floating-window + artifact system for
  every station, both themes; palette + type adoption.
- **Phase 4a/4b/4d/4e** — doorway, ship picker, Captain's Dossier, STAR
  reward cards; T15 profile window + its doors; identity system (5F lockup
  to §8 exact values, as-is mark rule, decoded nav, T17B signoff w/ red
  ship slot, planet-dot motif, HUD under-construction banner).
- **2026-07-19 polish round** — flight-manual modal, dossier log bar,
  right-side lock-on cut-ins, gate mouse-guard (`gatesUp`), fire-through
  HUD chrome, planet-dot cursor, figures stripped from scenes, bigger gate
  marks, picker row fix, popover placements.
- **2026-07-20 — employment fix + R1b + R1c**: dossier STATUS chip corrected
  from "Open to crew" to "Active duty" (Aaron is not open to work — Lead
  Automation Analyst at HubSpot; role subtitle now reads "Lead Automation
  Analyst · HubSpot"). **R1b done** — GitHub chip added to the profile
  popup's Other Builds row (`github.com/aselkridge/aarons-portfolio`).
  **R1c done** — planet-dot cursor replaced by Aaron's real sourced scanner
  art (idle + a bigger/brighter lit state over anything clickable), picked
  via a live hover-comparison mockup: Bebop 2 idle / Bebop 1 lit (warm),
  source render idle / newest Drive upload lit (cool). Pure CSS swap on
  `:root` custom properties, no JS touched. **R1a started, blocked** — tried
  creating the `aarons-3d-portfolio` repo directly via the GitHub API and it
  403'd (this session's GitHub App has no repo-creation permission); Aaron
  needs to create it by hand and hand it back before the Walkman move can
  continue.
- **2026-07-20 later — R2a done**: real ship art in for both themes —
  Swordfish II ("render 2") and Rocinante ("render 6") — chosen from 16
  sourced candidates via a live spin-test review page (candidates drawn in a
  fixed 3/4 hero-shot perspective visibly broke apart while spinning; true
  top-down designs held their silhouette at every angle, which is what
  decided it, not raw first impression). Touches: the flying cursor ship
  (real `<img>` per theme, same rotate/translate math, untouched — Rocinante
  needed a 90° rotate first, its source render was nose-left), the ship
  picker (real renders, nose-right to match the existing launch direction),
  the hangar-bay docked ship (`shipSVG()` reworked for `<img>`-based
  markup), and the signoff slot (a flat red silhouette derived from the
  Swordfish render — stays red in both themes, never tinted, per the
  standing cross-theme-constants rule). Also closes issue #20 (cursor box
  bumped 44→54×62). Verified headless across both themes, desktop + mobile,
  zero console errors.
- **2026-07-20 evening — bug round on the above**: Aaron reported the
  scanner cursor (R1c) visually overlapping the flying ship, and that it
  read too big generally. Root cause: the cursor is real (idle/lit swap
  over `.brand`/`.console`, the two big `pointer-events:auto` zones inside
  the full-viewport `.hud`), and the ship — which chases the mouse with a
  lag/ease — frequently flies through those exact same corners, so a big
  cursor image and the ship end up visually stacked. **Fix**: shrunk the
  cursor a lot (idle 56px→26px, lit 70-76px→32-34px) rather than change the
  interaction model — a custom cursor bitmap always paints above all page
  content (OS-level, not something CSS z-index can touch), so shrinking is
  the real lever, not layering. **Caveat**: headless screenshots cannot
  render the OS-drawn custom cursor at all, so this fix is verified by CSS
  value + hotspot alignment only — needs Aaron's real-browser confirmation
  that the smaller size is enough, or whether it wants going further.
  Also fixed in the same round: Rocinante now mirrors to face left and
  launches off-screen left on the ship picker, opposite Swordfish's right
  — matches the picker copy's own long-standing ◂/▸ arrow hints, which the
  motion direction hadn't actually honored since Phase 4b shipped.

---

## THE ROAD TO DONE — remaining phases (consolidated 2026-07-19, evening)

> Fresh numbering (R1–R6) so old phase numbers can't confuse: this list IS
> the complete remaining work. Order = build order; R2 is gated on assets
> and interleaves with anything. NOTE: Aaron called a pause on code changes
> when this list was written — nothing below starts until he says go.

### R1 — Cockpit housekeeping (small code, one sitting)
- **R1a. Separate the Walkman** (Aaron 2026-07-19: "its own separate thing").
  The Walkman currently IS the site root (`docs/index.html`); the game lives
  under `/docs/orbit/`. Plan: (1) move the Walkman to its own repo with its
  own Pages URL — repo name decided: `aarons-3d-portfolio`; (2) promote the
  orbit game to the ROOT of this repo's site so the main URL opens the game
  directly (asset paths + og/meta + favicon updates); (3) remove the two
  cross-links (profile "OTHER BUILDS ↗ The Walkman" chip, mobile hint
  "Walkman ↗"); (4) optional redirect stub at the old orbit URL so shared
  links keep working. **BLOCKED 2026-07-20**: tried to create the repo
  directly via the GitHub API, got a 403 — this session's GitHub App isn't
  authorized to create repos, only to work in ones it's already been granted
  access to. Aaron needs to create `aarons-3d-portfolio` by hand on
  github.com (empty, public, no init needed) and say so — then this resumes.
- ~~**R1b. GitHub link in the profile window**~~ **DONE 2026-07-20** — added
  to the Other Builds row, links to `github.com/aselkridge/aarons-portfolio`.
- ~~**R1c. Scanner cursor v2**~~ **DONE 2026-07-20** — idle + lit states, real
  sourced art, both themes. Hotspots are eyeballed to each asset's lens
  center, not pixel-measured — revisit if it ever feels off in real play.
- **R1d. Micro-bug batch** — #19 log-count clip (re-verify post log-bar
  redesign), #11 banner timing, #2 projectile tunneling through planets
  (swept segment-circle test), #12a ₩20,000 threshold (Aaron decides value).
- **R1e. Picker exit directions** — on ship-select, the Expanse ship flies
  OFF TO THE LEFT when clicked; Bebop keeps flying right. (Mirror the
  launch transform for the cool half.)
- **R1f. Branded boot loader** — replace the "NAV SYSTEMS online" boot text:
  wordmark with the logo mark beneath it, the TEAL PLANET DOT orbiting the
  mark as the loading motion, and cycling launch-prep words underneath in
  Space Mono (ANALYZING… · CHECKING FUEL… · PLOTTING TRAJECTORY… ·
  CALIBRATING NAV·COM… · IGNITION…), LLM-loader style. NOTE: Aaron
  explicitly authorized the wordmark here — the boot splash is a brand
  moment, an exception to the mark-only screens rule.
- **R1g. Flight manual auto-open** — the ? modal pops on FIRST entry into
  the system (right after the ship pick lands you in flight), dismissible
  by clicking out as normal; once per visit.
- **R1h. Social share card** — the og:/twitter image becomes logo +
  wordmark on a split-theme background (recommend the diagonal seam,
  echoing the doorway — warm left / cool right); generate 1200×630,
  update og:image + twitter meta on the orbit page (and root once R1a
  promotes it).
- **R1i. Return to the hangar doors from flight** (Aaron 2026-07-20: "a way
  for players to return to the FIRST screen... from the orbit game
  screen"). A visible HUD control (console row or nav row, styled to match
  the existing chip family) that re-shows `#doorway`/`#shipsel` from
  mid-flight — effectively re-running the front-door sequence on demand,
  not just a page reload. Needs `gatesUp` re-armed and the running game
  paused/hidden cleanly behind the doors while it's up, same guarantee the
  boot sequence already relies on.
- **R1j. Master audio mute toggle** (Aaron 2026-07-20: "toggle off all
  audio at any time"). Today there's no single mute — the music player
  only has its own play/pause, and `Sound` (`02-sound.js`) has no shared
  gain/mute path; SFX and music are two separate systems. Needs one HUD
  button that silences both at once (a shared muted flag `Sound`/`Music`
  both check, or a master `GainNode` for SFX + muting the `<audio>`
  element for music) and persists across the session so it doesn't reset
  on its own mid-play.

### RCC — The Coldest Call (added 2026-07-20; runs as its own thread)
Aaron's playable GTM-engineering game for AlphaForge. Spec: Aaron's build
doc ("Moon Transmission, Build Spec & Handoff", Google Doc, 2026-07-20) —
title/subtitle per Aaron's direct instruction: **The Coldest Call · "a
playable outreach run. help a stranded astronaut introduce ice cream to a
moon."** Placement decided (mockup signed off 2026-07-20): mission door on
the AlphaForge rail + PLAYABLE deck card, both opening a mission-briefing
window whose CTA routes to `coldest-call/`.
- **RCC-a. Entry point — SHIPPED on-branch 2026-07-20** (this shipment).
  Door markup/CSS in `index.html` (`#mdoor`, `.has-mission`, `.bf-*`,
  `.k-brief`), show/hide + briefing in `07-environments.js`
  (`openMissionBrief`), PLAYABLE card support in `10-content-viewer.js`,
  placeholder route at `docs/orbit/coldest-call/index.html`. Verified live
  both themes, desktop + 1349×789 + mobile; door only exists on AlphaForge.
- **RCC-b. The game build — SHIPPED LIVE 2026-07-20** (Aaron: "push the
  game live. We are done"). The full run now lives at
  `docs/orbit/coldest-call/index.html` (single self-contained page, all CSS
  + JS inline; fonts relative to `docs/assets/fonts/`; art under
  `coldest-call/assets/`: five character sprites Aaron picked from a
  21-candidate live audition (pilot=Firefly26, engineer=21, offduty=17,
  ronin=07, generic=12, crowd-tinted per person), two terrain strips
  (bebop/expanse, world anchors read off the art's own landmarks), and the
  orbit build's real ships (Swordfish II / Roci) parked at the landing site
  with theme-colored ownership glows. Game loop: intro transmission →
  suit select → walk the vertical strip through 4 stations → clay
  workstation console takeover (live 24-row table, free-column trap) →
  the seam (six human-written lines, three approaches) → send → debrief
  (reward-card style, insights, honest zero-reply branch). Both themes via
  in-game toggle or `?t=roci`/`#roci`; returns to `../#alphaforge`.
  3-run Playwright suite in the session scratchpad passed on the shipped
  build (exact credit math, silent branch, tutorial, free-column trap).
  Sources/build pipeline (template.html, build.py for the inline-artifact
  version, deploy.py for this site version, playtest.py) live in the build
  session's scratchpad; the shipped page is the artifact of record.
- **RCC-c. Open decisions — RESOLVED:** (1) walker = Aaron's sourced sprites
  (tier-A ambient bob + rotate, per medium-honesty); (2) rival first names
  kept per Aaron's direction (AlphaForge coach nods); (3) ships in BOTH
  theme skins.

### R2 — The Art Drop (gated on assets; interleaves with any phase)
Medium-honesty rule applies throughout (CLAUDE.md): illustrated things are
sourced, never hand-coded; I do shells, keying, compositing, animation tiers.
- ~~**R2a. NEW SHIPS**~~ **DONE 2026-07-20** — Swordfish II (render 2) and
  Rocinante (render 6), picked from 16 candidates via a live spin-test
  review (see SHIPPED above for the full rundown). Ship *names* didn't
  change (still Swordfish II / Rocinante), just their art, so no copy
  needed touching on the picker or console toggle labels.
- ~~**R2b. Signoff ship silhouette**~~ **DONE 2026-07-20** — folded into R2a,
  the red `[ SHIP ]` slot is now a real flat-red Swordfish II silhouette.
- **R2c. Scene art** (old Phase 3): real layered backgrounds per station —
  scenes are deliberately figure-free right now. Per scene: declare
  animation tier (A ambient / B lights / C character) BEFORE sourcing,
  source in depth layers, composite + animate. Includes issue #6 (themes
  not visually distinct per scene). Ronin's scene waits for R3d.
- **R2d. The Hangar easter egg** (brief T19): "things I love" shelf behind
  the signoff once its object art is sourced; contact duty then moves fully
  to HAIL + dossier doors.

### R3 — THE CONTENT PHASE (new, Aaron 2026-07-19: "make sure I am truly
showcasing myself" — the site is only done when the words are his)
- **R3a. Content inventory** — I walk every surface and deliver a checklist
  of REAL vs PLACEHOLDER (station tabs, artifacts, reward pools, dossier,
  profile, gates copy, meta/og text).
- **R3b. Career truth** — résumé PDF (flips the three "· SOON" slots live),
  the 9 AlphaForge builds 001–009 into the blueprint cards, more real STAR
  stories into `data/facts.js`, Clay table screenshots into the gallery,
  dossier/profile role + chips wording confirm, station decode wording
  confirm (his tags vs the brief's proposals).
- **R3c. Life & Craft truth** — real Oromugais into the poem windows,
  polaroid photos + captions, eating/grilling + fatherhood sections,
  refresh watching/playing/listening lists.
- **R3d. Ronin brainstorm → content** — the dedicated session deciding what
  the secret planet holds (mood exists: "#1 is a direction, not a rank");
  its window, scene, and GC entry all hang off this.
- **R3e. The showcase read-through** — full pass together over every word
  and surface: voice, accuracy, "does this showcase Aaron" — sign-off gate
  for calling content DONE.

### R4 — Ground Control + mobile (old 4c/4f/4g)
- **R4a. Ground Control terminal + the full T14 console restyle +
  readability scan** — the calm career console (identity rail,
  CAREER/ABOUT/FACTS/QUOTES tabs) unlocks the doorway's locked door;
  content comes ready-made from R3b. The NAV·COM console gets its full
  T14 rebuild in the same pass (big bounty hierarchy, true segmented
  SHIP/WPN toggles, bordered data footer, reward-card header language) so
  GC and the console ship to one matched standard — the console is the
  most wired-up component on the page (hangar bay, minimize/chip,
  immersive toggle), so it gets its own full regression run here, not a
  rider on another batch. Aaron 2026-07-20: some text/UI is "just too
  small still" — a readability pass (font sizes, contrast, tap/click
  targets) across every floating window and HUD panel rides along in this
  same pass, since he ties it directly to the T14 rebuild; anything
  trivially fixable sooner can still fold into R1d instead of waiting.
- **R4b. Secret paths** — hidden Pong in GC corner, Ronin's GC entry,
  dual unlock (Pong win OR bounty threshold from R1d's decision).
- **R4c. Mobile — full review and rework** — mobile-primary path via GC's
  tap-menu model + the real touch fixes (issue #21), PLUS Aaron's
  2026-07-20 ask for a complete mobile pass end to end (doorway/picker,
  stations, HUD/console, dossier, all modals) so nothing on a phone is
  left half-checked — "flawless" is the bar, not just the touch-control
  bug. No average patches.

### R5 — In-site tutorial (old Phase 5)
Guided first-flight for visitors; the flight-manual modal's "run the
tutorial · soon" slot goes live as the replay entry. Needs R4 shape final.

### R6 — The DIY build manual (old Phase 6 — THE FINAL PHASE, no matter what)
Aaron's personal plain-English walkthrough of how this was all built:
tools, concepts, lessons, mistakes. Last, so it teaches the final shape.

### No backlog — by design
Everything known lives in a phase above (Aaron 2026-07-19: "I don't want
a backlog at all"). T14 folded into R4a; the cars/boats/words/speakers
strip shipped 2026-07-19. One standing PROCESS note (not a task): if the
outside design source sends another brief, read it fully before folding
in — it overrides its predecessors where they conflict, but Aaron's own
direct instructions outrank any document.


## 3.1 Phase 1 of the roadmap: quick wins (shipped earlier today)

**Planet approach animation** (`index.html`, `04-world.js`, `06-flight.js`):
- Added `.pglow` — a large radial-gradient glow bloom behind every planet
  (each planet's own color via `--pc`), invisible at rest, blooming in via
  a back-out/overshoot easing (`cubic-bezier(.34,1.56,.64,1)`) when the
  planet goes `.live` (proximity lock) — reads as a flare rather than a
  flat fade. The existing `.ring`/`.orb` scale transitions got the same
  bouncy easing so the whole "coming into range" moment feels like one
  cohesive pop rather than several small, disjointed transitions.
- Orbit rings (`.sun-orbit`, one per station, built in `buildPlanet()`)
  now carry their own planet's color and a constant ambient glow
  (`box-shadow`) at all times, brightening further via a new `.live` state
  toggled in `setLock()` (`06-flight.js`) alongside the planet's own — the
  system map reads as a lit set of flight paths instead of flat reference
  lines.
- Ronin (the secret world) gets a real one-shot entrance — `.materialize`,
  added in `unlockRonin()` and removed ~1.2s later — scaling in from
  nothing past full size with its own glow flash, instead of snapping into
  existence mid-frame.

**Log button prominence** (`index.html`, `08-ui.js`): the old single
pulsing dot was too subtle. `.hasnew` now fills the button with a solid
red-tinted background (not just a border), and a new numeric badge
(`#log-badge`) shows exactly how many rewards are waiting — both driven by
`Progress.d.rwNew` now being a **count**, not a boolean. `markLogNew()`
also re-triggers a brief scale "bump" (`.bump`, reflow-retriggered) the
instant a new reward lands, so there's an announce moment, not just a
static glow. Badge clears and the bump stops firing once the log is opened.

**Session-only rewards** (`03-progress.js`): `Progress.d.rw`/`rwNew` are
now excluded from what's read from and written to `localStorage` — deleted
from the saved blob before both load and save — so the reward collection
resets every visit, exactly like `bounty` and the secret planet already
did. Achievements (`d.ach`) and the visit/gold/saucer counters are
untouched and still persist normally; only the reward log is session-only.

**Redesigned "?" button** (`index.html`): was a plain generic circle
(`border:1px solid var(--line)`). Now themed per ship to match the
console/log-tab language — amber-bordered with a solid-fill hover for
Swordfish, cyan-bordered with a translucent-glow hover for Rocinante — and
the log button's base styling was folded into the same shared rule so both
nav buttons read as one consistent chip family.

**Verified** (live state via headless browser, not source-reading): a
planet's `.live` toggle (via real ship proximity, not a one-off manual
call that the per-frame proximity check would immediately override)
correctly sets `.live` on both the planet and its orbit ring, and the
`.pglow` opacity settles at the intended 0.55 with the ring's box-shadow
showing the planet's own color; Ronin gains `.materialize` immediately on
unlock and loses it again ~1.2s later; earning rewards increments the log
badge text (1, then 2) and sets `.hasnew`, both clear on opening the log;
a full reload confirms `Progress.d.rw`/`rwNew` reset to empty/0 while a
test achievement survives the same reload; the existing reward
picker→reveal flow and a real gold-asteroid-crack→modal path both still
work end-to-end; zero console errors throughout. Screenshotted the glow
flash, the settled state, Ronin's materialize moment, the log badge, and
the full nav row in both themes.

## 3.2 This shipment — Phase 1.5: reward presentation & log polish

Follow-ups shipped after Phase 1 the same day (plus three bug fixes in
between: reward-modal click-through/cursor, bigger ?/LOG buttons, slower
grander Ronin reveal, and the picker made non-dismissible so a cracked
gold asteroid can never be wasted).

- **Per-entry NEW tracking** (`Progress.d.rwSeen`, session-only like the
  rest of the reward state): an earned reward stays "new" until its log
  entry is actually clicked and read — NOT merely until the panel opens.
  The button badge counts unread; each category tab in the log carries its
  own count chip (`.tab-new`) so you can see *where* the new items are;
  unread entries render lit up — bold near-white with a themed glow, an
  accent edge, and a NEW chip — then settle to normal once read.
- **Log brightened**: entry text lifted from `--ink` @ .85 opacity (dull
  gray) to a bright near-white.
- **Per-category reveal voices** (`.rewardmodal.cat-*` CSS + `setRevealBody`
  in 08-ui.js): quotes render in Dancing Script with a decorative opening
  quote (wisdom mood); career facts render bold with every number blown up
  ~1.65× in Anton with an accent glow (`.rm-num`, HTML-escaped then
  regex-wrapped); fun facts render in rounded Baloo 2 (relaxed); pilot
  facts render as a mono "PILOT FILE // DECRYPTED" dossier readout. Two
  new self-hosted fonts added to `docs/assets/fonts/` (Dancing Script 600,
  Baloo 2 600 — same no-CDN pattern as the rest).
- **Clearer picker labels**: About the Pilot · who Aaron is / Career Wins ·
  the numbers / Fun Facts · off-duty / Wisdom · words to fly by (label +
  small sub on each button; log tabs use short forms Pilot/Career/Fun/
  Wisdom; REWARD_META reveal labels updated to match).

**Verified** (headless browser, live state): badge counts 3 after 3 earns
and survives opening the log; tab chips show per-category counts (2/1);
unread entries carry `.unseen` + NEW chips and un-light individually on
click, decrementing the badge; career numbers wrap in `.rm-num` (199/148/
40/93%); quotes/random reveals compute to Dancing Script/Baloo 2 with both
fonts confirmed loaded via `document.fonts.check`; NEW chip no longer
overlaps text (padding fix); picker renders correctly in both themes;
zero console errors.

**Still pending from Aaron:** Clay table screenshots (AlphaForge gallery),
poems (Oromugai), eating/fatherhood content (Life). All have marked
placeholder sections that need no code changes to fill.

**Explicitly NOT touched this shipment**: issues #2, #5–8, #11, #12a in §2,
all still outstanding — folded into Phase 3 (visual fidelity) and Phase 4
(Ground Control) of the roadmap above. Phases 2–5 not started.

---

## 4. The Redesign Brief (2026-07-19) — where the new direction came from

Aaron shared a full design handoff from a separate design session
(`Design Notes.zip` → `design_handoff_aaronautics/README.md` +
`Aaronautics Redesign.dc.html`, a 12-turn HTML mockup reference — a design
medium to model from, not code to copy). **Its README explicitly supersedes
the old `docs/DESIGN-BRIEF.md`** (stale — describes four aesthetics and a
different flow). Governing rule from that brief: *"Lead with wonder.
Guarantee the exit"* — keep the full game, but résumé/LinkedIn/career-proof
must be one click away from anywhere; the game delivers the portfolio, it
doesn't gate it.

The item-by-item decisions from reviewing this brief with Aaron are folded
directly into the phase list in §3 above (mainly Phase 2's palette/type
adoption and Phase 4's sub-parts 4a–4g). This section is provenance/reference
only — §3 is the current source of truth for what's built vs. pending.

One correction worth flagging explicitly: the brief's own arrow-press
warp+font-crossfade theme transition (its Turn 11) is NOT being built.
Aaron's actual ask (confirmed 2026-07-19): after LAUNCH, a **second
full-screen diagonal-split scene** — Swordfish vs Rocinante, each with theme
name/copy — where clicking a ship flies it off-screen and warps into flight.
This is a new, bespoke front-door sequence, NOT a reuse of the existing
in-game hangar-bay ship-swap animation (that stays exactly as it is, untouched,
for later mid-session theme switching). See Phase 4b in §3.

**Standing note:** Aaron has said more design material is coming from this
same outside source ("look out") — when it arrives, read fully before folding
in; it may reshape §3 again, the way this brief did.

**Corrections sheet (CLAUDE_CODE_FIXES.md, landed 2026-07-19 — overrides the
v3 README where they conflict; all seven items applied):**
- The **A mark is always the real asset** (`aaron-logo-transparent.png`) —
  never redrawn. On busy station scenes it renders as a single-color tint
  (cream warm / holo-blue cool) via CSS `mask` of the asset itself.
- **Every station screen** carries the mark (mark ONLY) top-left of the
  shared rail, breadcrumb beneath, **clickable → returns to orbit**
  (`#st-mark`, wired to `closeStation`).
- Wordmark placement: doorway + ship-select + stations = mark only; system
  map/flight = full lockup (the lockup's first appearance on the system map
  is an intentional reveal).
- **The dot motif follows the environment: teal `#35c1d1` warm, orange
  `#f0a63c` cool** — applied to the wordmark i-tittle, the profile-avatar
  dot, and the wisdom quote marks.
- **Signoff = option B**: straight Special Elite line, thin red contrail
  into a **labeled placeholder slot for the red Swordfish II silhouette**
  (`.sg-ship` — red in BOTH themes, never theme-swaps; Aaron is sourcing
  the art, do not fabricate it).
- **The only three cross-theme constants:** the A mark, the signoff, and
  Space Mono. Everything else themes.

**v3 brief (Design Notes 2.zip, landed 2026-07-19):** a consolidated v3
handoff that supersedes v2 where they disagree. New in v3 and now BUILT:
ship picker (T16), fixed signoff (T17A), profile window + three doors
(T15/T18), the warm/cool artifact system (T20–24), STAR reward cards
(T13/T2), Captain's Dossier + HUD kit direction (T14), the 5F lockup (§5).
Still pending from v3: the T19 **Hangar** easter egg (needs art; signoff
keeps contact duty until then), full T14 NAV·COM restyle (Aaron chose the
lighter touch for now), Ground Control 4c (on hold), secret-planet Pong.

**Aaron supplies, drops straight in (no code changes unless noted):**
- `docs/orbit/assets/resume.pdf` → then swap the three "▤ RÉSUMÉ · SOON"
  slots (dossier/console/profile) to real links — small code touch.
- Swordfish II + Rocinante renders → the ship-picker image slots.
- The 9 AlphaForge builds (001–009) → `SECTIONS.alphaforge` build cards.
- Life polaroid photos + captions → `SECTIONS.life` "Now playing" items.
- Real STAR career stories → `data/facts.js` career array (object shape
  documented inline).
- Confirm/adjust nav decode wording (currently his own station tags).
