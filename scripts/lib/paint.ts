export type Material = {
  outline: string;
  dark: string;
  base: string;
  light: string;
};

/**
 * Four-step ramps in the Stardew Valley register: saturated mid-tones, a warm
 * dark outline rather than pure black, and a light step used only as a rim.
 */
export const materials = {
  wood: {
    outline: "#3a2412",
    dark: "#6b4520",
    base: "#a06a34",
    light: "#c89355",
  },
  darkWood: {
    outline: "#241608",
    dark: "#4a2e15",
    base: "#6d4622",
    light: "#8f6236",
  },
  iron: {
    outline: "#23262d",
    dark: "#525b68",
    base: "#8b95a4",
    light: "#c2cad6",
  },
  copper: {
    outline: "#4d2410",
    dark: "#95431b",
    base: "#cf7430",
    light: "#f0a35c",
  },
  gold: {
    outline: "#5f4104",
    dark: "#ad7c0c",
    base: "#efc01f",
    light: "#ffe884",
  },
  stone: {
    outline: "#33322f",
    dark: "#5d5b57",
    base: "#8b8880",
    light: "#b9b6ae",
  },
  coal: {
    outline: "#111114",
    dark: "#26262c",
    base: "#3b3b45",
    light: "#5c5c69",
  },
  leaf: {
    outline: "#17351a",
    dark: "#2c6630",
    base: "#4a9a44",
    light: "#7cc45f",
  },
  darkLeaf: {
    outline: "#0f2413",
    dark: "#1f4a24",
    base: "#337038",
    light: "#4f9450",
  },
  straw: {
    outline: "#6b4a15",
    dark: "#a8802a",
    base: "#dcb14a",
    light: "#f4d67f",
  },
  skin: {
    outline: "#6d422a",
    dark: "#b47f52",
    base: "#e6b78d",
    light: "#f8d9b6",
  },
  hair: {
    outline: "#2a1a10",
    dark: "#4d2f1a",
    base: "#77492a",
    light: "#a06b3f",
  },
  cloth: {
    outline: "#2b2a3c",
    dark: "#4a4a68",
    base: "#6f6f95",
    light: "#9a9ac0",
  },
  clothRed: {
    outline: "#4d1517",
    dark: "#8d2528",
    base: "#c33b3c",
    light: "#e57070",
  },
  clothBlue: {
    outline: "#13294d",
    dark: "#24487f",
    base: "#3a6fb8",
    light: "#6d9de0",
  },
  clothGreen: {
    outline: "#14361f",
    dark: "#256239",
    base: "#3a9257",
    light: "#63bd81",
  },
  clothPurple: {
    outline: "#2e1740",
    dark: "#512a6d",
    base: "#7a44a0",
    light: "#a878c8",
  },
  clothTeal: {
    outline: "#10333a",
    dark: "#1d5c68",
    base: "#2d8b9c",
    light: "#5cbccc",
  },
  clothPink: {
    outline: "#5a2038",
    dark: "#94395e",
    base: "#c85d8b",
    light: "#e995b6",
  },
  linen: {
    outline: "#6a6152",
    dark: "#a89b81",
    base: "#d8ccae",
    light: "#f2ead1",
  },
  leather: {
    outline: "#2e1b0f",
    dark: "#54331c",
    base: "#7c4e2b",
    light: "#a3703f",
  },
  water: {
    outline: "#0d2f3d",
    dark: "#1a5c78",
    base: "#2f8fae",
    light: "#67c6dc",
  },
  fish: {
    outline: "#2a3b4d",
    dark: "#4d6b85",
    base: "#7b9db8",
    light: "#b3cede",
  },
  salmon: {
    outline: "#5e2a1c",
    dark: "#9c4a2c",
    base: "#d4763f",
    light: "#f0a86e",
  },
  crimson: {
    outline: "#4a1010",
    dark: "#8a1f1f",
    base: "#c53030",
    light: "#e86a6a",
  },
  berry: {
    outline: "#1d2352",
    dark: "#343d85",
    base: "#5058bd",
    light: "#8189dd",
  },
  grape: {
    outline: "#331a4a",
    dark: "#5a2e7d",
    base: "#8347ac",
    light: "#ac7bcd",
  },
  pumpkin: {
    outline: "#5e2b06",
    dark: "#a04f10",
    base: "#dd7c1c",
    light: "#f4a852",
  },
  tomato: {
    outline: "#521212",
    dark: "#93221f",
    base: "#cf3a2f",
    light: "#ec7566",
  },
  melon: {
    outline: "#2c4a18",
    dark: "#4f7a28",
    base: "#78ad3c",
    light: "#a6d46a",
  },
  cream: {
    outline: "#8a7351",
    dark: "#cdb47f",
    base: "#f0e0b6",
    light: "#fdf6e0",
  },
  white: {
    outline: "#7d7a72",
    dark: "#bab6ab",
    base: "#e8e5dc",
    light: "#ffffff",
  },
  cheese: {
    outline: "#7a5406",
    dark: "#bd8a12",
    base: "#efc23c",
    light: "#fbdf85",
  },
  honey: {
    outline: "#6d4204",
    dark: "#ad700d",
    base: "#e2a021",
    light: "#f7cc63",
  },
  glass: {
    outline: "#3b5560",
    dark: "#6e909c",
    base: "#a7c6cf",
    light: "#dcecf1",
  },
  crystal: {
    outline: "#1d4360",
    dark: "#2f7a9c",
    base: "#4fb4d0",
    light: "#9be3f0",
  },
  amethyst: {
    outline: "#3a1a5c",
    dark: "#6330a0",
    base: "#9155d6",
    light: "#c093ef",
  },
  emerald: {
    outline: "#08402c",
    dark: "#12734b",
    base: "#1fa870",
    light: "#5fd6a5",
  },
  ruby: {
    outline: "#4e0d1c",
    dark: "#8f1830",
    base: "#cc2a4c",
    light: "#ec6b83",
  },
  soil: {
    outline: "#2c1c10",
    dark: "#4e3620",
    base: "#6f5030",
    light: "#8f6c46",
  },
  clay: {
    outline: "#5a3524",
    dark: "#8e5a3d",
    base: "#b8825d",
    light: "#d6ab89",
  },
  fire: {
    outline: "#6b1e05",
    dark: "#ad3d0a",
    base: "#e56b17",
    light: "#f9a83f",
  },
  bread: {
    outline: "#6b4415",
    dark: "#a5722c",
    base: "#d6a256",
    light: "#efc98c",
  },
  meat: {
    outline: "#5e2226",
    dark: "#9a4048",
    base: "#c9686f",
    light: "#e59ba0",
  },
  bone: {
    outline: "#7d7458",
    dark: "#b7ac8b",
    base: "#e0d7bb",
    light: "#f6f0dc",
  },
  shadowFur: {
    outline: "#241d18",
    dark: "#42352b",
    base: "#63503f",
    light: "#88705a",
  },
  pinkFur: {
    outline: "#6b3040",
    dark: "#a85668",
    base: "#dd8a99",
    light: "#f2b8c2",
  },
} satisfies Record<string, Material>;

export type MaterialName = keyof typeof materials;

export type Zone = {
  material: MaterialName;
  test: (x: number, y: number) => boolean;
};

export type PaletteEntry = { name: string; color: string | null };

export type PaintedSprite = {
  frames: string[][];
  palette: Record<string, PaletteEntry>;
};

const PALETTE_CHARS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

type Role = "outline" | "dark" | "base" | "light";

function materialAt(
  x: number,
  y: number,
  base: MaterialName,
  zones: Zone[],
): MaterialName {
  for (const zone of zones) {
    if (zone.test(x, y)) {
      return zone.material;
    }
  }
  return base;
}

/**
 * Classifies each cell of a line-art frame into an outline/fill/rim role.
 * Interiors are found by flooding the exterior from the canvas border, so a
 * closed contour becomes a solid body and thin strokes stay as material edges.
 */
function roleGrid(frame: string[]): Array<Array<Role | null>> {
  const height = frame.length;
  const width = frame[0]?.length ?? 0;
  const ink = frame.map((row) => [...row].map((cell) => cell !== "."));
  const exterior = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false),
  );

  const queue: Array<[number, number]> = [];
  for (let x = 0; x < width; x += 1) {
    queue.push([x, 0], [x, height - 1]);
  }
  for (let y = 0; y < height; y += 1) {
    queue.push([0, y], [width - 1, y]);
  }

  while (queue.length > 0) {
    const [x, y] = queue.pop() as [number, number];
    if (x < 0 || y < 0 || x >= width || y >= height) {
      continue;
    }
    if (exterior[y][x] || ink[y][x]) {
      continue;
    }
    exterior[y][x] = true;
    queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  const isFill = (x: number, y: number): boolean =>
    x >= 0 &&
    y >= 0 &&
    x < width &&
    y < height &&
    !ink[y][x] &&
    !exterior[y][x];

  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x): Role | null => {
      if (isFill(x, y)) {
        const openAbove = !isFill(x, y - 1);
        const openLeft = !isFill(x - 1, y);
        const openBelow = !isFill(x, y + 1);
        const openRight = !isFill(x + 1, y);
        if ((openAbove || openLeft) && !(openBelow || openRight)) {
          return "light";
        }
        if (openBelow || openRight) {
          return "dark";
        }
        return "base";
      }

      if (!ink[y][x]) {
        return null;
      }

      const touchesBody =
        isFill(x + 1, y) ||
        isFill(x - 1, y) ||
        isFill(x, y + 1) ||
        isFill(x, y - 1);

      if (touchesBody) {
        return "outline";
      }

      // A stroke with no body behind it is the object itself, so it is shaded
      // like a solid: lit along its top edge, shadowed along the bottom.
      const solid = (nx: number, ny: number): boolean =>
        nx >= 0 && ny >= 0 && nx < width && ny < height && ink[ny][nx];
      const openAbove = !solid(x, y - 1);
      const openBelow = !solid(x, y + 1);

      if (openAbove && !openBelow) {
        return "light";
      }
      if (openBelow && !openAbove) {
        return "dark";
      }
      if (!solid(x + 1, y)) {
        return "dark";
      }
      return "base";
    }),
  );
}

export function paintFrames(
  frames: string[][],
  base: MaterialName,
  zones: Zone[] | Zone[][] = [],
): PaintedSprite {
  const perFrame = Array.isArray(zones[0]);
  const zonesFor = (index: number): Zone[] =>
    perFrame ? ((zones as Zone[][])[index] ?? []) : (zones as Zone[]);

  const colorGrids = frames.map((frame, index) => {
    const roles = roleGrid(frame);
    const frameZones = zonesFor(index);
    return roles.map((row, y) =>
      row.map((role, x) => {
        if (role === null) {
          return null;
        }
        const material = materials[materialAt(x, y, base, frameZones)];
        return material[role];
      }),
    );
  });

  const allZones = perFrame ? (zones as Zone[][]).flat() : (zones as Zone[]);
  const palette: Record<string, PaletteEntry> = {
    ".": { name: "empty", color: null },
  };
  const charForColor = new Map<string, string>();
  let nextChar = 0;

  const painted = colorGrids.map((grid) =>
    grid.map((row) =>
      row
        .map((color) => {
          if (!color) {
            return ".";
          }
          const existing = charForColor.get(color);
          if (existing) {
            return existing;
          }
          const char = PALETTE_CHARS[nextChar];
          if (!char) {
            throw new Error("Ran out of palette characters");
          }
          nextChar += 1;
          charForColor.set(color, char);
          palette[char] = { name: nameForColor(color, base, allZones), color };
          return char;
        })
        .join(""),
    ),
  );

  return { frames: painted, palette };
}

function nameForColor(
  color: string,
  base: MaterialName,
  zones: Zone[],
): string {
  const candidates: MaterialName[] = [
    base,
    ...zones.map((zone) => zone.material),
  ];
  for (const name of candidates) {
    const material = materials[name];
    for (const role of ["outline", "dark", "base", "light"] as const) {
      if (material[role] === color) {
        return `${name}-${role}`;
      }
    }
  }
  return "accent";
}
