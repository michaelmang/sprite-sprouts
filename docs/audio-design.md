# Audio design

In most games the soundtrack decorates the mechanics. Here it _is_ the
mechanics, which imposes an unusual constraint: every piece of music in the game
must be analytically legible. If the player cannot hear the meter, the melody's
contour, or the cadence, the lesson fails.

## The governing idea: one theme, six transformations

There is a single principal theme — **the Valley Theme** — heard in full only
twice: once in act 0, played badly on a dying instrument, and once in act 7,
played by the restored Orchestrion.

Between those, each act presents the theme reduced to the element being taught:

| Act          | What the player hears of the theme                                 |
| ------------ | ------------------------------------------------------------------ |
| 1 Rhythm     | Only its rhythm, on unpitched percussion                           |
| 2 Melody     | Only its melodic line, unaccompanied                               |
| 3 Harmony    | Only its chord progression, no tune                                |
| 4 Tone color | Its opening phrase, played by nine different instruments           |
| 5 Texture    | Its first and second phrases played simultaneously as counterpoint |
| 6 Form       | Its full sectional layout, blocked out as A B A C A                |

This does the pedagogical work automatically. By act 7 the player has heard the
theme dissected six ways and the full statement lands as recognition rather
than novelty. It is also, structurally, a theme and variations — which is
itself act 6's lesson.

**Composition note:** write the Valley Theme first, and write it so it survives
dismemberment. It needs a rhythm distinctive enough to identify on a drum, a
contour clear enough to sing unaccompanied, a harmonization that stands alone,
and a phrase structure that blocks cleanly into sections. That is a demanding
brief and everything else depends on it.

## Adaptive layering

Each chamber's ambient music is built from stems that unlock as the player
restores elements. Enter act 4 having completed 1–3 and the underscore already
has pulse, tune, and harmony; the act adds color.

```
Stem 1  pulse        unlocked by act 1
Stem 2  bass/harmony unlocked by act 3
Stem 3  melody       unlocked by act 2
Stem 4  color/pads   unlocked by act 4
Stem 5  counterline  unlocked by act 5
Stem 6  full form    unlocked by act 6
```

Mix stems by crossfading gain, not by starting and stopping playback, so
everything stays sample-locked. The player literally hears their own progress
accumulate — the strongest possible reinforcement for a game about layers.

## Diegetic vs. underscore

Keep a hard line between them, because the game asks players to analyze what
they hear and ambiguity about _what is being analyzed_ is fatal.

- **Diegetic** (teaching material, puzzle content): dry, close, centered, no
  reverb tail. Always triggered by a visible source — a teacher, an instrument,
  the Orchestrion.
- **Underscore** (ambience): wetter, wider, quieter, and it **ducks to near
  silence whenever a lesson passage plays**. Never let the underscore compete
  with the thing the player is being asked to hear.

## Instrumentation by act

Each chamber has a distinct ensemble so the player can identify the act by ear
alone:

| Act           | Ensemble                                           |
| ------------- | -------------------------------------------------- |
| 0 Threshold   | Solo cello, sparse                                 |
| 1 Rhythm      | Frame drum, woodblock, pizzicato bass, hand claps  |
| 2 Melody      | Solo voice, then solo oboe. Nothing to hide behind |
| 3 Harmony     | Portative organ, low strings, choir pads           |
| 4 Tone color  | Full mixed chamber ensemble — the point is variety |
| 5 Texture     | Two to four equal voices, strings or recorders     |
| 6 Form        | Brass and organ, architectural and blocky          |
| 7 Orchestrion | Everything, plus mechanical noise as percussion    |

## Interactive audio requirements

These are hard technical requirements, not preferences, and they should shape
the engine choice (see `tech-plan.md`).

1. **Sample-accurate scheduling.** Rhythm exercises must schedule against the
   audio clock, never `requestAnimationFrame`. Visual gears sync _to audio_,
   not the reverse.
2. **Latency compensation.** Tap-the-pulse needs a calibration step. Offer it
   in act 1 and store the offset. Bluetooth headphones can add 150–300 ms and
   will otherwise make the whole act feel broken.
3. **Per-note playback.** Harmony and melody puzzles need arbitrary pitches on
   demand, so a sampled instrument set with pitch-shifting, not pre-rendered
   audio files per phrase.
4. **Independent stem control.** Texture work needs each voice soloable and
   mutable in real time.
5. **Tempo control.** Every teaching passage must be playable at 50–100% speed
   without pitch change. This is the single biggest accessibility win in a
   listening game.
6. **Loop points.** "Replay just this bar" must be exact and gapless.

## Source material

The game teaches Western art-music concepts, so real repertoire is tempting.
Recommendation: **write original material** rather than licensing recordings.

- Public-domain _compositions_ do not mean public-domain _recordings_. Nearly
  all commercial classical recordings are separately copyrighted.
- Purpose-written material can be constructed to isolate exactly one variable,
  which real repertoire almost never does.
- You can still gesture at the canon: an act 6 fugue "after Bach" teaches the
  form without any licensing exposure.

If you want real repertoire, record it yourself or use openly licensed
performances (Musopen, IMSLP recordings marked CC0/CC-BY) and check each
recording's license individually.

## Sound design

Non-musical audio should never be pitched arbitrarily — everything in this game
is in the same key.

- **UI ticks and clicks:** tuned to the current key's tonic and fifth.
- **The Orchestrion:** mechanical noise, air, wood, metal — recorded or
  synthesized, used as percussion in act 7.
- **Chamber ambiences:** each tuned to a drone on that chamber's tonal center.
- **Failure sound:** there isn't one. Wrong answers produce a musical
  consequence (the wrong chord, the lurching gear), never a buzzer.

## Accessibility

A game about listening owes deaf and hard-of-hearing players a real answer, and
"subtitles" is not it.

- **Every audio cue has a visual analogue** — this is already true because of
  the three-planes mechanic, and it should be treated as a requirement rather
  than a coincidence.
- **Haptic pulse** for rhythm work on supported devices.
- **Waveform and piano-roll views** available at all times on plane 3.
- **Adjustable tempo and isolated stems** help everyone, not just players with
  hearing differences.

The honest position: acts 1, 5, and 6 (rhythm, texture, form) are substantially
playable without audio. Acts 2, 3, and 4 are not fully translatable, and the
game should say so rather than pretend otherwise.

## Deliverables

| Item                       | Count           | Notes                                             |
| -------------------------- | --------------- | ------------------------------------------------- |
| Valley Theme               | 1               | Full statement, ~90 s. Write first                |
| Act ambiences              | 7               | Layered stems, 6 per act                          |
| Teaching passages          | ~60             | Short, isolated, one variable each                |
| Instrument sample set      | ~15 instruments | 2–3 velocity layers, chromatic every 3rd semitone |
| UI sound kit               | ~20             | Tuned, not arbitrary                              |
| Orchestrion mechanical kit | ~15             | Doubles as act 7 percussion                       |
