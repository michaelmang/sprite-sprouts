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
import { PixelCanvas } from "./lib/pixel-canvas";

type CharacterDraft = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  frames: CharacterFrames;
};

const villagers: Array<
  Omit<CharacterDraft, "frames"> & { look: VillagerLook }
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
  },
  {
    id: "maren-shopkeep",
    name: "Maren",
    description:
      "General-store keeper in an apron. Sells seeds, food, and supplies.",
    tags: ["villager", "human", "shopkeeper"],
    look: { hat: "bun", body: "apron", accessory: "basket" },
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
  },
  {
    id: "lila-innkeeper",
    name: "Lila",
    description:
      "Inn and saloon keeper. Serves meals and hosts the evening crowd.",
    tags: ["villager", "human", "innkeeper"],
    look: { hat: "beret", body: "dress", accessory: "mug" },
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
  },
  {
    id: "nora-carpenter",
    name: "Nora",
    description: "Carpenter in a bandana. Builds farm buildings and furniture.",
    tags: ["villager", "human", "carpenter"],
    look: { hat: "bandana", body: "overalls", accessory: "saw" },
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
  },
  {
    id: "caleb-rancher",
    name: "Caleb",
    description:
      "Neighboring rancher. Offers animal advice and the first hay bale.",
    tags: ["villager", "human", "rancher"],
    look: { hat: "cap", body: "overalls", accessory: "pitchfork" },
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
  },
  {
    id: "gran-heather",
    name: "Gran Heather",
    description:
      "Elder in a bun and shawl. Knows forage spots and old recipes.",
    tags: ["villager", "human", "elder"],
    look: { hat: "bun", body: "dress", accessory: "cane" },
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
  },
  {
    id: "wren-artist",
    name: "Wren",
    description:
      "Painter in a beret. Sells furniture catalogs and seasonal decorations.",
    tags: ["villager", "human", "artist"],
    look: { hat: "beret", body: "dress", accessory: "palette" },
  },
  {
    id: "ash-wanderer",
    name: "Ash",
    description:
      "Cloaked wanderer. Appears at the bus stop and the mountain shrine.",
    tags: ["villager", "human", "wanderer"],
    look: { hat: "hood", body: "robe", accessory: "lantern" },
  },
];

const animals: CharacterDraft[] = [
  {
    id: "chicken",
    name: "Chicken",
    description: "Coop animal. Lays eggs and follows scattered feed.",
    tags: ["animal", "coop"],
    frames: drawChicken(),
  },
  {
    id: "duck",
    name: "Duck",
    description:
      "Coop animal that likes water. Lays duck eggs and drops feathers.",
    tags: ["animal", "coop"],
    frames: drawDuck(),
  },
  {
    id: "rabbit",
    name: "Rabbit",
    description: "Coop animal. Produces wool and the occasional lucky foot.",
    tags: ["animal", "coop"],
    frames: drawRabbit(),
  },
  {
    id: "cow",
    name: "Cow",
    description: "Barn animal. Produces milk when petted and fed.",
    tags: ["animal", "barn"],
    frames: drawCow(),
  },
  {
    id: "goat",
    name: "Goat",
    description: "Barn animal. Produces goat milk.",
    tags: ["animal", "barn"],
    frames: drawGoat(),
  },
  {
    id: "sheep",
    name: "Sheep",
    description: "Barn animal. Grows wool that can be sheared.",
    tags: ["animal", "barn"],
    frames: drawSheep(),
  },
  {
    id: "pig",
    name: "Pig",
    description: "Barn animal. Finds truffles when let outside.",
    tags: ["animal", "barn"],
    frames: drawPig(),
  },
  {
    id: "horse",
    name: "Horse",
    description: "A rideable farm horse. Faster than walking the valley.",
    tags: ["animal", "farm"],
    frames: drawHorse(),
  },
  {
    id: "cat",
    name: "Cat",
    description: "Cabin pet. Sleeps on furniture and follows the farmer.",
    tags: ["animal", "pet"],
    frames: drawCat(),
  },
  {
    id: "dog",
    name: "Dog",
    description: "Cabin pet. Greets the farmer at the door.",
    tags: ["animal", "pet"],
    frames: drawDog(),
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
    palette: {
      ".": { name: "empty", color: null },
      "#": { name: "outline", color: "#2b2118" },
    },
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
    palette: {
      ".": { name: "empty", color: null },
      "#": { name: "outline", color: "#2b2118" },
    },
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

async function main() {
  const characters: CharacterDraft[] = [
    ...villagers.map((villager) => ({
      id: villager.id,
      name: villager.name,
      description: villager.description,
      tags: villager.tags,
      frames: villagerFrames(villager.look),
    })),
    ...animals,
  ];

  for (const draft of characters) {
    await writeSprite(characterDocument(draft));
    console.log(`Wrote sprites/characters/${draft.id}`);
  }

  for (const draft of objectDrafts) {
    const canvas = new PixelCanvas(16, 16);
    draft.draw(canvas);
    await writeSprite(
      objectDocument(
        draft.id,
        draft.name,
        draft.description,
        draft.tags,
        canvas.toPixels(),
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
