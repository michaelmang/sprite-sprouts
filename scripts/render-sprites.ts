import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { pixelsToSvg } from "../src/lib/render-svg";
import {
  kindFolder,
  spriteSchema,
  type SpriteKind,
} from "../src/lib/sprite-schema";

const SPRITES_DIR = path.join(process.cwd(), "sprites");

async function main() {
  const kinds: SpriteKind[] = ["character", "object"];
  let rendered = 0;

  for (const kind of kinds) {
    const kindDir = path.join(SPRITES_DIR, kindFolder[kind]);
    let folders: string[] = [];

    try {
      folders = (await readdir(kindDir)).filter(
        (name) => !name.startsWith("."),
      );
    } catch {
      continue;
    }

    for (const folder of folders) {
      const jsonPath = path.join(kindDir, folder, "sprite.json");
      const raw = await readFile(jsonPath, "utf8");
      const sprite = spriteSchema.parse(JSON.parse(raw));
      const previewFrame =
        sprite.animations[0]?.directions.down?.[0] ??
        Object.keys(sprite.frames)[0];

      if (!previewFrame) {
        throw new Error(`No frames to render for ${sprite.id}`);
      }

      const svgPath = path.join(kindDir, folder, "outline.svg");
      await writeFile(svgPath, `${pixelsToSvg(sprite, previewFrame)}\n`);
      rendered += 1;
      console.log(
        `Wrote ${path.posix.join("sprites", kindFolder[kind], folder, "outline.svg")}`,
      );
    }
  }

  console.log(`Rendered ${rendered} outline SVG${rendered === 1 ? "" : "s"}.`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
