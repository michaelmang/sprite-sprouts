import Link from "next/link";

export function Header() {
  return (
    <header className="border-soil/15 bg-paper/95 border-b">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          The Long Line
        </Link>
        <nav className="text-soil flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-foreground">
            Play
          </Link>
          <Link href="/guide" className="hover:text-foreground">
            About the art
          </Link>
        </nav>
      </div>
    </header>
  );
}
