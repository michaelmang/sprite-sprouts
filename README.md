# Sprite Sprouts

A small catalog for **Stardew Valley-like sprite outlines**. AI can generate character and object outlines into this repo; you pull those files into desktop software, paint them, and push the finished sprites back to the same folders.

There is a Next.js browser so you can preview the catalog, plus JSON Schema and scripts so the files stay consistent.

## Pull this sample

The starter farmer is Willow, plus a full valley catalog of townsfolk, animals, tools, crops, and items:

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
yarn sprites:audit       # duplicate, density, and silhouette checks
yarn sprites:render      # rewrite outline.svg from sprite.json
yarn sprites:catalog      # regenerate the valley outline set
yarn lint
yarn format
yarn typecheck
yarn build
```

## Local setup

This repo pins **Yarn 4.10.3** in `package.json` (`packageManager`). A globally installed Yarn 1.22.x will fail with:

> This project's package.json defines "packageManager": "yarn@4.10.3". However the current global version of Yarn is 1.22.22.

Enable [Corepack](https://yarnpkg.com/corepack) so `yarn` is the pinned version:

```bash
corepack enable
corepack prepare yarn@4.10.3 --activate
yarn --version   # 4.10.3
yarn install
yarn dev
```

If `yarn --version` is still 1.x, the old binary is ahead of Corepack on `PATH`. Use `corepack yarn install`, or remove the global Yarn 1 install (`npm uninstall -g yarn`).

CI runs format, lint, typecheck, sprite validation, SVG render (must stay committed), and the Next.js build.
