import { SpriteCard } from "@/components/SpriteCard";
import { listSprites } from "@/lib/catalog";

export default async function Home() {
  const entries = await listSprites();
  const characters = entries.filter(
    (entry) => entry.sprite.kind === "character",
  );
  const objects = entries.filter((entry) => entry.sprite.kind === "object");

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 py-12">
      <section className="max-w-2xl">
        <p className="text-moss text-sm font-medium">
          Stardew-like sprite catalog
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Outlines in, painted sprites back.
        </h1>
        <p className="text-soil mt-4 text-lg leading-8">
          AI drops character and object outlines here. Pull the files into your
          desktop software, paint them, then upload the finalized sprites to the
          same folders.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Characters</h2>
        {characters.length === 0 ? (
          <EmptyKind kind="character" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {characters.map((entry) => (
              <SpriteCard key={entry.sprite.id} sprite={entry.sprite} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Objects</h2>
        {objects.length === 0 ? (
          <EmptyKind kind="object" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {objects.map((entry) => (
              <SpriteCard key={entry.sprite.id} sprite={entry.sprite} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function EmptyKind({ kind }: { kind: "character" | "object" }) {
  return (
    <p className="border-soil/25 bg-paper text-soil rounded-xl border border-dashed px-4 py-6 text-sm">
      No {kind}s yet. Add one with{" "}
      <code className="bg-background text-foreground rounded px-1.5 py-0.5 font-mono">
        yarn sprites:new {kind} my-{kind}
      </code>
      .
    </p>
  );
}
