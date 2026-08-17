# Sprites

This directory is the source of truth for desktop software.

```text
sprites/
  characters/<id>/
    sprite.json      # required — pixel grid, palette, animations
    preview.svg      # generated colour preview (`yarn sprites:render`)
    notes.md         # optional art notes
  objects/<id>/
    ...same files
```

Regenerate the valley catalog with:

```bash
yarn sprites:catalog
```

## Catalog

Characters are 16×32. Objects are 16×16. Every sprite ships painted: a warm
dark outline, a filled body, and lit and shadowed steps drawn from a shared
material palette.

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

## Art direction

Modelled on the Stardew Valley item sheet:

- **Fill the tile.** Object art spans at least 11 of the 16 pixels on its long
  side. Empty margins read as unfinished icons.
- **Four-step materials.** Each material carries an outline, a shadow, a body,
  and a highlight. The outline is a warm dark tone, never pure black.
- **Light from the top left.** Bodies take the highlight along their upper edge
  and the shadow along the lower and right edges.
- **Read at thumbnail size.** The shape should identify the asset before the
  label does; villagers carry a job-specific prop in every direction.
- **Materials carry meaning.** Wooden handles, metal heads, leafy tops, and
  cloth bands are painted as separate zones instead of one flat colour.
- **Never reuse a sprite.** `yarn sprites:audit` fails on duplicate art, close
  painted neighbours, flat or undersized shapes, copied animal rear views,
  identical walk phases, and bottom-edge clipping.

## Workflow

1. **AI draft** — add a folder under `characters/` or `objects/` with `status: "outline"`.
2. **Pull** — clone or `git pull`, then open `sprite.json` (and `preview.svg`) in your local tool.
3. **Refine** — adjust the palette and pixels. Set `status` to `"in-progress"` if you want to mark it claimed.
4. **Upload** — set `status` to `"final"`, run `yarn sprites:render`, commit, and push.

Scaffold a blank sprite with:

```bash
yarn sprites:new character river-npc "River"
yarn sprites:new object watering-can
```
