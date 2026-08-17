import { notFound } from "next/navigation";

import { getSprite } from "@/lib/catalog";
import type { SpriteKind } from "@/lib/sprite-schema";

const kindFromFolder: Record<string, SpriteKind> = {
  characters: "character",
  objects: "object",
};

type SpriteRouteProps = {
  params: Promise<{ kind: string; id: string }>;
};

export async function GET(_request: Request, { params }: SpriteRouteProps) {
  const { kind, id } = await params;
  const spriteKind = kindFromFolder[kind];
  if (!spriteKind) {
    notFound();
  }

  const entry = await getSprite(spriteKind, id);
  if (!entry) {
    notFound();
  }

  return Response.json(entry.sprite);
}
