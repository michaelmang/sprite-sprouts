import { SpriteCard } from "@/components/SpriteCard";
import { groupByCategory, listSprites, type CatalogEntry } from "@/lib/catalog";

export default async function Home() {
  const entries = await listSprites();
  const characters = groupByCategory(entries, "character");
  const objects = groupByCategory(entries, "object");
  const characterCount = entries.filter(
    (entry) => entry.sprite.kind === "character",
  ).length;
  const objectCount = entries.filter(
    (entry) => entry.sprite.kind === "object",
  ).length;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 py-12">
      <section className="max-w-2xl">
        <p className="text-moss text-sm font-medium">
          Stardew-like sprite catalog
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Painted drafts in, finished sprites back.
        </h1>
        <p className="text-soil mt-4 text-lg leading-8">
          {characterCount} character and {objectCount} object sprites covering a
          full valley: townsfolk, farm animals, tools, crops, forage, mines,
          fish, artisan goods, machines, and furniture. Every sprite ships
          painted with an outline, body, and shading, so you can pull a folder
          into your desktop software, refine it, and upload it back.
        </p>
      </section>

      <KindSections title="Characters" kind="character" groups={characters} />
      <KindSections title="Objects" kind="object" groups={objects} />
    </main>
  );
}

function KindSections({
  title,
  kind,
  groups,
}: {
  title: string;
  kind: "character" | "object";
  groups: Array<{ category: string; entries: CatalogEntry[] }>;
}) {
  if (groups.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <EmptyKind kind={kind} />
      </section>
    );
  }

  return (
    <>
      {groups.map((group) => (
        <section key={group.category} className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-semibold">{group.category}</h2>
            <p className="text-soil text-sm">{group.entries.length}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.entries.map((entry) => (
              <SpriteCard key={entry.sprite.id} sprite={entry.sprite} />
            ))}
          </div>
        </section>
      ))}
    </>
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
