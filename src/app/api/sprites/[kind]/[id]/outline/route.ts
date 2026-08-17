import { notFound } from "next/navigation";

import { getSprite } from "@/lib/catalog";
import { pixelsToSvg } from "@/lib/render-svg";
import type { SpriteKind } from "@/lib/sprite-schema";

const kindFromFolder: Record<string, SpriteKind> = {
  characters: "character",
  objects: "object",
};

type OutlineRouteProps = {
  params: Promise<{ kind: string; id: string }>;
};

export async function GET(_request: Request, { params }: OutlineRouteProps) {
  const { kind, id } = await params;
  const spriteKind = kindFromFolder[kind];
  if (!spriteKind) {
    notFound();
  }

  const entry = await getSprite(spriteKind, id);
  if (!entry) {
    notFound();
  }

  const previewFrame =
    entry.sprite.animations[0]?.directions.down?.[0] ??
    Object.keys(entry.sprite.frames)[0];

  if (!previewFrame) {
    notFound();
  }

  const svg = pixelsToSvg(entry.sprite, previewFrame);

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Disposition": `attachment; filename="${entry.sprite.id}-outline.svg"`,
    },
  });
}
