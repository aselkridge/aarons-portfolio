# Aaronautics

Aaron's personal portfolio — a spaceflight / mission-control themed, interactive
website. Not a normal web page: a *place you interface with*. Boot up, pick an
aesthetic (retro / modern / futuristic / anime), watch the countdown, launch, and
fly into a cockpit whose console panels are the navigation.

> **Building on this project? Read [`docs/DESIGN-BRIEF.md`](docs/DESIGN-BRIEF.md) first.**
> Starting a fresh Claude Code session? Read [`docs/NEXT-SESSION.md`](docs/NEXT-SESSION.md).

## Status

Early prototyping. Concepts live in [`prototypes/`](prototypes/). The real site
(Three.js + real 3D model, self-hosted fonts, GitHub Pages) is not built yet — the
next step needs a session with **Full** network access (see `docs/NEXT-SESSION.md`).

## Structure

- `docs/` — the design brief and handoff notes (the project's memory).
- `prototypes/` — self-contained HTML concept explorations.
  - `00-hero-v0.1.html` — first hero concept.
  - `01-mission-control-v0.2.html` — theme-switch + countdown + launch + cockpit nav.
  - `02-walkman-v2.html` — CSS-3D orbitable tape deck with clickable transport.
  - `03-type-identity-bebop.html` — self-hosted type identity (Cowboy Bebop cut).
  - `build-type.js` — how fonts get inlined from `@fontsource` npm packages.
