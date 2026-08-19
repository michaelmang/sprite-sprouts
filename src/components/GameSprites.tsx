"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";

import heartSprite from "../../sprites/a_cute_colorful_root_vegetabl_6.png";
import orbSprite from "../../sprites/a_cute_colorful_root_vegetabl_5.png";
import seedSprite from "../../sprites/a_cute_colorful_root_vegetabl_8.png";
import shellSprite from "../../sprites/a_cute_colorful_root_vegetabl_13.png";
import apprenticeSprite from "../../sprites/cute_medieval_boy__south.png";
import heartFrame0 from "../../sprites/objects/beat-1/animations/frame_000.png";
import heartFrame1 from "../../sprites/objects/beat-1/animations/frame_001.png";
import heartFrame2 from "../../sprites/objects/beat-1/animations/frame_002.png";
import heartFrame3 from "../../sprites/objects/beat-1/animations/frame_003.png";
import heartFrame4 from "../../sprites/objects/beat-1/animations/frame_004.png";
import heartFrame5 from "../../sprites/objects/beat-1/animations/frame_005.png";
import heartFrame6 from "../../sprites/objects/beat-1/animations/frame_006.png";
import heartFrame7 from "../../sprites/objects/beat-1/animations/frame_007.png";
import heartFrame8 from "../../sprites/objects/beat-1/animations/frame_008.png";
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

const heartAnimation = [
  heartFrame0,
  heartFrame1,
  heartFrame2,
  heartFrame3,
  heartFrame4,
  heartFrame5,
  heartFrame6,
  heartFrame7,
  heartFrame8,
];

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
  active = false,
  activationId = 0,
  beat,
  className,
}: SpriteProps & {
  active?: boolean;
  activationId?: number;
  beat: BeatKind;
}) {
  const sprite = beatSprites[beat];

  if (active && beat === "heart") {
    return (
      <AnimatedHeart
        key={activationId}
        alt={sprite.label}
        className={className}
      />
    );
  }

  return (
    <PixelSprite
      alt={sprite.label}
      className={className}
      image={sprite.image}
    />
  );
}

function AnimatedHeart({ alt, className }: SpriteProps & { alt: string }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timers = heartAnimation.slice(1).map((_, index) =>
      window.setTimeout(() => setFrame(index + 1), (index + 1) * 55),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return (
    <PixelSprite
      alt={`${alt}, animated`}
      className={className}
      image={heartAnimation[frame] ?? heartFrame0}
    />
  );
}
