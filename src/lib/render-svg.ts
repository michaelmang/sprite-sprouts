import type { SpriteDocument } from "./sprite-schema";

export function pixelsToSvg(
  sprite: SpriteDocument,
  frameId: string,
  options: { scale?: number } = {},
): string {
  const frame = sprite.frames[frameId];
  if (!frame) {
    throw new Error(`Unknown frame "${frameId}" on sprite ${sprite.id}`);
  }

  const scale = options.scale ?? 16;
  const { width, height } = sprite.canvas;
  const rects: string[] = [];

  frame.pixels.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      const swatch = sprite.palette[cell];
      if (!swatch?.color) {
        return;
      }

      rects.push(
        `<rect x="${x}" y="${y}" width="1" height="1" fill="${swatch.color}"/>`,
      );
    });
  });

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width * scale}" height="${height * scale}" shape-rendering="crispEdges" role="img" aria-label="${escapeXml(sprite.name)}">`,
    `<title>${escapeXml(sprite.name)} — ${escapeXml(frameId)}</title>`,
    `<rect width="${width}" height="${height}" fill="transparent"/>`,
    rects.join(""),
    `</svg>`,
  ].join("");
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
