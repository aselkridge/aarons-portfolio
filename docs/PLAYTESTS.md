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
designed, mockup awaiting Aaron's approval · `APPROVED <date>` build
greenlit · `SHIPPED` live · `WONTFIX` deliberate, with reasoning.

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

**P1.1 — The table felt overwhelming on first sight.** `SHIPPED 2026-07-21`
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
under-highlighted.** `SHIPPED 2026-07-21`
Player enjoyed seeing rivals do poorly but couldn't tell WHY each one
failed, and asked for the comparison to be highlighted more overall.
*Change:* the debrief pauses on MEANWHILE, ON THE FAR SIDE — the rival
cards sweep in one by one with a glow so the moment lands — then each card
gets a hover / tap reveal that diagnoses the strategy in one breath
(Jordan: one loud broadcast, compared notes; Natalie: flawless machine
notes with no person inside; Adam: perfect table, zero sends), each tied
back to the matching insight.

**P1.3 — Hard to know which citizen info mattered for the flyer.** `SHIPPED 2026-07-21`
Reading names/rows, the player couldn't tell what to carry forward into the
writing step.
*Change:* make the data-to-words thread visible at the seam: every filled
blank in the line templates gets a colored chip traced to the column it came
from (hover shows source + what it cost). The words literally light up with
where they came from.

**P1.4 — Column picking: unclear what to pick or why.** `SHIPPED 2026-07-21`
*Interpretation:* deciding what's worth knowing IS the craft being taught,
so we don't hand over answers — we hand over the question.
*Change:* a tieback banner above the column menu ("a column earns its place
two ways: it helps you choose WHO to visit, or gives you something real to
SAY at the door") + significant-moment popups in the tutorial style at the
four biggest decisions of the run — first console open, the group gate,
locking columns, and right before the send — so guidance travels with the
player instead of ending at the start.

**P1.5 — The free-column hover hint was loved; wants hints on the rest.**
`SHIPPED 2026-07-21` *Change:* every column gets a hover hint written as a heuristic,
not an answer — what the column is FOR and one honest caution (e.g. mood:
"changes by the hour; by the time you knock, it already happened"). The
trap columns keep their existing reveal.

**P1.6 — The ending didn't feel like an ending.** `SHIPPED 2026-07-21`
The in-person goodbye + debrief buttons weren't enough signal that the game
was complete.
*Change:* a full celebration finale after the goodbye — fireworks over the
town, the crowd out with the first scoops, a big RUN COMPLETE moment, then
clear buttons (see your debrief / run it again / back to AlphaForge).

**P1.7 — Credit tracking lagged the action.** `SHIPPED 2026-07-21`
Credits visibly changed later than the choice that spent them.
*Change:* the credit meter reacts the instant a column is picked or dropped —
rolling number animation, a spend flash on paid picks, a distinct FREE flash
(with "the survey already paid") on free picks, and a live projected line
("this run: 30 · leaves you 25") before committing.

**P1.8 — Column choices didn't visibly connect to the flyer writing.**
`SHIPPED 2026-07-21` Same thread as P1.3, seen from the picking side.
*Change:* covered by the P1.3 seam treatment + the P1.4 banner language, so
the promise ("this will become words at the door") is made at pick time and
kept at write time.

**P1.9 — Didn't realize more than one group could be kept.** `SHIPPED 2026-07-21`
Player kept only The Traditionalists, believing the choice was one-of-three.
The multi-select exists mechanically but nothing announces it.
*Change:* the gate states the rule in plain words ("keep one group, keep
two, keep all three"), cards become visible keep-toggles with checkbox
marks, and a live count ("KEEPING 14 OF 24") shows the list growing as
groups are added. (House note: we never say "segments" in game voice.)

**P1.10 — Group names appear from nowhere.** `SHIPPED 2026-07-21`
The Curious / The Traditionalists / The Quiet Ones are never explained.
*Interpretation:* keep it simple — no new grouping mechanic. The groups
were always the astronaut's read of his neighbors; the fix is him saying
so.
*Change:* one beat before the gate: the astronaut's log ("two years and a
radio... I wrote three names in my log"), each name defined in a breath,
closed with "those are my notes, not rules." Shares a treatment with P1.9.

**P1.11 — Transmission device needs beauty + a crystal-clear split from
in-person speech.** `SHIPPED 2026-07-21` (Raised by Aaron on reviewing the same
session.)
*Change:* radio lines arrive inside a drawn wrist unit (metal bezel,
channel line, blinking signal bars, waveform, scanline shimmer over
glowing text); in-person lines get a portrait chip and a clean open plate
with no device chrome; narration stays bare. Three voices, three
unmistakable looks.

**P1.12 — The player never knew the plan, so the table came from nowhere.**
`SHIPPED 2026-07-21` (Best insight of the session, per Aaron.) The player knew the
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

**P2.2 — The select screen has no sequence.** `SHIPPED 2026-07-21`
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

**P2.3 — Nothing ever says what to do next, anywhere.** `SHIPPED 2026-07-21`
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

**P2.6 — Hard to keep track of who is talking.** `SHIPPED 2026-07-21`
Rival cutscenes, popups, and transmissions identify speakers with small
text only; the player lost track of who was speaking.
*Change:* every voice gets a face. Rival and Yash lines get the speaker's
sprite portrait chip (their crowd tint) plus their name in their color;
the astronaut's wrist-unit screen carries his name on the channel line
(extends P1.11); narration stays faceless on purpose, since it is nobody
speaking.

**P2.7 — "They don't know what they're learning."** `SHIPPED 2026-07-21`
A player handed the game cold (no LinkedIn post, no context) has no idea
the run teaches anything, or what. Aaron flags the bigger question too:
how the site page frames it, and what the game is ultimately for.
*Change:* the title screen makes the promise out loud, in one human
sentence with zero course language ("One run, about ten minutes. You leave
knowing how anything new gets introduced to strangers: not by shouting at
everyone, but by choosing a few people and saying something true"), and
frames the notebook from minute one as the thing you fill and keep. The
site-page framing question stays open with Aaron.

**P2.8 — Mid-conversation, there is no way back.** `SHIPPED 2026-07-21`
A missed line cannot be reread; dialogue only moves forward. On a learning
platform a missed line is a missed lesson.
*Change:* words never disappear, two ways. (1) The conversation window
keeps every line of the current scene, scrollable, earlier lines dimmed
but readable. (2) The notebook grows a LOG page holding the run's full
transcript, scene by scene, re-readable at any point, even stations later.
Forward flow unchanged; the BACK travel button keeps its current job.

**P2.9 — "Notice the price tag, nothing." Player: "WHAT price tag?"**
`SHIPPED 2026-07-21, direction A+B+D`
Aaron's ruling on the candidates: A (price tags on everything) and B (the
pointing rule) approved, PLUS D (the itemized mini receipt on the meter).
C (rewriting lines down to match the screen) is REJECTED as a step
backwards, now a standing principle: the language never steps down to
match the screen; the screen steps up to meet the language. The astronaut's free-survey line references a price tag,
but nothing on screen wears one; the player searched the table for a
literal tag, found nothing, and lost the thread ("what money? where?").
*Root cause:* the economy lives in words and in the credit meter, but not
ON the objects. Narration gestures at UI that does not exist. This is a
class of bug, not a single line.
*Candidate fixes (Aaron iterating):* (A) literal price tags on everything
buyable or free (0 CR in green, 15 CR in amber) so money is always
visible; (B) a pointing system: any line that references something on
screen makes that something glow while the words type; (C) rewrite lines
to only reference what exists; (D) an itemized mini receipt on the meter.
Claude recommends A+B as one rule: nothing is referenced unless it is
visible, and when referenced, it lights up. Not mocked yet.

**P2.10 — Players can't tell a good result from a bad one.** `SHIPPED 2026-07-21`
A player with four replies from nine sent said "I don't think I did very
good." (Positive note, same session: the quiet-ones + public-statements
null moment LANDED — "oh, because they're quiet" — the designed lesson
firing exactly as intended, INSIGHTS 'zero' already covers it.)
*Interpretation:* the game scores runs but never calibrates them. Without
a ruler, real wins read as losses, and zero reads as pure defeat.
*Change:* THE MEASURING STICK opens the debrief results: a scale in plain
words (the wide world: 1 in 25 · a good day: 1 in 10 · a warm referral:
1 in 3) with the player's run glowing on it. Zero runs get their own
honest ruler (zero still bought you knowledge nobody learns free). RUN IT
AGAIN grows a challenge voice: different groups, columns, line, see how
many you can reach now. Mocked as section 14. Already built and confirmed
working, for the record: insights recap headlines the debrief, the silent
run gets WHY NOBODY WROTE BACK, and RUN IT AGAIN exists.

**P2.11 — "A knock on the door" and "make the cut" read as riddles.**
`SHIPPED 2026-07-21` Player at the full-table moment: "what does a knock on the door
mean? I must have missed that." And on the gate button: "make the cut, in
a good way or bad way? Did somebody get cut?" The run's biggest decision
is carried by two sales-floor idioms.
*Interpretation:* one rule, two homes. Anything the player must ACT on
gets literal words; the trade's slang moves to a decoder shelf where the
curious can still learn it, each entry tagged as sales-floor talk. Aaron's
principle: simple and straightforward everywhere, but never shutting
players off from learning the real vocabulary.
*Change:* (a) path rewrites: "who actually gets a knock on the door?"
becomes "out of all these neighbors, who should we actually go visit?";
MAKE THE CUT becomes KEEP MY LIST with "everyone else steps out of the
run, kindly and for free" beneath it; full idiom sweep of every
player-facing action line at build time. (b) THE DECODER: a new shelf in
the notebook's definitions for the slang itself: a knock on the door,
making the cut, the gate, a cold call (the game's own title, decoded),
segments. Mocked as section 16.

**P2.12 — The columns don't feel connected to ice cream.** `SHIPPED 2026-07-21`
(Raised by Aaron reviewing the sessions.) The data reads as generic
research; the mission doesn't shine through it. "Do they like cold
things", "seems to like desserts" would connect instantly. Some columns
may stay blatantly silly on purpose (the mood one).
*Interpretation:* a content rule, THE ICE CREAM TEST: every column must
answer "what does this have to do with ice cream?" in one breath, or wear
its silliness openly. Mechanics, prices, and the fragile-data trap stay
untouched.
*Change:* re-skin the menu and every citizen's answers: family size hints
as "more spoons at the table", distance as "ice cream travels badly,
closer doors get colder scoops", secret wish becomes "what dessert they
dream of", public statements becomes "what they say about off-world
food"; mood stays as the honest silly one. ONE new column proposed, SWEET
TOOTH (do they already love sweet things), which is a real mechanical
addition and needs a small scoring balance pass + playtest-suite update
before shipping. Mocked as section 17.

### Ideas (vision backlog, not queued with fixes)

**F-1 — The Feedback Door (Aaron, 2026-07-20).** In-game feedback capture
at the bottom of the debrief. Mechanism (works on the static site, no
server): Aaron creates a Google Form (auto-linked to a Google Sheet);
the game adds a styled door that opens the form in a new tab with the
run's numbers pre-filled via the form's URL parameters (sent, replies,
credits left, suit), so every Sheet row arrives with its play data.
Five suggested questions live in mockup section 15. `SHIPPED 2026-07-21`:
Aaron built the form (8 questions, one required); the door prefills the
run string into the RUN DATA field (entry.600648468) and opens in a new
tab from the debrief.

**F-3 — Ship parking spot (Aaron, 2026-07-20).** `SHIPPED 2026-07-21` Keep the Swordfish's
clean vector style as is, but move the parked ships' anchor so they sit on
open ground in both themes instead of appearing to rest on a building.
Layout-only fix, queued with the build.

**F-4 — Outer framing copy (Aaron: all three).** The game is positioned
everywhere it appears outside itself (AlphaForge briefing window, deck
card, share description, suggested LinkedIn blurb) as all three at once:
proof of Aaron's GTM craft, a free ten-minute lesson, and a signal to
people who might hire or build with him. Claude mocks the copy; Aaron
approves before it ships.

**I-2 SPEC LOCKED — 2026-07-21, `SHIPPED 2026-07-21` the Delivery Dash v1 (Aaron's polish
round applied).** Course: 10 shuffled district segments (5 strips x2, no
immediate repeats) + shop street finish, ~70s par. Seams: road alignment
+ junction-post overlays cut from the strips + sky equalization. Arcade:
scanlines/CRT vignette, READY GO countdown, district plates, synth SFX,
letter grade by crate coldness. Score: crate of 20 scoops, melt meter IS
the score, survivors bank as credits capped +15 (overflow = Gunmy's tip
jar, flavor only). Ghost: Jordan as faint red pace-runner, HUD gap, +3
for beating him. No elevated platforms in v1 (stacked-crate high road
reserved for v2). One powerup: COLD SNAP (freezes melt 3s). Random cameo
1-in-3: shop window flickers SEE YOU SPACE COWBOY (bebop) / GO SLOW, GO
SMOOTH (expanse). HUD: melt+scoops, clock+ghost gap, sprinkles, district,
suit-perk badge. Suit powers: Dash (Pilot float, Engineer insulated
crate, Ronin one forgiveness, Off-Duty +3 sprinkles, Volunteer +1 tip);
Catch (Pilot slow powerups, Engineer wide tray, Ronin one rock free,
Off-Duty opening shower, Volunteer +1). Glue: job board fork, walk-off/
walk-back, SHIFT BANKED return toast, THE GRIND field note on first job.

**E-1 `SHIPPED 2026-07-21` — End-screen sign-off panels, every theme (Aaron: "gold, fits my
whole thing").** After the finale fireworks settle, a themed sign-off
panel: bebop = Aaron's sourced SEE YOU SPACE COWBOY painting used whole;
expanse = composed galaxy crop with "GO SLOW. GO SMOOTH. GO SWEET."
(Claude's proposed line, Aaron may veto).

**F-2 — The Volunteer, a fifth suit pick (Aaron, 2026-07-20).** `SHIPPED 2026-07-21` The
generic crowd suit becomes pickable at the start as THE VOLUNTEER: dressed
like the town, read as one of their own. Zero new art, small build.

**I-2 — The Delivery Dash, second side job (Aaron, 2026-07-20).** `SHIPPED 2026-07-21` (v1 spec above)
Auto-running side scroller: sprint the cold crate from the crash site to
Gunmy's Store, spacebar-only jumps, platforms with a fast risky high road
and a safe slow low road, STILL enemies that restart you with the clock
(the melt meter) still ticking, goo/gravel slowdowns, sprinkles on risky
lines, one COLD SNAP powerup, Jordan's pace as a beatable ghost (+3),
pay = scoops that survive the melt, best run pays, capped. Spec on mockup
page section 18; playable demo on Aaron's go.

**I-3 — Suits with consequences (Aaron, 2026-07-20; brainstorm).** `SHIPPED 2026-07-21` (A+B)
Rule: flavor everywhere, powers only where credits are capped, so the main
run's lesson stays fair. (A) Banter skin: per-suit rival greetings,
wrist-unit asides, debrief sign-offs. (B) Side-job perks: Pilot floaty
jump in the Dash, Engineer wider catch tray, Ronin one enemy-forgiveness
per run, Off-Duty opens each shift with a scoop shower, Volunteer +1
credit per job (the town tips its own). (C, someday) suit-flavored citizen
reactions. Claude recommends A+B. Section 19.

**ART DECISIONS — 2026-07-21, Aaron's picks locked:**
Astronaut = Pair A (weathered veteran, full1 + wave2). Dash runners = all
six, suit-matched; pilot slot uses run5 only (run4 unused spare). Course =
five distinct district strips chained (station strip was a duplicate,
used once) ending at the batch-1 shop street; sky-gpt far layer. Gunmy =
shop3 (alien in his own doorway with OPEN sign; sets town canon as alien,
accepted). Props: crate1, crab2, goat2, goo3, mcrate4, rock5, cone1,
sundae2. Main-game skies (top space band of The Coldest Call): both
approved CROPPED TO SKY ONLY (bebop's baked-in train/desert/caption cut;
caption panel reserved for a possible end-screen easter egg). Full-course
demo delivered and approved flow: crash site districts to Gunmy's door.

**A-1 — Art request: the astronaut himself (RESOLVED: Pair A).** No sprite exists for
the astronaut; he appears only as a drawn portrait chip. Two images to
source in the same style as the 21-sprite batch (prompts on mockup page
section 19): full body weathered suit with antenna backpack, and a wave
pose holding a cone for the finale.

**I-1 — The Side Job (Aaron, 2026-07-20).** `SHIPPED 2026-07-21` (Scoop Catch v2 + Delivery Dash) At the moment credit pressure
first lands, offer optional work: the sprite walks off the main path to
one of two mini games (left/right), earns a small capped credit amount,
rivals quietly earn too, then walks back. Real-world tieback: money buys
credits everywhere, and time is how you earn money.
*Claude's take: worth building, and not only for fun — "your rivals worked
shifts too" makes it the sharpest lesson in the game (budget is grindable
by everyone; judgment is not). Guardrails so it can't break the economy:
one shift per job, fixed small payout (~+15), offered once (right after
claygent prices land), fully optional, under a minute, mints a THE GRIND
field note. Playable proof (Scoop Catch) lives on the mockup
page, section 12.*
*V2 (Aaron's notes, 2026-07-20, applied to the playable): 45 seconds,
tutorial card, arcade frame with big score + best, catch pop feedback,
rare moon rocks at minus 2, two labeled fast-falling powerups (snowflake
slow-time, sundae scoop-shower), roughly a third fewer standard scoops,
replay any time with only the best shift paying, unlabeled sparkles
removed.*

### Session decisions

- **2026-07-20, Aaron: "YES YES YES to EVERYTHING."** All treatments
  (sections 01-17), Scoop Catch v2, the Delivery Dash (I-2), suit impacts
  A+B (I-3), the Volunteer (F-2), and the sweet tooth column (with balance
  pass) are APPROVED for build. P2.9 approved on direction A+B (price tags
  everywhere + the pointing rule). Build order: art-independent treatments
  first, art-dependent pieces as assets land. Still open: F-1 Google Form
  (Aaron creates + sends link), site-page framing (P2.7's outer question),
  and the art requests list.
- P2.2 + P2.3 mocked as one treatment (section 10) on the Playtest 001
  mockup page; awaiting Aaron's approval alongside the P1 set.
- P2.4 / P2.5 / P2.6 folded into mockup sections 02, 04, and 08 as
  extensions (noted inline on the page).
- P2.7 mocked as section 11 (the promise on the door). I-1 demoed as
  section 12, decision deferred to Aaron as a separate, larger build.
- P2.8 mocked as section 13 (the rewind: scrollback + notebook LOG).

---

*Template for future entries: copy the Playtest 001 structure — profile,
overall read, numbered findings (verbatim quote or faithful paraphrase +
interpretation + change + status), session decisions.*
