# R2 Art Sourcing Kit — ready-to-paste prompts (R2c scenes + R2d shelf)

> 2026-07-21. Companion to `CONTENT-INVENTORY.md`. Every prompt below is
> ready to paste into an image generator as-is. Style register: **16-bit
> pixel art**, matching the hangar-bay set now live (your gpt-image picks) —
> one consistent "real art" language across the whole site.

## How to run this (5 minutes of reading, then assembly line)

1. **Tool/model:** last round, **gpt-image** renders won all four categories.
   Recommend leading with it again; generate 2–4 candidates per prompt like
   last time.
2. **Aspect:** every scene layer wants **wide landscape** (roughly 3:2 or
   16:9). If the tool has a size picker, choose its widest landscape option,
   largest size. Shelf objects (bottom section) are the exception — square.
3. **One scene at a time, same session/model** — layers of the same scene
   need to look like siblings. Generate the BG first, then the MID and FG
   right after in the same chat/session so the style holds.
4. **Transparency:** MID and FG layers ask for "isolated on transparent
   background." If the tool won't do real transparency, use this fallback
   line instead: *"on a solid pure black background, nothing else"* — I
   flood-fill-key it clean on my end (established pipeline from the quill
   and ship art).
5. **The city lights overlay** (my animation layer for AlphaForge): do NOT
   try to generate it — I'll extract the lit windows from the delivered MID
   layer myself. One less thing to prompt.
6. **Delivery:** Drive folders like last time — one folder per scene, warm
   and cool inside, filenames don't matter. I review everything in a live
   mockup (same as the hangar round) before anything ships.

**The count: 30 scene images (5 scenes × 2 themes × 3 layers) + your shelf
objects.** At 2–4 candidates each that's a real session — totally fine to do
it scene by scene across days. Suggested order: **AlphaForge → Notes →
Life → Craft → Mission** (city gets the most screen time; sun is most
forgiving of style drift).

---

## SCENE 1 · MISSION — "Solar Approach" (the sun's upper atmosphere)

### Warm (Swordfish · amber)
**M-W-BG (background, opaque):**
> 16-bit pixel art, the blazing upper atmosphere of a star, a huge amber sun dominating the sky with solar corona and plasma arcs, drifting solar haze, warm orange and gold palette, wide landscape, detailed dithered shading, retro sci-fi videogame background, no text

**M-W-MID (midground, transparent):**
> 16-bit pixel art game asset, a silhouetted solar observation station on a rocky ridge line, backlit by warm amber light, wide horizontal terrain strip, isolated on transparent background, detailed dithering, no text

**M-W-FG (foreground, transparent):**
> 16-bit pixel art game asset, dark foreground rock outcrops and a lone antenna mast in silhouette with amber rim lighting, wide horizontal strip along the bottom, isolated on transparent background, no text

### Cool (Rocinante · icy blue)
**M-C-BG:**
> 16-bit pixel art, the upper atmosphere of a pale blue-white star, icy blue corona and cold plasma arcs, deep space visible above, cool blue and teal palette, wide landscape, detailed dithered shading, retro sci-fi videogame background, no text

**M-C-MID:**
> 16-bit pixel art game asset, a silhouetted solar observation station on a rocky ridge line, backlit by cold blue-white light, wide horizontal terrain strip, isolated on transparent background, detailed dithering, no text

**M-C-FG:**
> 16-bit pixel art game asset, dark foreground rock outcrops and a lone antenna mast in silhouette with icy blue rim lighting, wide horizontal strip along the bottom, isolated on transparent background, no text

---

## SCENE 2 · ALPHAFORGE — "Neon Grid" (the city)

### Warm
**A-W-BG:**
> 16-bit pixel art, hazy amber dusk sky over a distant retro-futuristic city skyline, warm smog glow on the horizon, orange and rust palette, wide landscape, detailed dithered shading, Cowboy-Bebop-inspired mood, videogame background, no text

**A-W-MID:**
> 16-bit pixel art game asset, a band of mid-rise cyberpunk buildings with many small lit windows and a few neon signs, warm amber and orange night palette, wide horizontal strip, isolated on transparent background, detailed dithering, no readable text on signs

**A-W-FG:**
> 16-bit pixel art game asset, a dark rooftop edge in the foreground with vents, cables, an antenna and a water tower in silhouette with warm amber rim light, wide horizontal strip along the bottom, isolated on transparent background, no text

### Cool
**A-C-BG:**
> 16-bit pixel art, deep night sky over a distant futuristic city skyline, cold blue atmospheric haze, icy blue and teal palette, stars visible, wide landscape, detailed dithered shading, The-Expanse-inspired mood, videogame background, no text

**A-C-MID:**
> 16-bit pixel art game asset, a band of mid-rise futuristic buildings with many small cold-blue lit windows and holographic-style signage glow, icy blue night palette, wide horizontal strip, isolated on transparent background, detailed dithering, no readable text

**A-C-FG:**
> 16-bit pixel art game asset, a dark rooftop edge in the foreground with vents, cables, an antenna and a water tower in silhouette with icy blue rim light, wide horizontal strip along the bottom, isolated on transparent background, no text

---

## SCENE 3 · LIFE — "Canopy" (the forest)

### Warm
**L-W-BG:**
> 16-bit pixel art, golden hour sky glimpsed through a high forest canopy, warm light rays filtering down through leaves, amber and deep green palette, wide landscape, detailed dithered shading, peaceful videogame background, no text

**L-W-MID:**
> 16-bit pixel art game asset, a dense tree line band of layered forest silhouettes in warm greens catching golden light, wide horizontal strip, isolated on transparent background, detailed dithering, no text

**L-W-FG:**
> 16-bit pixel art game asset, dark foreground tree trunks and undergrowth ferns in silhouette with warm golden rim light, framing the left and right edges and the bottom, isolated on transparent background, no text

### Cool
**L-C-BG:**
> 16-bit pixel art, cool moonlit night sky glimpsed through a high forest canopy, pale blue light rays filtering down, deep blue-green palette, wide landscape, detailed dithered shading, tranquil videogame background, no text

**L-C-MID:**
> 16-bit pixel art game asset, a dense tree line band of layered forest silhouettes in cool blue-greens under moonlight, wide horizontal strip, isolated on transparent background, detailed dithering, no text

**L-C-FG:**
> 16-bit pixel art game asset, dark foreground tree trunks and undergrowth ferns in silhouette with pale blue moonlit rim light, framing the left and right edges and the bottom, isolated on transparent background, no text

*(Fireflies, sway, and fog are mine — CSS/canvas animation on top. Don't
prompt for them.)*

---

## SCENE 4 · OROMUGAI — "The Loop" (the ocean)

### Warm
**O-W-BG:**
> 16-bit pixel art, a vast calm ocean horizon at sunset, huge warm sky with layered amber and rose clouds, sun low over the water, wide landscape, detailed dithered shading, contemplative videogame background, no text

**O-W-MID:**
> 16-bit pixel art game asset, a band of open sea with gentle rolling waves catching warm sunset light, subtle glitter path on the water, wide horizontal strip, isolated on transparent background, detailed dithering, no text

**O-W-FG:**
> 16-bit pixel art game asset, dark foreground shoreline rocks and the end of a small wooden pier in silhouette with warm amber rim light, wide horizontal strip along the bottom, isolated on transparent background, no text

### Cool
**O-C-BG:**
> 16-bit pixel art, a vast calm ocean horizon under a huge moonlit night sky, cold blue clouds and stars, moon low over the water, wide landscape, detailed dithered shading, contemplative videogame background, no text

**O-C-MID:**
> 16-bit pixel art game asset, a band of open sea with gentle rolling waves catching cold moonlight, subtle silver glitter path on the water, wide horizontal strip, isolated on transparent background, detailed dithering, no text

**O-C-FG:**
> 16-bit pixel art game asset, dark foreground shoreline rocks and the end of a small wooden pier in silhouette with pale blue rim light, wide horizontal strip along the bottom, isolated on transparent background, no text

---

## SCENE 5 · NOTES — "The Lot" (the graffiti lot)

### Warm
**N-W-BG:**
> 16-bit pixel art, golden hour sky over low city rooftops and distant water towers, warm haze, amber and brick-red palette, wide landscape, detailed dithered shading, Bronx-inspired urban videogame background, no text

**N-W-MID:**
> 16-bit pixel art game asset, a long brick wall covered in colorful abstract graffiti pieces, warm golden hour light, wide horizontal strip, isolated on transparent background, detailed dithering, abstract shapes only, no readable words

**N-W-FG:**
> 16-bit pixel art game asset, foreground of a cracked asphalt lot with a chain-link fence section, a milk crate and a boombox in silhouette with warm rim light, wide horizontal strip along the bottom, isolated on transparent background, no text

### Cool
**N-C-BG:**
> 16-bit pixel art, night sky over low city rooftops and distant water towers, cool blue tones with a few lit windows, wide landscape, detailed dithered shading, urban videogame background, no text

**N-C-MID:**
> 16-bit pixel art game asset, a long brick wall covered in glowing blue-toned abstract graffiti pieces under cold streetlight, wide horizontal strip, isolated on transparent background, detailed dithering, abstract shapes only, no readable words

**N-C-FG:**
> 16-bit pixel art game asset, foreground of a cracked asphalt lot with a chain-link fence section, a milk crate and a boombox in silhouette with icy blue rim light, wide horizontal strip along the bottom, isolated on transparent background, no text

---

## R2d · THE HANGAR SHELF — "things I love" objects

**First: pick your 5–8 objects.** From your own file, strong candidates —
grill/spatula, cassette Walkman, game controller, Pokémon card, snowboard,
Skyline R34 model car, bird/binoculars, basketball, a Lego brick stack, a
quill/ink (Oromugai). Your call entirely — this shelf IS the content.

**Template — paste once per object, swap the [OBJECT] part:**
> 16-bit pixel art game asset, [OBJECT], single object centered, isolated on transparent background, consistent soft light from the upper left, detailed dithered shading, warm neutral colors, no text

Examples ready to go:
> 16-bit pixel art game asset, a classic cassette Walkman with headphones wrapped around it, single object centered, isolated on transparent background, consistent soft light from the upper left, detailed dithered shading, no text

> 16-bit pixel art game asset, a small charcoal grill with the lid open and grill marks visible, single object centered, isolated on transparent background, consistent soft light from the upper left, detailed dithered shading, no text

> 16-bit pixel art game asset, a Nissan Skyline R34 GT-R model car in silver, single object centered, isolated on transparent background, consistent soft light from the upper left, detailed dithered shading, no text

Objects are theme-agnostic (one set, not warm/cool pairs) — the shelf's
lighting does the theming, which I build in CSS.

---

*When a folder lands, I do the same pipeline as the hangar round: pull from
Drive → contact-sheet review → live mockup at real size with my picks →
your sign-off → integrate + verify both themes/desktop/mobile → ship.*
