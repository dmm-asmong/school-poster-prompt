const STATS = [
  { k: "6종", v: "홍보물" },
  { k: "7가지", v: "플랫폼 사이즈" },
  { k: "3채널", v: "홍보 문구" },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink text-white">
      <div aria-hidden className="bg-grid absolute inset-0" />
      <div aria-hidden className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-volt/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-volt" /> 강사·프리랜서 강의자를 위한 홍보물 프롬프트 메이커
          </p>
          <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            강의는 자신 있는데,
            <br />
            <span className="text-volt">홍보물</span>이 늘 막막했다면.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            강의 주제와 대상만 고르면 모집 포스터·썸네일·카드뉴스·수료증용 <b className="text-zinc-200">이미지 AI 프롬프트</b>와{" "}
            <b className="text-zinc-200">인스타·스레드·블로그 홍보 문구</b>를 한 번에 만들어 드려요.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#studio" className="rounded-xl bg-volt px-5 py-3 text-sm font-extrabold text-ink hover:brightness-95">
              홍보물 만들기 →
            </a>
            <a href="#gallery" className="rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">
              예시 12개 보기
            </a>
          </div>
          <dl className="mt-9 flex gap-8">
            {STATS.map((s) => (
              <div key={s.v}>
                <dt className="text-2xl font-black text-white">{s.k}</dt>
                <dd className="text-xs text-zinc-500">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 결과물 미리보기 목업 (순수 CSS) */}
        <div aria-hidden className="relative mx-auto h-80 w-full max-w-md sm:h-96">
          <div className="absolute left-2 top-4 w-44 rotate-[-6deg] rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-900 p-4 shadow-2xl sm:w-52">
            <div className="aspect-[4/5] rounded-xl border border-white/20 p-3">
              <p className="text-[10px] font-bold text-blue-200">수강생 모집</p>
              <p className="mt-1 text-base font-black leading-tight sm:text-lg">4주 완성 파이썬</p>
              <div className="mt-3 space-y-1">
                {["기초 문법", "업무 자동화", "미니 프로젝트"].map((t) => (
                  <p key={t} className="text-[10px] text-blue-100">✔ {t}</p>
                ))}
              </div>
              <div className="mt-4 h-8 w-8 rounded bg-white/90" />
            </div>
          </div>
          <div className="absolute right-0 top-0 w-56 rotate-[4deg] rounded-2xl bg-volt p-3 text-ink shadow-2xl sm:w-64">
            <div className="flex aspect-video flex-col justify-between rounded-xl bg-ink p-3 text-white">
              <span className="w-fit rounded bg-volt px-1.5 text-[10px] font-black text-ink">NEW</span>
              <p className="text-xl font-black leading-none">
                AI 툴로 <span className="text-volt">10배</span>
                <br />
                빠르게
              </p>
            </div>
          </div>
          <div className="absolute bottom-2 right-4 w-60 rotate-[-2deg] rounded-2xl border border-white/10 bg-white p-4 text-ink shadow-2xl sm:w-72">
            <p className="text-[11px] font-bold text-zinc-400">✍️ 홍보 문구 · 인스타그램</p>
            <p className="mt-1 text-xs leading-relaxed">
              퇴근 후 2시간 투자로 내일 업무가 달라집니다.
              <br />
              📣 4주 완성 파이썬 · 얼리버드 99,000원
            </p>
            <p className="mt-2 text-[11px] font-semibold text-blue-600">#파이썬 #업무자동화 #직장인공부</p>
          </div>
        </div>
      </div>
    </section>
  );
}
