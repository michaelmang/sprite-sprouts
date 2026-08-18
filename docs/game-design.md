# Game design

A single-player, non-combat game about learning to hear. The player is an
apprentice; a master musician guides them through the elements of music in the
order Aaron Copland lays them out in _What to Listen For in Music_.

Working titles: **The Long Line**, **Orchestrion**, **Apprentice Ear**.
_The Long Line_ is Copland's own phrase for the sense of continuity that carries
a listener through a piece, and it doubles as a description of the game's arc.

## Premise

The valley's music lives inside the **Orchestrion**, a vast mechanical
instrument built into the hillside by musicians who are now gone. It has fallen
silent. Its six chambers each hold one element of music, and each has seized.

Maestro Vela, the last person who heard it play, is too old to climb inside.
The apprentice is small enough, and — more importantly — teachable.

Restoring a chamber does not mean fixing a machine. It means the apprentice
demonstrating that they can _hear_ that element. The Orchestrion responds to
comprehension, not repair. This is the conceit that lets every mechanic be a
listening exercise rather than a puzzle wearing a musical costume.

## The three planes (the core lens)

Copland's opening argument is that we listen on three planes at once. This
becomes the game's central, always-available mechanic rather than a single
lesson.

The player holds one button to shift planes. The same passage of music renders
three ways:

| Plane               | Key | What the player sees                        | What it is for                                      |
| ------------------- | --- | ------------------------------------------- | --------------------------------------------------- |
| **Sensuous**        | 1   | Color, bloom, motion. No notation.          | Feeling the sound. Used for mood, timbre, dynamics. |
| **Expressive**      | 2   | Faces, gesture, scene reactions.            | Meaning and character. Used for phrasing and drama. |
| **Sheerly musical** | 3   | Notation, grid, pitch lattice, form blocks. | Structure. Used to solve.                           |

Almost every puzzle is solvable only by moving between planes: you find the
_feeling_ on plane 1, locate the _gesture_ on plane 2, and place the _note_ on
plane 3. The lesson embedded in the mechanic is Copland's actual thesis, that
the planes are not a hierarchy and the trained listener uses all three at once.

**Design rule:** never lock a plane. A player who wants to stay on plane 1 can
finish the game more slowly. Mastery is measured by moving fluidly, not by
abandoning the sensuous plane for the technical one.

## Act structure

Each act is one chamber, one element, one resident teacher, and one new verb.

| Act | Element          | Teacher              | New verb    | Chamber         |
| --- | ---------------- | -------------------- | ----------- | --------------- |
| 0   | The three planes | Maestro Vela         | **Listen**  | The Threshold   |
| 1   | Rhythm           | Toma, the timekeeper | **Pulse**   | The Escapement  |
| 2   | Melody           | Sable, the cantor    | **Trace**   | The Long Stair  |
| 3   | Harmony          | Quint, the organist  | **Stack**   | The Vault       |
| 4   | Tone color       | Bell, the luthier    | **Voice**   | The Cabinet     |
| 5   | Texture          | Odile, the weaver    | **Weave**   | The Loomworks   |
| 6   | Form             | Feld, the mason      | **Build**   | The Nave        |
| 7   | The whole        | The apprentice       | **Compose** | The Orchestrion |

Acts 1–6 can be played in order or, after act 3, in any order — but the final
act requires all six. Copland's own sequence (rhythm, melody, harmony, tone
color, then texture and form) is the recommended path and the default.

## Core loop

Every lesson, at every layer, runs the same four beats:

1. **Hear it.** The teacher plays a phrase. No task, no timer. The player can
   replay forever. This is deliberate: the game should never punish listening.
2. **Find it.** The player identifies the element in what they just heard —
   tap the pulse, trace the contour, name the chord quality. Low stakes,
   instant feedback, retryable.
3. **Change it.** The player alters one parameter and hears the consequence.
   Displace the accent. Invert the contour. Swap major for minor. This is where
   understanding actually forms, because the player hears cause and effect.
4. **Make it.** A short open-ended commission with a constraint. "Write eight
   bars that arrive somewhere." Graded on constraints met, never on taste.

The fourth beat is the one that matters and the one most music games skip.

## Progression and failure

There is no fail state and no score. The apprentice cannot die, run out of
time, or lose progress.

- **Feedback is diegetic.** A wrong answer is a wrong sound, and the teacher
  reacts to it in character. The Orchestrion sputters rather than buzzing.
- **Difficulty is opt-in.** Each lesson has a "harder ear" variant the player
  may request. Toma will always offer to take the click track away.
- **Progress is a growing piece.** The player's own composition accumulates
  across the game; each act contributes a layer to it. By the finale the player
  performs something they built over the whole arc.

The single "resource" is **attention**, shown as the Orchestrion's light. It
grows when the player listens fully before answering, which quietly rewards
patience over guessing.

## The arc

**Act 0 — The Threshold.** The apprentice arrives expecting to be taught to
play. Vela instead makes them sit and listen to a single sustained note until
they can describe three different things about it. Establishes the planes, the
tone, and the fact that this game is about the ear.

**Acts 1–3 — The fundamentals.** Rhythm, melody, harmony. The apprentice is
competent and increasingly cocky. Toma is delighted by them; Sable is not.
Around act 3 the apprentice writes something technically correct and completely
lifeless, and Quint says so.

**The turn.** Vela reveals the Orchestrion did not fall silent from disrepair.
The last generation of musicians grew so expert that they only listened on the
third plane — they analyzed and stopped feeling. The machine, which responds to
comprehension, could no longer find any. This reframes every mechanic: the
player's plane-switching habit was never a convenience, it was the point.

**Acts 4–6 — The craft.** Tone color, texture, form. Larger, more expressive
work. The apprentice starts making choices Vela did not teach them.

**Act 7 — The Orchestrion.** The apprentice composes for the machine. Vela does
not supervise. The final sequence is Copland's closing chapter made literal:
the apprentice is composer, the Orchestrion is interpreter, and Vela — for the
first time in the game — is only a listener.

## Cast

| Character          | Role                                               | Voice                                                                                                                                                     |
| ------------------ | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **The apprentice** | Player. Default name Rill; renameable.             | Curious, impatient, funny when nervous. Speaks in questions.                                                                                              |
| **Maestro Vela**   | Master musician. Former keeper of the Orchestrion. | Patient, concrete, allergic to mysticism. Explains music with physical images: water, walking, masonry. Never says "you'll understand when you're older." |
| **Toma**           | Timekeeper. Rhythm.                                | Loud, physical, generous. Teaches with the body — clapping, stamping, walking.                                                                            |
| **Sable**          | Cantor. Melody.                                    | Exacting and dry. Withholds praise. The first character to tell the apprentice something is bad.                                                          |
| **Quint**          | Organist. Harmony.                                 | Warm, structural, a little sad. Talks about chords as places you can be homesick for.                                                                     |
| **Bell**           | Luthier. Tone color.                               | Tinkerer. Talks about instruments as personalities with grudges.                                                                                          |
| **Odile**          | Weaver. Texture.                                   | Speaks almost entirely in cloth metaphors, and is right every time.                                                                                       |
| **Feld**           | Mason. Form.                                       | Blunt, architectural. Thinks in load-bearing walls and doorways.                                                                                          |

Vela is the only character present in every act. The others appear in their own
chamber and return for the finale as the audience.

## What this game is not

Worth stating, because it shapes every decision:

- **Not a rhythm game.** Timing accuracy is a tool in act 1, not the game.
- **Not notation training.** The staff is one of three views, introduced late,
  and never required to finish a lesson.
- **Not a DAW.** Composition tools are deliberately constrained. Eight bars,
  a handful of choices, one clear question per commission.
- **Not gated on musical background.** A player who has never read music should
  finish. A trained musician should still find the act 5 and 6 commissions
  interesting.

## Open questions

- Does the apprentice have a voice, or are they silent with dialogue choices?
  Recommendation: they speak. The relationship carries the game and a silent
  protagonist weakens it.
- Are the six acts gated or open after act 3? Recommendation: open, with a
  strong suggested order, because Copland's own book is read that way.
- How long? Target 4–6 hours. Each act is roughly 30–45 minutes of lesson plus
  a 10-minute commission.
