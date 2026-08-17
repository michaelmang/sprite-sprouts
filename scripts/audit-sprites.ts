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
      shape.ink < 18 ||
      shape.bounds.width < 3 ||
      shape.bounds.height < 3 ||
      shape.localDensity > 0.72 ||
      shape.ink > shape.pixels.length * (shape.pixels[0]?.length ?? 0) * 0.58,
  );

  const frameRoles = [
    "idle-down",
    "idle-right",
    "idle-up",
    "walk-down-left",
    "walk-down-right",
  ] as const;
  const directionalDuplicates: Array<{
    frameId: string;
    ids: string[];
  }> = [];
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
      const signature = shapeFor(entry.sprite.id, pixels).signature;
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
