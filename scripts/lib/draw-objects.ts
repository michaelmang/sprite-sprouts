import { PixelCanvas } from "./pixel-canvas";

export type ObjectDraft = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  draw: (canvas: PixelCanvas) => void;
};

function item(
  id: string,
  name: string,
  tags: string[],
  description: string,
  draw: (canvas: PixelCanvas) => void,
): ObjectDraft {
  return { id, name, tags, description, draw };
}

function tool(
  id: string,
  name: string,
  description: string,
  draw: ObjectDraft["draw"],
) {
  return item(id, name, ["tool"], description, draw);
}

function crop(
  id: string,
  name: string,
  description: string,
  draw: ObjectDraft["draw"],
) {
  return item(id, name, ["crop", "produce"], description, draw);
}

function seed(
  id: string,
  name: string,
  description: string,
  draw: ObjectDraft["draw"],
) {
  return item(id, name, ["seed"], description, draw);
}

function forage(
  id: string,
  name: string,
  description: string,
  draw: ObjectDraft["draw"],
) {
  return item(id, name, ["forage"], description, draw);
}

function resource(
  id: string,
  name: string,
  description: string,
  draw: ObjectDraft["draw"],
) {
  return item(id, name, ["resource"], description, draw);
}

function gem(
  id: string,
  name: string,
  description: string,
  draw: ObjectDraft["draw"],
) {
  return item(id, name, ["gem", "mineral"], description, draw);
}

function fish(
  id: string,
  name: string,
  description: string,
  draw: ObjectDraft["draw"],
) {
  return item(id, name, ["fish"], description, draw);
}

function food(
  id: string,
  name: string,
  tags: string[],
  description: string,
  draw: ObjectDraft["draw"],
) {
  return item(id, name, ["food", ...tags], description, draw);
}

function machine(
  id: string,
  name: string,
  description: string,
  draw: ObjectDraft["draw"],
) {
  return item(id, name, ["machine", "crafting"], description, draw);
}

function furniture(
  id: string,
  name: string,
  description: string,
  draw: ObjectDraft["draw"],
) {
  return item(id, name, ["furniture"], description, draw);
}

function world(
  id: string,
  name: string,
  tags: string[],
  description: string,
  draw: ObjectDraft["draw"],
) {
  return item(id, name, tags, description, draw);
}

type PacketStyle = "tall" | "pouch" | "wide" | "rounded" | "tied" | "torn";

function packet(
  canvas: PixelCanvas,
  style: PacketStyle,
  label: (c: PixelCanvas) => void,
): void {
  switch (style) {
    case "tall":
      canvas.rect(5, 2, 7, 13);
      canvas.hline(5, 11, 5);
      canvas.line(5, 2, 8, 4);
      canvas.line(11, 2, 8, 4);
      break;
    case "pouch":
      canvas.hline(5, 11, 3);
      canvas.line(5, 3, 3, 7);
      canvas.vline(3, 7, 12);
      canvas.line(3, 12, 6, 14);
      canvas.hline(6, 10, 14);
      canvas.line(10, 14, 13, 12);
      canvas.vline(13, 7, 12);
      canvas.line(13, 7, 11, 3);
      break;
    case "wide":
      canvas.rect(2, 5, 12, 9);
      canvas.hline(2, 13, 8);
      canvas.line(2, 5, 5, 3);
      canvas.hline(5, 10, 3);
      canvas.line(10, 3, 13, 5);
      break;
    case "rounded":
      canvas.hline(5, 11, 2);
      canvas.line(5, 2, 3, 5);
      canvas.vline(3, 5, 12);
      canvas.line(3, 12, 5, 14);
      canvas.hline(5, 11, 14);
      canvas.line(11, 14, 13, 12);
      canvas.vline(13, 5, 12);
      canvas.line(13, 5, 11, 2);
      canvas.hline(4, 12, 6);
      break;
    case "tied":
      canvas.hline(6, 10, 3);
      canvas.plot(5, 2);
      canvas.plot(11, 2);
      canvas.line(6, 3, 4, 6);
      canvas.line(10, 3, 12, 6);
      canvas.vline(4, 6, 12);
      canvas.vline(12, 6, 12);
      canvas.hline(4, 12, 13);
      break;
    case "torn":
      canvas.points([
        [3, 4],
        [5, 2],
        [7, 4],
        [9, 2],
        [12, 4],
      ]);
      canvas.line(3, 4, 3, 13);
      canvas.line(12, 4, 13, 12);
      canvas.line(3, 13, 8, 14);
      canvas.line(8, 14, 13, 12);
      canvas.hline(4, 11, 7);
      break;
  }
  label(canvas);
}

export const objectDrafts: ObjectDraft[] = [
  tool("watering-can", "Watering Can", "Can for watering crop tiles.", (c) => {
    c.rect(3, 6, 8, 6);
    c.hline(10, 13, 7);
    c.hline(11, 14, 8);
    c.rect(4, 4, 4, 3);
  }),
  tool("hoe", "Hoe", "Tills soil into farmable dirt.", (c) => {
    c.line(2, 12, 12, 7);
    c.line(2, 13, 12, 8);
    c.vline(12, 4, 9);
    c.hline(11, 14, 4);
  }),
  tool("axe", "Axe", "Chops trees, stumps, and branches.", (c) => {
    c.vline(8, 4, 14);
    c.vline(9, 5, 14);
    c.line(8, 4, 5, 2);
    c.line(5, 2, 2, 4);
    c.vline(2, 4, 8);
    c.line(2, 8, 8, 5);
    c.hline(7, 10, 14);
  }),
  tool("pickaxe", "Pickaxe", "Breaks rocks and ore nodes.", (c) => {
    c.vline(8, 5, 14);
    c.vline(9, 6, 14);
    c.line(2, 6, 6, 3);
    c.hline(6, 11, 3);
    c.line(11, 3, 14, 6);
    c.plot(2, 7);
  }),
  tool("scythe", "Scythe", "Cuts fiber, weeds, and mature hay.", (c) => {
    c.line(3, 14, 8, 4);
    c.line(4, 14, 9, 4);
    c.line(8, 4, 13, 2);
    c.line(13, 2, 15, 4);
    c.line(15, 4, 13, 7);
    c.line(13, 7, 9, 8);
  }),
  tool("fishing-rod", "Fishing Rod", "Casts into water for fish.", (c) => {
    c.line(2, 14, 5, 5);
    c.line(3, 14, 6, 5);
    c.line(5, 5, 8, 2);
    c.line(8, 2, 12, 3);
    c.line(12, 3, 14, 6);
    c.vline(14, 6, 11);
    c.line(14, 11, 12, 13);
    c.plot(11, 12);
  }),
  tool("copper-sword", "Copper Sword", "Starter melee weapon.", (c) => {
    c.vline(8, 1, 11);
    c.vline(7, 2, 9);
    c.vline(9, 2, 9);
    c.hline(5, 11, 11);
    c.vline(8, 12, 14);
  }),
  tool("milk-pail", "Milk Pail", "Used to milk cows and goats.", (c) => {
    c.circle(8, 6, 5);
    c.clearRect(3, 7, 11, 5);
    c.hline(4, 12, 6);
    c.line(4, 6, 5, 13);
    c.line(12, 6, 11, 13);
    c.hline(5, 11, 13);
    c.hline(5, 11, 8);
    c.plot(8, 10);
  }),
  tool("shears", "Shears", "Used to shear sheep.", (c) => {
    c.line(4, 12, 7, 4);
    c.line(11, 12, 8, 4);
    c.hline(7, 8, 5);
    c.plot(6, 3);
    c.plot(9, 3);
  }),
  tool("copper-pan", "Copper Pan", "Pans riverbeds for ore flakes.", (c) => {
    c.line(2, 7, 4, 11);
    c.hline(4, 11, 12);
    c.line(11, 12, 13, 7);
    c.hline(2, 13, 7);
    c.line(13, 7, 15, 4);
    c.line(14, 4, 15, 4);
    c.plot(7, 10);
    c.plot(10, 9);
  }),

  crop("parsnip", "Parsnip", "A long pale spring root.", (c) => {
    c.line(6, 6, 7, 11);
    c.line(10, 6, 9, 11);
    c.line(7, 11, 8, 14);
    c.line(9, 11, 8, 14);
    c.hline(6, 10, 6);
    c.line(7, 6, 5, 2);
    c.line(8, 6, 8, 1);
    c.line(9, 6, 12, 3);
    c.plot(6, 9);
  }),
  crop("potato", "Potato", "A lumpy underground tuber.", (c) => {
    c.points([
      [6, 4],
      [9, 4],
      [11, 5],
      [12, 7],
      [11, 11],
      [9, 13],
      [6, 12],
      [4, 10],
      [4, 7],
      [5, 5],
    ]);
    c.line(6, 4, 9, 4);
    c.line(12, 7, 11, 11);
    c.line(9, 13, 6, 12);
    c.line(4, 10, 4, 7);
    c.plot(6, 7);
    c.plot(9, 10);
  }),
  crop("cauliflower", "Cauliflower", "A dense white curd on a stem.", (c) => {
    c.circle(8, 6, 4);
    c.circle(5, 7, 2);
    c.circle(11, 7, 2);
    c.vline(8, 10, 13);
  }),
  crop("kale", "Kale", "Frilly leaf greens.", (c) => {
    c.line(8, 13, 4, 4);
    c.line(8, 13, 12, 4);
    c.line(8, 13, 8, 3);
    c.plot(3, 6);
    c.plot(13, 7);
    c.plot(6, 5);
    c.plot(10, 5);
  }),
  crop("green-bean", "Green Bean", "A long climbing pod.", (c) => {
    c.line(5, 3, 6, 13);
    c.line(6, 3, 7, 13);
    c.plot(4, 5);
    c.plot(8, 8);
    c.plot(5, 11);
  }),
  crop("strawberry", "Strawberry", "A heart-shaped berry with seeds.", (c) => {
    c.points([
      [5, 6],
      [7, 5],
      [8, 6],
      [9, 5],
      [11, 6],
      [12, 8],
      [8, 14],
      [4, 8],
    ]);
    c.line(5, 6, 7, 5);
    c.line(9, 5, 11, 6);
    c.line(11, 6, 12, 8);
    c.line(12, 8, 8, 14);
    c.line(8, 14, 4, 8);
    c.line(4, 8, 5, 6);
    c.points([
      [6, 8],
      [10, 8],
      [8, 10],
      [7, 12],
    ]);
    c.line(8, 6, 8, 3);
    c.plot(6, 4);
    c.plot(10, 4);
  }),
  crop("melon", "Melon", "A heavy summer melon.", (c) => {
    c.circle(8, 9, 5);
    c.vline(8, 4, 14);
    c.line(6, 5, 5, 12);
    c.line(10, 5, 11, 12);
    c.line(8, 4, 10, 2);
  }),
  crop("blueberry", "Blueberry", "A cluster of small berries.", (c) => {
    c.circle(6, 8, 2);
    c.circle(10, 8, 2);
    c.circle(8, 11, 2);
    c.line(6, 6, 8, 3);
    c.line(10, 6, 8, 3);
    c.points([
      [7, 7],
      [11, 8],
      [8, 12],
    ]);
  }),
  crop("tomato", "Tomato", "A round fruit with a calyx.", (c) => {
    c.circle(8, 9, 4);
    c.plot(8, 5);
    c.line(8, 5, 8, 2);
    c.points([
      [5, 5],
      [6, 6],
      [10, 6],
      [11, 5],
      [8, 7],
    ]);
    c.plot(6, 9);
    c.plot(10, 10);
  }),
  crop("corn", "Corn", "A tall ear of corn.", (c) => {
    c.rect(6, 3, 4, 10);
    c.plot(5, 4);
    c.plot(10, 5);
    c.plot(5, 8);
    c.plot(10, 9);
    c.vline(8, 13, 14);
  }),
  crop("pumpkin", "Pumpkin", "A ribbed autumn squash.", (c) => {
    c.circle(8, 9, 5);
    c.vline(8, 5, 13);
    c.vline(5, 7, 12);
    c.vline(11, 7, 12);
    c.plot(8, 3);
    c.plot(9, 4);
  }),
  crop("wheat", "Wheat", "Grain stalks for flour and beer.", (c) => {
    c.vline(5, 6, 14);
    c.vline(8, 5, 14);
    c.vline(11, 6, 14);
    c.plot(5, 4);
    c.plot(4, 5);
    c.plot(8, 3);
    c.plot(9, 4);
    c.plot(11, 4);
    c.plot(12, 5);
  }),
  crop("grape", "Grape", "A hanging fruit cluster.", (c) => {
    c.plot(8, 2);
    c.vline(8, 3, 4);
    c.circle(6, 6, 2);
    c.circle(10, 6, 2);
    c.circle(8, 9, 2);
    c.circle(5, 10, 2);
    c.circle(11, 10, 2);
    c.circle(8, 13, 2);
  }),
  crop("sunflower", "Sunflower", "A tall flower with a seed head.", (c) => {
    c.circle(8, 6, 4);
    c.circle(8, 6, 2, true);
    c.plot(8, 1);
    c.plot(3, 6);
    c.plot(13, 6);
    c.plot(8, 11);
    c.vline(8, 11, 14);
    c.plot(6, 13);
    c.plot(10, 12);
  }),
  crop("hops", "Hops", "Cone flowers used for brewing.", (c) => {
    c.vline(8, 2, 14);
    c.diamond(8, 6, 3);
    c.diamond(8, 11, 3);
  }),
  crop("beet", "Beet", "A round root with leafy tops.", (c) => {
    c.circle(8, 10, 3, true);
    c.line(8, 7, 5, 2);
    c.line(8, 7, 8, 2);
    c.line(8, 7, 11, 2);
  }),
  crop("hot-pepper", "Hot Pepper", "A hanging spicy pepper.", (c) => {
    c.plot(8, 3);
    c.plot(7, 4);
    c.line(8, 4, 10, 12);
    c.line(7, 5, 9, 12);
    c.plot(10, 13);
  }),
  crop("yam", "Yam", "A thick autumn tuber.", (c) => {
    c.rect(6, 4, 5, 9);
    c.plot(5, 6);
    c.plot(11, 10);
    c.plot(8, 3);
  }),

  seed("parsnip-seeds", "Parsnip Seeds", "Spring root crop packet.", (c) =>
    packet(c, "tall", (x) => {
      x.vline(8, 7, 12);
      x.line(8, 7, 6, 5);
      x.line(8, 7, 10, 5);
    }),
  ),
  seed(
    "strawberry-seeds",
    "Strawberry Seeds",
    "Spring berry crop packet.",
    (c) =>
      packet(c, "pouch", (x) => {
        x.points([
          [6, 8],
          [7, 7],
          [8, 8],
          [9, 7],
          [10, 8],
          [8, 12],
        ]);
        x.line(6, 8, 8, 12);
        x.line(10, 8, 8, 12);
      }),
  ),
  seed("blueberry-seeds", "Blueberry Seeds", "Summer berry crop packet.", (c) =>
    packet(c, "wide", (x) => {
      x.circle(6, 11, 1);
      x.circle(9, 10, 1);
      x.circle(11, 12, 1);
    }),
  ),
  seed("pumpkin-seeds", "Pumpkin Seeds", "Fall squash crop packet.", (c) =>
    packet(c, "rounded", (x) => {
      x.circle(8, 10, 3);
      x.vline(8, 7, 13);
      x.plot(8, 6);
    }),
  ),
  seed("wheat-seeds", "Wheat Seeds", "Fall grain crop packet.", (c) =>
    packet(c, "tied", (x) => {
      x.vline(7, 7, 11);
      x.vline(9, 7, 11);
      x.points([
        [6, 8],
        [8, 6],
        [10, 8],
        [6, 10],
        [10, 10],
      ]);
    }),
  ),
  seed("ancient-seed", "Ancient Seed", "A mysterious fossilized seed.", (c) => {
    c.hline(7, 10, 2);
    c.line(7, 2, 4, 6);
    c.vline(4, 6, 10);
    c.line(4, 10, 7, 14);
    c.hline(7, 10, 14);
    c.line(10, 14, 12, 10);
    c.vline(12, 6, 10);
    c.line(12, 6, 10, 2);
    c.line(6, 10, 10, 6);
    c.line(6, 6, 10, 10);
  }),
  seed(
    "mixed-seeds",
    "Mixed Seeds",
    "Wild seeds that grow a random crop.",
    (c) =>
      packet(c, "torn", (x) => {
        x.plot(6, 9);
        x.plot(8, 8);
        x.plot(10, 10);
        x.plot(7, 11);
        x.plot(9, 12);
      }),
  ),

  forage(
    "wild-horseradish",
    "Wild Horseradish",
    "A spicy spring forage root.",
    (c) => {
      c.line(6, 6, 5, 10);
      c.line(5, 10, 8, 14);
      c.line(8, 14, 11, 10);
      c.line(11, 10, 10, 6);
      c.hline(6, 10, 6);
      c.line(7, 6, 4, 2);
      c.line(8, 6, 8, 1);
      c.line(9, 6, 12, 2);
      c.plot(6, 9);
      c.plot(9, 11);
    },
  ),
  forage("daffodil", "Daffodil", "A yellow spring wildflower.", (c) => {
    c.circle(8, 6, 3);
    c.circle(8, 6, 1, true);
    c.vline(8, 9, 14);
    c.plot(6, 11);
  }),
  forage("leek", "Leek", "A wild onion stalk.", (c) => {
    c.line(7, 8, 4, 2);
    c.line(8, 8, 8, 1);
    c.line(9, 8, 12, 2);
    c.vline(6, 8, 12);
    c.vline(10, 8, 12);
    c.line(6, 12, 8, 14);
    c.line(10, 12, 8, 14);
    c.hline(6, 10, 8);
  }),
  forage("dandelion", "Dandelion", "A puffball wildflower.", (c) => {
    c.circle(8, 5, 3);
    c.plot(5, 3);
    c.plot(11, 3);
    c.plot(4, 6);
    c.plot(12, 6);
    c.vline(8, 8, 14);
  }),
  forage("morel", "Morel", "A honeycomb forest mushroom.", (c) => {
    c.circle(8, 6, 4);
    c.plot(7, 5);
    c.plot(9, 6);
    c.plot(6, 7);
    c.plot(10, 7);
    c.vline(8, 10, 13);
  }),
  forage("holly", "Holly", "Winter berries on spiny leaves.", (c) => {
    c.line(4, 8, 12, 5);
    c.line(5, 11, 12, 8);
    c.circle(9, 9, 1, true);
    c.circle(11, 7, 1, true);
    c.circle(8, 11, 1, true);
  }),
  forage(
    "spice-berry",
    "Spice Berry",
    "A fragrant summer forage berry.",
    (c) => {
      c.circle(8, 9, 3);
      c.circle(8, 9, 1);
      c.line(8, 6, 8, 3);
      c.line(8, 4, 5, 2);
      c.line(8, 4, 11, 2);
      c.plot(5, 8);
      c.plot(11, 10);
    },
  ),
  forage("cave-carrot", "Cave Carrot", "A pale root found in mines.", (c) => {
    c.line(8, 3, 10, 13);
    c.line(8, 3, 6, 12);
    c.plot(7, 2);
    c.plot(9, 2);
  }),
  forage("wild-plum", "Wild Plum", "A small tart forest plum.", (c) => {
    c.circle(8, 9, 4);
    c.line(8, 5, 10, 2);
    c.line(10, 2, 13, 3);
    c.line(10, 3, 12, 5);
    c.plot(6, 8);
  }),
  forage("blackberry", "Blackberry", "A late-fall bramble berry.", (c) => {
    c.circle(6, 7, 2);
    c.circle(10, 7, 2);
    c.circle(8, 10, 2);
    c.circle(5, 11, 2);
    c.circle(11, 11, 2);
    c.line(6, 5, 8, 3);
    c.line(10, 5, 8, 3);
  }),
  forage("winter-root", "Winter Root", "A hardy root under snow.", (c) => {
    c.line(8, 4, 5, 13);
    c.line(8, 4, 11, 12);
    c.plot(8, 3);
  }),
  forage(
    "crystal-fruit",
    "Crystal Fruit",
    "A winter fruit with a glassy skin.",
    (c) => {
      c.diamond(8, 9, 5);
      c.diamond(8, 9, 2);
      c.line(8, 4, 10, 2);
      c.plot(11, 2);
    },
  ),
  forage("coconut", "Coconut", "A tough tropical nut.", (c) => {
    c.circle(8, 9, 5);
    c.line(5, 5, 11, 12);
    c.line(4, 7, 9, 13);
    c.points([
      [6, 7],
      [8, 6],
      [10, 7],
    ]);
  }),
  forage("cactus-fruit", "Cactus Fruit", "A desert forage fruit.", (c) => {
    c.circle(8, 9, 3, true);
    c.vline(8, 3, 6);
    c.plot(6, 5);
    c.plot(10, 4);
  }),

  resource("wood", "Wood", "Basic lumber from trees.", (c) => {
    c.rect(3, 4, 10, 4);
    c.circle(4, 6, 2);
    c.rect(2, 9, 10, 4);
    c.circle(11, 11, 2);
    c.plot(4, 6);
    c.plot(11, 11);
  }),
  resource("hardwood", "Hardwood", "Dense lumber from large stumps.", (c) => {
    c.rect(2, 4, 12, 8);
    c.hline(2, 13, 7);
    c.vline(7, 4, 11);
  }),
  resource("stone", "Stone", "Common rock for building and tools.", (c) => {
    c.plot(8, 4);
    c.line(8, 4, 3, 10);
    c.line(8, 4, 13, 9);
    c.hline(3, 13, 11);
    c.line(3, 10, 5, 11);
    c.line(13, 9, 12, 11);
  }),
  resource("fiber", "Fiber", "Weeds and plant fiber for crafting.", (c) => {
    c.line(5, 13, 4, 3);
    c.line(8, 13, 8, 2);
    c.line(11, 13, 12, 4);
  }),
  resource("sap", "Sap", "Sticky resin from tapped trees.", (c) => {
    c.plot(8, 2);
    c.line(8, 2, 4, 9);
    c.line(8, 2, 12, 9);
    c.circle(8, 10, 4);
    c.plot(6, 11);
    c.plot(9, 8);
  }),
  resource("clay", "Clay", "Soft earth for pottery and flooring.", (c) => {
    c.circle(6, 9, 3);
    c.circle(10, 9, 3);
    c.circle(8, 7, 3);
    c.hline(5, 11, 12);
    c.plot(6, 8);
    c.plot(10, 10);
  }),
  resource("coal", "Coal", "Fuel for furnaces.", (c) => {
    c.points([
      [7, 3],
      [11, 4],
      [13, 8],
      [10, 13],
      [5, 12],
      [3, 8],
      [5, 5],
    ]);
    c.line(7, 3, 11, 4);
    c.line(11, 4, 13, 8);
    c.line(13, 8, 10, 13);
    c.line(10, 13, 5, 12);
    c.line(5, 12, 3, 8);
    c.line(3, 8, 5, 5);
    c.line(5, 5, 7, 3);
    c.line(6, 6, 10, 10);
    c.line(9, 5, 6, 10);
  }),
  resource("copper-ore", "Copper Ore", "Raw copper from rocky nodes.", (c) => {
    c.points([
      [8, 3],
      [12, 5],
      [13, 10],
      [9, 13],
      [4, 11],
      [3, 7],
    ]);
    c.line(8, 3, 12, 5);
    c.line(12, 5, 13, 10);
    c.line(13, 10, 9, 13);
    c.line(9, 13, 4, 11);
    c.line(4, 11, 3, 7);
    c.line(3, 7, 8, 3);
    c.circle(7, 8, 2);
    c.circle(10, 10, 1);
  }),
  resource("iron-ore", "Iron Ore", "Raw iron from deeper mines.", (c) => {
    c.rect(4, 5, 8, 7);
    c.plot(6, 7);
    c.plot(10, 9);
  }),
  resource("gold-ore", "Gold Ore", "Raw gold from late-mine nodes.", (c) => {
    c.points([
      [7, 3],
      [11, 4],
      [13, 8],
      [11, 12],
      [7, 13],
      [3, 10],
      [4, 6],
    ]);
    c.line(7, 3, 11, 4);
    c.line(11, 4, 13, 8);
    c.line(13, 8, 11, 12);
    c.line(11, 12, 7, 13);
    c.line(7, 13, 3, 10);
    c.line(3, 10, 4, 6);
    c.line(4, 6, 7, 3);
    c.diamond(8, 8, 2);
  }),
  resource("star-ore", "Star Ore", "A rare late-game ore.", (c) => {
    c.plot(8, 3);
    c.line(8, 3, 5, 13);
    c.line(8, 3, 11, 13);
    c.hline(4, 12, 8);
    c.line(4, 8, 11, 13);
    c.line(12, 8, 5, 13);
  }),
  resource("quartz", "Quartz", "A common cave crystal.", (c) => {
    c.plot(8, 3);
    c.line(8, 3, 5, 12);
    c.line(8, 3, 11, 12);
    c.hline(5, 11, 12);
  }),
  resource("geode", "Geode", "A rock that may hold minerals.", (c) => {
    c.points([
      [7, 3],
      [11, 4],
      [13, 7],
      [12, 11],
      [9, 13],
      [5, 12],
      [3, 9],
      [4, 5],
    ]);
    c.line(7, 3, 11, 4);
    c.line(11, 4, 13, 7);
    c.line(13, 7, 12, 11);
    c.line(12, 11, 9, 13);
    c.line(9, 13, 5, 12);
    c.line(5, 12, 3, 9);
    c.line(3, 9, 4, 5);
    c.line(4, 5, 7, 3);
    c.diamond(8, 8, 2);
  }),
  resource(
    "magma-geode",
    "Magma Geode",
    "A geode formed in lava floors.",
    (c) => {
      c.points([
        [8, 2],
        [12, 4],
        [14, 8],
        [11, 13],
        [5, 13],
        [2, 8],
        [4, 4],
      ]);
      c.line(8, 2, 12, 4);
      c.line(12, 4, 14, 8);
      c.line(14, 8, 11, 13);
      c.line(11, 13, 5, 13);
      c.line(5, 13, 2, 8);
      c.line(2, 8, 4, 4);
      c.line(4, 4, 8, 2);
      c.diamond(8, 8, 2, true);
    },
  ),
  resource(
    "omni-geode",
    "Omni Geode",
    "A geode that can hold any mineral.",
    (c) => {
      c.circle(8, 8, 5);
      c.vline(8, 3, 13);
      c.hline(3, 13, 8);
      c.line(4, 4, 12, 12);
      c.line(12, 4, 4, 12);
      c.circle(8, 8, 2);
    },
  ),
  resource("bone-fragment", "Bone Fragment", "A shard of old bone.", (c) => {
    c.line(4, 11, 12, 4);
    c.line(4, 12, 12, 5);
    c.plot(5, 9);
    c.plot(11, 6);
  }),

  gem(
    "earth-crystal",
    "Earth Crystal",
    "A cloudy mineral from the mines.",
    (c) => {
      c.diamond(8, 8, 5);
      c.hline(6, 10, 8);
    },
  ),
  gem("frozen-tear", "Frozen Tear", "A cold blue cave gem.", (c) => {
    c.plot(8, 3);
    c.line(8, 3, 5, 8);
    c.line(8, 3, 11, 8);
    c.line(5, 8, 8, 13);
    c.line(11, 8, 8, 13);
  }),
  gem("fire-quartz", "Fire Quartz", "A warm crystal from lava levels.", (c) => {
    c.plot(8, 2);
    c.line(8, 2, 4, 12);
    c.line(8, 2, 12, 12);
    c.hline(4, 12, 12);
    c.plot(8, 7);
  }),
  gem("emerald", "Emerald", "A green cut gem.", (c) => {
    c.rect(5, 4, 6, 8);
    c.hline(6, 9, 3);
    c.hline(6, 9, 12);
    c.vline(8, 4, 11);
  }),
  gem("aquamarine", "Aquamarine", "A sea-colored gem.", (c) => {
    c.hline(6, 10, 2);
    c.line(6, 2, 4, 6);
    c.vline(4, 6, 10);
    c.line(4, 10, 6, 14);
    c.hline(6, 10, 14);
    c.line(10, 14, 12, 10);
    c.vline(12, 6, 10);
    c.line(12, 6, 10, 2);
    c.hline(4, 12, 8);
    c.vline(8, 3, 13);
  }),
  gem("ruby", "Ruby", "A deep red cut gem.", (c) => {
    c.hline(6, 10, 3);
    c.line(6, 3, 3, 7);
    c.line(10, 3, 13, 7);
    c.line(3, 7, 6, 13);
    c.line(13, 7, 10, 13);
    c.hline(6, 10, 13);
    c.line(3, 7, 13, 7);
    c.vline(8, 4, 12);
  }),
  gem("amethyst", "Amethyst", "A purple cluster gem.", (c) => {
    c.plot(8, 3);
    c.line(8, 3, 6, 12);
    c.line(8, 3, 10, 12);
    c.plot(4, 8);
    c.line(4, 8, 5, 13);
    c.plot(12, 7);
    c.line(12, 7, 11, 13);
  }),
  gem("topaz", "Topaz", "A golden cut gem.", (c) => {
    c.rect(4, 5, 8, 7);
    c.hline(6, 9, 4);
    c.hline(6, 9, 12);
  }),
  gem("jade", "Jade", "A smooth green stone.", (c) => {
    c.circle(8, 8, 5);
    c.circle(8, 8, 2);
    c.line(5, 5, 11, 11);
  }),
  gem("diamond", "Diamond", "A rare brilliant gem.", (c) => {
    c.plot(8, 2);
    c.line(8, 2, 3, 7);
    c.line(8, 2, 13, 7);
    c.line(3, 7, 8, 14);
    c.line(13, 7, 8, 14);
    c.hline(3, 13, 7);
  }),
  gem(
    "rainbow-shard",
    "Rainbow Shard",
    "A legendary prismatic crystal.",
    (c) => {
      c.plot(8, 1);
      c.line(8, 1, 2, 14);
      c.line(8, 1, 14, 14);
      c.hline(2, 14, 14);
      c.hline(5, 11, 8);
      c.vline(8, 4, 11);
    },
  ),

  fish("sunfish", "Sunfish", "A small sunny-day river fish.", (c) => {
    c.circle(8, 8, 4);
    c.line(5, 5, 8, 2);
    c.line(8, 2, 11, 5);
    c.line(5, 11, 8, 14);
    c.line(8, 14, 11, 11);
    c.plot(11, 7);
    c.line(4, 8, 1, 5);
    c.line(4, 8, 1, 11);
  }),
  fish("bream", "Bream", "A common nighttime river fish.", (c) => {
    c.line(3, 8, 6, 5);
    c.hline(6, 11, 5);
    c.line(11, 5, 14, 8);
    c.line(14, 8, 11, 10);
    c.hline(6, 11, 10);
    c.line(6, 10, 3, 8);
    c.plot(11, 7);
    c.line(3, 8, 1, 5);
    c.line(3, 8, 1, 11);
  }),
  fish("carp", "Carp", "Lives in lakes and ponds.", (c) => {
    c.circle(8, 8, 4);
    c.line(5, 5, 2, 4);
    c.line(5, 11, 2, 12);
    c.line(12, 8, 15, 6);
    c.line(12, 8, 15, 10);
    c.plot(5, 7);
    c.plot(8, 5);
    c.plot(8, 11);
  }),
  fish("catfish", "Catfish", "A whiskered rainy-day fish.", (c) => {
    c.line(3, 8, 6, 5);
    c.hline(6, 12, 5);
    c.line(12, 5, 14, 8);
    c.line(14, 8, 12, 11);
    c.hline(6, 12, 11);
    c.line(6, 11, 3, 8);
    c.line(3, 8, 1, 5);
    c.line(3, 8, 1, 11);
    c.line(12, 7, 15, 5);
    c.line(12, 9, 15, 11);
    c.plot(11, 7);
  }),
  fish("salmon", "Salmon", "A strong fall river fish.", (c) => {
    c.line(2, 8, 5, 5);
    c.hline(5, 12, 5);
    c.line(12, 5, 15, 8);
    c.line(15, 8, 12, 10);
    c.hline(5, 12, 10);
    c.line(5, 10, 2, 8);
    c.line(2, 8, 0, 5);
    c.line(2, 8, 0, 11);
    c.line(8, 5, 10, 2);
    c.plot(12, 7);
  }),
  fish("tuna", "Tuna", "An ocean fish with a crescent tail.", (c) => {
    c.line(2, 8, 6, 4);
    c.hline(6, 10, 4);
    c.line(10, 4, 13, 8);
    c.line(13, 8, 10, 12);
    c.hline(6, 10, 12);
    c.line(6, 12, 2, 8);
    c.line(13, 8, 15, 4);
    c.line(13, 8, 15, 12);
    c.line(7, 4, 9, 1);
    c.line(7, 12, 9, 15);
    c.plot(10, 7);
  }),
  fish("eel", "Eel", "A long night-ocean fish.", (c) => {
    c.line(2, 12, 5, 7);
    c.line(3, 13, 6, 8);
    c.line(5, 7, 9, 10);
    c.line(6, 8, 9, 11);
    c.line(9, 10, 13, 4);
    c.line(9, 11, 14, 5);
    c.hline(13, 14, 4);
    c.plot(13, 6);
  }),
  fish(
    "pufferfish",
    "Pufferfish",
    "A round ocean fish. Handle carefully.",
    (c) => {
      c.circle(8, 8, 4);
      c.points([
        [8, 2],
        [5, 3],
        [11, 3],
        [3, 5],
        [13, 5],
        [2, 8],
        [14, 8],
        [3, 11],
        [13, 11],
        [5, 13],
        [11, 13],
        [8, 14],
      ]);
      c.plot(10, 7);
      c.plot(11, 9);
    },
  ),
  fish("squid", "Squid", "A night ocean catch with tentacles.", (c) => {
    c.circle(8, 6, 3, true);
    c.vline(6, 9, 13);
    c.vline(8, 9, 14);
    c.vline(10, 9, 13);
    c.plot(5, 12);
    c.plot(11, 12);
  }),
  fish("legend-fish", "Legend", "A legendary mountain-lake fish.", (c) => {
    c.circle(8, 8, 4, true);
    c.plot(2, 6);
    c.plot(3, 8);
    c.plot(2, 10);
    c.plot(13, 5);
    c.plot(14, 8);
    c.plot(13, 11);
    c.plot(8, 3);
  }),

  food("egg", "Egg", ["animal-product"], "A chicken egg.", (c) => {
    c.hline(7, 9, 4);
    c.line(7, 4, 5, 7);
    c.vline(5, 7, 10);
    c.line(5, 10, 7, 13);
    c.hline(7, 9, 13);
    c.line(9, 13, 11, 10);
    c.vline(11, 7, 10);
    c.line(11, 7, 9, 4);
    c.plot(8, 8);
  }),
  food(
    "duck-egg",
    "Duck Egg",
    ["animal-product"],
    "A larger pale egg.",
    (c) => {
      c.hline(7, 9, 3);
      c.line(7, 3, 5, 6);
      c.vline(5, 6, 10);
      c.line(5, 10, 7, 13);
      c.hline(7, 9, 13);
      c.line(9, 13, 11, 10);
      c.vline(11, 6, 10);
      c.line(11, 6, 9, 3);
      c.plot(8, 6);
    },
  ),
  food("milk", "Milk", ["animal-product"], "Fresh cow milk.", (c) => {
    c.rect(4, 6, 8, 8);
    c.line(4, 6, 7, 2);
    c.line(12, 6, 9, 2);
    c.hline(7, 9, 2);
    c.vline(8, 3, 5);
    c.rect(6, 8, 4, 3);
  }),
  food(
    "goat-milk",
    "Goat Milk",
    ["animal-product"],
    "Creamy goat milk.",
    (c) => {
      c.rect(3, 6, 10, 7);
      c.hline(6, 9, 3);
      c.line(6, 3, 3, 6);
      c.line(9, 3, 12, 6);
      c.plot(5, 2);
      c.plot(10, 2);
      c.points([
        [5, 8],
        [7, 9],
        [9, 9],
        [11, 8],
      ]);
      c.hline(5, 10, 13);
    },
  ),
  food("wool", "Wool", ["animal-product"], "Fluffy sheep wool.", (c) => {
    c.circle(5, 7, 3);
    c.circle(9, 5, 3);
    c.circle(12, 8, 3);
    c.circle(9, 11, 3);
    c.circle(5, 11, 3);
    c.plot(8, 8);
  }),
  food(
    "duck-feather",
    "Duck Feather",
    ["animal-product"],
    "A soft iridescent feather.",
    (c) => {
      c.line(4, 13, 11, 3);
      c.line(5, 13, 12, 4);
      c.line(11, 3, 13, 5);
      c.line(13, 5, 10, 10);
      c.line(10, 10, 5, 13);
      c.line(6, 10, 11, 7);
      c.line(8, 7, 12, 5);
      c.line(8, 11, 4, 12);
    },
  ),
  food(
    "rabbit-foot",
    "Rabbit Foot",
    ["animal-product"],
    "A lucky forage from rabbits.",
    (c) => {
      c.circle(8, 6, 3, true);
      c.vline(8, 9, 13);
      c.plot(6, 12);
      c.plot(10, 12);
    },
  ),
  food(
    "truffle",
    "Truffle",
    ["animal-product"],
    "A rare pig-foraged fungus.",
    (c) => {
      c.circle(6, 8, 3);
      c.circle(10, 8, 3);
      c.circle(8, 10, 3);
      c.plot(5, 6);
      c.plot(10, 7);
      c.plot(8, 11);
    },
  ),
  food("cloth", "Cloth", ["crafted"], "Woven fabric from wool.", (c) => {
    c.rect(3, 4, 10, 9);
    c.hline(3, 12, 7);
    c.hline(3, 12, 10);
  }),
  food(
    "mayonnaise",
    "Mayonnaise",
    ["crafted", "artisan"],
    "Jarred egg mayonnaise.",
    (c) => {
      c.rect(3, 7, 10, 6);
      c.hline(4, 12, 6);
      c.hline(5, 11, 5);
      c.circle(8, 9, 2);
      c.plot(8, 4);
      c.circle(8, 3, 1);
    },
  ),
  food(
    "cheese",
    "Cheese",
    ["crafted", "artisan"],
    "A wheel of cow cheese.",
    (c) => {
      c.line(3, 11, 4, 6);
      c.line(4, 6, 8, 3);
      c.line(8, 3, 13, 7);
      c.line(13, 7, 12, 12);
      c.hline(3, 12, 12);
      c.line(8, 3, 8, 12);
      c.circle(10, 8, 1);
    },
  ),
  food(
    "goat-cheese",
    "Goat Cheese",
    ["crafted", "artisan"],
    "A tangy goat cheese wheel.",
    (c) => {
      c.circle(8, 9, 5);
      c.hline(3, 13, 9);
      c.line(8, 4, 6, 9);
      c.line(8, 4, 10, 9);
      c.circle(8, 7, 1);
    },
  ),
  food(
    "honey",
    "Honey",
    ["crafted", "artisan"],
    "Wildflower honey from a bee house.",
    (c) => {
      c.hline(6, 10, 3);
      c.hline(5, 11, 5);
      c.line(5, 5, 3, 8);
      c.line(11, 5, 13, 8);
      c.line(3, 8, 5, 12);
      c.line(13, 8, 11, 12);
      c.hline(5, 11, 12);
      c.diamond(8, 8, 2);
    },
  ),
  food("jam", "Jam", ["crafted", "artisan"], "Preserved fruit spread.", (c) => {
    c.rect(4, 6, 8, 8);
    c.hline(3, 12, 5);
    c.points([
      [3, 4],
      [5, 5],
      [7, 4],
      [9, 5],
      [12, 4],
    ]);
    c.circle(8, 10, 2);
    c.line(8, 8, 10, 7);
  }),
  food(
    "pickles",
    "Pickles",
    ["crafted", "artisan"],
    "Preserved vegetables.",
    (c) => {
      c.rect(5, 4, 6, 10);
      c.vline(7, 6, 11);
      c.vline(9, 6, 11);
    },
  ),
  food("wine", "Wine", ["crafted", "artisan"], "Aged fruit wine.", (c) => {
    c.hline(7, 9, 2);
    c.vline(7, 2, 6);
    c.vline(9, 2, 6);
    c.line(7, 6, 5, 8);
    c.line(9, 6, 11, 8);
    c.rect(5, 8, 7, 6);
    c.hline(6, 10, 11);
  }),
  food(
    "pale-ale",
    "Pale Ale",
    ["crafted", "artisan"],
    "Brewed from hops.",
    (c) => {
      c.rect(3, 4, 8, 10);
      c.line(11, 6, 14, 7);
      c.vline(14, 7, 11);
      c.line(14, 11, 11, 12);
      c.hline(4, 10, 7);
      c.points([
        [5, 3],
        [7, 2],
        [9, 3],
      ]);
    },
  ),
  food("coffee", "Coffee", ["cooked"], "A cup of roasted beans.", (c) => {
    c.rect(4, 6, 7, 6);
    c.plot(11, 7);
    c.plot(12, 8);
    c.plot(11, 9);
    c.plot(7, 4);
    c.plot(8, 3);
  }),
  food("fried-egg", "Fried Egg", ["cooked"], "A simple breakfast fry.", (c) => {
    c.points([
      [7, 3],
      [10, 4],
      [12, 3],
      [14, 6],
      [13, 9],
      [14, 12],
      [10, 13],
      [7, 12],
      [4, 13],
      [2, 10],
      [3, 7],
      [2, 5],
      [5, 4],
    ]);
    c.line(7, 3, 10, 4);
    c.line(12, 3, 14, 6);
    c.line(14, 6, 13, 9);
    c.line(13, 9, 14, 12);
    c.line(14, 12, 10, 13);
    c.line(10, 13, 7, 12);
    c.line(7, 12, 4, 13);
    c.line(4, 13, 2, 10);
    c.line(2, 10, 3, 7);
    c.line(3, 7, 2, 5);
    c.line(2, 5, 5, 4);
    c.line(5, 4, 7, 3);
    c.circle(8, 8, 2, true);
  }),
  food("hashbrowns", "Hashbrowns", ["cooked"], "Crispy fried potato.", (c) => {
    c.line(2, 9, 4, 13);
    c.hline(4, 12, 14);
    c.line(12, 14, 14, 9);
    c.hline(2, 14, 9);
    c.line(4, 11, 7, 6);
    c.line(7, 12, 10, 5);
    c.line(10, 12, 13, 7);
    c.line(3, 8, 5, 5);
  }),
  food(
    "pancakes",
    "Pancakes",
    ["cooked"],
    "A stacked breakfast plate.",
    (c) => {
      c.hline(4, 12, 10);
      c.hline(4, 12, 8);
      c.hline(4, 12, 6);
      c.plot(8, 4);
      c.plot(9, 5);
    },
  ),
  food("bread", "Bread", ["cooked"], "A baked loaf.", (c) => {
    c.rect(3, 6, 10, 6);
    c.hline(5, 11, 5);
    c.plot(6, 8);
    c.plot(9, 8);
  }),
  food("salad", "Salad", ["cooked"], "A bowl of mixed greens.", (c) => {
    c.circle(8, 9, 5);
    c.plot(6, 6);
    c.plot(9, 5);
    c.plot(11, 7);
    c.plot(7, 8);
  }),
  food("pizza", "Pizza", ["cooked"], "A baked cheese pie.", (c) => {
    c.circle(8, 8, 6);
    c.line(8, 8, 3, 5);
    c.line(8, 8, 13, 6);
    c.line(8, 8, 8, 14);
    c.plot(6, 7);
    c.plot(10, 9);
  }),
  food("sashimi", "Sashimi", ["cooked"], "Sliced raw fish.", (c) => {
    c.line(3, 10, 8, 5);
    c.line(4, 11, 9, 6);
    c.line(8, 10, 13, 5);
    c.line(7, 11, 12, 6);
  }),
  food(
    "complete-breakfast",
    "Complete Breakfast",
    ["cooked"],
    "Eggs, hashbrowns, and a bun.",
    (c) => {
      c.circle(5, 7, 3);
      c.rect(9, 5, 5, 4);
      c.rect(4, 11, 8, 3);
    },
  ),

  machine("chest", "Chest", "Stores items on the farm.", (c) => {
    c.rect(2, 5, 12, 8);
    c.hline(2, 13, 8);
    c.rect(7, 8, 2, 2);
  }),
  machine("furnace", "Furnace", "Smelts ore into bars.", (c) => {
    c.rect(3, 3, 10, 11);
    c.rect(6, 7, 4, 4);
    c.hline(5, 10, 14);
  }),
  machine("charcoal-kiln", "Charcoal Kiln", "Turns wood into coal.", (c) => {
    c.rect(3, 6, 10, 8);
    c.hline(4, 11, 5);
    c.rect(9, 1, 3, 5);
    c.line(5, 13, 5, 9);
    c.circle(8, 10, 3);
    c.plot(8, 12);
  }),
  machine("keg", "Keg", "Brews wine, juice, and ale.", (c) => {
    c.rect(4, 3, 8, 11);
    c.hline(4, 11, 6);
    c.hline(4, 11, 10);
    c.plot(8, 8);
  }),
  machine("preserve-jar", "Preserve Jar", "Makes jam and pickles.", (c) => {
    c.rect(4, 4, 8, 10);
    c.hline(5, 10, 3);
    c.hline(5, 10, 7);
  }),
  machine("cheese-press", "Cheese Press", "Turns milk into cheese.", (c) => {
    c.rect(3, 6, 10, 8);
    c.rect(6, 2, 4, 5);
    c.hline(5, 10, 10);
  }),
  machine(
    "mayonnaise-machine",
    "Mayonnaise Machine",
    "Turns eggs into mayonnaise.",
    (c) => {
      c.rect(4, 6, 8, 8);
      c.hline(5, 10, 5);
      c.circle(8, 3, 2);
      c.vline(8, 5, 7);
      c.circle(8, 10, 2);
      c.plot(6, 13);
      c.plot(10, 13);
    },
  ),
  machine("loom", "Loom", "Weaves wool into cloth.", (c) => {
    c.rect(3, 4, 10, 9);
    c.vline(5, 5, 11);
    c.vline(8, 5, 11);
    c.vline(11, 5, 11);
    c.hline(3, 12, 7);
  }),
  machine("bee-house", "Bee House", "Produces honey each few days.", (c) => {
    c.rect(4, 5, 8, 8);
    c.hline(3, 12, 5);
    c.plot(8, 3);
    c.plot(7, 4);
    c.plot(9, 4);
    c.rect(7, 8, 2, 2);
  }),
  machine("seed-maker", "Seed Maker", "Turns crops back into seeds.", (c) => {
    c.rect(3, 4, 10, 10);
    c.rect(6, 7, 4, 4);
    c.hline(5, 10, 2);
  }),
  machine(
    "recycling-machine",
    "Recycling Machine",
    "Turns trash into resources.",
    (c) => {
      c.rect(3, 3, 10, 11);
      c.line(6, 6, 10, 10);
      c.line(10, 6, 6, 10);
    },
  ),
  machine("sprinkler", "Sprinkler", "Waters adjacent crop tiles.", (c) => {
    c.rect(6, 6, 4, 6);
    c.plot(8, 4);
    c.hline(3, 13, 8);
    c.vline(8, 3, 13);
  }),
  machine(
    "quality-sprinkler",
    "Quality Sprinkler",
    "Waters a 3×3 crop patch.",
    (c) => {
      c.rect(6, 6, 4, 6);
      c.circle(8, 8, 5);
      c.plot(8, 3);
    },
  ),
  machine("scarecrow", "Scarecrow", "Keeps crows off nearby crops.", (c) => {
    c.circle(8, 4, 2);
    c.hline(3, 13, 7);
    c.vline(8, 6, 14);
    c.plot(5, 10);
    c.plot(11, 10);
  }),
  machine("tapper", "Tapper", "Collects sap from trees.", (c) => {
    c.rect(5, 6, 6, 6);
    c.hline(7, 8, 5);
    c.plot(11, 8);
    c.plot(12, 9);
  }),
  machine("crab-pot", "Crab Pot", "Catches shellfish in water.", (c) => {
    c.hline(5, 11, 3);
    c.line(5, 3, 2, 7);
    c.line(11, 3, 14, 7);
    c.vline(2, 7, 13);
    c.vline(14, 7, 13);
    c.hline(2, 14, 13);
    c.hline(2, 14, 8);
    c.vline(5, 5, 13);
    c.vline(11, 5, 13);
    c.line(5, 8, 11, 13);
    c.line(11, 8, 5, 13);
  }),
  machine(
    "lightning-rod",
    "Lightning Rod",
    "Catches storms as batteries.",
    (c) => {
      c.vline(8, 2, 13);
      c.plot(8, 1);
      c.hline(6, 10, 4);
      c.fillRect(6, 13, 4, 2);
    },
  ),

  furniture("bed", "Bed", "A place to sleep and end the day.", (c) => {
    c.rect(2, 3, 12, 11);
    c.rect(3, 4, 10, 4);
    c.hline(2, 13, 8);
  }),
  furniture("oak-table", "Oak Table", "A simple wooden table.", (c) => {
    c.rect(2, 5, 12, 5);
    c.vline(4, 10, 13);
    c.vline(11, 10, 13);
  }),
  furniture("oak-chair", "Oak Chair", "A matching wooden chair.", (c) => {
    c.rect(4, 7, 8, 5);
    c.vline(4, 3, 12);
    c.vline(11, 7, 12);
  }),
  furniture("lamp", "Lamp", "A small indoor light.", (c) => {
    c.rect(5, 2, 6, 5);
    c.vline(8, 7, 13);
    c.fillRect(6, 12, 4, 2);
  }),
  furniture("fireplace", "Fireplace", "A cozy stone hearth.", (c) => {
    c.rect(2, 2, 12, 12);
    c.rect(5, 6, 6, 6);
    c.hline(2, 13, 5);
  }),
  furniture("bookcase", "Bookcase", "Shelves for books and gifts.", (c) => {
    c.rect(3, 2, 10, 13);
    c.hline(3, 12, 6);
    c.hline(3, 12, 10);
    c.vline(6, 3, 5);
    c.vline(9, 7, 9);
  }),
  furniture("potted-plant", "Potted Plant", "A leafy houseplant.", (c) => {
    c.rect(5, 10, 6, 4);
    c.circle(8, 6, 4);
    c.plot(8, 2);
    c.plot(4, 6);
    c.plot(12, 5);
  }),
  furniture("clock", "Clock", "A wall clock for the cabin.", (c) => {
    c.circle(8, 8, 5);
    c.vline(8, 8, 5);
    c.line(8, 8, 11, 9);
  }),
  furniture("television", "Television", "A chunky farmhouse TV.", (c) => {
    c.rect(2, 4, 12, 8);
    c.rect(4, 6, 8, 4);
    c.hline(6, 9, 12);
  }),

  world(
    "shipping-bin",
    "Shipping Bin",
    ["farm"],
    "Sells whatever you place inside overnight.",
    (c) => {
      c.rect(2, 5, 12, 8);
      c.rect(5, 7, 6, 4);
      c.hline(2, 13, 5);
    },
  ),
  world(
    "mailbox",
    "Mailbox",
    ["town"],
    "Where letters and seeds arrive.",
    (c) => {
      c.rect(5, 4, 7, 6);
      c.vline(8, 10, 14);
      c.fillRect(7, 13, 3, 2);
      c.plot(12, 5);
    },
  ),
  world("fence", "Fence", ["farm"], "Keeps animals in a pasture.", (c) => {
    c.vline(4, 4, 13);
    c.vline(11, 4, 13);
    c.hline(4, 11, 6);
    c.hline(4, 11, 10);
  }),
  world("gate", "Gate", ["farm"], "A walkable fence opening.", (c) => {
    c.rect(3, 4, 10, 10);
    c.vline(8, 4, 13);
    c.plot(6, 8);
    c.plot(10, 8);
  }),
  world(
    "grass-starter",
    "Grass Starter",
    ["farm"],
    "Plants a patch of grass for animals.",
    (c) => {
      c.hline(3, 13, 13);
      c.line(5, 13, 5, 6);
      c.line(8, 13, 8, 4);
      c.line(11, 13, 11, 7);
    },
  ),
  world(
    "oak-sapling",
    "Oak Sapling",
    ["tree"],
    "Grows into an oak tree.",
    (c) => {
      c.circle(5, 7, 3);
      c.circle(9, 5, 3);
      c.circle(11, 8, 3);
      c.line(8, 9, 8, 15);
      c.line(8, 11, 5, 8);
      c.line(8, 11, 11, 8);
    },
  ),
  world(
    "maple-sapling",
    "Maple Sapling",
    ["tree"],
    "Grows into a maple tree.",
    (c) => {
      c.vline(8, 9, 15);
      c.points([
        [8, 1],
        [7, 4],
        [4, 2],
        [5, 6],
        [2, 6],
        [6, 10],
        [8, 8],
        [10, 10],
        [14, 6],
        [11, 6],
        [12, 2],
        [9, 4],
      ]);
      c.line(8, 1, 7, 4);
      c.line(7, 4, 4, 2);
      c.line(4, 2, 5, 6);
      c.line(5, 6, 2, 6);
      c.line(2, 6, 6, 10);
      c.line(6, 10, 8, 8);
      c.line(8, 8, 10, 10);
      c.line(10, 10, 14, 6);
      c.line(14, 6, 11, 6);
      c.line(11, 6, 12, 2);
      c.line(12, 2, 9, 4);
      c.line(9, 4, 8, 1);
    },
  ),
  world(
    "pine-sapling",
    "Pine Sapling",
    ["tree"],
    "Grows into a pine tree.",
    (c) => {
      c.vline(8, 12, 14);
      c.plot(8, 2);
      c.line(8, 2, 4, 11);
      c.line(8, 2, 12, 11);
      c.hline(4, 12, 11);
    },
  ),
  world(
    "weed",
    "Weed",
    ["forage", "world"],
    "A wild tuft. Cut for fiber.",
    (c) => {
      c.line(8, 13, 4, 5);
      c.line(8, 13, 8, 3);
      c.line(8, 13, 12, 6);
    },
  ),
  world("rock", "Rock", ["world", "mine"], "A small breakable stone.", (c) => {
    c.line(8, 5, 3, 11);
    c.line(8, 5, 13, 10);
    c.hline(3, 13, 12);
  }),
  world(
    "stump",
    "Stump",
    ["world", "tree"],
    "A hardwood stump to crack.",
    (c) => {
      c.rect(4, 6, 8, 7);
      c.hline(5, 10, 5);
      c.vline(8, 7, 11);
    },
  ),
  world("twig", "Twig", ["world"], "A fallen branch. Chop for wood.", (c) => {
    c.line(2, 12, 12, 4);
    c.line(3, 13, 13, 5);
    c.line(6, 10, 5, 6);
    c.line(7, 9, 6, 5);
    c.line(10, 7, 13, 8);
    c.line(11, 6, 14, 7);
    c.hline(1, 3, 12);
  }),
  world(
    "crop-sprout",
    "Crop Sprout",
    ["crop"],
    "Generic first-growth crop tile.",
    (c) => {
      c.hline(2, 14, 13);
      c.hline(4, 12, 14);
      c.vline(8, 6, 12);
      c.line(8, 8, 4, 5);
      c.line(8, 9, 3, 7);
      c.line(8, 8, 12, 5);
      c.line(8, 9, 13, 7);
      c.plot(4, 6);
      c.plot(12, 6);
    },
  ),
  world(
    "tea-bush",
    "Tea Bush",
    ["crop"],
    "A perennial bush for tea leaves.",
    (c) => {
      c.circle(5, 8, 3);
      c.circle(9, 6, 3);
      c.circle(11, 10, 3);
      c.circle(7, 11, 3);
      c.vline(8, 11, 15);
      c.line(8, 13, 5, 11);
      c.line(8, 13, 11, 10);
    },
  ),
  world(
    "berry-bush",
    "Berry Bush",
    ["world", "forage"],
    "Seasonal wild berries.",
    (c) => {
      c.circle(8, 8, 5);
      c.plot(6, 7);
      c.plot(10, 6);
      c.plot(8, 10);
      c.plot(5, 10);
      c.plot(11, 9);
    },
  ),

  item(
    "bouquet",
    "Bouquet",
    ["gift"],
    "A wrapped bunch of flowers for a crush.",
    (c) => {
      c.plot(8, 13);
      c.line(8, 12, 5, 4);
      c.line(8, 12, 8, 3);
      c.line(8, 12, 11, 4);
      c.circle(5, 4, 2);
      c.circle(8, 3, 2);
      c.circle(11, 4, 2);
    },
  ),
  item(
    "heart-pendant",
    "Heart Pendant",
    ["gift", "special"],
    "A charm used to propose.",
    (c) => {
      c.circle(8, 3, 2);
      c.vline(8, 5, 7);
      c.points([
        [5, 7],
        [6, 6],
        [8, 8],
        [10, 6],
        [11, 7],
      ]);
      c.line(5, 7, 5, 9);
      c.line(11, 7, 11, 9);
      c.line(5, 9, 8, 13);
      c.line(11, 9, 8, 13);
      c.plot(7, 9);
      c.plot(9, 9);
    },
  ),
  item(
    "dinosaur-egg",
    "Dinosaur Egg",
    ["special", "animal-product"],
    "An ancient egg that might hatch.",
    (c) => {
      c.hline(7, 9, 2);
      c.line(7, 2, 4, 6);
      c.vline(4, 6, 10);
      c.line(4, 10, 7, 14);
      c.hline(7, 9, 14);
      c.line(9, 14, 12, 10);
      c.vline(12, 6, 10);
      c.line(12, 6, 9, 2);
      c.points([
        [6, 6],
        [9, 5],
        [10, 9],
        [7, 11],
      ]);
    },
  ),
  item(
    "ancient-doll",
    "Ancient Doll",
    ["special", "artifact"],
    "A buried doll from an old village.",
    (c) => {
      c.circle(8, 4, 2);
      c.rect(6, 6, 4, 5);
      c.vline(6, 11, 13);
      c.vline(9, 11, 13);
      c.plot(4, 8);
      c.plot(11, 8);
    },
  ),
  item(
    "treasure",
    "Treasure Chest",
    ["special"],
    "A small chest of loot.",
    (c) => {
      c.rect(3, 6, 10, 7);
      c.hline(3, 12, 9);
      c.plot(8, 9);
      c.hline(5, 10, 5);
    },
  ),
  item(
    "star-drop",
    "Star Drop",
    ["special"],
    "A legendary fruit that raises energy.",
    (c) => {
      c.plot(8, 2);
      c.line(8, 2, 5, 14);
      c.line(8, 2, 11, 14);
      c.hline(3, 13, 7);
      c.circle(8, 9, 2, true);
    },
  ),
  item(
    "lost-book",
    "Lost Book",
    ["special"],
    "A recovered library book.",
    (c) => {
      c.rect(4, 3, 8, 11);
      c.vline(6, 4, 12);
      c.hline(7, 10, 6);
      c.hline(7, 10, 8);
    },
  ),
  item(
    "battery-pack",
    "Battery Pack",
    ["resource", "special"],
    "Power captured from lightning.",
    (c) => {
      c.rect(5, 4, 6, 9);
      c.hline(7, 8, 3);
      c.plot(8, 7);
      c.plot(7, 8);
      c.plot(8, 9);
    },
  ),
];
