import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:grid-cols-3">
        <div>
          <p className="font-bold">Space Coast Explorer</p>
          <p className="mt-2 text-sm text-slate-300">
            Self-guided destination discovery for Florida&apos;s Space Coast.
          </p>
        </div>
        <div className="grid gap-2 text-sm text-slate-200">
          <Link href="/tours">Tours</Link>
          <Link href="/space-coast">Destinations</Link>
          <Link href="/launches">Launches</Link>
          <Link href="/about">About</Link>
        </div>
        <div className="grid gap-2 text-sm text-slate-200">
          <Link href="/privacy">Privacy</Link>
          <span>Contact: hello@example.com</span>
        </div>
      </div>
    </footer>
  );
}
