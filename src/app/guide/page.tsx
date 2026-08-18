import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pull & upload",
};

export default function GuidePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Pull &amp; upload
        </h1>
        <p className="text-soil mt-3 leading-7">
          The git repo is the handoff. Sprites are authored in PixelLab and
          committed into{" "}
          <code className="bg-paper rounded px-1.5 py-0.5 font-mono text-sm">
            sprites/
          </code>
          , so the art, the design docs, and the game all move together.
        </p>
      </div>
      <ol className="flex list-decimal flex-col gap-5 pl-6 leading-7">
        <li>
          Author the sprite in PixelLab, following the sizes and palette in{" "}
          <span className="font-mono text-sm">sprites/README.md</span>. Generate
          the shared style reference first so every asset matches.
        </li>
        <li>
          Add it under{" "}
          <code className="bg-paper rounded px-1.5 py-0.5 font-mono text-sm">
            sprites/characters/&lt;id&gt;/
          </code>{" "}
          or{" "}
          <code className="bg-paper rounded px-1.5 py-0.5 font-mono text-sm">
            sprites/objects/&lt;id&gt;/
          </code>{" "}
          with a <span className="font-mono text-sm">sprite.json</span> carrying
          its metadata, palette, and animations.
        </li>
        <li>
          Run{" "}
          <code className="bg-paper rounded px-1.5 py-0.5 font-mono text-sm">
            yarn sprites:validate
          </code>{" "}
          and{" "}
          <code className="bg-paper rounded px-1.5 py-0.5 font-mono text-sm">
            yarn sprites:audit
          </code>{" "}
          to check the schema and catch duplicate or under-filled art.
        </li>
        <li>
          Set <span className="font-mono text-sm">status</span> to{" "}
          <span className="font-mono text-sm">final</span>, run{" "}
          <code className="bg-paper rounded px-1.5 py-0.5 font-mono text-sm">
            yarn sprites:render
          </code>
          , then commit and push.
        </li>
      </ol>
      <p className="text-soil text-sm">
        The full production queue is in{" "}
        <span className="font-mono">docs/asset-plan.md</span>.
      </p>
    </main>
  );
}
