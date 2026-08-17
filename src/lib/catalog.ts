import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import {
  kindFolder,
  spriteSchema,
  type SpriteDocument,
  type SpriteKind,
} from "./sprite-schema";

export const SPRITES_DIR = path.join(process.cwd(), "sprites");

export type CatalogEntry = {
  sprite: SpriteDocument;
  relativeDir: string;
  filePath: string;
};

export async function listSprites(): Promise<CatalogEntry[]> {
  const kinds: SpriteKind[] = ["character", "object"];
  const entries: CatalogEntry[] = [];

  for (const kind of kinds) {
    const kindDir = path.join(SPRITES_DIR, kindFolder[kind]);
    let folders: string[] = [];

    try {
      folders = await readdir(kindDir);
    } catch {
      continue;
    }

    for (const folder of folders) {
      if (folder.startsWith(".")) {
        continue;
      }

      const filePath = path.join(kindDir, folder, "sprite.json");

      try {
        const raw = await readFile(filePath, "utf8");
        const parsed = spriteSchema.parse(JSON.parse(raw));
        entries.push({
          sprite: parsed,
          relativeDir: path.posix.join("sprites", kindFolder[kind], folder),
          filePath,
        });
      } catch {
        // Invalid sprites are reported by `yarn sprites:validate`.
      }
    }
  }

  return entries.sort((a, b) => a.sprite.name.localeCompare(b.sprite.name));
}

export async function getSprite(
  kind: SpriteKind,
  id: string,
): Promise<CatalogEntry | null> {
  const entries = await listSprites();
  return (
    entries.find(
      (entry) => entry.sprite.kind === kind && entry.sprite.id === id,
    ) ?? null
  );
}

const characterCategoryOrder = ["Player", "Villagers", "Animals"];
const objectCategoryOrder = [
  "Tools",
  "Crops",
  "Seeds",
  "Forage",
  "Resources",
  "Gems & minerals",
  "Fish",
  "Food & artisan",
  "Machines",
  "Furniture",
  "Farm & world",
  "Special",
  "Other",
];

export function categoryFor(sprite: SpriteDocument): string {
  if (sprite.kind === "character") {
    if (sprite.tags.includes("player")) {
      return "Player";
    }
    if (sprite.tags.includes("animal")) {
      return "Animals";
    }
    return "Villagers";
  }

  const labels: Record<string, string> = {
    tool: "Tools",
    crop: "Crops",
    seed: "Seeds",
    forage: "Forage",
    resource: "Resources",
    gem: "Gems & minerals",
    mineral: "Gems & minerals",
    fish: "Fish",
    food: "Food & artisan",
    machine: "Machines",
    furniture: "Furniture",
    farm: "Farm & world",
    world: "Farm & world",
    tree: "Farm & world",
    gift: "Special",
    special: "Special",
    artifact: "Special",
  };

  for (const tag of sprite.tags) {
    const label = labels[tag];
    if (label) {
      return label;
    }
  }

  return "Other";
}

export function groupByCategory(
  entries: CatalogEntry[],
  kind: SpriteKind,
): Array<{ category: string; entries: CatalogEntry[] }> {
  const order =
    kind === "character" ? characterCategoryOrder : objectCategoryOrder;
  const groups = new Map<string, CatalogEntry[]>();

  for (const entry of entries.filter((item) => item.sprite.kind === kind)) {
    const category = categoryFor(entry.sprite);
    const list = groups.get(category) ?? [];
    list.push(entry);
    groups.set(category, list);
  }

  return order
    .filter((category) => groups.has(category))
    .map((category) => ({
      category,
      entries: groups.get(category) ?? [],
    }));
}
