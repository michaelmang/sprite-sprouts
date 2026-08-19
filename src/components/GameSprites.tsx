import Image, { type StaticImageData } from "next/image";

import heartSprite from "../../sprites/a_cute_colorful_root_vegetabl_6.png";
import orbSprite from "../../sprites/a_cute_colorful_root_vegetabl_5.png";
import seedSprite from "../../sprites/a_cute_colorful_root_vegetabl_8.png";
import shellSprite from "../../sprites/a_cute_colorful_root_vegetabl_13.png";
import apprenticeSprite from "../../sprites/cute_medieval_boy__south.png";
import guideSprite from "../../sprites/wise_bird_sage_wizard_philosopher_with__south.png";

export type BeatKind = "heart" | "seed" | "orb" | "shell";

type SpriteProps = {
  className?: string;
};

const beatSprites: Record<BeatKind, { image: StaticImageData; label: string }> =
  {
    heart: { image: heartSprite, label: "Heart beat" },
    seed: { image: seedSprite, label: "Sprout beat" },
    orb: { image: orbSprite, label: "Water orb beat" },
    shell: { image: shellSprite, label: "Shell beat" },
  };

function PixelSprite({
  alt,
  className,
  image,
}: SpriteProps & { alt: string; image: StaticImageData }) {
  return (
    <Image
      alt={alt}
      className={className}
      draggable={false}
      height={image.height}
      priority
      src={image}
      unoptimized
      width={image.width}
    />
  );
}

export function ApprenticeSprite({ className }: SpriteProps) {
  return (
    <PixelSprite
      alt="Rill, the apprentice"
      className={className}
      image={apprenticeSprite}
    />
  );
}

export function GuideSprite({ className }: SpriteProps) {
  return (
    <PixelSprite
      alt="Pip, the bird wizard"
      className={className}
      image={guideSprite}
    />
  );
}

export function BeatSprite({
  beat,
  className,
}: SpriteProps & { beat: BeatKind }) {
  const sprite = beatSprites[beat];
  return (
    <PixelSprite
      alt={sprite.label}
      className={className}
      image={sprite.image}
    />
  );
}
