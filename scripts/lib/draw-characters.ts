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

function legs(canvas: PixelCanvas, y: number, dress: boolean): void {
  if (dress) {
    canvas.rect(4, y, 8, 9);
    canvas.hline(4, 11, y + 8);
    return;
  }
  canvas.rect(5, y, 3, 7);
  canvas.rect(8, y, 3, 7);
  canvas.hline(4, 7, y + 7);
  canvas.hline(8, 11, y + 7);
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
  const top = child ? 8 : 1;
  switch (kind) {
    case "none":
      canvas.hline(6, 9, top);
      canvas.hline(5, 10, top + 1);
      return top + 2;
    case "cowlick":
      canvas.plot(9, top);
      canvas.plot(10, top + 1);
      canvas.hline(6, 9, top + 1);
      canvas.hline(5, 10, top + 2);
      return top + 3;
    case "bun":
      canvas.circle(8, top + 1, 2);
      canvas.hline(5, 10, top + 3);
      return top + 4;
    case "bandana":
      canvas.hline(5, 10, top);
      canvas.hline(4, 11, top + 1);
      canvas.plot(3, top + 2);
      canvas.plot(12, top + 1);
      return top + 2;
    case "beret":
      canvas.hline(5, 11, top);
      canvas.hline(4, 10, top + 1);
      canvas.plot(12, top);
      return top + 2;
    case "cap":
      canvas.rect(5, top, 6, 3);
      canvas.hline(10, 13, top + 2);
      return top + 3;
    case "hardhat":
      canvas.rect(4, top, 8, 3);
      canvas.hline(3, 12, top + 3);
      canvas.plot(8, top);
      return top + 4;
    case "top":
      canvas.rect(6, top, 4, 3);
      canvas.hline(3, 12, top + 3);
      return top + 4;
    case "pointed":
      canvas.plot(8, top);
      canvas.line(8, top, 4, top + 5);
      canvas.line(8, top, 11, top + 5);
      canvas.hline(4, 11, top + 5);
      return top + 6;
    case "souwester":
      canvas.rect(5, top, 6, 3);
      canvas.hline(2, 13, top + 3);
      canvas.hline(3, 12, top + 4);
      return top + 5;
    case "hood":
      canvas.rect(4, top, 8, 5);
      canvas.plot(3, top + 4);
      canvas.plot(12, top + 4);
      return top + 4;
    case "straw":
    default:
      canvas.hline(6, 9, top);
      canvas.hline(5, 10, top + 1);
      canvas.hline(4, 11, top + 2);
      canvas.hline(3, 12, top + 3);
      return top + 4;
  }
}

export function drawVillagerDown(look: VillagerLook): string[] {
  const canvas = new PixelCanvas(16, 32);
  const child = look.scale === "child";
  const faceY = hat(canvas, look.hat, child);
  face(canvas, faceY, look.body === "coat");
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
  const torsoY = faceY + (look.beard === "long" ? 9 : 7);
  torso(canvas, torsoY, look.body);
  legs(canvas, torsoY + 8, look.body === "dress" || look.body === "robe");
  return canvas.toPixels();
}

export function drawVillagerRight(look: VillagerLook): string[] {
  const canvas = new PixelCanvas(16, 32);
  const child = look.scale === "child";
  const top = child ? 8 : 1;

  if (look.hat === "pointed") {
    canvas.plot(10, top);
    canvas.line(10, top, 7, top + 5);
    canvas.line(10, top, 13, top + 5);
    canvas.hline(7, 13, top + 5);
  } else if (look.hat === "top") {
    canvas.rect(8, top, 4, 3);
    canvas.hline(6, 14, top + 3);
  } else if (look.hat === "hood") {
    canvas.rect(6, top, 7, 5);
  } else if (look.hat === "none" || look.hat === "cowlick") {
    canvas.hline(8, 12, top + 1);
  } else {
    canvas.rect(7, top, 6, 3);
    canvas.hline(6, 14, top + 3);
  }

  const faceY = top + 4;
  canvas.rect(7, faceY, 6, 7);
  canvas.plot(11, faceY + 2);
  if (look.beard === "long") {
    canvas.rect(8, faceY + 5, 4, 4);
  } else if (look.beard === "short") {
    canvas.hline(9, 12, faceY + 6);
  }

  const torsoY = faceY + 7;
  const wide =
    look.body === "coat" || look.body === "robe" || look.body === "dress";
  canvas.rect(wide ? 6 : 7, torsoY, wide ? 7 : 6, 8);
  if (look.body === "overalls" || look.body === "apron") {
    canvas.rect(8, torsoY + 1, 4, 5);
  }

  if (look.body === "dress" || look.body === "robe") {
    canvas.rect(6, torsoY + 8, 7, 8);
  } else {
    canvas.vline(9, torsoY + 8, torsoY + 15);
    canvas.vline(10, torsoY + 8, torsoY + 15);
    canvas.hline(8, 11, torsoY + 15);
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
  hat(canvas, look.hat, child);
  const top = child ? 12 : 6;
  canvas.rect(5, top, 6, 6);
  const torsoY = top + 6;
  torso(canvas, torsoY, look.body);
  legs(canvas, torsoY + 8, look.body === "dress" || look.body === "robe");
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

  return framesFromDownRight(down.toPixels(), right.toPixels());
}

export function drawCow(): CharacterFrames {
  const down = animalCanvas();
  down.rect(4, 14, 8, 10);
  down.rect(5, 10, 6, 5);
  down.plot(6, 12);
  down.plot(9, 12);
  down.plot(5, 16);
  down.plot(10, 17);
  down.vline(5, 24, 30);
  down.vline(6, 24, 30);
  down.vline(9, 24, 30);
  down.vline(10, 24, 30);
  down.hline(4, 7, 30);
  down.hline(8, 11, 30);

  const right = animalCanvas();
  right.rect(2, 16, 12, 8);
  right.rect(11, 12, 4, 5);
  right.plot(14, 14);
  right.plot(3, 18);
  right.plot(7, 20);
  right.vline(4, 24, 30);
  right.vline(11, 24, 30);
  right.hline(3, 5, 30);
  right.hline(10, 12, 30);

  return framesFromDownRight(down.toPixels(), right.toPixels());
}

export function drawPig(): CharacterFrames {
  const down = animalCanvas();
  down.circle(8, 20, 5, true);
  down.clearRect(6, 18, 4, 3);
  down.rect(6, 18, 4, 3);
  down.plot(7, 19);
  down.plot(8, 19);
  down.vline(5, 26, 30);
  down.vline(10, 26, 30);
  down.hline(4, 6, 30);
  down.hline(9, 11, 30);

  const right = animalCanvas();
  right.circle(8, 21, 5, true);
  right.rect(12, 20, 3, 2);
  right.plot(2, 22);
  right.vline(5, 27, 30);
  right.vline(10, 27, 30);

  return framesFromDownRight(down.toPixels(), right.toPixels());
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

  return framesFromDownRight(down.toPixels(), right.toPixels());
}

export function drawGoat(): CharacterFrames {
  const down = animalCanvas();
  down.rect(5, 14, 6, 10);
  down.rect(6, 10, 4, 5);
  down.plot(5, 11);
  down.plot(10, 11);
  down.plot(7, 13);
  down.plot(8, 13);
  down.vline(6, 24, 30);
  down.vline(9, 24, 30);
  down.hline(5, 7, 30);
  down.hline(8, 10, 30);

  const right = animalCanvas();
  right.rect(3, 16, 10, 8);
  right.rect(10, 12, 4, 5);
  right.plot(13, 11);
  right.plot(12, 12);
  right.vline(5, 24, 30);
  right.vline(11, 24, 30);

  return framesFromDownRight(down.toPixels(), right.toPixels());
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

  return framesFromDownRight(down.toPixels(), right.toPixels());
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

  return framesFromDownRight(down.toPixels(), right.toPixels());
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

  return framesFromDownRight(down.toPixels(), right.toPixels());
}

export function drawDog(): CharacterFrames {
  const down = animalCanvas();
  down.rect(5, 16, 6, 8);
  down.rect(6, 12, 4, 5);
  down.plot(5, 13);
  down.plot(10, 13);
  down.plot(7, 15);
  down.plot(8, 15);
  down.vline(6, 24, 30);
  down.vline(9, 24, 30);
  down.hline(5, 7, 30);
  down.hline(8, 10, 30);
  down.plot(4, 22);
  down.plot(11, 22);

  const right = animalCanvas();
  right.rect(3, 18, 10, 7);
  right.rect(10, 14, 4, 5);
  right.plot(14, 16);
  right.line(3, 20, 1, 16);
  right.vline(5, 25, 30);
  right.vline(11, 25, 30);

  return framesFromDownRight(down.toPixels(), right.toPixels());
}

export function drawHorse(): CharacterFrames {
  const down = animalCanvas();
  down.rect(4, 12, 8, 12);
  down.rect(6, 7, 4, 6);
  down.plot(5, 8);
  down.plot(10, 8);
  down.plot(7, 10);
  down.plot(8, 10);
  down.vline(5, 24, 30);
  down.vline(6, 24, 30);
  down.vline(9, 24, 30);
  down.vline(10, 24, 30);
  down.hline(4, 7, 30);
  down.hline(8, 11, 30);

  const right = animalCanvas();
  right.rect(1, 16, 12, 8);
  right.rect(11, 10, 4, 7);
  right.plot(14, 12);
  right.vline(3, 24, 30);
  right.vline(4, 24, 30);
  right.vline(10, 24, 30);
  right.vline(11, 24, 30);
  right.line(1, 18, 0, 14);

  return framesFromDownRight(down.toPixels(), right.toPixels());
}

function framesFromDownRight(down: string[], right: string[]): CharacterFrames {
  return {
    down,
    right,
    left: mirrorRows(right),
    up: down,
    walkLeft: stepLegs(down, "left"),
    walkRight: stepLegs(down, "right"),
  };
}
