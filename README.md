# Aaronautics

Aaron's personal portfolio — a spaceflight / mission-control themed, interactive
website. Not a normal web page: a *place you operate*. Pick a ship, fly a
top-down solar system where the sun is the mission statement, land on planets
to open the portfolio's sections, earn bounty, and find the secret planet.

**Live:** https://aselkridge.github.io/aarons-portfolio/docs/orbit/

> **What are the games and how do they play?** Read [`docs/GAMES.md`](docs/GAMES.md).
> **Building on this project?** Read [`docs/DESIGN-BRIEF.md`](docs/DESIGN-BRIEF.md) first,
> then [`docs/orbit/HANDOFF.md`](docs/orbit/HANDOFF.md) (the always-current maintenance doc).

## What's here

Two playable experiences (both explained in [`docs/GAMES.md`](docs/GAMES.md)):

- **Orbit** (`docs/orbit/`) — the portfolio itself, played as a spaceship.
  Two full theme skins (Cowboy Bebop / The Expanse), asteroid combat with a
  bounty system, five painted planet scenes, achievements and rewards.
- **The Coldest Call** (`docs/orbit/coldest-call/`) — a 10–15 minute teaching
  game about go-to-market engineering: help a stranded astronaut introduce
  ice cream to a moon, on a budget of 100 credits. Reached through the
  AlphaForge station's mission door, or directly at
  https://aselkridge.github.io/aarons-portfolio/docs/orbit/coldest-call/

## Structure

- `docs/` — the live site (GitHub Pages serves this) + the project's memory:
  - `docs/GAMES.md` — reader-facing explanation of both games.
  - `docs/DESIGN-BRIEF.md` — permanent design memory and decisions.
  - `docs/orbit/HANDOFF.md` — rewritten every shipment: file map, known
    issues, roadmap.
  - `docs/assets/fonts/` — all fonts, self-hosted (house rule: no CDNs).
- `prototypes/` — the original self-contained HTML concept explorations that
  grew into the site (hero, mission control, the CSS-3D Walkman, type
  identity).
