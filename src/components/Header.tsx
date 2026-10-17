import Logo from "./Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <a href="#top" aria-label="클래스부스트 처음으로">
          <Logo dark />
        </a>
        <nav className="flex items-center gap-1 text-sm font-semibold text-zinc-300">
          <a href="#studio" className="hidden rounded-lg px-3 py-1.5 hover:text-white sm:inline">
            만들기
          </a>
          <a href="#gallery" className="hidden rounded-lg px-3 py-1.5 hover:text-white sm:inline">
            예시
          </a>
          <a href="#how" className="hidden rounded-lg px-3 py-1.5 hover:text-white sm:inline">
            사용법
          </a>
          <a href="#studio" className="ml-1 rounded-lg bg-volt px-3 py-1.5 font-bold text-ink hover:brightness-95">
            무료로 시작
          </a>
        </nav>
      </div>
    </header>
  );
}
