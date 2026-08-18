# Technical plan

Goal: a browser-playable game you can run locally after every change, built on
the stack already in this repository, with PixelLab as the art source.

## Stack recommendation

| Layer       | Choice                                     | Why                                                                                                                                                |
| ----------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shell       | **Next.js 16 + TypeScript** (already here) | The asset catalog, design docs, and game ship from one repo and one dev server. Deploys anywhere.                                                  |
| Rendering   | **Phaser 3** at `/play`                    | Scenes, sprite sheets, animation, input, and tilemaps out of the box. Written for exactly this kind of 2D game.                                    |
| Audio       | **Tone.js** + **@tonejs/midi**             | Sample-accurate scheduling on the Web Audio clock, tempo control, per-note sampled instruments. Do **not** use Phaser's audio for musical content. |
| State       | **Zustand**                                | Progress, flags, and the player's composition. Small and serializable.                                                                             |
| Lesson flow | **XState**                                 | Lessons are state machines (hear → find → change → make) with retries and branches. Worth the dependency by act 3.                                 |
| Persistence | `localStorage` first, file export later    | The player's composition should be exportable as MIDI.                                                                                             |
| Testing     | **Vitest**                                 | Musical logic (interval math, cadence detection, form validation) is pure and very testable.                                                       |

### Why Phaser rather than the alternatives

- **PixiJS**: excellent renderer, but you would rebuild scene management, input,
  and animation yourself.
- **React + DOM/Canvas**: fine for the puzzle UIs, painful for a walkable
  chamber with characters.
- **Godot 4**: the better engine in the abstract, and it exports to web. But it
  leaves this repo's stack, splits your tooling, and complicates the PixelLab
  import you already want automated. Choose it only if you decide the game
  should ship natively.

Practical hybrid, and the one to build: **Phaser owns the world** (chambers,
characters, movement, props) and **React owns the panels** (dialogue, notation,
loom, blueprint table) rendered above the canvas. Phaser emits events; React
listens. This gets you real UI controls for the musical puzzles without
reinventing them in canvas.

### The audio rule that governs everything

Musical timing must run on the Web Audio clock. Schedule with
`Tone.Transport`, and drive the visuals from audio time:

```ts
// Right: visuals follow audio.
Tone.Transport.scheduleRepeat((time) => {
  Tone.Draw.schedule(() => gear.advance(), time);
}, "4n");
```

Never schedule musical events in Phaser's update loop or `setInterval`. Frame
timing drifts and act 1 will feel broken in a way that is very hard to diagnose
later.

Add a **latency calibration** step in act 1: play a click, have the player tap,
take the median offset, store it, subtract it from all subsequent input.

## Repository layout

Extends what is already here rather than replacing it.

```text
docs/                  design, asset, audio, dialogue, and build plans
sprites/               PixelLab output, committed as the asset catalog
  characters/<id>/
  objects/<id>/
schemas/               sprite document schema
scripts/               validate, audit, render, and (next) pixellab import
src/
  app/                 Next.js routes
    page.tsx           asset catalog
    play/              the game shell
  game/                Phaser scenes and systems
    scenes/            boot, chamber-rhythm, chamber-melody, ...
    systems/           audio, input, progress
    lessons/           one state machine per lesson
  music/               theory primitives (intervals, chords, cadences, form)
  ui/                  React panels rendered over the canvas
  lib/                 catalog + schema (existing)
public/
  audio/               stems, samples, teaching passages
  atlas/               packed texture atlases built from sprites/
```

`src/music/` is worth calling out: keep interval arithmetic, chord
identification, cadence detection, and form validation as **pure functions with
no audio or rendering dependencies**. They are the part of this codebase most
likely to be wrong and easiest to unit test.

## PixelLab integration

The API is at `https://api.pixellab.ai/v2` with bearer-token auth. Docs:
<https://api.pixellab.ai/v2/docs>, and a machine-readable summary at
<https://api.pixellab.ai/v2/llms.txt>. There is also a Python SDK and a remote
MCP server at `https://api.pixellab.ai/mcp`.

Endpoints most relevant here:

| Need                                 | Endpoint                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------ |
| Props and items                      | `POST /v2/generate-image-v2` (or `create-image-pixflux` for style knobs) |
| Style consistency across ~265 assets | `POST /v2/generate-with-style-v2` with reference images                  |
| Character sprites                    | `POST /v2/create-character-4dir`                                         |
| Rotations from a reference           | `POST /v2/generate-8-rotations-v2`                                       |
| Dialogue portraits                   | `POST /v2/characters/{character_id}/portrait`                            |
| Cleanup                              | `POST /v2/remove-background`, `POST /v2/resize`                          |
| UI elements                          | `POST /v2/generate-ui-v2`                                                |

### Two workflows, and when to use each

**Authoring in the PixelLab app (your stated preference).** Export PNGs, drop
them into `sprites/<kind>/<id>/`, run the import script to write metadata and
previews. No API key needed. This should be the default.

**Automated generation (`scripts/pixellab-import.ts`, to build).** Reads a
manifest of assets to produce, calls the API, writes results into `sprites/`.
Useful for bulk work like the ~85 props, and for regenerating a whole act after
a palette change. Keep the token in `PIXELLAB_API_TOKEN` and never commit it.

```bash
# sketch of the intended interface
yarn sprites:import --from-manifest docs/asset-plan.md --act 1
yarn sprites:import --id pendulum --prompt "brass pendulum, amber, 32x64"
```

Because generation costs money and is non-deterministic, the import script
should **never** run in CI and should refuse to overwrite an existing sprite
without `--force`.

### Schema change this requires

The current `sprite.json` stores a pixel grid, which suited generated line art.
PixelLab produces PNGs, so the schema needs an image-backed variant:

```jsonc
{
  "schemaVersion": 2,
  "id": "pendulum",
  "name": "Pendulum",
  "kind": "object",
  "status": "final",
  "source": { "tool": "pixellab", "prompt": "brass pendulum, amber" },
  "image": "sheet.png", // replaces `frames[].pixels`
  "frameSize": { "width": 32, "height": 64 },
  "frames": { "swing": { "start": 0, "count": 8 } },
  "animations": [{ "id": "swing", "frameMs": 120, "frames": "swing" }],
}
```

Keep the grid variant valid (`schemaVersion: 1`) so nothing has to be migrated;
validate on the discriminator. The catalog page then renders either the SVG it
generates from a grid or the PNG directly.

### Atlas build

Phaser wants packed atlases, not 265 loose PNGs. Add a build step using
`free-tex-packer-core` that packs `sprites/**/sheet.png` into
`public/atlas/<act>.png` + `.json`. Run it in `prebuild` so the atlas is never
stale.

## Build order

Each milestone ends with something you can actually play.

**M0 — Shell.** Next.js route at `/play`, Phaser boots, a chamber tilemap
renders, the apprentice walks. No audio. _You can walk around._

**M1 — Audio spine.** Tone.js, transport, sampled instrument, latency
calibration, the Valley Theme playing. Plane-switching implemented as three
visual treatments. _You can listen and switch planes._

**M2 — Act 1 vertical slice.** All five rhythm mechanics, Toma's dialogue,
the commission, and the first Orchestrion chamber lighting. This is the real
test of the whole design; if act 1 is not enjoyable, the format is wrong and
it is cheap to find out now. _You can finish an act._

**M3 — Dialogue system.** YAML scripts, portraits, branching, audio-aware
lines. Retrofit act 1 onto it.

**M4 — Acts 2 and 3.** Melody and harmony. These share the most machinery
(pitch, intervals, playback), so build them together.

**M5 — Progress and composition.** The accumulating piece, save/load, MIDI
export.

**M6 — Acts 4, 5, 6.** Tone color, texture, form.

**M7 — Act 7 and the ending.** Final commission, orchestrated playback, the
teachers' responses.

**M8 — Polish.** Accessibility pass (tempo control, stem isolation, haptics),
settings, credits.

Milestones M0–M2 are the ones that de-risk the project. Everything after M2 is
content production against a proven format.

## Deployment

- **Local:** `yarn dev` — the catalog at `/`, the game at `/play`.
- **Hosted:** Vercel handles Next.js natively; the game is static assets plus
  client-side code, so it deploys with no server work.
- **Audio size:** sample libraries get large. Load per-act, use compressed
  formats (Ogg/AAC ~128 kbps for stems, keep WAV only for short percussive
  samples), and lazy-load each chamber's audio on entry.

## Things that will bite you

Listed because each one is cheaper to plan for than to discover:

1. **AudioContext starts suspended.** Every browser requires a user gesture.
   Put a "press to begin" gate in front of the game and resume the context
   there.
2. **Bluetooth latency** makes rhythm work feel wrong. Calibration is not
   optional.
3. **Sample loading time.** Preload the act's instruments during the dialogue
   that precedes the lesson.
4. **Pixel-art scaling.** Set `pixelArt: true` in Phaser and use integer scale
   factors, or your PixelLab art will shimmer.
5. **Mobile.** A tap-the-pulse game is good on touch; a drag-the-loom game is
   not. Decide the target early — the recommendation is desktop first.
6. **Musical correctness.** Cadence and interval logic is easy to get subtly
   wrong. Unit-test `src/music/` against known examples from the start.
