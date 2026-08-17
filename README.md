# Sprite Sprouts

A small catalog for **Stardew Valley-like sprite outlines**. AI can generate character and object outlines into this repo; you pull those files into desktop software, paint them, and push the finished sprites back to the same folders.

There is a Next.js browser so you can preview the catalog, plus JSON Schema and scripts so the files stay consistent.

## Pull this sample

The starter character is Willow, a 16×32 farmer outline:

```text
sprites/characters/willow-farmer/
  sprite.json     # grids, palette, animations — import this
  outline.svg     # idle-down picture of the same data
  notes.md
```

Clone or pull the repo, then open that folder in your local tool. `sprite.json` is the source of truth.

## How the repo is laid out

```text
sprites/                  # source of truth for desktop software
  characters/<id>/
  objects/<id>/
schemas/sprite.schema.json
src/                      # Next.js catalog (App Router)
scripts/                  # validate, scaffold, render SVG
```

Each sprite folder is one asset. Status on the JSON document is `outline`, `in-progress`, or `final`.

| Status        | Meaning                                        |
| ------------- | ---------------------------------------------- |
| `outline`     | AI (or a person) drew line work; ready to pull |
| `in-progress` | Claimed locally                                |
| `final`       | Painted work uploaded back                     |

Characters default to **16×32**. Objects default to **16×16**. Pixels are strings of palette keys: `.` is empty, `#` is the outline. Add more one-character keys when you color the sprite.

## Workflow

1. Generate or scaffold an outline (`yarn sprites:new character river-npc`).
2. Pull `sprites/<kind>/<id>/` onto your machine.
3. Edit `sprite.json` in custom software. Keep canvas size and pivot (`x,y` at the feet) unless the game needs something else.
4. Set `"status": "final"`, run `yarn sprites:render`, commit, and push.

The catalog site reads the same `sprites/` tree. Desktop tools can also hit `/api/sprites` when the app is running.

## Scripts

```bash
yarn dev                 # catalog at http://localhost:3000
yarn sprites:validate    # schema + folder/id checks
yarn sprites:render      # rewrite outline.svg from sprite.json
yarn sprites:new character my-npc
yarn lint
yarn format
yarn typecheck
yarn build
```

## Local setup

Yarn 4 via Corepack:

```bash
corepack enable
yarn install
yarn dev
```

CI runs format, lint, typecheck, sprite validation, SVG render (must stay committed), and the Next.js build.
