# Aaronautics — operating instructions (read first, every session)

## This project is ART, not a checklist.
Aaronautics is an interactive, spaceflight-themed *place you operate* — not a
web page. Every surface (content boxes, frames, panels, scenes) is meant to be
immersive and have MOOD. The container is part of the art, not just something
to hold text. Do NOT ship "squares-and-circles, it works, done" versions.
If it isn't beautiful, it isn't finished.

## The medium-honesty rule (non-negotiable)
Before building ANY visual element, state which medium it needs:
- **Vector / CSS / SVG geometry** (frames, HUD, borders, glows, gradients,
  scan-lines, typography, layout, animation) → I build it, and it can be
  genuinely beautiful. This is my strength.
- **Illustrated / painterly / organic** (characters, rendered scenes, painterly
  textures, realistic objects) → I CANNOT hand-code this to a beautiful
  standard. Canvas/SVG primitives have a hard ceiling (this is why the
  environment figures look "blocky" — wrong medium, not lack of effort).
  → STOP and ask Aaron for a real art asset or image-generated art. Describe
  exactly what to source and why. Never over-promise and land back at blocks.

## The quality bar — the Oromugai parchment box
The poetry station's parchment content box (built 2026-07-18) is the
REFERENCE STANDARD for the whole site. Aaron: "this is the quality I want the
whole website at." Every surface — especially the Phase 3 redesign of the
scenes — should aim there, not at "it works, done."

The METHOD that got there, reuse it everywhere (it's the hybrid, not either
half alone):
- CSS/SVG builds the immersive SHELL — frame, paper texture (layered
  gradients + live fractal-noise), foxing, vignette, type, layout, one
  restrained accent. This is mine and it can be genuinely beautiful.
- Real ILLUSTRATED art (Aaron sources it from an image generator) gets keyed
  to transparency and composited IN: `mix-blend-mode:multiply` for
  ink/paint-on-paper so it melts into the surface (not a pasted sticker);
  normal + a soft drop-shadow for raised objects (e.g. the wax seal).
- Keying tip that worked: flood-fill the background from the image borders so
  interior highlights aren't punched out; optimize/resize before inlining.
- Assets live in `docs/orbit/assets/` (quill.png, wax_seal.png so far).

## Sourcing art in LAYERS + animating it (Phase 3 — highest-leverage knowledge)
Text-to-image generators (Firefly, Midjourney, DALL·E, etc.) output ONE FLAT
image — they do NOT hand back movable layers. How to actually get layers:
- **Props:** prompt each element "isolated on transparent background" as its own
  image, OR hand me a flat one and I cut it (I flood-fill-key clean fg/bg splits).
- **Scenes:** ask for DEPTH LAYERS — sky/background, midground, foreground as
  separate images (enables parallax + moving individual elements).
- **Characters that must move:** get them RIGGED (Live2D / Spine / After-Effects→
  Lottie) or drawn in separated parts. A flat character can only do ambient motion.
What I can/can't separate myself: I CAN isolate an object on a clean background
(PIL keying, like the quill). I CANNOT split same-colored/overlapping regions,
paint in the hole behind a cut-out (no generative fill here), or rig a flat
figure. So complex layering must come from how the art is SOURCED, not from me.

Animation tiers (state which a scene needs before Aaron sources art):
- **A — ambient (any image, my wheelhouse):** bob, sway, drift, parallax,
  breathing-scale, glow pulses, drifting fog/clouds, particles (embers/snow),
  light rays, shimmer. Most "alive" feeling comes from here.
- **B — blinking lights / glowing windows:** either the lights on their own
  layer (I flicker it) OR I overlay CSS glow spots on the static image and blink
  those. City lights like the current build → yes.
- **C — true character motion (walk/talk/gesture):** a single flat image CANNOT.
  Needs separated parts, a frame sequence (sprite sheet), a pre-animated file
  (Lottie/GIF/APNG/WebM), or AI image-to-video (Runway/Kling/Pika). I'll say
  which, per character, before art is sourced.

## Responsive — art and text must NEVER collide (any screen)
The parchment mockup overlapped text on a narrow phone because the quill was
`position:absolute` (out of text flow) — a quick-mockup shortcut, NOT how the
real thing ships. Real integration rule:
- Give the art its OWN ZONE via grid/flex (don't absolutely overlap text/art).
- Reposition/shrink on small screens with media/container queries (container
  queries matter — these boxes reappear at different sizes, e.g. the Ground
  Control screen in Phase 4).
- `shape-outside` CAN wrap text around an image's contour (Word-style) — elegant
  on larger screens, but on tiny screens still shrink/move the art.
- ALWAYS verify with a real mobile screenshot before merge — this is exactly
  what the "desktop + mobile screenshots" sign-off step is for.

## Show before it goes live — always
"Live" = merged to the default branch (GitHub Pages serves `docs/`). The work
branch is NOT live. For any design change:
1. **Mockup first** — build a self-contained HTML mockup and publish it as a
   private Artifact (claude.ai URL) for Aaron to see. Iterate there. No orbit
   code touched yet.
2. **Then integrate** on the branch and send REAL headless screenshots (both
   themes, desktop + mobile) for in-context sign-off.
3. **Aaron merges** when ready. Never merge/deploy to make something live
   without being asked.

## Ask, don't guess
On any design decision with real taste in it, give a genuine expert opinion
(composition, mood, type, color, motion) AND the engineering trade-off — then
ask, rather than silently picking. Be both the artist and the engineer.

## House rules
- **No CDNs.** Everything self-hosted/inlined (fonts live in `docs/assets/fonts/`).
- **Orbit code** is split under `docs/orbit/js/` (load order matters) with all
  CSS + markup in `docs/orbit/index.html`. Full file map + current bugs +
  roadmap live in `docs/orbit/HANDOFF.md` — read it before touching code.
- Work on the assigned branch; commit with `user.email=noreply@anthropic.com`.
- One issue at a time unless Aaron says batch it.
