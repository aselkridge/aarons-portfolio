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

## Playtest 002 — 2026-07-20

**Player profile:** second outside playtester. Doesn't play games at all.
Played the PRE-Playtest-001-changes build (none of the P1 treatments were
live yet). Reached the table, stopped there. Feedback relayed by Aaron.

**Overall read:** independently reproduces Playtest 001's root finding (the
plan is missing), and adds a genuinely new one: the game assumes players
know that games guide you, but a non-gamer needs the interface itself to
say what to touch next. Two players, zero shared context, same wall.

### Findings

**P2.1 — At the table, still didn't know the point or objective.**
`CONFIRMS P1.12 / P1.1` No new treatment: this is the plan-before-the-table
gap (P1.12's LEARN / CHOOSE / SAY HELLO plan + tracker) and the wall beat
(P1.1), now independently reproduced by a second player on the old build.
Strong evidence those two treatments are the right priority.

**P2.2 — The select screen has no sequence.** `PROPOSED`
Player saw the name field first ("pick a name... what name? MY name?"),
typed their own name, nothing visibly happened, and only later discovered
the suit cards were clickable and required. After picking a suit: "okay,
then what?"
*Interpretation:* the screen presents three controls as equals with no
order, and the callsign label assumes context ("callsign" itself is
pilot-speak).
*Change:* the select screen becomes three numbered steps (1 PICK YOUR
SUIT, 2 TYPE ANY NAME YOU LIKE, 3 DROP TO THE SURFACE) with the current
step lit and the finished steps checked; the name field explains itself
("what should the astronaut call you? any name works"); the drop button,
when not ready, says why in plain words instead of sitting dim.

**P2.3 — Nothing ever says what to do next, anywhere.** `PROPOSED`
Player asked for the next thing to be bouncing / highlighted, and for a
reminder to appear if nothing happens for a while, all tied back to the
overarching goal.
*Change:* a game-wide "guided hand": the one control the run is waiting on
gets a soft pulse; after ~8 quiet seconds a small nudge chip appears next
to it in the astronaut's voice ("Next: pick a suit. Click one of the
cards."); the nudge names the current plan word (P1.12's tracker) so every
next step ties back to where the run is headed. Nudges never block, never
repeat once acted on, and disappear for the rest of a screen once used.

**P2.4 — At the table: "what do these mean, why are they important, how
do I use them?"** `MOSTLY COVERED BY P1.4 + P1.5, EXTENDED`
Player hit the column-meaning question at the TABLE headers, not only at
the pick menu (mood today, who they trust, etc. read as riddles).
*Change (extension):* the P1.5 hover hints ride with the columns onto the
console table itself: hovering any column header shows the same what-it-is-
for card. One set of hints, present everywhere the column appears.

**P2.5 — "Why is it a P.S.? What does that even mean for the whole
message?"** `PARTLY COVERED BY P1.3/P1.8, EXTENDED`
The seam options are labeled P.S. but the game never says what a P.S. is,
never shows the full letter, and never shows where the line lands in it.
*Change (extension):* the seam adds a one-letter preview: the shared body
everyone receives (dimmed), with YOUR line highlighted in place at the
bottom, labeled "your line rides here, at the end of every letter." Plus
one plain sentence: a P.S. is the little note under a letter, the one part
written for one person. The P1.3 colored source chips light inside that
preview, so meaning, placement, and data-source read in one glance.

**P2.6 — Hard to keep track of who is talking.** `PROPOSED`
Rival cutscenes, popups, and transmissions identify speakers with small
text only; the player lost track of who was speaking.
*Change:* every voice gets a face. Rival and Yash lines get the speaker's
sprite portrait chip (their crowd tint) plus their name in their color;
the astronaut's wrist-unit screen carries his name on the channel line
(extends P1.11); narration stays faceless on purpose, since it is nobody
speaking.

**P2.7 — "They don't know what they're learning."** `PROPOSED`
A player handed the game cold (no LinkedIn post, no context) has no idea
the run teaches anything, or what. Aaron flags the bigger question too:
how the site page frames it, and what the game is ultimately for.
*Change:* the title screen makes the promise out loud, in one human
sentence with zero course language ("One run, about ten minutes. You leave
knowing how anything new gets introduced to strangers: not by shouting at
everyone, but by choosing a few people and saying something true"), and
frames the notebook from minute one as the thing you fill and keep. The
site-page framing question stays open with Aaron.

### Ideas (vision backlog, not queued with fixes)

**I-1 — The Side Job (Aaron, 2026-07-20).** At the moment credit pressure
first lands, offer optional work: the sprite walks off the main path to
one of two mini games (left/right), earns a small capped credit amount,
rivals quietly earn too, then walks back. Real-world tieback: money buys
credits everywhere, and time is how you earn money.
*Claude's take: worth building, and not only for fun — "your rivals worked
shifts too" makes it the sharpest lesson in the game (budget is grindable
by everyone; judgment is not). Guardrails so it can't break the economy:
one shift per job, fixed small payout (~+15), offered once (right after
claygent prices land), fully optional, under a minute, mints a THE GRIND
field note. Playable 30-second proof (Scoop Catch) lives on the mockup
page, section 12.*

### Session decisions

- P2.2 + P2.3 mocked as one treatment (section 10) on the Playtest 001
  mockup page; awaiting Aaron's approval alongside the P1 set.
- P2.4 / P2.5 / P2.6 folded into mockup sections 02, 04, and 08 as
  extensions (noted inline on the page).
- P2.7 mocked as section 11 (the promise on the door). I-1 demoed as
  section 12, decision deferred to Aaron as a separate, larger build.

---

*Template for future entries: copy the Playtest 001 structure — profile,
overall read, numbered findings (verbatim quote or faithful paraphrase +
interpretation + change + status), session decisions.*
