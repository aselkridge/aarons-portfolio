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
