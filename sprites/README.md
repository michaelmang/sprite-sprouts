# Sprites

The asset catalog. Sprites are authored in PixelLab and committed here.

## PixelLab source exports

The PNGs at this directory's root are the original 48×48 PixelLab exports.
Directional character files use their generated direction suffix; the beat
spirits are the `a_cute_colorful_root_vegetabl*.png` set.

The beat-game MVP currently imports these files directly:

| Game role  | PixelLab export                                                   |
| ---------- | ----------------------------------------------------------------- |
| Apprentice | `cute_medieval_boy__south.png`                                    |
| Guide      | `wise_bird_sage_wizard_philosopher_with__south.png`               |
| Heart      | `a_cute_colorful_root_vegetabl_6.png`                              |
| Sprout     | `a_cute_colorful_root_vegetabl_8.png`                              |
| Water      | `a_cute_colorful_root_vegetabl_5.png`                              |
| Shell      | `a_cute_colorful_root_vegetabl_13.png`                             |

These are static imports in `src/components/GameSprites.tsx`; Next.js
fingerprints them in the production build while preserving the original PNG
bytes. CSS enlarges them with nearest-neighbour pixel rendering.

```text
sprites/
  characters/<id>/
    sprite.json      # required — metadata, palette, animations
    preview.svg      # generated preview (`yarn sprites:render`)
    notes.md         # optional art notes
  objects/<id>/
    ...same files
```

This directory is currently empty. See [`../docs/asset-plan.md`](../docs/asset-plan.md)
for the full production queue and [`../docs/tech-plan.md`](../docs/tech-plan.md)
for the PixelLab import pipeline.

## Art direction

Fixed before generating assets, because changing them later means regenerating
everything.

| Setting            | Value                                             |
| ------------------ | ------------------------------------------------- |
| Object/prop tile   | 32×32                                             |
| Small icons        | 16×16                                             |
| Characters         | 32×48, 4-directional                              |
| Dialogue portraits | 64×64 or 96×96                                    |
| Palette            | One shared 32–48 colour palette across all assets |
| Outline            | Consistent warm dark outline, never pure black    |
| Light              | From the top left; shadow bottom and right        |

Each chamber has a dominant hue so the player can identify the act at a glance:
rhythm amber, melody blue, harmony deep green, tone colour violet, texture
rose, form stone-grey.

Generate the palette and a style reference sheet **first**, then pass it to
PixelLab's style-matching endpoint for every subsequent asset. Consistency
across ~265 assets depends on it.

## Status

Every sprite document carries a status:

| Status        | Meaning                         |
| ------------- | ------------------------------- |
| `outline`     | Draft; ready to pull            |
| `in-progress` | Claimed and being worked on     |
| `final`       | Finished and in use by the game |

## Checks

```bash
yarn sprites:validate   # schema, folder/id agreement
yarn sprites:audit      # duplicates, fill, colour count, directional frames
yarn sprites:render     # regenerate preview.svg
```

The audit fails on duplicate art, undersized or flat sprites, duplicate
directional character frames, copied animal rear views, identical walk phases,
and bottom-edge clipping. Close-but-distinct neighbours are reported without
failing, since hand-authored art legitimately includes variants.
