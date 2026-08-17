import { listSprites } from "../src/lib/catalog";

type Shape = {
  id: string;
  pixels: string[];
  ink: number;
  bounds: { width: number; height: number };
  localDensity: number;
  signature: string;
};

function shapeFor(id: string, pixels: string[]): Shape {
  const points: Array<[number, number]> = [];

  pixels.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      if (cell !== ".") {
        points.push([x, y]);
      }
    });
  });

  if (points.length === 0) {
    return {
      id,
      pixels,
      ink: 0,
      bounds: { width: 0, height: 0 },
      localDensity: 0,
      signature: "",
    };
  }

  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const occupied = new Set(points.map(([x, y]) => `${x - minX},${y - minY}`));
  const signature = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) =>
      occupied.has(`${x},${y}`) ? "#" : ".",
    ).join(""),
  ).join("/");

  return {
    id,
    pixels,
    ink: points.length,
    bounds: { width, height },
    localDensity: points.length / (width * height),
    signature,
  };
}

function similarity(a: Shape, b: Shape): number {
  if (
    a.pixels.length !== b.pixels.length ||
    a.pixels[0]?.length !== b.pixels[0]?.length
  ) {
    return 0;
  }

  let intersection = 0;
  let union = 0;
  a.pixels.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      const aInk = cell !== ".";
      const bInk = b.pixels[y]?.[x] !== ".";
      if (aInk || bInk) {
        union += 1;
      }
      if (aInk && bInk) {
        intersection += 1;
      }
    });
  });
  return union === 0 ? 1 : intersection / union;
}

async function main() {
  const entries = await listSprites();
  const shapes = entries.map((entry) => {
    const frameId =
      entry.sprite.animations[0]?.directions.down?.[0] ??
      Object.keys(entry.sprite.frames)[0];
    const pixels = frameId ? entry.sprite.frames[frameId]?.pixels : undefined;
    if (!pixels) {
      throw new Error(`No preview frame for ${entry.sprite.id}`);
    }
    return shapeFor(entry.sprite.id, pixels);
  });

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

  const weak = shapes.filter(
    (shape) =>
      shape.ink < 8 ||
      shape.bounds.width < 3 ||
      shape.bounds.height < 3 ||
      shape.localDensity > 0.72 ||
      shape.ink > shape.pixels.length * (shape.pixels[0]?.length ?? 0) * 0.58,
  );

  console.log(`Audited ${shapes.length} sprite previews.`);
  console.log(`Exact duplicate silhouettes: ${exact.length}`);
  for (const group of exact) {
    console.log(`  - ${group.map((shape) => shape.id).join(", ")}`);
  }
  console.log(
    `Close silhouette neighbors for human review (IoU ≥ 0.78): ${near.length}`,
  );
  for (const pair of near.sort((a, b) => b.score - a.score)) {
    console.log(`  - ${pair.a} / ${pair.b}: ${(pair.score * 100).toFixed(1)}%`);
  }
  console.log(`Weak density or bounds: ${weak.length}`);
  for (const shape of weak) {
    console.log(
      `  - ${shape.id}: ${shape.ink}px, ${shape.bounds.width}×${shape.bounds.height} bounds, ${(shape.localDensity * 100).toFixed(0)}% local density`,
    );
  }

  if (exact.length > 0 || weak.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
