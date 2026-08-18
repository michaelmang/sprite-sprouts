# Sprite Sprouts

Design documents and the sprite catalog for a game about learning to hear.

An apprentice is guided by a master musician through the elements of music
composition, following the order Aaron Copland lays out in _What to Listen For
in Music_: rhythm, melody, harmony, tone color, texture, and form.

Sprites are authored in [PixelLab](https://www.pixellab.ai/) and committed
here, so the art, the design, and the game all move together.

## Docs

Start here — this is the substance of the project right now.

| Document                                                   | Contents                                                                    |
| ---------------------------------------------------------- | --------------------------------------------------------------------------- |
| [`docs/game-design.md`](docs/game-design.md)               | Premise, the three-planes lens, act structure, core loop, cast, story arc   |
| [`docs/mechanics-by-layer.md`](docs/mechanics-by-layer.md) | The mechanics for each element, act by act, with commissions and prop lists |
| [`docs/asset-plan.md`](docs/asset-plan.md)                 | Every sprite to produce in PixelLab, with sizes and prompt seeds            |
| [`docs/audio-design.md`](docs/audio-design.md)             | Soundtrack architecture, adaptive layering, interactive audio requirements  |
| [`docs/dialogue.md`](docs/dialogue.md)                     | Sample scripts, character voices, and the dialogue data format              |
| [`docs/tech-plan.md`](docs/tech-plan.md)                   | Stack, repository layout, PixelLab API integration, build milestones        |

## The catalog

`sprites/` is the asset catalog and is currently empty, ready for PixelLab
output. Each asset is a folder:

```text
sprites/
  characters/<id>/
    sprite.json     # metadata, palette, animations
    preview.svg     # generated preview
    notes.md        # optional art notes
  objects/<id>/
    ...same files
```

The Next.js app browses whatever is in that tree, grouped by category, with a
JSON API at `/api/sprites` for tooling.

See [`sprites/README.md`](sprites/README.md) for the art direction and
[`docs/tech-plan.md`](docs/tech-plan.md) for the schema change that PNG-backed
PixelLab assets require.

## Scripts

```bash
yarn dev                 # catalog at http://localhost:3000
yarn sprites:validate    # schema + folder/id checks
yarn sprites:audit       # duplicate, fill, colour, and direction checks
yarn sprites:render      # rewrite preview.svg from sprite.json
yarn lint
yarn format
yarn typecheck
yarn build
```

## Local setup

This repo pins **Yarn 4.10.3**. A global Yarn 1.22.x will refuse to run it, so
enable [Corepack](https://yarnpkg.com/corepack):

```bash
corepack enable
corepack prepare yarn@4.10.3 --activate
yarn --version   # 4.10.3
yarn install
yarn dev
```

If `yarn --version` still reports 1.x, the old binary is ahead of Corepack on
`PATH`. Use `corepack yarn install`, or remove the global install with
`npm uninstall -g yarn`.

CI runs format, lint, typecheck, sprite validation, the sprite audit, preview
rendering, and the Next.js build.
