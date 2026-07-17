# Aaronautics — Design Brief & Handoff

> **Purpose of this file:** the permanent memory of the project. If you're a new
> Claude session (or a new person) picking this up, **read this top to bottom first.**
> It captures who Aaron is, what we're building, every decision made so far, the
> hard constraints we hit, and exactly what to do next.

Last updated: 2026-07-17

---

## 1. Who this is for

**Aaron** (GitHub: `aselkridge`) — building his first website ever. He cares
deeply about design, art, and words (he's a poet), so "functional but generic"
is a failure. He has repeatedly (and correctly) rejected anything that feels
like a "default AI-built website."

He is **deliberately more than one thing** — that range IS the point of the site:
- **Lead Automation Analyst at HubSpot** (RevOps org; was the *first* automation
  analyst hired, now one of the leads on a full team). Builds automations.
  *Note: he does not want employer-forward framing — this is a portfolio, not a CV.*
- **Aerospace engineer by degree** (this is where the brand name comes from).
- **GTM engineer** — via the AlphaForge cohort (see below).
- **Poet, visual artist (drawing), physics nerd.**
- **Father from the Bronx**, husband, building/renovating his own home.
- Into **anime, hip-hop, video games, movies, music**.
- Wants to start **content creation** (writing + video) about fatherhood, the
  Bronx, becoming a husband, building his home, and explaining GTM to a community
  that was never handed the map.

## 2. The brand

**"Aaronautics"** = *Aaron* + *(aero)nautics* — a play on **aeronautics**, nodding
to his aerospace degree. The whole site leans into a **spaceflight / mission-control**
theme.

## 3. The core idea (what makes it NOT a normal website)

This is the heart of it, and Aaron is emphatic about it:

> **The site is not a "web page." It's a place you interface with.**
> A *diegetic* experience — the controls exist as real objects inside the world,
> not as web buttons floating on top. You operate a machine; you don't "click a nav link."

The intended flow:
1. **Boot screen → pick an aesthetic.** Not four flat buttons — it should feel like
   *interfacing with a device*. Aaron's own idea: a console/device on the mission-control
   desk, showing the current theme, with a physical **◄ / ►** button on each side.
   Press one and the **whole room transitions** to the next aesthetic.
2. **Mission Control room** — with a **countdown clock** modeled on the real NASA
   incandescent-**bulb** clock (the "HOUR / MINUTE / SECOND" one — Aaron sent this
   reference many times; it's the signature object).
3. **LAUNCH** — press the button (or countdown hits zero): ignition, shake, ascent.
   Bonus idea from a reference: a launch-sequence panel listing items **001–009**
   maps beautifully to the **9 AlphaForge builds**.
4. **In-ship cockpit** — view of space out the window; the **console panels are the
   navigation.** Click a station to open that section.

### The four aesthetics (Aaron approved these descriptions — keep them)
- **Retro** — Apollo-era. Amber bulbs, CRT scanlines, warm serif.
- **Modern** — clean & quiet. Glass, restraint, monochrome.
- **Futuristic** — *The Expanse*. Holo-blue, thin lines, cold glass.
- **Anime** — *Cowboy Bebop*. Jazzy warmth, film grain, bold title-card type.

### The music player (important, recurring request)
- A **tape deck / music player near every place music can play**, showing Aaron's
  **currently-listening** tracks.
- It must be a **real 3D object you can rotate and whose buttons you physically press**
  (play / stop / next / back).
- It **changes per aesthetic**: retro = tape deck, anime = CD player, modern = MP3
  player, futuristic = holo-player.
- Music source (Aaron's choice): **Spotify / YouTube embeds** (official, free, legal).

## 4. Site structure (pages / stations)

| Station | Contents |
|---|---|
| **Mission** | The thesis / mission statement. **This is the real flagship** — Aaron's point of view, not AlphaForge. "Built to be more than one thing." |
| **AlphaForge** | The *proof*. 9 GTM builds from the Clay-led cohort — each: problem, what he built, tangible numbers. Raw material = his Clay tables / weekly prompt solutions (to be provided). |
| **Life** | Relatable page — reading / watching / listening / eating. Anime, hip-hop, food. Conversation starters. |
| **Craft** | The artist side — poetry, drawings, physics. Made things with no ROI attached. |
| **Notes** | Blog-style writing **and video**, easy to navigate — fatherhood, the Bronx, building his home, GTM-for-my-community. |

Also: the site should **link out** to other sites/projects Aaron builds later.

## 5. Typography (SOLVED — do not regress to system fonts)

Aaron's biggest recurring complaint was "generic AI fonts." Fixed by self-hosting
real fonts. The **Bebop cut** (for the anime skin, and the baseline voice):
- **Anton** — heavy condensed display (title-card weight).
- **Oswald** — tall filmic body/labels.
- **Space Mono** — techy data/readouts/timers.
- Treatment: film grain, scanlines, vignette, B&W title-card energy, a live
  "session" timer, "SEE YOU, SPACE COWBOY…" signoff.

Each *other* skin should get its own type cut (retro: warm serif; modern: clean
grotesque; futuristic: technical). Fonts are pulled from the **npm `@fontsource/*`
packages** and inlined — see `prototypes/build-type.js` for the exact method.

## 6. The 3D model (chosen, but BLOCKED — see constraints)

- Aaron picked the **Sony Walkman WM-F2078** (Sketchfab, by *Dolgov12*,
  Creative Commons – Attribution → we must credit the maker on the site).
- The file is in **Aaron's Google Drive**: `sony_walkman_wm-f2078.glb`,
  file id `1FNHrIAFbC2tQC-730DSA-Q-pi8eAyuEr`.
- **It is 167 MB — unusable as-is.** Must be optimized to ~5 MB (resize textures to
  ~1–2K, decimate/compress geometry) with e.g. `gltf-transform` or `gltfpack` before
  it can go on the web or in the repo (GitHub caps files at 100 MB).

## 7. Tech decisions

- **Real 3D = Three.js / WebGL** on the real site (loads fine on free GitHub Pages;
  the visitor's browser fetches Three from a CDN). The CSS-only 3D in the prototypes
  was ONLY a workaround for the artifact sandbox — the real build should use WebGL +
  the real `.glb` model for photoreal quality (Aaron rejected the "Tomb Raider"/gamey
  CSS look for the final).
- **Self-host all fonts** (already proven via `@fontsource` + inlining).
- **Hosting:** GitHub Pages (free) is the working assumption. Not yet set up.
- **Music:** Spotify / YouTube embeds.

## 8. Constraints we learned the hard way (READ THIS)

- **Artifact preview sandbox** blocks: external CDN scripts (no Three.js), web
  fonts, external images, external iframes. That's why prototypes are CSS-only and
  self-contained. Real 3D/photoreal is impossible *inside an artifact* — it needs a
  real host (GitHub Pages).
- **This session's cloud environment used `Trusted` network access**, which only
  allows package registries (npm/PyPI/etc.) + GitHub. It **blocks Google Drive and
  the general web.** That's why the 167 MB model could not be downloaded to optimize
  it. **To do the real 3D pipeline, the environment needs `Full` (or `Custom` with
  Google/CDN domains) network access.** (npm-based work — fonts, libraries — DOES
  work under Trusted.)

## 9. Reference material Aaron gave

- **Sites he admires:** maximeheckel.com (dark, cinematic, great type, interactive
  essays), bruno-simon.com (drive-a-car WebGL playground), spencerhong.com,
  logartis.info, getcoleman.com, nayn.bio, aicho.vercel.app (cohort-mate's
  portfolio+Life+hobbies), nothing-to-watch.port80.ch (diegetic/tactile),
  siteinspire.com "unusual layout" category.
- **Shows:** *The Expanse* (cockpits/consoles), *Cowboy Bebop* (title-card type,
  jazz, B&W), *The Twilight Zone* (B&W surreal — possible easter-egg aesthetic).
- **Objects:** the NASA bulb **countdown clock** (signature), Apollo & modern
  mission-control rooms, Space Shuttle glass cockpit, the **"we are rewind"** orange
  Walkman (great CSS target for the retro deck's look/color).

## 10. Prototypes so far (also saved as private Artifacts on Aaron's claude.ai)

Files live in `prototypes/`. Live previews (Aaron's account):
- `00-hero-v0.1.html` — first hero concept → https://claude.ai/code/artifact/bbbe6348-806a-4a88-8063-49a955ce4883
- `01-mission-control-v0.2.html` — theme-switch + countdown + launch + cockpit nav → https://claude.ai/code/artifact/4e09091b-5bf8-40ee-8114-e8aa6d7c76ae
- `02-walkman-v2.html` — CSS-3D orbitable tape deck, clickable buttons → https://claude.ai/code/artifact/7858cb1b-edb6-425e-88a7-6d1cef452123
- `03-type-identity-bebop.html` — real self-hosted fonts, Bebop title-card → https://claude.ai/code/artifact/167658b8-8c49-4fb6-a5ed-1974c26e79c7

*(These are artifact-body HTML — they render in the Artifact tool. Opened as raw
files they mostly work but aren't the final site.)*

## 11. Where we left off / NEXT STEPS

Aaron liked: the aesthetic-select concept + descriptions, the diegetic direction,
the real-font type identity. He wants photoreal 3D objects (not gamey CSS).

Immediate next steps once on a **Full-network** session:
1. Download `sony_walkman_wm-f2078.glb` from Aaron's Drive and **optimize to ~5 MB**.
2. Stand up a real **Three.js** preview of the Walkman (orbit + clickable transport +
   Spotify) deployed to **GitHub Pages** so Aaron gets a live URL.
3. Build the **theme-switch desk** (◄ / ► device that reskins the room) — "Step 2"
   he asked for.
4. Get Aaron's **Clay / AlphaForge** files to make the flagship page real.
5. Cut per-skin type systems (retro / modern / futuristic).

Still open / to ask Aaron: fonts for the non-anime skins; whether to mention HubSpot
at all; final page order.
