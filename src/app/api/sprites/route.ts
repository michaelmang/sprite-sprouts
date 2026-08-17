import { listSprites } from "@/lib/catalog";
import { kindFolder } from "@/lib/sprite-schema";

export async function GET() {
  const entries = await listSprites();

  return Response.json({
    sprites: entries.map((entry) => ({
      id: entry.sprite.id,
      name: entry.sprite.name,
      kind: entry.sprite.kind,
      status: entry.sprite.status,
      path: entry.relativeDir,
      json: `/api/sprites/${kindFolder[entry.sprite.kind]}/${entry.sprite.id}`,
      svg: `/api/sprites/${kindFolder[entry.sprite.kind]}/${entry.sprite.id}/outline`,
    })),
  });
}
