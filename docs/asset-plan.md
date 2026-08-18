# Asset plan

Everything to produce in PixelLab, grouped by act. Nothing here has been drawn
— this is the production queue.

## Conventions

Decide these once, before generating anything, because changing them later
means regenerating everything.

| Setting                      | Recommendation                                   | Why                                                                                                |
| ---------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Object/prop tile             | **32×32**                                        | Music props carry more internal detail than farm items. 16×16 cannot show a chord stack or a clef. |
| Small icons (notes, accents) | **16×16**                                        | Read at a glance, used in dense rows.                                                              |
| Characters                   | **32×48**, 4-directional                         | Room for instruments in hand and readable faces in dialogue range.                                 |
| Portraits (dialogue)         | **64×64** or **96×96**                           | The game is dialogue-heavy; portraits carry the relationship.                                      |
| Palette                      | One shared 32–48 color palette                   | Locks visual cohesion across acts. Generate it first and feed it to PixelLab as a style reference. |
| Outline                      | Consistent dark warm outline, not black          | Matches the pixel-art convention and keeps chambers from feeling cold.                             |
| Perspective                  | Top-down 3/4 for chambers, straight-on for props | 3/4 for walkable spaces, straight-on for inventory-style props.                                    |

**Per-act tint.** Each chamber gets a dominant hue so the player always knows
which element they are in: Rhythm amber, Melody blue, Harmony deep green,
Tone color violet, Texture rose, Form stone-grey.

## Production order

1. Palette + style reference sheet (one image, feeds everything else).
2. Maestro Vela and the apprentice — characters + portraits.
3. Act 1 props (proves the pipeline end to end on the smallest act).
4. Remaining teachers.
5. Acts 2–6 props.
6. Chamber tilesets.
7. UI kit.

---

## Characters

4-directional, idle + walk minimum. Teachers also need a "demonstrate" pose
(playing their instrument) and a portrait with 3 expressions.

| ID             | Description                                            | PixelLab prompt seed                                                               |
| -------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `apprentice`   | Young apprentice, satchel, simple tunic, no instrument | "young pixel art apprentice musician, satchel, plain tunic, 4 directional sprite"  |
| `maestro-vela` | Elderly master, long coat, walking cane, white hair    | "elderly pixel art music master, long coat, cane, dignified, 4 directional sprite" |
| `toma`         | Broad percussionist, sleeves rolled, frame drum        | "pixel art percussionist with frame drum, rolled sleeves, energetic"               |
| `sable`        | Tall cantor, high collar, holds a lantern              | "pixel art singer in high-collared robe holding a lantern, severe expression"      |
| `quint`        | Organist, seated-friendly design, heavy shawl          | "pixel art organist with shawl, portative organ, warm and weathered"               |
| `bell`         | Luthier, apron, tools, spectacles                      | "pixel art luthier with leather apron and tools, spectacles, workshop"             |
| `odile`        | Weaver, wrapped in layered cloth                       | "pixel art weaver draped in layered cloth, holding a shuttle"                      |
| `feld`         | Mason, dust-covered, mallet at belt                    | "pixel art stonemason with mallet and plumb line, dusty work clothes"              |

Portraits: one per character, expressions **neutral / pleased / unconvinced**.
Vela needs a fourth: **listening** (eyes closed) for the finale.

PixelLab's `create-character-4dir` plus the animation endpoints are the right
tools here; the portrait endpoints (`portrait-character-pro`) can derive the
dialogue portraits from the same character so they stay on-model.

---

## Act 1 — Rhythm (amber)

| ID                   | Size  | Description                        | Animation            |
| -------------------- | ----- | ---------------------------------- | -------------------- |
| `pendulum`           | 32×64 | Brass pendulum, swings             | 8-frame swing loop   |
| `escapement-gear-2`  | 32×32 | Two-tooth gear, duple meter        | 4-frame rotate       |
| `escapement-gear-3`  | 32×32 | Three-tooth gear, triple meter     | 4-frame rotate       |
| `escapement-gear-4`  | 32×32 | Four-tooth gear, quadruple meter   | 4-frame rotate       |
| `beat-stone`         | 16×16 | A single beat, plain               | lit / unlit          |
| `beat-stone-split-2` | 16×16 | Beat split into eighths            | —                    |
| `beat-stone-split-3` | 16×16 | Beat split into triplets           | —                    |
| `beat-stone-split-4` | 16×16 | Beat split into sixteenths         | —                    |
| `accent-weight`      | 16×16 | Draggable accent marker            | idle / held / landed |
| `rest-token`         | 16×16 | Silence marker                     | —                    |
| `time-dial`          | 32×32 | Meter selector, 2/3/4/6            | —                    |
| `frame-drum`         | 32×32 | Toma's drum                        | 3-frame strike       |
| `metronome`          | 32×32 | Desk metronome                     | tick loop            |
| `walking-tile`       | 32×32 | Floor tile that lights on the beat | on / off             |
| `downbeat-marker`    | 16×16 | Marks beat one                     | —                    |
| `polyrhythm-axle`    | 48×32 | Two gears on one shaft             | rotate loop          |

## Act 2 — Melody (blue)

| ID                 | Size  | Description                              | Animation       |
| ------------------ | ----- | ---------------------------------------- | --------------- |
| `stair-tread`      | 32×32 | One step of the pitch stair              | lit / unlit     |
| `stair-gap-plank`  | 32×32 | Wide plank spanning a leap               | —               |
| `pitch-lantern`    | 16×16 | Hanging lantern, one per scale degree    | 3-frame glow    |
| `contour-ribbon`   | 64×32 | Drawn melodic line                       | —               |
| `motif-seed`       | 16×16 | The recurring idea                       | —               |
| `climax-flag`      | 16×32 | Marks the melodic high point             | plant animation |
| `question-bridge`  | 64×32 | Antecedent phrase bridge                 | —               |
| `answer-bridge`    | 64×32 | Consequent phrase bridge, closes the gap | —               |
| `inversion-mirror` | 32×32 | Flips a motif                            | —               |
| `sequence-arrow`   | 16×16 | Shifts a motif up/down                   | —               |
| `sable-lantern`    | 32×32 | Sable's prop                             | glow loop       |

## Act 3 — Harmony (deep green)

| ID                       | Size  | Description                          | Animation          |
| ------------------------ | ----- | ------------------------------------ | ------------------ |
| `chord-crystal-major`    | 32×32 | Bright, symmetrical stack            | pulse              |
| `chord-crystal-minor`    | 32×32 | Same form, cooler, one facet shifted | pulse              |
| `chord-crystal-dim`      | 32×32 | Compressed, unstable                 | flicker            |
| `chord-crystal-seventh`  | 32×32 | Four-tier stack                      | pulse              |
| `tonic-beacon`           | 48×48 | Home. The vault's center             | breathing glow     |
| `cadence-door-perfect`   | 48×64 | Opens cleanly                        | open animation     |
| `cadence-door-deceptive` | 48×64 | Rattles, stays shut                  | rattle animation   |
| `cadence-door-plagal`    | 48×64 | Side door, gentle                    | open animation     |
| `cadence-door-half`      | 48×64 | Half-open, unresolved                | —                  |
| `fifths-dial`            | 64×64 | Circle of fifths, rotatable          | 12-position rotate |
| `key-ring`               | 16×16 | One key signature                    | —                  |
| `tension-meter`          | 32×64 | Vertical dissonance gauge            | fill levels        |
| `suspension-weight`      | 16×16 | Held note creating tension           | —                  |
| `portative-organ`        | 48×32 | Quint's instrument                   | bellows loop       |

## Act 4 — Tone color (violet)

| ID                                           | Size  | Description                   | Animation |
| -------------------------------------------- | ----- | ----------------------------- | --------- |
| `violin`, `cello`, `double-bass`             | 32×32 | String family                 | play loop |
| `flute`, `clarinet`, `oboe`, `bassoon`       | 32×32 | Woodwind family               | play loop |
| `horn`, `trumpet`, `trombone`, `tuba`        | 32×32 | Brass family                  | play loop |
| `timpani`, `snare`, `cymbal`, `glockenspiel` | 32×32 | Percussion family             | strike    |
| `harp`, `piano`                              | 32×32 | Keyboard/plucked              | play loop |
| `instrument-rack`                            | 64×64 | Wall rack holding instruments | —         |
| `identification-screen`                      | 64×64 | Hides the sounding instrument | —         |
| `spectral-prism`                             | 32×32 | Splits a tone into its color  | shimmer   |
| `register-ladder`                            | 32×64 | Low/middle/high selector      | —         |
| `mute-token`                                 | 16×16 | Modifier                      | —         |
| `pizzicato-token`                            | 16×16 | Modifier                      | —         |
| `tremolo-token`                              | 16×16 | Modifier                      | —         |
| `bell-workbench`                             | 64×32 | Bell's bench with tools       | —         |

## Act 5 — Texture (rose)

| ID             | Size  | Description                       | Animation      |
| -------------- | ----- | --------------------------------- | -------------- |
| `loom-frame`   | 96×96 | The central loom                  | —              |
| `shuttle`      | 32×16 | Carries the weft                  | pass animation |
| `thread-spool` | 16×16 | One voice; needs 4 color variants | —              |
| `warp-grid`    | 64×64 | Vertical threads                  | —              |
| `cloth-mono`   | 32×32 | Single-thread swatch              | —              |
| `cloth-homo`   | 32×32 | Melody-and-ground swatch          | —              |
| `cloth-poly`   | 32×32 | Interwoven swatch                 | —              |
| `canon-peg`    | 16×16 | Sets entry delay                  | —              |
| `snag-marker`  | 16×16 | Voice-leading collision           | flash          |
| `odile-shears` | 32×32 | Odile's prop                      | —              |

## Act 6 — Form (stone-grey)

| ID                         | Size  | Description              | Animation        |
| -------------------------- | ----- | ------------------------ | ---------------- |
| `form-block-a`             | 32×32 | Section A                | —                |
| `form-block-b`             | 32×32 | Section B                | —                |
| `form-block-c`             | 32×32 | Section C                | —                |
| `blueprint-table`          | 64×48 | Arrangement surface      | —                |
| `fugue-arch`               | 48×48 | One entry of the subject | settle animation |
| `scaffold`                 | 64×64 | Incomplete structure     | —                |
| `keystone`                 | 32×32 | Completes an arch        | set animation    |
| `variation-stamp-rhythm`   | 16×16 | Transformation token     | —                |
| `variation-stamp-mode`     | 16×16 | Major/minor flip         | —                |
| `variation-stamp-ornament` | 16×16 | Decoration               | —                |
| `sonata-map`               | 96×96 | Walkable form diagram    | —                |
| `plumb-line`               | 16×32 | Feld's prop              | swing            |
| `mallet`                   | 32×32 | Feld's prop              | —                |

## Shared / UI

| ID                                            | Size    | Description                             |
| --------------------------------------------- | ------- | --------------------------------------- |
| `plane-lens-sensuous`                         | 32×32   | Plane 1 icon                            |
| `plane-lens-expressive`                       | 32×32   | Plane 2 icon                            |
| `plane-lens-musical`                          | 32×32   | Plane 3 icon                            |
| `orchestrion-core`                            | 128×128 | The machine's heart; six chamber lights |
| `chamber-light`                               | 16×16   | One per element, dim/lit                |
| `dialogue-frame`                              | 9-slice | Dialogue box                            |
| `button-play`, `button-replay`, `button-stop` | 16×16   | Transport controls                      |
| `note-whole` … `note-sixteenth`               | 16×16   | Note-value icons                        |
| `clef-treble`, `clef-bass`                    | 16×16   | Notation icons                          |
| `staff-line-tile`                             | 32×32   | Tiling staff background                 |
| `attention-meter`                             | 64×16   | The Orchestrion's light gauge           |

## Chamber tilesets

One tileset per chamber, ~24 tiles each: floor, wall, wall-top, three trim
variants, stairs, door, and two decorative props. PixelLab's tileset generation
is the right tool; generate all six from the same style reference so the
chambers feel like one building.

## Rough count

| Group                            | Count           |
| -------------------------------- | --------------- |
| Characters (sprites + portraits) | 8 + 8           |
| Act props                        | ~85             |
| Shared / UI                      | ~20             |
| Tilesets                         | 6 × ~24         |
| **Total**                        | **~265 assets** |

Start with the 16 act-1 props and the two act-0 characters. That is a complete
vertical slice and will tell you whether the sizes and palette hold up before
you commit to the other 240.
