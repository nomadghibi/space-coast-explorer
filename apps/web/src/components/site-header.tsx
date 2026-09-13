import Link from "next/link";

const links = [
  { href: "/space-coast", label: "Destinations" },
  { href: "/tours", label: "Tours" },
  { href: "/analytics", label: "Analytics" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/50 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link className="flex items-center gap-3 text-base font-black text-slate-950" href="/">
          <span className="grid size-9 place-items-center rounded-md bg-teal-700 text-amber-200">✦</span>
          <span>Space Coast Explorer</span>
        </Link>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-slate-700">
          {links.map((link) => (
            <Link className="hover:text-teal-700" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
