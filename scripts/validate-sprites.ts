import { mkdir, readdir, readFile } from "node:fs/promises";
import path from "node:path";

import {
  kindFolder,
  spriteSchema,
  type SpriteKind,
} from "../src/lib/sprite-schema";

const SPRITES_DIR = path.join(process.cwd(), "sprites");

async function listKindFolders(kind: SpriteKind): Promise<string[]> {
  const kindDir = path.join(SPRITES_DIR, kindFolder[kind]);

  try {
    return (await readdir(kindDir)).filter((name) => !name.startsWith("."));
  } catch {
    await mkdir(kindDir, { recursive: true });
    return [];
  }
}

async function main() {
  const kinds: SpriteKind[] = ["character", "object"];
  const errors: string[] = [];
  let checked = 0;

  for (const kind of kinds) {
    const folders = await listKindFolders(kind);

    for (const folder of folders) {
      checked += 1;
      const filePath = path.join(
        SPRITES_DIR,
        kindFolder[kind],
        folder,
        "sprite.json",
      );
      const relative = path.posix.join(
        "sprites",
        kindFolder[kind],
        folder,
        "sprite.json",
      );

      let raw: string;
      try {
        raw = await readFile(filePath, "utf8");
      } catch {
        errors.push(`${relative}: missing sprite.json`);
        continue;
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch (error) {
        errors.push(
          `${relative}: invalid JSON (${error instanceof Error ? error.message : error})`,
        );
        continue;
      }

      const result = spriteSchema.safeParse(parsed);
      if (!result.success) {
        for (const issue of result.error.issues) {
          const where = issue.path.length > 0 ? issue.path.join(".") : "(root)";
          errors.push(`${relative}: ${where}: ${issue.message}`);
        }
        continue;
      }

      if (result.data.id !== folder) {
        errors.push(
          `${relative}: id "${result.data.id}" must match folder "${folder}"`,
        );
      }

      if (result.data.kind !== kind) {
        errors.push(
          `${relative}: kind "${result.data.kind}" must be "${kind}"`,
        );
      }
    }
  }

  if (errors.length > 0) {
    console.error(
      `Sprite validation failed (${errors.length} issue${errors.length === 1 ? "" : "s"}):\n`,
    );
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Validated ${checked} sprite${checked === 1 ? "" : "s"}.`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
