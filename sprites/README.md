# Sprites

This directory is the source of truth for desktop software.

```text
sprites/
  characters/<id>/
    sprite.json      # required — pixel grid + metadata
    outline.svg      # generated preview (`yarn sprites:render`)
    notes.md         # optional art notes
  objects/<id>/
    ...same files
```

## Workflow

1. **AI outline** — add a folder under `characters/` or `objects/` with `status: "outline"`.
2. **Pull** — clone or `git pull`, then open `sprite.json` (and `outline.svg`) in your local tool.
3. **Paint** — expand the palette and fill interior pixels. Set `status` to `"in-progress"` if you want to mark it claimed.
4. **Upload** — set `status` to `"final"`, run `yarn sprites:render`, commit, and push.

Scaffold a blank sprite with:

```bash
yarn sprites:new character river-npc "River"
yarn sprites:new object watering-can
```

Canvas defaults: characters are 16×32, objects are 16×16.
