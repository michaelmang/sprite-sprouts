export type BeatKind = "heart" | "seed" | "orb" | "shell";

type SpriteProps = {
  className?: string;
};

export function ApprenticeSprite({ className }: SpriteProps) {
  return (
    <svg
      aria-label="Rill, the apprentice"
      className={className}
      role="img"
      shapeRendering="crispEdges"
      viewBox="0 0 32 48"
    >
      <path fill="#2b1b25" d="M9 5h14v3h4v11h-3v5H8v-5H5V9h4z" />
      <path fill="#8f462f" d="M11 3h10v2h4v4h-3V7H10v3H7V7h4z" />
      <path fill="#d88952" d="M10 9h12v3h3v7h-3v4H10v-4H7v-7h3z" />
      <path fill="#ffd08a" d="M11 10h10v2h2v6h-3v3h-8v-3H9v-6h2z" />
      <path fill="#2b1b25" d="M12 13h2v2h-2zm6 0h2v2h-2zm-3 4h3v1h-3z" />
      <path fill="#304b52" d="M8 23h16v4h3v12h-5v-8H10v8H5V27h3z" />
      <path fill="#4c7a65" d="M10 24h12v5H10zm-2 6h16v7H8z" />
      <path fill="#d7ac55" d="M6 28h4v7H6zm16 0h4v7h-4z" />
      <path fill="#293044" d="M10 37h5v8H8v-3h2zm7 0h5v5h2v3h-7z" />
      <path fill="#7c382e" d="M7 44h8v3H7zm10 0h8v3h-8z" />
      <path fill="#f2ce71" d="M23 24h3v3h-3z" />
    </svg>
  );
}

export function GuideSprite({ className }: SpriteProps) {
  return (
    <svg
      aria-label="Pip, the bird wizard"
      className={className}
      role="img"
      shapeRendering="crispEdges"
      viewBox="0 0 40 52"
    >
      <path fill="#18223d" d="M13 3h12v3h5v5h4v22h-5v7H10v-7H5V11h4V6h4z" />
      <path fill="#335a91" d="M14 4h10v3h5v5h3v17h-5v6H12v-5H7V12h4V7h3z" />
      <path fill="#5ca0c9" d="M13 8h13v4h3v6H10v-6h3z" />
      <path fill="#f5dfb0" d="M11 17h18v10h-3v6H14v-5h-3z" />
      <path fill="#fff4cf" d="M14 19h12v8h-3v4h-6v-4h-3z" />
      <path fill="#23334e" d="M15 20h3v3h-3zm8 0h3v3h-3z" />
      <path fill="#d59642" d="M18 24h7v3h-7z" />
      <path fill="#f4f0dc" d="M12 28h4v8h3v6h-7zm14 0h4v8h-3v6h-7v-6h3z" />
      <path fill="#8e4e9a" d="M8 35h8v11H6v-7h2zm16 0h8v4h2v7H24z" />
      <path fill="#5e3276" d="M12 38h16v10H12z" />
      <path fill="#17203a" d="M8 46h11v4H6v-2h2zm13 0h11v2h2v2H21z" />
      <path fill="#7a4b2d" d="M34 18h3v31h-3z" />
      <path fill="#e9c95f" d="M32 14h7v7h-7z" />
      <path fill="#fff3a2" d="M34 12h3v11h-3zm-2 4h7v3h-7z" />
    </svg>
  );
}

export function BeatSprite({
  beat,
  className,
}: SpriteProps & { beat: BeatKind }) {
  const common = {
    className,
    role: "img" as const,
    shapeRendering: "crispEdges" as const,
    viewBox: "0 0 40 40",
  };

  if (beat === "heart") {
    return (
      <svg {...common} aria-label="Heart beat">
        <path
          fill="#27192c"
          d="M10 8h8v4h4V8h8v4h4v11h-4v4h-4v4h-4v4h-4v-4h-4v-4h-4v-4H6V12h4z"
        />
        <path
          fill="#e15689"
          d="M11 11h6v4h6v-4h6v3h3v8h-4v4h-4v4h-8v-4h-4v-4H9v-8h2z"
        />
        <path fill="#ff9fba" d="M12 12h5v4h-5zm3 5h12v4H15z" />
        <path fill="#94ec77" d="M17 5h3v6h-3zm4 1h5v3h-5z" />
        <path fill="#79ddf2" d="M2 18h6v3H2zm30 0h6v3h-6z" />
      </svg>
    );
  }

  if (beat === "seed") {
    return (
      <svg {...common} aria-label="Sprout beat">
        <path fill="#171f35" d="M14 13h12v4h5v14h-4v5H13v-4H9V18h5z" />
        <path fill="#9d315c" d="M14 16h12v3h3v11h-4v4H15v-3h-4V19h3z" />
        <path fill="#db537c" d="M14 18h12v8H14z" />
        <path fill="#f18ca1" d="M15 18h5v4h-5z" />
        <path fill="#59a43b" d="M18 4h4v12h-4z" />
        <path fill="#76c64b" d="M6 6h10v4h4v5h-8v-3H6zm17 2h11v6H22v-4h1z" />
        <path fill="#b8e35d" d="M8 7h7v2H8zm18 2h6v2h-6z" />
        <path fill="#292038" d="M15 23h3v3h-3zm8 0h3v3h-3z" />
      </svg>
    );
  }

  if (beat === "orb") {
    return (
      <svg {...common} aria-label="Water orb beat">
        <path
          fill="#17213a"
          d="M13 9h14v4h5v5h3v10h-4v5h-5v3H14v-3H9v-5H5V18h3v-5h5z"
        />
        <path
          fill="#286b8d"
          d="M13 12h14v3h4v5h2v7h-4v4h-4v3H15v-3h-4v-4H7v-7h3v-5h3z"
        />
        <path fill="#45a9b5" d="M14 14h9v3h4v4h3v7h-4v3H15v-3h-4v-9h3z" />
        <path fill="#8cded0" d="M14 15h7v3h-7z" />
        <path fill="#16243c" d="M14 22h3v3h-3zm10 0h3v3h-3zm-6 5h5v2h-5z" />
        <path
          fill="#4b9ea4"
          d="M3 10h5v3H3zm29 1h5v3h-5zM4 31h5v3H4zm28-1h5v3h-5z"
        />
      </svg>
    );
  }

  return (
    <svg {...common} aria-label="Shell beat">
      <path fill="#251a31" d="M8 28h4V15h4V9h8v3h5v4h4v8h-4v5h-5v4H12v-2H8z" />
      <path
        fill="#bc5e65"
        d="M11 27h3V16h4v-5h5v3h5v4h3v5h-4v4h-4v4h-9v-2h-3z"
      />
      <path fill="#ef9a6b" d="M14 25h3V16h4v-3h2v4h4v3h2v3h-4v3h-4v3h-7z" />
      <path fill="#f3cb6a" d="M17 23h3v-7h3v4h3v3h-3v3h-6z" />
      <path fill="#8cd15d" d="M7 9h4v6H7zm23 20h6v3h-6z" />
      <path fill="#58b7cf" d="M4 20h6v3H4zm26-8h5v3h-5z" />
      <path fill="#b66bda" d="M12 5h3v6h-3zm18 18h7v3h-7z" />
    </svg>
  );
}
