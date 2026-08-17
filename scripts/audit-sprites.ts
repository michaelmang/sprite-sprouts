import { listSprites, type CatalogEntry } from "../src/lib/catalog";
import type { SpriteDocument } from "../src/lib/sprite-schema";

type Shape = {
  id: string;
  /** Palette-resolved colours, so comparisons survive per-sprite palette keys. */
  colors: Array<Array<string | null>>;
  ink: number;
  bounds: { width: number; height: number };
  distinctColors: number;
  signature: string;
};

function colorGrid(
  sprite: SpriteDocument,
  pixels: string[],
): Array<Array<string | null>> {
  return pixels.map((row) =>
    [...row].map((cell) => sprite.palette[cell]?.color ?? null),
  );
}

function shapeFor(id: string, sprite: SpriteDocument, pixels: string[]): Shape {
  const colors = colorGrid(sprite, pixels);
  const points: Array<[number, number]> = [];
  const used = new Set<string>();

  colors.forEach((row, y) => {
    row.forEach((color, x) => {
      if (color) {
        points.push([x, y]);
        used.add(color);
      }
    });
  });

  if (points.length === 0) {
    return {
      id,
      colors,
      ink: 0,
      bounds: { width: 0, height: 0 },
      distinctColors: 0,
      signature: "",
    };
  }

  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const width = Math.max(...xs) - minX + 1;
  const height = Math.max(...ys) - minY + 1;

  const signature = Array.from({ length: height }, (_, y) =>
    Array.from(
      { length: width },
      (_, x) => colors[minY + y]?.[minX + x] ?? "-",
    ).join(","),
  ).join("/");

  return {
    id,
    colors,
    ink: points.length,
    bounds: { width, height },
    distinctColors: used.size,
    signature,
  };
}

/** Agreement over painted cells: same shape in different colours is not a clash. */
function similarity(a: Shape, b: Shape): number {
  if (a.colors.length !== b.colors.length) {
    return 0;
  }

  let matching = 0;
  let union = 0;
  a.colors.forEach((row, y) => {
    row.forEach((color, x) => {
      const other = b.colors[y]?.[x] ?? null;
      if (color || other) {
        union += 1;
      }
      if (color && other && color === other) {
        matching += 1;
      }
    });
  });

  return union === 0 ? 1 : matching / union;
}

function previewPixels(entry: CatalogEntry): string[] {
  const frameId =
    entry.sprite.animations[0]?.directions.down?.[0] ??
    Object.keys(entry.sprite.frames)[0];
  const pixels = frameId ? entry.sprite.frames[frameId]?.pixels : undefined;
  if (!pixels) {
    throw new Error(`No preview frame for ${entry.sprite.id}`);
  }
  return pixels;
}

async function main() {
  const entries = await listSprites();
  const shapes = entries.map((entry) =>
    shapeFor(entry.sprite.id, entry.sprite, previewPixels(entry)),
  );

  const duplicateGroups = new Map<string, Shape[]>();
  for (const shape of shapes) {
    const list = duplicateGroups.get(shape.signature) ?? [];
    list.push(shape);
    duplicateGroups.set(shape.signature, list);
  }

  const exact = [...duplicateGroups.values()].filter(
    (group) => group.length > 1,
  );

  const near: Array<{ a: string; b: string; score: number }> = [];
  for (let i = 0; i < shapes.length; i += 1) {
    for (let j = i + 1; j < shapes.length; j += 1) {
      const a = shapes[i];
      const b = shapes[j];
      if (!a || !b || a.signature === b.signature) {
        continue;
      }
      const score = similarity(a, b);
      if (score >= 0.78) {
        near.push({ a: a.id, b: b.id, score });
      }
    }
  }

  const weak: string[] = [];
  for (const [index, shape] of shapes.entries()) {
    const entry = entries[index];
    if (!entry) {
      continue;
    }
    const isObject = entry.sprite.kind === "object";
    const longestSide = Math.max(shape.bounds.width, shape.bounds.height);

    if (shape.ink < 18) {
      weak.push(`${shape.id}: only ${shape.ink} painted pixels`);
    }
    if (shape.bounds.width < 3 || shape.bounds.height < 3) {
      weak.push(`${shape.id}: degenerate bounds`);
    }
    if (isObject && longestSide < 11) {
      weak.push(`${shape.id}: fills only ${longestSide}px of the 16px tile`);
    }
    if (shape.distinctColors < 3) {
      weak.push(
        `${shape.id}: ${shape.distinctColors} colours, needs an outline, body, and shading step`,
      );
    }
  }

  const frameRoles = [
    "idle-down",
    "idle-right",
    "idle-up",
    "walk-down-left",
    "walk-down-right",
  ] as const;
  const directionalDuplicates: Array<{ frameId: string; ids: string[] }> = [];
  const frameFaults: string[] = [];

  for (const frameId of frameRoles) {
    const bySignature = new Map<string, string[]>();
    for (const entry of entries.filter(
      (item) => item.sprite.kind === "character",
    )) {
      const pixels = entry.sprite.frames[frameId]?.pixels;
      if (!pixels) {
        continue;
      }
      const signature = shapeFor(
        entry.sprite.id,
        entry.sprite,
        pixels,
      ).signature;
      const ids = bySignature.get(signature) ?? [];
      ids.push(entry.sprite.id);
      bySignature.set(signature, ids);
    }
    for (const ids of bySignature.values()) {
      if (ids.length > 1) {
        directionalDuplicates.push({ frameId, ids });
      }
    }
  }

  for (const entry of entries.filter(
    (item) => item.sprite.kind === "character",
  )) {
    const { sprite } = entry;
    const down = sprite.frames["idle-down"]?.pixels;
    const up = sprite.frames["idle-up"]?.pixels;
    const stepA = sprite.frames["walk-down-left"]?.pixels;
    const stepB = sprite.frames["walk-down-right"]?.pixels;

    if (
      sprite.tags.includes("animal") &&
      down &&
      up &&
      down.join("/") === up.join("/")
    ) {
      frameFaults.push(`${sprite.id}: animal rear view matches front view`);
    }
    if (stepA && stepB && stepA.join("/") === stepB.join("/")) {
      frameFaults.push(`${sprite.id}: both walk phases are identical`);
    }
    for (const [frameId, frame] of Object.entries(sprite.frames)) {
      if (frame.pixels.at(-1)?.includes("#")) {
        frameFaults.push(`${sprite.id}/${frameId}: touches bottom canvas edge`);
      }
    }
  }

  console.log(`Audited ${shapes.length} sprite previews.`);
  console.log(`Exact duplicate sprites: ${exact.length}`);
  for (const group of exact) {
    console.log(`  - ${group.map((shape) => shape.id).join(", ")}`);
  }
  console.log(`Close neighbours (painted overlap ≥ 0.78): ${near.length}`);
  for (const pair of near.sort((a, b) => b.score - a.score)) {
    console.log(`  - ${pair.a} / ${pair.b}: ${(pair.score * 100).toFixed(1)}%`);
  }
  console.log(`Weak fill, colour, or bounds: ${weak.length}`);
  for (const message of weak) {
    console.log(`  - ${message}`);
  }
  console.log(
    `Duplicate character silhouettes in corresponding directions: ${directionalDuplicates.length}`,
  );
  for (const group of directionalDuplicates) {
    console.log(`  - ${group.frameId}: ${group.ids.join(", ")}`);
  }
  console.log(`Directional/frame faults: ${frameFaults.length}`);
  for (const fault of frameFaults) {
    console.log(`  - ${fault}`);
  }

  if (
    exact.length > 0 ||
    near.length > 0 ||
    weak.length > 0 ||
    directionalDuplicates.length > 0 ||
    frameFaults.length > 0
  ) {
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
