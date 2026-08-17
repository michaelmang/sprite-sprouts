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
          The git repo is the handoff. AI writes outlines into{" "}
          <code className="bg-paper rounded px-1.5 py-0.5 font-mono text-sm">
            sprites/
          </code>
          , you pull them onto your desktop, then commit the painted files back
          to the same paths.
        </p>
      </div>
      <ol className="flex list-decimal flex-col gap-5 pl-6 leading-7">
        <li>
          Clone or pull this repository. Each sprite is a folder such as{" "}
          <code className="bg-paper rounded px-1.5 py-0.5 font-mono text-sm">
            sprites/characters/willow-farmer/
          </code>
          .
        </li>
        <li>
          Open <span className="font-mono text-sm">sprite.json</span> in your
          custom software. The pixel grids, palette, animations, and pivot live
          there. <span className="font-mono text-sm">outline.svg</span> is the
          same idle pose as a picture.
        </li>
        <li>
          Paint interiors by adding palette keys (skin, hat, shirt, and so on)
          and replacing <span className="font-mono text-sm">.</span> cells. Keep{" "}
          <span className="font-mono text-sm">#</span> as the outline unless you
          are replacing the line work.
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
        New blank sprites:{" "}
        <code className="bg-paper rounded px-1.5 py-0.5 font-mono">
          yarn sprites:new character my-npc
        </code>
      </p>
    </main>
  );
}
