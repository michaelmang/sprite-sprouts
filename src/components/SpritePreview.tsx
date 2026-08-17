import type { SpriteDocument } from "@/lib/sprite-schema";
import { pixelsToSvg } from "@/lib/render-svg";

type SpritePreviewProps = {
  sprite: SpriteDocument;
  frameId: string;
  scale?: number;
  className?: string;
};

export function SpritePreview({
  sprite,
  frameId,
  scale = 8,
  className,
}: SpritePreviewProps) {
  const svg = pixelsToSvg(sprite, frameId, { scale });

  return (
    // Data-URI SVGs are generated from sprite JSON; next/image does not apply.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
      alt={`${sprite.name} (${frameId})`}
      width={sprite.canvas.width * scale}
      height={sprite.canvas.height * scale}
      className={`[image-rendering:pixelated] ${className ?? ""}`}
    />
  );
}
