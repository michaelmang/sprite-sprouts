export class PixelCanvas {
  readonly width: number;
  readonly height: number;
  private readonly cells: boolean[][];

  constructor(width: number, height: number, cells?: boolean[][]) {
    this.width = width;
    this.height = height;
    this.cells =
      cells ??
      Array.from({ length: height }, () =>
        Array.from({ length: width }, () => false),
      );
  }

  static fromPixels(pixels: string[]): PixelCanvas {
    const height = pixels.length;
    const width = pixels[0]?.length ?? 0;
    const canvas = new PixelCanvas(width, height);
    pixels.forEach((row, y) => {
      [...row].forEach((cell, x) => {
        if (cell === "#") {
          canvas.plot(x, y);
        }
      });
    });
    return canvas;
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  plot(x: number, y: number): this {
    const px = Math.round(x);
    const py = Math.round(y);
    if (this.inBounds(px, py)) {
      this.cells[py][px] = true;
    }
    return this;
  }

  erase(x: number, y: number): this {
    const px = Math.round(x);
    const py = Math.round(y);
    if (this.inBounds(px, py)) {
      this.cells[py][px] = false;
    }
    return this;
  }

  clearRect(x: number, y: number, w: number, h: number): this {
    for (let py = y; py < y + h; py += 1) {
      for (let px = x; px < x + w; px += 1) {
        this.erase(px, py);
      }
    }
    return this;
  }

  hline(x0: number, x1: number, y: number): this {
    const start = Math.min(x0, x1);
    const end = Math.max(x0, x1);
    for (let x = start; x <= end; x += 1) {
      this.plot(x, y);
    }
    return this;
  }

  vline(x: number, y0: number, y1: number): this {
    const start = Math.min(y0, y1);
    const end = Math.max(y0, y1);
    for (let y = start; y <= end; y += 1) {
      this.plot(x, y);
    }
    return this;
  }

  rect(x: number, y: number, w: number, h: number): this {
    if (w <= 0 || h <= 0) {
      return this;
    }
    this.hline(x, x + w - 1, y);
    this.hline(x, x + w - 1, y + h - 1);
    this.vline(x, y, y + h - 1);
    this.vline(x + w - 1, y, y + h - 1);
    return this;
  }

  fillRect(x: number, y: number, w: number, h: number): this {
    for (let py = y; py < y + h; py += 1) {
      this.hline(x, x + w - 1, py);
    }
    return this;
  }

  line(x0: number, y0: number, x1: number, y1: number): this {
    let x = x0;
    let y = y0;
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      this.plot(x, y);
      if (x === x1 && y === y1) {
        break;
      }
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
    return this;
  }

  circle(cx: number, cy: number, radius: number, fill = false): this {
    for (let y = -radius; y <= radius; y += 1) {
      for (let x = -radius; x <= radius; x += 1) {
        const distance = x * x + y * y;
        const outer = radius * radius;
        const inner = (radius - 0.9) * (radius - 0.9);
        if (fill ? distance <= outer : distance <= outer && distance >= inner) {
          this.plot(cx + x, cy + y);
        }
      }
    }
    return this;
  }

  diamond(cx: number, cy: number, radius: number, fill = false): this {
    for (let y = -radius; y <= radius; y += 1) {
      for (let x = -radius; x <= radius; x += 1) {
        const distance = Math.abs(x) + Math.abs(y);
        if (fill ? distance <= radius : distance === radius) {
          this.plot(cx + x, cy + y);
        }
      }
    }
    return this;
  }

  points(coords: Array<[number, number]>): this {
    for (const [x, y] of coords) {
      this.plot(x, y);
    }
    return this;
  }

  stamp(other: PixelCanvas, dx = 0, dy = 0): this {
    other.toPixels().forEach((row, y) => {
      [...row].forEach((cell, x) => {
        if (cell === "#") {
          this.plot(x + dx, y + dy);
        }
      });
    });
    return this;
  }

  mirrorX(): PixelCanvas {
    const clone = new PixelCanvas(this.width, this.height);
    this.toPixels().forEach((row, y) => {
      [...row].reverse().forEach((cell, x) => {
        if (cell === "#") {
          clone.plot(x, y);
        }
      });
    });
    return clone;
  }

  toPixels(): string[] {
    return this.cells.map((row) =>
      row.map((cell) => (cell ? "#" : ".")).join(""),
    );
  }
}

export function mirrorRows(pixels: string[]): string[] {
  return pixels.map((row) => [...row].reverse().join(""));
}

export function stepLegs(pixels: string[], which: "left" | "right"): string[] {
  const canvas = PixelCanvas.fromPixels(pixels);
  const height = pixels.length;
  const width = pixels[0]?.length ?? 0;
  const legTop = Math.max(0, height - 10);
  canvas.clearRect(0, legTop, width, height - legTop);

  const leftX = which === "left" ? 3 : 5;
  const rightX = which === "right" ? width - 5 : width - 7;
  const leftFootY = which === "left" ? height - 2 : height - 3;
  const rightFootY = which === "right" ? height - 2 : height - 3;

  canvas.vline(leftX, legTop, leftFootY);
  canvas.vline(leftX + 1, legTop, leftFootY);
  canvas.hline(leftX - 1, leftX + 2, leftFootY);

  canvas.vline(rightX, legTop, rightFootY);
  canvas.vline(rightX + 1, legTop, rightFootY);
  canvas.hline(rightX - 1, rightX + 2, rightFootY);

  return canvas.toPixels();
}
