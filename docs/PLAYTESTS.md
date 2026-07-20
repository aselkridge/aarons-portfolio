# The Coldest Call — Playtest Log

> **Purpose:** the research record for the game. Every playtest gets an entry:
> who played, what they hit, what we decided it means, what we changed, and
> where that change shipped. Findings are numbered `P<session>.<finding>` so
> commits and future entries can cite them (e.g. "fixes P1.3"). Raw player
> words stay verbatim where possible — the reaction IS the data.
>
> Related docs: [`GAMES.md`](GAMES.md) (what the game is),
> [`orbit/HANDOFF.md`](orbit/HANDOFF.md) (live known issues / roadmap).

**Status legend:** `RAW` noted, not yet interpreted · `PROPOSED` change
designed, mockup awaiting Aaron's approval · `APPROVED` build greenlit ·
`SHIPPED` live · `WONTFIX` deliberate, with reasoning.

---

## Playtest 001 — 2026-07-20

**Player profile:** first outside playtester. No GTM / sales-ops background,
first time seeing a data table used for outreach. Played the live build
solo, unprompted. Feedback relayed by Aaron.

**Overall read:** the run works end to end for a total newcomer, and the
teaching moments that DO fire (the free-column hover hint) were explicitly
appreciated. Every finding below is a gap in *orientation*, not mechanics:
the player was never lost in the world, they were lost in *what mattered*.
That's the exact audience the game is for, so these are high-value fixes.

### Findings

**P1.1 — The table felt overwhelming on first sight.** `PROPOSED`
Player had never seen a data table used this way; the 24-row console read as
"too much" with no cue for how to feel about that.
*Interpretation:* not a bug — an unclaimed teaching beat. Feeling swamped by
raw data is the honest first experience of this work; the game should say so
out loud, so newcomers read the feeling as correct rather than as failure.
*Change:* a first-open console beat — the astronaut acknowledges the wall
("if that looks like too much, you are seeing it right") and reframes the
job as making a big list small. Plus a new insight, THE WALL, so the lesson
lands in the notebook for every player.

**P1.2 — Rival results were interesting but under-explained AND
under-highlighted.** `PROPOSED`
Player enjoyed seeing rivals do poorly but couldn't tell WHY each one
failed, and asked for the comparison to be highlighted more overall.
*Change:* the debrief pauses on MEANWHILE, ON THE FAR SIDE — the rival
cards sweep in one by one with a glow so the moment lands — then each card
gets a hover / tap reveal that diagnoses the strategy in one breath
(Jordan: one loud broadcast, compared notes; Natalie: flawless machine
notes with no person inside; Adam: perfect table, zero sends), each tied
back to the matching insight.

**P1.3 — Hard to know which citizen info mattered for the flyer.** `PROPOSED`
Reading names/rows, the player couldn't tell what to carry forward into the
writing step.
*Change:* make the data-to-words thread visible at the seam: every filled
blank in the line templates gets a colored chip traced to the column it came
from (hover shows source + what it cost). The words literally light up with
where they came from.

**P1.4 — Column picking: unclear what to pick or why.** `PROPOSED`
*Interpretation:* deciding what's worth knowing IS the craft being taught,
so we don't hand over answers — we hand over the question.
*Change:* a tieback banner above the column menu ("a column earns its place
two ways: it helps you choose WHO to visit, or gives you something real to
SAY at the door") + significant-moment popups in the tutorial style at the
four biggest decisions of the run — first console open, the group gate,
locking columns, and right before the send — so guidance travels with the
player instead of ending at the start.

**P1.5 — The free-column hover hint was loved; wants hints on the rest.**
`PROPOSED` *Change:* every column gets a hover hint written as a heuristic,
not an answer — what the column is FOR and one honest caution (e.g. mood:
"changes by the hour; by the time you knock, it already happened"). The
trap columns keep their existing reveal.

**P1.6 — The ending didn't feel like an ending.** `PROPOSED`
The in-person goodbye + debrief buttons weren't enough signal that the game
was complete.
*Change:* a full celebration finale after the goodbye — fireworks over the
town, the crowd out with the first scoops, a big RUN COMPLETE moment, then
clear buttons (see your debrief / run it again / back to AlphaForge).

**P1.7 — Credit tracking lagged the action.** `PROPOSED`
Credits visibly changed later than the choice that spent them.
*Change:* the credit meter reacts the instant a column is picked or dropped —
rolling number animation, a spend flash on paid picks, a distinct FREE flash
(with "the survey already paid") on free picks, and a live projected line
("this run: 30 · leaves you 25") before committing.

**P1.8 — Column choices didn't visibly connect to the flyer writing.**
`PROPOSED` Same thread as P1.3, seen from the picking side.
*Change:* covered by the P1.3 seam treatment + the P1.4 banner language, so
the promise ("this will become words at the door") is made at pick time and
kept at write time.

**P1.9 — Didn't realize more than one group could be kept.** `PROPOSED`
Player kept only The Traditionalists, believing the choice was one-of-three.
The multi-select exists mechanically but nothing announces it.
*Change:* the gate states the rule in plain words ("keep one group, keep
two, keep all three"), cards become visible keep-toggles with checkbox
marks, and a live count ("KEEPING 14 OF 24") shows the list growing as
groups are added. (House note: we never say "segments" in game voice.)

**P1.10 — Group names appear from nowhere.** `PROPOSED`
The Curious / The Traditionalists / The Quiet Ones are never explained.
*Interpretation:* keep it simple — no new grouping mechanic. The groups
were always the astronaut's read of his neighbors; the fix is him saying
so.
*Change:* one beat before the gate: the astronaut's log ("two years and a
radio... I wrote three names in my log"), each name defined in a breath,
closed with "those are my notes, not rules." Shares a treatment with P1.9.

**P1.11 — Transmission device needs beauty + a crystal-clear split from
in-person speech.** `PROPOSED` (Raised by Aaron on reviewing the same
session.)
*Change:* radio lines arrive inside a drawn wrist unit (metal bezel,
channel line, blinking signal bars, waveform, scanline shimmer over
glowing text); in-person lines get a portrait chip and a clean open plate
with no device chrome; narration stays bare. Three voices, three
unmistakable looks.

**P1.12 — The player never knew the plan, so the table came from nowhere.**
`PROPOSED` (Best insight of the session, per Aaron.) The player knew the
goal (get the neighbors to try ice cream) but had no idea the method would
involve building a table, so the console read as a non sequitur. The bridge
only formed by accident: they recognized "claygent" because they already
know Clay. An average player has no such bridge.
*Interpretation:* the game taught the steps but never stated the strategy.
Newcomers need the plan BEFORE the first tool, in physical words, with no
GTM vocabulary.
*Change:* (a) right after the intro call, the astronaut lays out the whole
job in three words: LEARN, CHOOSE, SAY HELLO; (b) those three words become
a persistent corner tracker that lights up and checks off as the run
progresses, so every screen answers "which word am I on"; (c) the table is
introduced as what it honestly is ("my notes on all twenty four, laid side
by side so you can compare them; that is all a table is"); (d) the claygent
gets one plain sentence needing no outside knowledge ("a tin helper with
good manners; it walks the town, asks one question at each door, writes
the answer into your notes").

### Session decisions

- Mockups of all eight treatments built as an interactive page (in the
  game's own styling) for Aaron's review before any game code changes.
- Nothing ships until Aaron approves per-treatment. This entry moves
  findings to `APPROVED` / `SHIPPED` as that happens.

---

*Template for future entries: copy the Playtest 001 structure — profile,
overall read, numbered findings (verbatim quote or faithful paraphrase +
interpretation + change + status), session decisions.*
