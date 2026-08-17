import Link from "next/link";

import { SpritePreview } from "@/components/SpritePreview";
import { kindFolder, type SpriteDocument } from "@/lib/sprite-schema";

const statusStyles: Record<SpriteDocument["status"], string> = {
  outline: "bg-straw/70 text-foreground",
  "in-progress": "bg-soil/10 text-soil",
  final: "bg-moss/15 text-moss",
};

type SpriteCardProps = {
  sprite: SpriteDocument;
};

export function SpriteCard({ sprite }: SpriteCardProps) {
  const previewFrame =
    sprite.animations[0]?.directions.down?.[0] ?? Object.keys(sprite.frames)[0];

  if (!previewFrame) {
    return null;
  }

  return (
    <Link
      href={`/sprites/${kindFolder[sprite.kind]}/${sprite.id}`}
      className="border-soil/15 bg-paper hover:border-moss/40 flex flex-col gap-4 rounded-xl border p-4 transition"
    >
      <div className="bg-background flex min-h-48 items-center justify-center rounded-lg">
        <SpritePreview sprite={sprite} frameId={previewFrame} scale={6} />
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{sprite.name}</h2>
          <p className="text-soil text-sm">{sprite.kind}</p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[sprite.status]}`}
        >
          {sprite.status}
        </span>
      </div>
    </Link>
  );
}
