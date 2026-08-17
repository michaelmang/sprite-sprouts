import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  emptyGrid,
  kindFolder,
  type SpriteDocument,
  type SpriteKind,
} from "../src/lib/sprite-schema";
import { pixelsToSvg } from "../src/lib/render-svg";

const usage = `Usage: yarn sprites:new <character|object> <id> [name]

Examples:
  yarn sprites:new character river-npc "River"
  yarn sprites:new object watering-can
`;

function titleFromId(id: string): string {
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function main() {
  const [kindArg, id, ...nameParts] = process.argv.slice(2);

  if (!kindArg || !id || kindArg === "--help" || kindArg === "-h") {
    console.error(usage);
    process.exit(kindArg ? 0 : 1);
  }

  if (kindArg !== "character" && kindArg !== "object") {
    console.error(usage);
    process.exit(1);
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    console.error("id must be kebab-case, for example willow-farmer");
    process.exit(1);
  }

  const kind = kindArg as SpriteKind;
  const name = nameParts.join(" ").trim() || titleFromId(id);
  const canvas =
    kind === "character"
      ? { width: 16, height: 32 }
      : { width: 16, height: 16 };

  const sprite: SpriteDocument = {
    $schema: "../../../schemas/sprite.schema.json",
    schemaVersion: 1,
    id,
    name,
    kind,
    status: "outline",
    description: `Outline for ${name}.`,
    tags: [],
    canvas,
    pivot: { x: Math.floor(canvas.width / 2), y: canvas.height },
    palette: {
      ".": { name: "empty", color: null },
      "#": { name: "outline", color: "#2b2118" },
    },
    frames: {
      "idle-down": { pixels: emptyGrid(canvas.width, canvas.height) },
    },
    animations: [
      {
        id: "idle",
        frameMs: 400,
        directions: { down: ["idle-down"] },
      },
    ],
  };

  const dir = path.join(process.cwd(), "sprites", kindFolder[kind], id);
  const jsonPath = path.join(dir, "sprite.json");

  try {
    await access(jsonPath);
    console.error(
      `Already exists: ${path.posix.join("sprites", kindFolder[kind], id)}`,
    );
    process.exit(1);
  } catch {
    // New sprite folder.
  }

  await mkdir(dir, { recursive: true });
  const svgPath = path.join(dir, "outline.svg");
  const notesPath = path.join(dir, "notes.md");

  await writeFile(jsonPath, `${JSON.stringify(sprite, null, 2)}\n`);
  await writeFile(svgPath, `${pixelsToSvg(sprite, "idle-down")}\n`);
  await writeFile(
    notesPath,
    `# ${name}\n\nStatus: outline\n\nDraw into \`sprite.json\`, then run \`yarn sprites:render\`.\n`,
  );

  console.log(`Created ${path.posix.join("sprites", kindFolder[kind], id)}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
