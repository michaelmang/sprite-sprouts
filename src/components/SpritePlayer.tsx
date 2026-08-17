"use client";

import { useEffect, useMemo, useState } from "react";

import { SpritePreview } from "@/components/SpritePreview";
import type { SpriteDirection, SpriteDocument } from "@/lib/sprite-schema";

const directionOrder: SpriteDirection[] = ["down", "right", "up", "left"];

type SpritePlayerProps = {
  sprite: SpriteDocument;
};

export function SpritePlayer({ sprite }: SpritePlayerProps) {
  const [animationId, setAnimationId] = useState(
    sprite.animations[0]?.id ?? "",
  );
  const animation =
    sprite.animations.find((item) => item.id === animationId) ??
    sprite.animations[0];

  const directions = useMemo(
    () =>
      directionOrder.filter((item) => {
        const frames = animation?.directions[item];
        return Boolean(frames && frames.length > 0);
      }),
    [animation],
  );

  const [direction, setDirection] = useState<SpriteDirection>(
    directions[0] ?? "down",
  );
  const activeDirection = directions.includes(direction)
    ? direction
    : (directions[0] ?? "down");

  if (!animation) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <PlayingPreview
        key={`${animation.id}-${activeDirection}`}
        sprite={sprite}
        animationId={animation.id}
        direction={activeDirection}
        frameMs={animation.frameMs}
        frames={animation.directions[activeDirection] ?? []}
      />
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          Animation
          <select
            className="border-soil/20 bg-paper rounded border px-2 py-1"
            value={animation.id}
            onChange={(event) => setAnimationId(event.target.value)}
          >
            {sprite.animations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          Direction
          <select
            className="border-soil/20 bg-paper rounded border px-2 py-1"
            value={activeDirection}
            onChange={(event) =>
              setDirection(event.target.value as SpriteDirection)
            }
          >
            {directions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

type PlayingPreviewProps = {
  sprite: SpriteDocument;
  animationId: string;
  direction: SpriteDirection;
  frameMs: number;
  frames: string[];
};

function PlayingPreview({
  sprite,
  animationId,
  direction,
  frameMs,
  frames,
}: PlayingPreviewProps) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (frames.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % frames.length);
    }, frameMs);

    return () => window.clearInterval(timer);
  }, [frameMs, frames.length]);

  const frameId = frames[Math.min(frameIndex, frames.length - 1)] ?? frames[0];

  if (!frameId) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="border-soil/15 bg-background flex items-center justify-center rounded-lg border px-8 py-10">
        <SpritePreview sprite={sprite} frameId={frameId} scale={12} />
      </div>
      <p className="text-soil font-mono text-xs">
        {animationId}/{direction} · {frameId}
      </p>
    </div>
  );
}
