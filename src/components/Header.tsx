const NAV = [
  { href: "#builder", label: "빌더" },
  { href: "#gallery", label: "예시" },
  { href: "#guide", label: "가이드" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <a href="#top" className="flex items-center gap-2 font-extrabold text-slate-900">
          <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-pink-500 to-indigo-500 text-base text-white">
            🖼️
          </span>
          <span className="text-[15px] sm:hidden">포스터 프롬프트</span>
          <span className="hidden sm:inline">학교 행사 포스터 프롬프트</span>
        </a>
        <nav className="flex gap-1 text-sm font-semibold text-slate-600">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="rounded-full px-2.5 py-1.5 hover:bg-slate-100 sm:px-3">
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
