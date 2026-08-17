import Link from "next/link";
import { notFound } from "next/navigation";

import { SpritePlayer } from "@/components/SpritePlayer";
import { getSprite, listSprites } from "@/lib/catalog";
import { kindFolder, type SpriteKind } from "@/lib/sprite-schema";

const kindFromFolder: Record<string, SpriteKind> = {
  characters: "character",
  objects: "object",
};

type SpritePageProps = {
  params: Promise<{ kind: string; id: string }>;
};

export async function generateStaticParams() {
  const entries = await listSprites();

  return entries.map((entry) => ({
    kind: kindFolder[entry.sprite.kind],
    id: entry.sprite.id,
  }));
}

export async function generateMetadata({ params }: SpritePageProps) {
  const { kind, id } = await params;
  const spriteKind = kindFromFolder[kind];
  if (!spriteKind) {
    return { title: "Sprite" };
  }

  const entry = await getSprite(spriteKind, id);
  return { title: entry?.sprite.name ?? "Sprite" };
}

export default async function SpritePage({ params }: SpritePageProps) {
  const { kind, id } = await params;
  const spriteKind = kindFromFolder[kind];
  if (!spriteKind) {
    notFound();
  }

  const entry = await getSprite(spriteKind, id);
  if (!entry) {
    notFound();
  }

  const { sprite, relativeDir } = entry;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-12">
      <Link href="/" className="text-soil hover:text-foreground text-sm">
        ← Catalog
      </Link>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <SpritePlayer sprite={sprite} />
        <aside className="flex flex-col gap-5">
          <div>
            <p className="text-moss text-sm font-medium">{sprite.status}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {sprite.name}
            </h1>
            <p className="text-soil mt-3 leading-7">{sprite.description}</p>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-soil">Canvas</dt>
              <dd className="font-mono">
                {sprite.canvas.width}×{sprite.canvas.height}
              </dd>
            </div>
            <div>
              <dt className="text-soil">Pivot</dt>
              <dd className="font-mono">
                {sprite.pivot.x},{sprite.pivot.y}
              </dd>
            </div>
            <div>
              <dt className="text-soil">Kind</dt>
              <dd>{sprite.kind}</dd>
            </div>
            <div>
              <dt className="text-soil">Frames</dt>
              <dd>{Object.keys(sprite.frames).length}</dd>
            </div>
          </dl>
          {sprite.tags.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {sprite.tags.map((tag) => (
                <li
                  key={tag}
                  className="bg-straw/60 rounded-full px-2 py-0.5 text-xs"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="border-soil/15 bg-paper rounded-lg border p-4 text-sm">
            <p className="font-medium">Pull these files</p>
            <p className="text-soil mt-1 font-mono text-xs">{relativeDir}/</p>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <a
                  className="text-moss underline"
                  href={`/api/sprites/${kind}/${id}`}
                >
                  sprite.json
                </a>
              </li>
              <li>
                <a
                  className="text-moss underline"
                  href={`/api/sprites/${kind}/${id}/outline`}
                >
                  outline.svg
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
