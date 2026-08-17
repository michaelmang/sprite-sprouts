import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { pixelsToSvg } from "../src/lib/render-svg";
import {
  kindFolder,
  type SpriteDocument,
  type SpriteKind,
} from "../src/lib/sprite-schema";
import {
  type CharacterFrames,
  type VillagerLook,
  drawCat,
  drawChicken,
  drawCow,
  drawDog,
  drawDuck,
  drawGoat,
  drawHorse,
  drawPig,
  drawRabbit,
  drawSheep,
  villagerFrames,
} from "./lib/draw-characters";
import { objectDrafts } from "./lib/draw-objects";
import { fillTile } from "./lib/fit";
import {
  animalZones,
  objectMaterial,
  objectZonesFor,
  villagerZones,
  type VillagerPalette,
} from "./lib/materials-map";
import { paintFrames, type PaletteEntry } from "./lib/paint";
import { PixelCanvas } from "./lib/pixel-canvas";
import { willowFarmerFrames } from "./lib/willow-farmer";

type CharacterDraft = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  frames: CharacterFrames;
  palette: Record<string, PaletteEntry>;
};

const villagers: Array<
  Omit<CharacterDraft, "frames" | "palette"> & {
    look: VillagerLook;
    colors: VillagerPalette;
  }
> = [
  {
    id: "mayor-bramble",
    name: "Mayor Bramble",
    description:
      "Town mayor in a top hat and suit. Runs festivals and the community ledger.",
    tags: ["villager", "human", "mayor"],
    look: {
      hat: "top",
      beard: "short",
      body: "suit",
      accessory: "ledger",
    },
    colors: { hair: "hair", top: "cloth", bottom: "cloth", prop: "linen" },
  },
  {
    id: "maren-shopkeep",
    name: "Maren",
    description:
      "General-store keeper in an apron. Sells seeds, food, and supplies.",
    tags: ["villager", "human", "shopkeeper"],
    look: { hat: "bun", body: "apron", accessory: "basket" },
    colors: {
      hair: "clothRed",
      top: "linen",
      bottom: "clothBlue",
      prop: "wood",
    },
  },
  {
    id: "bram-blacksmith",
    name: "Bram",
    description:
      "Blacksmith with a short beard. Upgrades tools and breaks geodes.",
    tags: ["villager", "human", "blacksmith"],
    look: {
      hat: "none",
      beard: "short",
      body: "apron",
      accessory: "hammer",
    },
    colors: { hair: "hair", top: "leather", bottom: "darkWood", prop: "iron" },
  },
  {
    id: "lila-innkeeper",
    name: "Lila",
    description:
      "Inn and saloon keeper. Serves meals and hosts the evening crowd.",
    tags: ["villager", "human", "innkeeper"],
    look: { hat: "beret", body: "dress", accessory: "mug" },
    colors: {
      hair: "clothPurple",
      top: "clothPurple",
      bottom: "clothPurple",
      prop: "cheese",
    },
  },
  {
    id: "joss-fisher",
    name: "Joss",
    description:
      "Harbor fisher in a sou'wester. Sells bait and talks about the tides.",
    tags: ["villager", "human", "fisher"],
    look: {
      hat: "souwester",
      beard: "long",
      body: "coat",
      accessory: "fish",
    },
    colors: {
      hair: "straw",
      top: "clothTeal",
      bottom: "clothBlue",
      prop: "fish",
    },
  },
  {
    id: "sage-willowisp",
    name: "Sage",
    description:
      "Tower wizard in a pointed hat and robe. Unlocks magic and the spirit forest.",
    tags: ["villager", "human", "wizard"],
    look: {
      hat: "pointed",
      beard: "long",
      body: "robe",
      accessory: "staff",
    },
    colors: {
      hair: "clothPurple",
      top: "clothPurple",
      bottom: "clothPurple",
      prop: "wood",
    },
  },
  {
    id: "nora-carpenter",
    name: "Nora",
    description: "Carpenter in a bandana. Builds farm buildings and furniture.",
    tags: ["villager", "human", "carpenter"],
    look: { hat: "bandana", body: "overalls", accessory: "saw" },
    colors: {
      hair: "clothRed",
      top: "clothBlue",
      bottom: "wood",
      prop: "iron",
    },
  },
  {
    id: "theo-doctor",
    name: "Theo",
    description:
      "Clinic doctor with glasses. Treats exhaustion and sells medicine.",
    tags: ["villager", "human", "doctor"],
    look: {
      hat: "none",
      glasses: true,
      body: "coat",
      accessory: "stethoscope",
    },
    colors: { hair: "hair", top: "white", bottom: "cloth", prop: "iron" },
  },
  {
    id: "iris-librarian",
    name: "Iris",
    description:
      "Librarian with a bun and glasses. Collects lost books and village lore.",
    tags: ["villager", "human", "librarian"],
    look: {
      hat: "bun",
      glasses: true,
      body: "dress",
      accessory: "book",
    },
    colors: {
      hair: "hair",
      top: "clothGreen",
      bottom: "clothGreen",
      prop: "clothRed",
    },
  },
  {
    id: "caleb-rancher",
    name: "Caleb",
    description:
      "Neighboring rancher. Offers animal advice and the first hay bale.",
    tags: ["villager", "human", "rancher"],
    look: { hat: "cap", body: "overalls", accessory: "pitchfork" },
    colors: {
      hair: "straw",
      top: "clothRed",
      bottom: "clothBlue",
      prop: "wood",
    },
  },
  {
    id: "pip-child",
    name: "Pip",
    description:
      "A small town kid with a cowlick. Often found chasing beetles.",
    tags: ["villager", "human", "child"],
    look: {
      hat: "cowlick",
      body: "shorts",
      scale: "child",
      accessory: "net",
    },
    colors: {
      hair: "pumpkin",
      top: "clothGreen",
      bottom: "clothBlue",
      prop: "wood",
    },
  },
  {
    id: "gran-heather",
    name: "Gran Heather",
    description:
      "Elder in a bun and shawl. Knows forage spots and old recipes.",
    tags: ["villager", "human", "elder"],
    look: { hat: "bun", body: "dress", accessory: "cane" },
    colors: { hair: "white", top: "clothPink", bottom: "cloth", prop: "wood" },
  },
  {
    id: "rex-miner",
    name: "Rex",
    description:
      "Adventurer-miner with a hard hat. Hangs around the guild and the mines.",
    tags: ["villager", "human", "miner"],
    look: {
      hat: "hardhat",
      beard: "short",
      body: "coat",
      accessory: "pickaxe",
    },
    colors: { hair: "hair", top: "cheese", bottom: "leather", prop: "iron" },
  },
  {
    id: "wren-artist",
    name: "Wren",
    description:
      "Painter in a beret. Sells furniture catalogs and seasonal decorations.",
    tags: ["villager", "human", "artist"],
    look: { hat: "beret", body: "dress", accessory: "palette" },
    colors: {
      hair: "clothTeal",
      top: "clothTeal",
      bottom: "linen",
      prop: "wood",
    },
  },
  {
    id: "ash-wanderer",
    name: "Ash",
    description:
      "Cloaked wanderer. Appears at the bus stop and the mountain shrine.",
    tags: ["villager", "human", "wanderer"],
    look: { hat: "hood", body: "robe", accessory: "lantern" },
    colors: { hair: "cloth", top: "cloth", bottom: "cloth", prop: "honey" },
  },
];

const animals: Array<Omit<CharacterDraft, "palette"> & { species: string }> = [
  {
    id: "chicken",
    name: "Chicken",
    description: "Coop animal. Lays eggs and follows scattered feed.",
    tags: ["animal", "coop"],
    frames: drawChicken(),
    species: "chicken",
  },
  {
    id: "duck",
    name: "Duck",
    description:
      "Coop animal that likes water. Lays duck eggs and drops feathers.",
    tags: ["animal", "coop"],
    frames: drawDuck(),
    species: "duck",
  },
  {
    id: "rabbit",
    name: "Rabbit",
    description: "Coop animal. Produces wool and the occasional lucky foot.",
    tags: ["animal", "coop"],
    frames: drawRabbit(),
    species: "rabbit",
  },
  {
    id: "cow",
    name: "Cow",
    description: "Barn animal. Produces milk when petted and fed.",
    tags: ["animal", "barn"],
    frames: drawCow(),
    species: "cow",
  },
  {
    id: "goat",
    name: "Goat",
    description: "Barn animal. Produces goat milk.",
    tags: ["animal", "barn"],
    frames: drawGoat(),
    species: "goat",
  },
  {
    id: "sheep",
    name: "Sheep",
    description: "Barn animal. Grows wool that can be sheared.",
    tags: ["animal", "barn"],
    frames: drawSheep(),
    species: "sheep",
  },
  {
    id: "pig",
    name: "Pig",
    description: "Barn animal. Finds truffles when let outside.",
    tags: ["animal", "barn"],
    frames: drawPig(),
    species: "pig",
  },
  {
    id: "horse",
    name: "Horse",
    description: "A rideable farm horse. Faster than walking the valley.",
    tags: ["animal", "farm"],
    frames: drawHorse(),
    species: "horse",
  },
  {
    id: "cat",
    name: "Cat",
    description: "Cabin pet. Sleeps on furniture and follows the farmer.",
    tags: ["animal", "pet"],
    frames: drawCat(),
    species: "cat",
  },
  {
    id: "dog",
    name: "Dog",
    description: "Cabin pet. Greets the farmer at the door.",
    tags: ["animal", "pet"],
    frames: drawDog(),
    species: "dog",
  },
];

function characterDocument(draft: CharacterDraft): SpriteDocument {
  return {
    $schema: "../../../schemas/sprite.schema.json",
    schemaVersion: 1,
    id: draft.id,
    name: draft.name,
    kind: "character",
    status: "outline",
    description: draft.description,
    tags: draft.tags,
    canvas: { width: 16, height: 32 },
    pivot: { x: 8, y: 32 },
    palette: draft.palette,
    frames: {
      "idle-down": { pixels: draft.frames.down },
      "idle-right": { pixels: draft.frames.right },
      "idle-left": { pixels: draft.frames.left },
      "idle-up": { pixels: draft.frames.up },
      "walk-down-left": { pixels: draft.frames.walkLeft },
      "walk-down-right": { pixels: draft.frames.walkRight },
    },
    animations: [
      {
        id: "idle",
        frameMs: 400,
        directions: {
          down: ["idle-down"],
          right: ["idle-right"],
          up: ["idle-up"],
          left: ["idle-left"],
        },
      },
      {
        id: "walk",
        frameMs: 140,
        directions: {
          down: ["idle-down", "walk-down-left", "idle-down", "walk-down-right"],
        },
      },
    ],
  };
}

function objectDocument(
  id: string,
  name: string,
  description: string,
  tags: string[],
  pixels: string[],
  palette: Record<string, PaletteEntry>,
): SpriteDocument {
  return {
    $schema: "../../../schemas/sprite.schema.json",
    schemaVersion: 1,
    id,
    name,
    kind: "object",
    status: "outline",
    description,
    tags,
    canvas: { width: 16, height: 16 },
    pivot: { x: 8, y: 16 },
    palette,
    frames: {
      "idle-down": { pixels },
    },
    animations: [
      {
        id: "idle",
        frameMs: 400,
        directions: { down: ["idle-down"] },
      },
    ],
  };
}

async function writeSprite(sprite: SpriteDocument): Promise<void> {
  const kind = sprite.kind as SpriteKind;
  const dir = path.join(process.cwd(), "sprites", kindFolder[kind], sprite.id);
  await mkdir(dir, { recursive: true });

  const previewFrame =
    sprite.animations[0]?.directions.down?.[0] ?? Object.keys(sprite.frames)[0];
  if (!previewFrame) {
    throw new Error(`No preview frame for ${sprite.id}`);
  }

  await writeFile(
    path.join(dir, "sprite.json"),
    `${JSON.stringify(sprite, null, 2)}\n`,
  );
  await writeFile(
    path.join(dir, "outline.svg"),
    `${pixelsToSvg(sprite, previewFrame)}\n`,
  );
  await writeFile(
    path.join(dir, "notes.md"),
    `# ${sprite.name}\n\n${sprite.description}\n\nTags: ${sprite.tags.join(", ") || "none"}\n`,
  );
}

const frameOrder = [
  "down",
  "right",
  "left",
  "up",
  "walkLeft",
  "walkRight",
] as const;

/** Willow's hand-drawn art has its own hat brim and overall bands. */
const willowZones = (facing: "front" | "back") =>
  villagerZones(
    5,
    15,
    {
      hair: "straw",
      top: "clothBlue",
      bottom: "clothBlue",
      prop: "wood",
    },
    facing,
  );

function paintCharacter(
  frames: CharacterFrames,
  base: Parameters<typeof paintFrames>[1],
  zones: Parameters<typeof paintFrames>[2],
): Pick<CharacterDraft, "frames" | "palette"> {
  const painted = paintFrames(
    frameOrder.map((key) => frames[key]),
    base,
    zones,
  );

  return {
    frames: Object.fromEntries(
      frameOrder.map((key, index) => [key, painted.frames[index]]),
    ) as unknown as CharacterFrames,
    palette: painted.palette,
  };
}

async function main() {
  const characters: CharacterDraft[] = [
    ...villagers.map((villager) => {
      const child = villager.look.scale === "child";
      const faceY = child ? 10 : 6;
      const torsoY = child ? 17 : villager.look.beard === "long" ? 15 : 14;

      return {
        id: villager.id,
        name: villager.name,
        description: villager.description,
        tags: villager.tags,
        ...paintCharacter(villagerFrames(villager.look), "skin", [
          villagerZones(faceY, torsoY, villager.colors),
          villagerZones(faceY, torsoY, villager.colors),
          villagerZones(faceY, torsoY, villager.colors),
          villagerZones(faceY, torsoY, villager.colors, "back"),
          villagerZones(faceY, torsoY, villager.colors),
          villagerZones(faceY, torsoY, villager.colors),
        ]),
      };
    }),
    {
      id: "willow-farmer",
      name: "Willow",
      description:
        "A cheerful starter farmer in a straw hat and overalls. Front, side, and back idle outlines plus a two-step walk cycle facing down.",
      tags: ["farmer", "villager", "player", "human"],
      ...paintCharacter(willowFarmerFrames as CharacterFrames, "skin", [
        willowZones("front"),
        willowZones("front"),
        willowZones("front"),
        willowZones("back"),
        willowZones("front"),
        willowZones("front"),
      ]),
    },
    ...animals.map((animal) => {
      const { base, zones } = animalZones(animal.species);
      return {
        id: animal.id,
        name: animal.name,
        description: animal.description,
        tags: animal.tags,
        ...paintCharacter(animal.frames, base, zones),
      };
    }),
  ];

  for (const draft of characters) {
    await writeSprite(characterDocument(draft));
    console.log(`Wrote sprites/characters/${draft.id}`);
  }

  for (const draft of objectDrafts) {
    const canvas = new PixelCanvas(16, 16);
    draft.draw(canvas);
    const tile = fillTile(canvas.toPixels());
    const painted = paintFrames(
      [tile.pixels],
      objectMaterial(draft.id, draft.tags),
      objectZonesFor(draft.id).map((zone) => ({
        material: zone.material,
        test: (x: number, y: number) => zone.test(...tile.toSource(x, y)),
      })),
    );
    const pixels = painted.frames[0];
    if (!pixels) {
      throw new Error(`No painted frame for ${draft.id}`);
    }

    await writeSprite(
      objectDocument(
        draft.id,
        draft.name,
        draft.description,
        draft.tags,
        pixels,
        painted.palette,
      ),
    );
    console.log(`Wrote sprites/objects/${draft.id}`);
  }

  console.log(
    `Catalog generated: ${characters.length} characters, ${objectDrafts.length} objects.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
