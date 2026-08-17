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
