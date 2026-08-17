type Bounds = { minX: number; minY: number; width: number; height: number };

function boundsOf(pixels: string[]): Bounds | null {
  const points: Array<[number, number]> = [];
  pixels.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      if (cell !== ".") {
        points.push([x, y]);
      }
    });
  });

  if (points.length === 0) {
    return null;
  }

  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return {
    minX,
    minY,
    width: Math.max(...xs) - minX + 1,
    height: Math.max(...ys) - minY + 1,
  };
}

function inkCount(pixels: string[]): number {
  return pixels.reduce(
    (total, row) => total + [...row].filter((cell) => cell !== ".").length,
    0,
  );
}

function blank(width: number, height: number): string[][] {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => "."),
  );
}

/**
 * Scales line art up so it occupies most of the tile, matching the way
 * Stardew Valley item icons nearly fill their 16x16 cell.
 */
export type FittedTile = {
  pixels: string[];
  /** Maps a tile coordinate back to the source art, so material zones stay put. */
  toSource: (x: number, y: number) => [number, number];
};

export function fitToCanvas(pixels: string[], target = 13): FittedTile {
  const height = pixels.length;
  const width = pixels[0]?.length ?? 0;
  const identity: FittedTile = {
    pixels,
    toSource: (x, y) => [x, y],
  };
  const bounds = boundsOf(pixels);
  if (!bounds) {
    return identity;
  }

  const factor = Math.min(
    target / bounds.width,
    target / bounds.height,
    (width - 2) / bounds.width,
    (height - 2) / bounds.height,
  );
  if (factor <= 1.12) {
    return identity;
  }

  const scaledW = Math.min(width, Math.round(bounds.width * factor));
  const scaledH = Math.min(height, Math.round(bounds.height * factor));
  const offsetX = Math.floor((width - scaledW) / 2);
  const offsetY = Math.floor((height - scaledH) / 2);
  const grid = blank(width, height);

  for (let ny = 0; ny < scaledH; ny += 1) {
    for (let nx = 0; nx < scaledW; nx += 1) {
      const sx = bounds.minX + Math.floor((nx * bounds.width) / scaledW);
      const sy = bounds.minY + Math.floor((ny * bounds.height) / scaledH);
      if (pixels[sy]?.[sx] !== ".") {
        const gy = offsetY + ny;
        const gx = offsetX + nx;
        if (grid[gy]?.[gx] !== undefined) {
          grid[gy][gx] = "#";
        }
      }
    }
  }

  return {
    pixels: grid.map((row) => row.join("")),
    toSource: (x, y) => [
      bounds.minX + Math.floor(((x - offsetX) * bounds.width) / scaledW),
      bounds.minY + Math.floor(((y - offsetY) * bounds.height) / scaledH),
    ],
  };
}

/**
 * Thickens strokes that are still too sparse to hold colour, so hairline
 * shapes become solid objects rather than scratches.
 */
export function thickenIfSparse(pixels: string[], threshold = 0.32): string[] {
  const bounds = boundsOf(pixels);
  if (!bounds) {
    return pixels;
  }

  const density = inkCount(pixels) / (bounds.width * bounds.height);
  if (density >= threshold) {
    return pixels;
  }

  const height = pixels.length;
  const width = pixels[0]?.length ?? 0;
  const grid = pixels.map((row) => [...row]);

  for (let y = height - 1; y >= 0; y -= 1) {
    for (let x = width - 1; x >= 0; x -= 1) {
      if (pixels[y]?.[x] === ".") {
        continue;
      }
      if (x + 1 < width) {
        grid[y][x + 1] = "#";
      }
      if (y + 1 < height) {
        grid[y + 1][x] = "#";
      }
    }
  }

  return grid.map((row) => row.join(""));
}

export function fillTile(pixels: string[], target = 13): FittedTile {
  const fitted = fitToCanvas(pixels, target);
  return {
    pixels: thickenIfSparse(fitted.pixels),
    toSource: fitted.toSource,
  };
}
