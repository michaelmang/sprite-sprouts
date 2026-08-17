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

Regenerate the valley catalog (does not overwrite `willow-farmer`) with:

```bash
yarn sprites:catalog
```

## Catalog

Characters are 16×32. Objects are 16×16. All start as `#` / `.` outlines.

### Outline art direction

- **Read at thumbnail size.** The outer contour should identify the asset before
  the label does.
- **Use role props.** Villagers carry a job-specific item (staff, ledger,
  hammer, fish, saw, book, net, or similar), not just a different hat.
- **Prefer contour and negative space over solid fill.** The audit rejects
  over-dense shapes that turn into dark blobs.
- **Keep families coherent, not identical.** Seed packets share a package shape,
  milk bottles share a vessel shape, and saplings share a trunk; their internal
  marks and contours distinguish the variant.
- **Never reuse a silhouette.** `yarn sprites:audit` fails on exact
  translation-normalized duplicates, empty/tiny drawings, and excessive local
  density. It checks corresponding character directions, true animal rear
  views, walk-phase separation, and bottom-edge clipping. It also reports close
  neighbors for human review.

### Characters

- **Player** — `willow-farmer`
- **Villagers** — mayor, shopkeeper, blacksmith, innkeeper, fisher, wizard, carpenter, doctor, librarian, rancher, child, elder, miner, artist, wanderer
- **Animals** — chicken, duck, rabbit, cow, goat, sheep, pig, horse, cat, dog

### Objects

- **Tools** — watering can, hoe, axe, pickaxe, scythe, fishing rod, sword, milk pail, shears, copper pan
- **Crops** — parsnip, potato, cauliflower, kale, green bean, strawberry, melon, blueberry, tomato, corn, pumpkin, wheat, grape, sunflower, hops, beet, hot pepper, yam
- **Seeds** — crop packets plus mixed seeds and an ancient seed
- **Forage** — horseradish, daffodil, leek, dandelion, morel, holly, spice berry, cave carrot, wild plum, blackberry, winter root, crystal fruit, coconut, cactus fruit
- **Resources** — wood, hardwood, stone, fiber, sap, clay, coal, ores, quartz, geodes, bone
- **Gems** — earth crystal, frozen tear, fire quartz, emerald, aquamarine, ruby, amethyst, topaz, jade, diamond, rainbow shard
- **Fish** — sunfish, bream, carp, catfish, salmon, tuna, eel, pufferfish, squid, legend
- **Food & artisan** — eggs, milk, wool, cheese, mayo, honey, jam, wine, coffee, cooked meals
- **Machines** — chest, furnace, keg, preserve jar, presses, bee house, sprinklers, scarecrow, tapper, crab pot, lightning rod
- **Furniture** — bed, table, chair, lamp, fireplace, bookcase, plant, clock, television
- **Farm & world** — shipping bin, mailbox, fence, gate, saplings, weeds, rocks, stumps
- **Special** — bouquet, heart pendant, dinosaur egg, artifacts, star drop

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
