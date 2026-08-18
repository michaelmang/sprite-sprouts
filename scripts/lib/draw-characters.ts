import { PixelCanvas, mirrorRows, stepLegs } from "./pixel-canvas";

export type VillagerLook = {
  hat:
    | "none"
    | "straw"
    | "top"
    | "pointed"
    | "cap"
    | "hood"
    | "bun"
    | "beret"
    | "souwester"
    | "hardhat"
    | "bandana"
    | "cowlick";
  glasses?: boolean;
  beard?: "none" | "short" | "long";
  body: "overalls" | "dress" | "robe" | "apron" | "suit" | "coat" | "shorts";
  scale?: "adult" | "child";
  accessory?:
    | "ledger"
    | "basket"
    | "hammer"
    | "mug"
    | "fish"
    | "staff"
    | "saw"
    | "stethoscope"
    | "book"
    | "pitchfork"
    | "net"
    | "cane"
    | "pickaxe"
    | "palette"
    | "lantern";
};

export type CharacterFrames = {
  down: string[];
  right: string[];
  left: string[];
  up: string[];
  walkLeft: string[];
  walkRight: string[];
};

function face(canvas: PixelCanvas, y: number, wide = false): void {
  const x0 = wide ? 4 : 5;
  const x1 = wide ? 11 : 10;
  canvas.rect(x0, y, x1 - x0 + 1, 7);
  canvas.plot(x0 + 2, y + 2);
  canvas.plot(x1 - 2, y + 2);
  canvas.hline(x0 + 3, x1 - 3, y + 4);
}

function legs(
  canvas: PixelCanvas,
  y: number,
  dress: boolean,
  short = false,
): void {
  const height = short ? 5 : 8;
  const foot = y + height - 1;

  if (dress) {
    // A skirt flares to the hem, then only the shoes break the silhouette.
    canvas.rect(4, y, 8, height - 2);
    canvas.hline(3, 12, y + height - 3);
    canvas.rect(4, foot - 1, 3, 2);
    canvas.rect(9, foot - 1, 3, 2);
    return;
  }

  // A gap between the legs keeps the walk cycle readable once the body is
  // filled with colour.
  canvas.rect(4, y, 3, height - 2);
  canvas.rect(9, y, 3, height - 2);
  canvas.rect(3, foot - 1, 4, 2);
  canvas.rect(9, foot - 1, 4, 2);
}

function accessoryDown(
  canvas: PixelCanvas,
  kind: VillagerLook["accessory"],
  torsoY: number,
): void {
  switch (kind) {
    case "ledger":
      canvas.rect(1, torsoY + 1, 4, 6);
      canvas.vline(3, torsoY + 2, torsoY + 5);
      break;
    case "basket":
      canvas.rect(11, torsoY + 4, 5, 5);
      canvas.circle(13, torsoY + 4, 2);
      break;
    case "hammer":
      canvas.vline(14, torsoY - 1, torsoY + 8);
      canvas.fillRect(11, torsoY - 2, 5, 3);
      break;
    case "mug":
      canvas.rect(12, torsoY + 2, 3, 4);
      canvas.plot(15, torsoY + 3);
      break;
    case "fish":
      canvas.line(1, torsoY + 6, 4, torsoY + 2);
      canvas.points([
        [1, torsoY + 6],
        [2, torsoY + 7],
        [3, torsoY + 6],
      ]);
      break;
    case "staff":
      canvas.vline(14, torsoY - 6, 30);
      canvas.diamond(14, torsoY - 7, 2);
      break;
    case "saw":
      canvas.line(1, torsoY + 7, 5, torsoY + 2);
      canvas.points([
        [1, torsoY + 6],
        [2, torsoY + 5],
        [3, torsoY + 4],
      ]);
      break;
    case "stethoscope":
      canvas.circle(8, torsoY + 3, 2);
      canvas.line(6, torsoY + 1, 5, torsoY - 1);
      canvas.line(10, torsoY + 1, 11, torsoY - 1);
      canvas.plot(8, torsoY + 6);
      break;
    case "book":
      canvas.rect(1, torsoY + 2, 5, 5);
      canvas.vline(3, torsoY + 2, torsoY + 6);
      break;
    case "pitchfork":
      canvas.vline(14, torsoY - 5, 30);
      canvas.hline(12, 15, torsoY - 5);
      canvas.vline(12, torsoY - 5, torsoY - 2);
      canvas.vline(15, torsoY - 5, torsoY - 2);
      break;
    case "net":
      canvas.circle(13, torsoY - 1, 3);
      canvas.line(11, torsoY + 1, 4, 30);
      break;
    case "cane":
      canvas.vline(13, torsoY + 3, 30);
      canvas.hline(11, 13, torsoY + 3);
      break;
    case "pickaxe":
      canvas.line(2, 29, 13, torsoY - 2);
      canvas.line(9, torsoY - 3, 15, torsoY);
      break;
    case "palette":
      canvas.circle(2, torsoY + 4, 3);
      canvas.plot(1, torsoY + 3);
      canvas.plot(3, torsoY + 4);
      canvas.line(12, torsoY + 7, 15, torsoY - 2);
      break;
    case "lantern":
      canvas.rect(11, torsoY + 3, 5, 6);
      canvas.hline(12, 14, torsoY + 2);
      canvas.plot(13, torsoY + 5);
      break;
    default:
      break;
  }
}

function accessorySide(
  canvas: PixelCanvas,
  kind: VillagerLook["accessory"],
  torsoY: number,
): void {
  if (kind === "staff" || kind === "pitchfork" || kind === "lantern") {
    canvas.vline(3, torsoY - 5, 30);
    if (kind === "staff") {
      canvas.diamond(3, torsoY - 6, 2);
    } else if (kind === "pitchfork") {
      canvas.hline(1, 5, torsoY - 5);
      canvas.vline(1, torsoY - 5, torsoY - 2);
      canvas.vline(5, torsoY - 5, torsoY - 2);
    } else {
      canvas.rect(1, torsoY + 3, 5, 6);
    }
    return;
  }
  if (kind === "hammer" || kind === "pickaxe" || kind === "saw") {
    canvas.line(3, 29, 6, torsoY);
    if (kind === "hammer") {
      canvas.fillRect(3, torsoY - 2, 6, 3);
    } else if (kind === "pickaxe") {
      canvas.line(2, torsoY, 9, torsoY - 3);
    } else {
      canvas.line(2, torsoY + 2, 7, torsoY - 2);
    }
    return;
  }
  if (kind === "ledger" || kind === "book") {
    canvas.rect(3, torsoY + 1, 5, 6);
    canvas.vline(5, torsoY + 2, torsoY + 5);
  } else if (kind === "basket") {
    canvas.rect(3, torsoY + 4, 6, 5);
    canvas.circle(6, torsoY + 4, 2);
  } else if (kind === "mug") {
    canvas.rect(4, torsoY + 2, 4, 4);
    canvas.plot(3, torsoY + 3);
  } else if (kind === "fish") {
    canvas.line(3, torsoY + 6, 7, torsoY + 2);
    canvas.line(3, torsoY + 6, 1, torsoY + 4);
    canvas.line(3, torsoY + 6, 1, torsoY + 8);
  } else if (kind === "stethoscope") {
    canvas.circle(9, torsoY + 3, 2);
    canvas.line(8, torsoY + 1, 7, torsoY - 1);
  } else if (kind === "net") {
    canvas.circle(4, torsoY - 1, 3);
    canvas.line(6, torsoY + 1, 11, 29);
  } else if (kind === "cane") {
    canvas.vline(4, torsoY + 3, 30);
    canvas.hline(4, 6, torsoY + 3);
  } else if (kind === "palette") {
    canvas.circle(4, torsoY + 4, 3);
    canvas.line(10, torsoY + 6, 14, torsoY - 2);
  }
}

function accessoryUp(
  canvas: PixelCanvas,
  kind: VillagerLook["accessory"],
  torsoY: number,
): void {
  switch (kind) {
    case "ledger":
    case "book":
      canvas.rect(2, torsoY + 1, 4, 6);
      break;
    case "basket":
      canvas.rect(11, torsoY + 4, 5, 5);
      break;
    case "hammer":
      canvas.vline(14, torsoY - 1, 29);
      canvas.fillRect(11, torsoY - 2, 5, 3);
      break;
    case "mug":
      canvas.rect(12, torsoY + 2, 3, 4);
      break;
    case "fish":
      canvas.line(2, torsoY + 7, 5, torsoY + 2);
      canvas.line(2, torsoY + 7, 0, torsoY + 5);
      canvas.line(2, torsoY + 7, 0, torsoY + 9);
      break;
    case "staff":
      canvas.vline(14, torsoY - 6, 30);
      canvas.diamond(14, torsoY - 7, 2);
      break;
    case "saw":
      canvas.line(1, torsoY + 7, 5, torsoY + 2);
      break;
    case "stethoscope":
      canvas.line(5, torsoY, 8, torsoY + 5);
      canvas.line(11, torsoY, 8, torsoY + 5);
      break;
    case "pitchfork":
      canvas.vline(14, torsoY - 5, 30);
      canvas.hline(12, 15, torsoY - 5);
      break;
    case "net":
      canvas.circle(13, torsoY - 1, 3);
      canvas.line(11, torsoY + 1, 4, 29);
      break;
    case "cane":
      canvas.vline(13, torsoY + 3, 30);
      break;
    case "pickaxe":
      canvas.line(2, 29, 13, torsoY - 2);
      canvas.line(9, torsoY - 3, 15, torsoY);
      break;
    case "palette":
      canvas.circle(2, torsoY + 4, 3);
      canvas.line(12, torsoY + 7, 15, torsoY - 2);
      break;
    case "lantern":
      canvas.rect(11, torsoY + 3, 5, 6);
      break;
    default:
      break;
  }
}

function torso(
  canvas: PixelCanvas,
  y: number,
  style: VillagerLook["body"],
): void {
  if (style === "robe" || style === "dress") {
    canvas.rect(4, y, 8, 9);
    canvas.hline(5, 10, y + 2);
    return;
  }
  if (style === "suit") {
    canvas.rect(4, y, 8, 8);
    canvas.vline(8, y, y + 7);
    canvas.hline(6, 9, y + 3);
    return;
  }
  if (style === "apron") {
    canvas.rect(4, y, 8, 8);
    canvas.rect(6, y + 1, 4, 6);
    return;
  }
  if (style === "coat") {
    canvas.rect(3, y, 10, 8);
    canvas.vline(8, y, y + 7);
    return;
  }
  canvas.rect(4, y, 8, 8);
  canvas.rect(6, y + 1, 4, 5);
  if (style === "overalls") {
    canvas.plot(7, y + 3);
    canvas.plot(8, y + 3);
  }
}

function hat(
  canvas: PixelCanvas,
  kind: VillagerLook["hat"],
  child: boolean,
): number {
  const faceY = child ? 10 : 6;
  const offsets: Record<VillagerLook["hat"], number> = {
    none: 2,
    cowlick: 3,
    bun: 4,
    bandana: 2,
    beret: 2,
    cap: 3,
    hardhat: 4,
    top: 4,
    pointed: 6,
    souwester: 5,
    hood: 4,
    straw: 4,
  };
  const top = faceY - offsets[kind];
  switch (kind) {
    case "none":
      canvas.hline(6, 9, top);
      canvas.hline(5, 10, top + 1);
      return faceY;
    case "cowlick":
      canvas.plot(9, top);
      canvas.plot(10, top + 1);
      canvas.hline(6, 9, top + 1);
      canvas.hline(5, 10, top + 2);
      return faceY;
    case "bun":
      canvas.circle(8, top + 1, 2);
      canvas.hline(5, 10, top + 3);
      return faceY;
    case "bandana":
      canvas.hline(5, 10, top);
      canvas.hline(4, 11, top + 1);
      canvas.plot(3, top + 2);
      canvas.plot(12, top + 1);
      return faceY;
    case "beret":
      canvas.hline(5, 11, top);
      canvas.hline(4, 10, top + 1);
      canvas.plot(12, top);
      return faceY;
    case "cap":
      canvas.rect(5, top, 6, 3);
      canvas.hline(10, 13, top + 2);
      return faceY;
    case "hardhat":
      canvas.rect(4, top, 8, 3);
      canvas.hline(3, 12, top + 3);
      canvas.plot(8, top);
      return faceY;
    case "top":
      canvas.rect(6, top, 4, 3);
      canvas.hline(3, 12, top + 3);
      return faceY;
    case "pointed":
      canvas.plot(8, top);
      canvas.line(8, top, 4, top + 5);
      canvas.line(8, top, 11, top + 5);
      canvas.hline(4, 11, top + 5);
      return faceY;
    case "souwester":
      canvas.rect(5, top, 6, 3);
      canvas.hline(2, 13, top + 3);
      canvas.hline(3, 12, top + 4);
      return faceY;
    case "hood":
      canvas.rect(4, top, 8, 5);
      canvas.plot(3, top + 4);
      canvas.plot(12, top + 4);
      return faceY;
    case "straw":
    default:
      canvas.hline(6, 9, top);
      canvas.hline(5, 10, top + 1);
      canvas.hline(4, 11, top + 2);
      canvas.hline(3, 12, top + 3);
      return faceY;
  }
}

function drawSideHat(
  canvas: PixelCanvas,
  kind: VillagerLook["hat"],
  faceY: number,
): void {
  switch (kind) {
    case "pointed":
      canvas.plot(10, faceY - 6);
      canvas.line(10, faceY - 6, 7, faceY - 1);
      canvas.line(10, faceY - 6, 14, faceY - 1);
      canvas.hline(7, 14, faceY - 1);
      break;
    case "top":
      canvas.rect(8, faceY - 4, 4, 3);
      canvas.hline(6, 14, faceY - 1);
      break;
    case "hood":
      canvas.rect(6, faceY - 4, 7, 5);
      canvas.plot(5, faceY);
      break;
    case "bun":
      canvas.circle(7, faceY - 3, 2);
      canvas.hline(8, 12, faceY - 1);
      break;
    case "beret":
      canvas.hline(7, 13, faceY - 2);
      canvas.hline(6, 12, faceY - 1);
      canvas.plot(14, faceY - 2);
      break;
    case "bandana":
      canvas.hline(7, 13, faceY - 2);
      canvas.hline(6, 14, faceY - 1);
      canvas.line(6, faceY - 1, 3, faceY + 2);
      break;
    case "cap":
      canvas.rect(7, faceY - 3, 6, 3);
      canvas.hline(12, 15, faceY - 1);
      break;
    case "hardhat":
      canvas.rect(7, faceY - 4, 6, 3);
      canvas.hline(5, 14, faceY - 1);
      canvas.plot(10, faceY - 4);
      break;
    case "souwester":
      canvas.rect(7, faceY - 5, 6, 3);
      canvas.hline(4, 15, faceY - 2);
      canvas.line(7, faceY - 1, 5, faceY + 2);
      break;
    case "straw":
      canvas.hline(9, 12, faceY - 4);
      canvas.hline(8, 13, faceY - 3);
      canvas.hline(6, 15, faceY - 1);
      break;
    case "cowlick":
      canvas.hline(8, 12, faceY - 1);
      canvas.line(11, faceY - 2, 13, faceY - 4);
      break;
    case "none":
    default:
      canvas.hline(8, 12, faceY - 1);
      break;
  }
}

function drawBackHair(
  canvas: PixelCanvas,
  kind: VillagerLook["hat"],
  faceY: number,
): void {
  if (kind === "bun") {
    canvas.circle(8, faceY + 5, 2);
  } else if (kind === "bandana") {
    canvas.line(5, faceY + 4, 3, faceY + 7);
    canvas.line(11, faceY + 4, 13, faceY + 7);
  } else if (kind === "beret") {
    canvas.plot(11, faceY + 1);
    canvas.plot(12, faceY + 2);
  } else if (kind === "hood") {
    canvas.hline(4, 11, faceY + 5);
  }
}

/** Bridges the head to the shoulders so the body reads as one figure. */
function neck(
  canvas: PixelCanvas,
  headBottom: number,
  torsoY: number,
  x0 = 6,
  x1 = 9,
): void {
  for (let y = headBottom + 1; y < torsoY; y += 1) {
    canvas.hline(x0, x1, y);
  }
}

function sideburns(canvas: PixelCanvas, faceY: number, wide: boolean): void {
  const left = wide ? 3 : 4;
  const right = wide ? 12 : 11;
  canvas.vline(left, faceY, faceY + 4);
  canvas.vline(right, faceY, faceY + 4);
}

export function drawVillagerDown(look: VillagerLook): string[] {
  const canvas = new PixelCanvas(16, 32);
  const child = look.scale === "child";
  const faceY = hat(canvas, look.hat, child);
  face(canvas, faceY, look.body === "coat");
  if (look.hat !== "hood" && look.hat !== "souwester") {
    sideburns(canvas, faceY, look.body === "coat");
  }
  if (look.glasses) {
    canvas.rect(5, faceY + 2, 3, 2);
    canvas.rect(8, faceY + 2, 3, 2);
  }
  if (look.beard === "short") {
    canvas.hline(6, 9, faceY + 6);
  }
  if (look.beard === "long") {
    canvas.rect(6, faceY + 5, 4, 4);
  }
  const torsoY = child ? 17 : look.beard === "long" ? 15 : 14;
  neck(canvas, faceY + (look.beard === "long" ? 8 : 6), torsoY);
  torso(canvas, torsoY, look.body);
  accessoryDown(canvas, look.accessory, torsoY);
  legs(
    canvas,
    torsoY + 8,
    look.body === "dress" || look.body === "robe",
    child,
  );
  return canvas.toPixels();
}

export function drawVillagerRight(look: VillagerLook): string[] {
  const canvas = new PixelCanvas(16, 32);
  const child = look.scale === "child";
  const faceY = child ? 10 : 6;
  drawSideHat(canvas, look.hat, faceY);
  canvas.rect(7, faceY, 6, 7);
  canvas.plot(11, faceY + 2);
  if (look.glasses) {
    canvas.rect(10, faceY + 2, 3, 2);
    canvas.plot(13, faceY + 3);
  }
  if (look.beard === "long") {
    canvas.rect(8, faceY + 5, 4, 4);
  } else if (look.beard === "short") {
    canvas.hline(9, 12, faceY + 6);
  }

  const torsoY = child ? 17 : look.beard === "long" ? 15 : 14;
  neck(canvas, faceY + (look.beard === "long" ? 8 : 6), torsoY, 8, 11);
  const wide =
    look.body === "coat" || look.body === "robe" || look.body === "dress";
  canvas.rect(wide ? 6 : 7, torsoY, wide ? 7 : 6, 8);
  if (look.body === "overalls" || look.body === "apron") {
    canvas.rect(8, torsoY + 1, 4, 5);
  }

  accessorySide(canvas, look.accessory, torsoY);

  if (look.body === "dress" || look.body === "robe") {
    canvas.rect(6, torsoY + 8, 7, child ? 5 : 8);
  } else {
    const footY = child ? 29 : 29;
    canvas.vline(9, torsoY + 8, footY);
    canvas.vline(10, torsoY + 8, footY);
    canvas.hline(8, 11, footY);
  }

  if (look.hat === "pointed") {
    canvas.vline(4, torsoY + 2, 30);
    canvas.plot(4, torsoY + 1);
  }

  return canvas.toPixels();
}

export function drawVillagerUp(look: VillagerLook): string[] {
  const canvas = new PixelCanvas(16, 32);
  const child = look.scale === "child";
  const top = hat(canvas, look.hat, child);
  canvas.rect(5, top, 6, 6);
  drawBackHair(canvas, look.hat, top);
  const torsoY = child ? 17 : look.beard === "long" ? 15 : 14;
  neck(canvas, top + 5, torsoY);
  torso(canvas, torsoY, look.body);
  accessoryUp(canvas, look.accessory, torsoY);
  legs(
    canvas,
    torsoY + 8,
    look.body === "dress" || look.body === "robe",
    child,
  );
  return canvas.toPixels();
}

export function villagerFrames(look: VillagerLook): CharacterFrames {
  const down = drawVillagerDown(look);
  const right = drawVillagerRight(look);
  return {
    down,
    right,
    left: mirrorRows(right),
    up: drawVillagerUp(look),
    walkLeft: stepLegs(down, "left"),
    walkRight: stepLegs(down, "right"),
  };
}

function animalCanvas(): PixelCanvas {
  return new PixelCanvas(16, 32);
}

type AnimalSpecies =
  | "chicken"
  | "duck"
  | "rabbit"
  | "cow"
  | "goat"
  | "sheep"
  | "pig"
  | "horse"
  | "cat"
  | "dog";

function drawAnimalBack(species: AnimalSpecies): string[] {
  const c = animalCanvas();

  switch (species) {
    case "chicken":
      c.circle(8, 21, 4);
      c.points([
        [6, 17],
        [8, 15],
        [10, 17],
      ]);
      c.line(6, 20, 8, 23);
      c.line(10, 20, 8, 23);
      c.vline(6, 26, 29);
      c.vline(10, 26, 29);
      c.hline(5, 7, 29);
      c.hline(9, 11, 29);
      break;
    case "duck":
      c.circle(8, 21, 4);
      c.circle(8, 17, 2);
      c.points([
        [5, 20],
        [8, 23],
        [11, 20],
        [8, 25],
      ]);
      c.vline(6, 26, 29);
      c.vline(10, 26, 29);
      c.hline(5, 7, 29);
      c.hline(9, 11, 29);
      break;
    case "rabbit":
      c.circle(8, 22, 4);
      c.vline(6, 12, 19);
      c.vline(7, 12, 18);
      c.vline(9, 12, 18);
      c.vline(10, 12, 19);
      c.circle(8, 22, 2);
      c.vline(6, 27, 29);
      c.vline(10, 27, 29);
      c.hline(5, 7, 30);
      c.hline(9, 11, 30);
      break;
    case "cow":
      c.rect(3, 13, 10, 11);
      c.line(8, 13, 8, 24);
      c.line(8, 16, 10, 20);
      c.plot(10, 21);
      c.rect(6, 21, 4, 3);
      addRearQuadrupedLegs(c, 24, false);
      break;
    case "goat":
      c.rect(4, 14, 8, 10);
      c.points([
        [6, 13],
        [8, 11],
        [10, 13],
      ]);
      c.line(8, 14, 10, 17);
      c.plot(11, 16);
      addRearQuadrupedLegs(c, 24, false);
      break;
    case "sheep":
      c.circle(8, 19, 5);
      c.circle(5, 19, 2);
      c.circle(11, 19, 2);
      c.circle(8, 16, 2);
      c.circle(8, 22, 2);
      addRearQuadrupedLegs(c, 25, false);
      break;
    case "pig":
      c.circle(8, 20, 5);
      c.line(8, 16, 11, 14);
      c.circle(12, 14, 1);
      c.hline(6, 10, 23);
      addRearQuadrupedLegs(c, 25, true);
      break;
    case "horse":
      c.rect(3, 12, 10, 12);
      c.line(8, 12, 8, 22);
      c.line(8, 14, 11, 18);
      c.line(11, 18, 13, 23);
      c.line(8, 13, 5, 17);
      c.line(5, 17, 3, 23);
      addRearQuadrupedLegs(c, 24, false);
      break;
    case "cat":
      c.circle(8, 21, 4);
      c.points([
        [5, 17],
        [6, 15],
        [7, 18],
        [9, 18],
        [10, 15],
        [11, 17],
      ]);
      c.line(4, 22, 2, 18);
      c.line(2, 18, 1, 21);
      c.vline(6, 26, 29);
      c.vline(10, 26, 29);
      c.hline(5, 7, 30);
      c.hline(9, 11, 30);
      break;
    case "dog":
      c.rect(4, 16, 8, 9);
      c.points([
        [5, 15],
        [5, 12],
        [7, 16],
        [9, 16],
        [11, 12],
        [11, 15],
      ]);
      c.line(11, 19, 14, 16);
      c.plot(14, 15);
      c.vline(6, 25, 29);
      c.vline(10, 25, 29);
      c.hline(5, 7, 30);
      c.hline(9, 11, 30);
      break;
  }

  return c.toPixels();
}

function addRearQuadrupedLegs(
  canvas: PixelCanvas,
  top: number,
  short: boolean,
): void {
  const foot = short ? 29 : 30;
  canvas.vline(4, top, foot - 1);
  canvas.vline(6, top, foot - 2);
  canvas.vline(9, top, foot - 2);
  canvas.vline(11, top, foot - 1);
  canvas.hline(3, 5, foot);
  canvas.hline(10, 12, foot);
}

function animalGait(
  species: AnimalSpecies,
  pixels: string[],
  phase: "left" | "right",
): string[] {
  const c = PixelCanvas.fromPixels(pixels);
  const bird = species === "chicken" || species === "duck";
  const rabbit = species === "rabbit";
  const pet = species === "cat" || species === "dog";
  const legTop = bird ? 25 : rabbit ? 27 : pet ? 25 : 24;
  c.clearRect(0, legTop, 16, 32 - legTop);

  if (bird) {
    const leftFoot = phase === "left" ? 30 : 29;
    const rightFoot = phase === "right" ? 30 : 29;
    c.vline(6, legTop, leftFoot - 1);
    c.vline(10, legTop, rightFoot - 1);
    c.hline(5, 7, leftFoot);
    c.hline(9, 11, rightFoot);
  } else if (rabbit) {
    const offset = phase === "left" ? -1 : 1;
    c.line(6, legTop, 5 + offset, 29);
    c.line(10, legTop, 10 + offset, 29);
    c.hline(3 + offset, 7 + offset, 30);
    c.hline(8 + offset, 12 + offset, 30);
  } else if (pet) {
    const leadX = phase === "left" ? 5 : 9;
    const backX = phase === "left" ? 10 : 6;
    c.line(leadX, legTop, leadX - 1, 29);
    c.line(backX, legTop, backX + 1, 28);
    c.hline(leadX - 2, leadX, 30);
    c.hline(backX, backX + 2, 29);
  } else {
    const leadLeft = phase === "left";
    c.line(5, legTop, leadLeft ? 3 : 5, leadLeft ? 30 : 29);
    c.line(7, legTop, leadLeft ? 7 : 6, leadLeft ? 29 : 30);
    c.line(9, legTop, leadLeft ? 10 : 9, leadLeft ? 30 : 29);
    c.line(11, legTop, leadLeft ? 12 : 13, leadLeft ? 29 : 30);
    c.hline(2, 4, leadLeft ? 30 : 29);
    c.hline(11, 14, leadLeft ? 29 : 30);
  }

  return c.toPixels();
}

export function drawChicken(): CharacterFrames {
  const down = animalCanvas();
  down.circle(8, 20, 4);
  down.plot(8, 16);
  down.plot(7, 17);
  down.plot(9, 17);
  down.plot(11, 20);
  down.plot(12, 20);
  down.vline(6, 25, 29);
  down.vline(10, 25, 29);
  down.hline(5, 7, 29);
  down.hline(9, 11, 29);

  const right = animalCanvas();
  right.circle(8, 21, 4);
  right.plot(12, 19);
  right.plot(13, 20);
  right.plot(4, 22);
  right.vline(6, 26, 29);
  right.vline(10, 26, 29);
  right.hline(5, 7, 29);
  right.hline(9, 11, 29);

  return animalFrames("chicken", down.toPixels(), right.toPixels());
}

export function drawCow(): CharacterFrames {
  const down = animalCanvas();
  down.hline(6, 9, 9);
  down.points([
    [4, 10],
    [5, 11],
    [10, 11],
    [11, 10],
  ]);
  down.rect(5, 10, 6, 6);
  down.rect(6, 13, 4, 3);
  down.plot(7, 12);
  down.plot(9, 12);
  down.line(5, 16, 3, 20);
  down.line(10, 16, 12, 20);
  down.vline(3, 20, 23);
  down.vline(12, 20, 23);
  down.hline(3, 12, 23);
  down.points([
    [5, 18],
    [10, 20],
    [7, 22],
  ]);
  down.vline(5, 24, 30);
  down.vline(6, 24, 30);
  down.vline(9, 24, 30);
  down.vline(10, 24, 30);
  down.hline(4, 7, 30);
  down.hline(8, 11, 30);

  const right = animalCanvas();
  right.line(2, 17, 5, 14);
  right.hline(5, 11, 14);
  right.line(11, 14, 13, 17);
  right.vline(13, 17, 23);
  right.hline(3, 13, 23);
  right.vline(2, 17, 23);
  right.rect(11, 10, 4, 5);
  right.plot(15, 12);
  right.plot(12, 9);
  right.line(2, 18, 0, 14);
  right.points([
    [5, 17],
    [9, 20],
  ]);
  right.vline(4, 24, 30);
  right.vline(11, 24, 30);
  right.hline(3, 5, 30);
  right.hline(10, 12, 30);

  return animalFrames("cow", down.toPixels(), right.toPixels());
}

export function drawPig(): CharacterFrames {
  const down = animalCanvas();
  down.circle(8, 20, 5);
  down.points([
    [5, 16],
    [5, 14],
    [7, 16],
    [9, 16],
    [11, 14],
    [11, 16],
  ]);
  down.rect(6, 18, 4, 3);
  down.plot(7, 19);
  down.plot(8, 19);
  down.circle(8, 23, 2);
  down.vline(5, 26, 30);
  down.vline(10, 26, 30);
  down.hline(4, 6, 30);
  down.hline(9, 11, 30);

  const right = animalCanvas();
  right.line(3, 17, 6, 15);
  right.hline(6, 11, 15);
  right.line(11, 15, 13, 18);
  right.vline(13, 18, 24);
  right.hline(3, 13, 24);
  right.vline(3, 17, 24);
  right.rect(12, 19, 3, 3);
  right.plot(14, 20);
  right.line(3, 19, 1, 17);
  right.circle(1, 16, 1);
  right.vline(5, 27, 30);
  right.vline(10, 27, 30);

  return animalFrames("pig", down.toPixels(), right.toPixels());
}

export function drawSheep(): CharacterFrames {
  const down = animalCanvas();
  down.circle(8, 19, 5);
  down.circle(5, 18, 2);
  down.circle(11, 18, 2);
  down.circle(8, 16, 2);
  down.rect(6, 22, 4, 3);
  down.vline(6, 26, 30);
  down.vline(10, 26, 30);
  down.hline(5, 7, 30);
  down.hline(9, 11, 30);

  const right = animalCanvas();
  right.circle(8, 20, 5);
  right.circle(5, 19, 2);
  right.circle(11, 18, 2);
  right.rect(11, 16, 3, 3);
  right.vline(5, 26, 30);
  right.vline(11, 26, 30);

  return animalFrames("sheep", down.toPixels(), right.toPixels());
}

export function drawGoat(): CharacterFrames {
  const down = animalCanvas();
  down.rect(6, 10, 4, 6);
  down.line(6, 10, 4, 7);
  down.line(9, 10, 11, 7);
  down.points([
    [5, 11],
    [3, 10],
    [10, 11],
    [12, 10],
  ]);
  down.plot(7, 12);
  down.plot(9, 12);
  down.line(7, 16, 8, 19);
  down.line(8, 19, 7, 21);
  down.line(6, 16, 4, 20);
  down.line(9, 16, 11, 20);
  down.vline(4, 20, 24);
  down.vline(11, 20, 24);
  down.hline(4, 11, 24);
  down.vline(6, 24, 30);
  down.vline(9, 24, 30);
  down.hline(5, 7, 30);
  down.hline(8, 10, 30);

  const right = animalCanvas();
  right.line(3, 17, 5, 14);
  right.hline(5, 11, 14);
  right.line(11, 14, 13, 17);
  right.vline(13, 17, 23);
  right.hline(3, 13, 23);
  right.vline(3, 17, 23);
  right.rect(10, 10, 4, 5);
  right.line(12, 10, 14, 7);
  right.plot(14, 12);
  right.line(11, 15, 12, 18);
  right.vline(5, 24, 30);
  right.vline(11, 24, 30);

  return animalFrames("goat", down.toPixels(), right.toPixels());
}

export function drawDuck(): CharacterFrames {
  const down = animalCanvas();
  down.circle(8, 21, 4);
  down.circle(8, 17, 2);
  down.hline(10, 12, 17);
  down.vline(6, 26, 29);
  down.vline(10, 26, 29);
  down.hline(5, 7, 29);
  down.hline(9, 11, 29);

  const right = animalCanvas();
  right.circle(7, 21, 4);
  right.circle(11, 18, 2);
  right.hline(13, 14, 18);
  right.vline(5, 26, 29);
  right.vline(9, 26, 29);

  return animalFrames("duck", down.toPixels(), right.toPixels());
}

export function drawRabbit(): CharacterFrames {
  const down = animalCanvas();
  down.circle(8, 22, 4);
  down.vline(6, 12, 19);
  down.vline(7, 12, 18);
  down.vline(9, 12, 18);
  down.vline(10, 12, 19);
  down.plot(7, 21);
  down.plot(9, 21);
  down.plot(8, 24);
  down.vline(6, 27, 30);
  down.vline(10, 27, 30);

  const right = animalCanvas();
  right.circle(8, 23, 4);
  right.vline(10, 12, 20);
  right.vline(11, 13, 20);
  right.plot(12, 22);
  right.vline(6, 27, 30);
  right.vline(9, 27, 30);

  return animalFrames("rabbit", down.toPixels(), right.toPixels());
}

export function drawCat(): CharacterFrames {
  const down = animalCanvas();
  down.circle(8, 21, 4);
  down.plot(5, 16);
  down.plot(6, 17);
  down.plot(10, 17);
  down.plot(11, 16);
  down.plot(7, 20);
  down.plot(9, 20);
  down.hline(7, 9, 23);
  down.vline(6, 26, 30);
  down.vline(10, 26, 30);
  down.plot(3, 24);
  down.plot(12, 24);

  const right = animalCanvas();
  right.circle(8, 22, 4);
  right.plot(11, 18);
  right.plot(12, 17);
  right.plot(12, 21);
  right.line(3, 22, 1, 18);
  right.vline(6, 27, 30);
  right.vline(10, 27, 30);

  return animalFrames("cat", down.toPixels(), right.toPixels());
}

export function drawDog(): CharacterFrames {
  const down = animalCanvas();
  down.rect(6, 12, 4, 6);
  down.points([
    [6, 13],
    [4, 10],
    [4, 15],
    [9, 13],
    [11, 10],
    [11, 15],
  ]);
  down.plot(7, 14);
  down.plot(9, 14);
  down.rect(7, 16, 3, 2);
  down.line(6, 18, 4, 21);
  down.line(9, 18, 11, 21);
  down.vline(4, 21, 24);
  down.vline(11, 21, 24);
  down.hline(4, 11, 24);
  down.vline(6, 24, 30);
  down.vline(9, 24, 30);
  down.hline(5, 7, 30);
  down.hline(8, 10, 30);
  down.plot(4, 22);
  down.plot(11, 22);

  const right = animalCanvas();
  right.line(3, 18, 5, 15);
  right.hline(5, 11, 15);
  right.line(11, 15, 13, 18);
  right.vline(13, 18, 24);
  right.hline(3, 13, 24);
  right.vline(3, 18, 24);
  right.rect(10, 11, 4, 5);
  right.hline(13, 15, 14);
  right.plot(11, 10);
  right.line(3, 19, 0, 15);
  right.vline(5, 25, 30);
  right.vline(11, 25, 30);

  return animalFrames("dog", down.toPixels(), right.toPixels());
}

export function drawHorse(): CharacterFrames {
  const down = animalCanvas();
  down.rect(6, 7, 4, 7);
  down.points([
    [6, 8],
    [5, 5],
    [7, 7],
    [9, 7],
    [10, 5],
    [10, 8],
  ]);
  down.plot(7, 10);
  down.plot(9, 10);
  down.rect(7, 12, 3, 3);
  down.line(6, 14, 3, 19);
  down.line(9, 14, 12, 19);
  down.vline(3, 19, 23);
  down.vline(12, 19, 23);
  down.hline(3, 12, 23);
  down.line(4, 16, 2, 13);
  down.vline(5, 24, 30);
  down.vline(6, 24, 30);
  down.vline(9, 24, 30);
  down.vline(10, 24, 30);
  down.hline(4, 7, 30);
  down.hline(8, 11, 30);

  const right = animalCanvas();
  right.line(1, 17, 4, 13);
  right.hline(4, 11, 13);
  right.line(11, 13, 13, 17);
  right.vline(13, 17, 23);
  right.hline(1, 13, 23);
  right.vline(1, 17, 23);
  right.line(10, 14, 12, 8);
  right.rect(11, 7, 4, 5);
  right.hline(14, 15, 10);
  right.points([
    [12, 7],
    [12, 5],
    [13, 7],
    [14, 5],
    [14, 7],
  ]);
  right.line(11, 9, 9, 6);
  right.vline(3, 24, 30);
  right.vline(4, 24, 30);
  right.vline(10, 24, 30);
  right.vline(11, 24, 30);
  right.line(1, 18, 0, 14);

  return animalFrames("horse", down.toPixels(), right.toPixels());
}

function animalFrames(
  species: AnimalSpecies,
  down: string[],
  right: string[],
): CharacterFrames {
  return {
    down,
    right,
    left: mirrorRows(right),
    up: drawAnimalBack(species),
    walkLeft: animalGait(species, down, "left"),
    walkRight: animalGait(species, down, "right"),
  };
}
