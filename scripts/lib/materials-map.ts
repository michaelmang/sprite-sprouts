import type { MaterialName, Zone } from "./paint";

/** Rows at or above the leaf line read as foliage on a growing crop. */
const leafyTop = (rows: number, material: MaterialName = "leaf"): Zone => ({
  material,
  test: (_x, y) => y <= rows,
});

const handleBelow = (rows: number, material: MaterialName = "wood"): Zone => ({
  material,
  test: (_x, y) => y >= rows,
});

const objectZones: Record<string, Zone[]> = {
  "watering-can": [{ material: "wood", test: (_x, y) => y <= 5 }],
  hoe: [{ material: "wood", test: (x, y) => x <= 10 && y >= 7 }],
  axe: [{ material: "wood", test: (_x, y) => y >= 9 }],
  pickaxe: [{ material: "wood", test: (_x, y) => y >= 6 }],
  scythe: [{ material: "wood", test: (_x, y) => y >= 9 }],
  "fishing-rod": [{ material: "wood", test: (_x, y) => y >= 9 }],
  "copper-sword": [{ material: "leather", test: (_x, y) => y >= 11 }],
  shears: [{ material: "wood", test: (_x, y) => y >= 9 }],
  "copper-pan": [{ material: "wood", test: (x) => x >= 13 }],
  "milk-pail": [{ material: "iron", test: (_x, y) => y <= 6 }],

  parsnip: [leafyTop(5)],
  potato: [leafyTop(3)],
  cauliflower: [{ material: "leaf", test: (_x, y) => y >= 10 }],
  "green-bean": [leafyTop(4)],
  strawberry: [leafyTop(4)],
  melon: [leafyTop(3)],
  blueberry: [leafyTop(5)],
  tomato: [leafyTop(6)],
  corn: [leafyTop(2)],
  pumpkin: [leafyTop(4)],
  grape: [leafyTop(4)],
  sunflower: [
    { material: "darkWood", test: (_x, y) => y >= 11 },
    { material: "leaf", test: (x, y) => y >= 11 && (x <= 6 || x >= 10) },
  ],
  hops: [{ material: "leaf", test: (x) => x === 8 }],
  beet: [leafyTop(6)],
  "hot-pepper": [leafyTop(4)],
  yam: [leafyTop(3)],

  "wild-horseradish": [leafyTop(5)],
  daffodil: [{ material: "leaf", test: (_x, y) => y >= 9 }],
  leek: [{ material: "white", test: (_x, y) => y >= 9 }],
  dandelion: [{ material: "leaf", test: (_x, y) => y >= 8 }],
  morel: [{ material: "cream", test: (_x, y) => y >= 10 }],
  holly: [{ material: "crimson", test: (x, y) => y >= 7 && x >= 7 }],
  "spice-berry": [leafyTop(4)],
  "cave-carrot": [leafyTop(2)],
  "wild-plum": [leafyTop(4)],
  blackberry: [leafyTop(4)],
  "winter-root": [leafyTop(3)],
  "crystal-fruit": [leafyTop(3)],
  coconut: [leafyTop(3, "darkLeaf")],
  "cactus-fruit": [{ material: "leaf", test: (_x, y) => y <= 7 }],

  "oak-sapling": [handleBelow(11, "darkWood")],
  "maple-sapling": [handleBelow(9, "darkWood")],
  "pine-sapling": [handleBelow(12, "darkWood")],
  "tea-bush": [handleBelow(11, "darkWood")],
  "berry-bush": [{ material: "crimson", test: (x, y) => y >= 6 && x >= 9 }],
  "crop-sprout": [{ material: "soil", test: (_x, y) => y >= 13 }],
  "grass-starter": [{ material: "soil", test: (_x, y) => y >= 13 }],
  scarecrow: [
    { material: "straw", test: (_x, y) => y <= 6 },
    { material: "darkWood", test: (_x, y) => y >= 7 },
  ],
  bouquet: [{ material: "leaf", test: (_x, y) => y >= 8 }],
  "potted-plant": [{ material: "clay", test: (_x, y) => y >= 10 }],
  tapper: [{ material: "iron", test: (x) => x >= 11 }],
  "bee-house": [{ material: "straw", test: (_x, y) => y <= 5 }],
  mailbox: [{ material: "darkWood", test: (_x, y) => y >= 10 }],
  lamp: [{ material: "honey", test: (_x, y) => y <= 6 }],
  fireplace: [
    { material: "fire", test: (x, y) => y >= 6 && x >= 5 && x <= 10 },
  ],
  "lightning-rod": [{ material: "stone", test: (_x, y) => y >= 12 }],
  "seed-maker": [{ material: "iron", test: (_x, y) => y <= 3 }],
  furnace: [
    { material: "fire", test: (x, y) => y >= 7 && y <= 10 && x >= 6 && x <= 9 },
  ],
  "charcoal-kiln": [{ material: "iron", test: (x, y) => x >= 9 && y <= 6 }],
  keg: [{ material: "iron", test: (_x, y) => y === 6 || y === 10 }],
  loom: [{ material: "linen", test: (_x, y) => y === 7 }],
  "cheese-press": [{ material: "iron", test: (_x, y) => y <= 6 }],
  "crab-pot": [{ material: "iron", test: (_x, y) => y <= 4 }],
  bed: [{ material: "linen", test: (_x, y) => y <= 8 }],
  bookcase: [{ material: "clothRed", test: (_x, y) => y >= 7 && y <= 9 }],
  television: [
    {
      material: "crystal",
      test: (x, y) => x >= 4 && x <= 11 && y >= 6 && y <= 9,
    },
  ],
  clock: [
    {
      material: "cream",
      test: (x, y) => x >= 5 && x <= 11 && y >= 5 && y <= 11,
    },
  ],
  "shipping-bin": [{ material: "darkWood", test: (_x, y) => y <= 5 }],

  wine: [{ material: "grape", test: (_x, y) => y >= 9 }],
  "pale-ale": [{ material: "straw", test: (_x, y) => y >= 7 }],
  jam: [{ material: "crimson", test: (_x, y) => y >= 8 }],
  honey: [{ material: "honey", test: (_x, y) => y >= 6 }],
  pickles: [{ material: "leaf", test: (_x, y) => y >= 6 }],
  mayonnaise: [{ material: "cream", test: (_x, y) => y >= 7 }],
  milk: [{ material: "white", test: (_x, y) => y >= 8 }],
  "goat-milk": [{ material: "white", test: (_x, y) => y >= 8 }],
  coffee: [{ material: "darkWood", test: (_x, y) => y >= 7 && y <= 10 }],
  "fried-egg": [
    {
      material: "cheese",
      test: (x, y) => x >= 6 && x <= 10 && y >= 6 && y <= 10,
    },
  ],
  pancakes: [{ material: "honey", test: (_x, y) => y <= 5 }],
  salad: [{ material: "leaf", test: (_x, y) => y <= 9 }],
  pizza: [{ material: "tomato", test: (_x, y) => y >= 6 }],
  sashimi: [{ material: "salmon", test: (_x, y) => y <= 9 }],
  "complete-breakfast": [{ material: "cheese", test: (_x, y) => y <= 8 }],
  bread: [{ material: "cream", test: (_x, y) => y >= 9 }],
  "rabbit-foot": [{ material: "white", test: (_x, y) => y <= 8 }],
  "dinosaur-egg": [{ material: "emerald", test: (_x, y) => y >= 9 }],
  "heart-pendant": [{ material: "gold", test: (_x, y) => y <= 5 }],
  "star-drop": [
    { material: "gold", test: (x, y) => y >= 7 && x >= 6 && x <= 10 },
  ],
  "ancient-doll": [{ material: "clothTeal", test: (_x, y) => y >= 6 }],
  "lost-book": [{ material: "linen", test: (x) => x >= 6 }],
  treasure: [{ material: "gold", test: (_x, y) => y >= 8 && y <= 10 }],
  "battery-pack": [{ material: "gold", test: (_x, y) => y <= 4 }],
  "bone-fragment": [],
  geode: [
    {
      material: "crystal",
      test: (x, y) => x >= 6 && x <= 10 && y >= 6 && y <= 10,
    },
  ],
  "magma-geode": [
    {
      material: "fire",
      test: (x, y) => x >= 6 && x <= 10 && y >= 6 && y <= 10,
    },
  ],
  "omni-geode": [
    {
      material: "amethyst",
      test: (x, y) => x >= 6 && x <= 10 && y >= 6 && y <= 10,
    },
  ],
  "copper-ore": [{ material: "copper", test: (x, y) => y >= 7 && x <= 11 }],
  "iron-ore": [{ material: "iron", test: (x, y) => y >= 6 && x >= 5 }],
  "gold-ore": [{ material: "gold", test: (x, y) => y >= 6 && x >= 5 }],
  "star-ore": [{ material: "gold", test: (_x, y) => y <= 8 }],
  wood: [],
  fiber: [],
  sap: [{ material: "leaf", test: (_x, y) => y <= 4 }],
  "mixed-seeds": [{ material: "leaf", test: (_x, y) => y >= 7 }],
  "parsnip-seeds": [{ material: "leaf", test: (_x, y) => y >= 5 }],
  "strawberry-seeds": [{ material: "crimson", test: (_x, y) => y >= 6 }],
  "blueberry-seeds": [{ material: "berry", test: (_x, y) => y >= 8 }],
  "pumpkin-seeds": [{ material: "pumpkin", test: (_x, y) => y >= 6 }],
  "wheat-seeds": [{ material: "straw", test: (_x, y) => y >= 5 }],
  "ancient-seed": [
    {
      material: "emerald",
      test: (x, y) => x >= 5 && x <= 11 && y >= 5 && y <= 11,
    },
  ],
  weed: [],
  rock: [],
  stump: [{ material: "darkWood", test: (_x, y) => y >= 8 }],
  twig: [],
  fence: [],
  gate: [{ material: "iron", test: (x) => x === 8 }],
  sprinkler: [
    { material: "water", test: (x, y) => x <= 4 || x >= 12 || y <= 4 },
  ],
  "quality-sprinkler": [
    { material: "water", test: (x, y) => x <= 4 || x >= 12 || y <= 4 },
  ],
  chest: [{ material: "gold", test: (_x, y) => y >= 8 && y <= 10 }],
  "oak-table": [],
  "oak-chair": [],
  "preserve-jar": [{ material: "leaf", test: (_x, y) => y >= 8 }],
  "mayonnaise-machine": [{ material: "cream", test: (_x, y) => y <= 5 }],
  "recycling-machine": [
    {
      material: "leaf",
      test: (x, y) => y >= 5 && y <= 11 && x >= 5 && x <= 11,
    },
  ],
  cloth: [],
  wool: [],
  cheese: [],
  "goat-cheese": [],
  truffle: [],
  egg: [],
  "duck-egg": [],
  "duck-feather": [],
};

/** Explicit material per object; anything unlisted falls back to its tag. */
const objectMaterials: Record<string, MaterialName> = {
  "watering-can": "iron",
  hoe: "iron",
  axe: "iron",
  pickaxe: "iron",
  scythe: "iron",
  "fishing-rod": "iron",
  "copper-sword": "iron",
  "milk-pail": "wood",
  shears: "iron",
  "copper-pan": "copper",

  parsnip: "cream",
  potato: "clay",
  cauliflower: "white",
  kale: "darkLeaf",
  "green-bean": "leaf",
  strawberry: "crimson",
  melon: "melon",
  blueberry: "berry",
  tomato: "tomato",
  corn: "cheese",
  pumpkin: "pumpkin",
  wheat: "straw",
  grape: "grape",
  sunflower: "cheese",
  hops: "leaf",
  beet: "crimson",
  "hot-pepper": "crimson",
  yam: "pumpkin",

  "parsnip-seeds": "linen",
  "strawberry-seeds": "linen",
  "blueberry-seeds": "linen",
  "pumpkin-seeds": "linen",
  "wheat-seeds": "linen",
  "mixed-seeds": "linen",
  "ancient-seed": "stone",

  "wild-horseradish": "cream",
  daffodil: "cheese",
  leek: "leaf",
  dandelion: "cheese",
  morel: "clay",
  holly: "darkLeaf",
  "spice-berry": "crimson",
  "cave-carrot": "pumpkin",
  "wild-plum": "grape",
  blackberry: "grape",
  "winter-root": "cream",
  "crystal-fruit": "crystal",
  coconut: "darkWood",
  "cactus-fruit": "crimson",

  wood: "wood",
  hardwood: "darkWood",
  stone: "stone",
  fiber: "leaf",
  sap: "honey",
  clay: "clay",
  coal: "coal",
  "copper-ore": "stone",
  "iron-ore": "stone",
  "gold-ore": "stone",
  "star-ore": "stone",
  quartz: "glass",
  geode: "stone",
  "magma-geode": "stone",
  "omni-geode": "stone",
  "bone-fragment": "bone",

  "earth-crystal": "amethyst",
  "frozen-tear": "crystal",
  "fire-quartz": "fire",
  emerald: "emerald",
  aquamarine: "crystal",
  ruby: "ruby",
  amethyst: "amethyst",
  topaz: "gold",
  jade: "emerald",
  diamond: "glass",
  "rainbow-shard": "amethyst",

  sunfish: "cheese",
  bream: "fish",
  carp: "melon",
  catfish: "shadowFur",
  salmon: "salmon",
  tuna: "water",
  eel: "darkLeaf",
  pufferfish: "cheese",
  squid: "pinkFur",
  "legend-fish": "crystal",

  egg: "cream",
  "duck-egg": "glass",
  milk: "white",
  "goat-milk": "white",
  wool: "white",
  "duck-feather": "clothTeal",
  "rabbit-foot": "shadowFur",
  truffle: "soil",
  cloth: "linen",
  mayonnaise: "glass",
  cheese: "cheese",
  "goat-cheese": "white",
  honey: "glass",
  jam: "glass",
  pickles: "glass",
  wine: "glass",
  "pale-ale": "glass",
  coffee: "white",
  "fried-egg": "white",
  hashbrowns: "bread",
  pancakes: "bread",
  bread: "bread",
  salad: "white",
  pizza: "bread",
  sashimi: "white",
  "complete-breakfast": "white",

  chest: "wood",
  furnace: "stone",
  "charcoal-kiln": "stone",
  keg: "wood",
  "preserve-jar": "wood",
  "cheese-press": "wood",
  "mayonnaise-machine": "iron",
  loom: "wood",
  "bee-house": "wood",
  "seed-maker": "wood",
  "recycling-machine": "iron",
  sprinkler: "iron",
  "quality-sprinkler": "gold",
  scarecrow: "straw",
  tapper: "wood",
  "crab-pot": "wood",
  "lightning-rod": "iron",

  bed: "wood",
  "oak-table": "wood",
  "oak-chair": "wood",
  lamp: "iron",
  fireplace: "stone",
  bookcase: "wood",
  "potted-plant": "leaf",
  clock: "darkWood",
  television: "coal",

  "shipping-bin": "wood",
  mailbox: "iron",
  fence: "wood",
  gate: "wood",
  "grass-starter": "leaf",
  "oak-sapling": "leaf",
  "maple-sapling": "crimson",
  "pine-sapling": "darkLeaf",
  weed: "leaf",
  rock: "stone",
  stump: "wood",
  twig: "darkWood",
  "crop-sprout": "leaf",
  "tea-bush": "darkLeaf",
  "berry-bush": "darkLeaf",

  bouquet: "clothPink",
  "heart-pendant": "ruby",
  "dinosaur-egg": "melon",
  "ancient-doll": "clay",
  treasure: "wood",
  "star-drop": "amethyst",
  "lost-book": "clothRed",
  "battery-pack": "iron",
};

const tagMaterials: Array<[string, MaterialName]> = [
  ["tool", "iron"],
  ["seed", "linen"],
  ["crop", "leaf"],
  ["forage", "leaf"],
  ["fish", "fish"],
  ["gem", "crystal"],
  ["mineral", "crystal"],
  ["resource", "stone"],
  ["machine", "wood"],
  ["furniture", "wood"],
  ["food", "bread"],
  ["farm", "wood"],
  ["world", "stone"],
  ["tree", "leaf"],
  ["special", "gold"],
  ["gift", "clothPink"],
];

export function objectMaterial(id: string, tags: string[]): MaterialName {
  const explicit = objectMaterials[id];
  if (explicit) {
    return explicit;
  }
  for (const [tag, material] of tagMaterials) {
    if (tags.includes(tag)) {
      return material;
    }
  }
  return "stone";
}

export function objectZonesFor(id: string): Zone[] {
  return objectZones[id] ?? [];
}

export type VillagerPalette = {
  hair: MaterialName;
  top: MaterialName;
  bottom: MaterialName;
  prop: MaterialName;
};

/**
 * Character bands follow the fixed skeleton in `draw-characters`: headwear
 * above the face, skin through the head, then torso and legs.
 */
export function villagerZones(
  faceY: number,
  torsoY: number,
  look: VillagerPalette,
  facing: "front" | "back" = "front",
): Zone[] {
  const legsY = torsoY + 8;
  const hairThrough = facing === "back" ? torsoY : faceY;

  return [
    { material: look.prop, test: (x, y) => (x <= 3 || x >= 12) && y >= faceY },
    { material: look.hair, test: (_x, y) => y < hairThrough },
    // Hair frames the face on both sides in the front and profile views.
    {
      material: look.hair,
      test: (x, y) => y < torsoY && (x <= 4 || x >= 11),
    },
    { material: "skin", test: (_x, y) => y < torsoY },
    { material: look.top, test: (_x, y) => y < legsY },
    { material: "leather", test: (_x, y) => y >= 29 },
    { material: look.bottom, test: () => true },
  ];
}

export function animalZones(species: string): {
  base: MaterialName;
  zones: Zone[];
} {
  switch (species) {
    case "chicken":
      return {
        base: "white",
        zones: [
          { material: "crimson", test: (_x, y) => y <= 17 },
          { material: "straw", test: (_x, y) => y >= 25 },
        ],
      };
    case "duck":
      return {
        base: "clothTeal",
        zones: [{ material: "straw", test: (_x, y) => y >= 25 }],
      };
    case "rabbit":
      return {
        base: "linen",
        zones: [{ material: "pinkFur", test: (_x, y) => y <= 19 }],
      };
    case "cow":
      return {
        base: "white",
        zones: [
          {
            material: "shadowFur",
            test: (x, y) => y <= 12 || (x <= 5 && y >= 17),
          },
          { material: "pinkFur", test: (_x, y) => y >= 21 && y <= 23 },
        ],
      };
    case "goat":
      return {
        base: "linen",
        zones: [{ material: "bone", test: (_x, y) => y <= 9 }],
      };
    case "sheep":
      return {
        base: "white",
        zones: [{ material: "skin", test: (_x, y) => y >= 22 && y <= 25 }],
      };
    case "pig":
      return {
        base: "pinkFur",
        zones: [{ material: "clay", test: (_x, y) => y >= 18 && y <= 21 }],
      };
    case "horse":
      return {
        base: "leather",
        zones: [{ material: "darkWood", test: (_x, y) => y <= 8 }],
      };
    case "cat":
      return {
        base: "shadowFur",
        zones: [{ material: "linen", test: (_x, y) => y >= 22 }],
      };
    case "dog":
    default:
      return {
        base: "wood",
        zones: [{ material: "linen", test: (_x, y) => y >= 22 }],
      };
  }
}
