import { EVENT_PRESETS } from "@/data/presets";
import { EXAMPLES } from "@/data/examples";
import { ALL_STYLES } from "@/data/styles";

export default function Hero() {
  const stats = [
    { value: ALL_STYLES.length, label: "가지 화풍" },
    { value: EVENT_PRESETS.length, label: "개 행사 프리셋" },
    { value: EXAMPLES.length, label: "개 예시" },
  ];
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-pink-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 top-32 size-72 rounded-full bg-indigo-200/60 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 pb-6 pt-12 sm:pt-20">
        <p className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-pink-600 shadow-sm ring-1 ring-pink-100">
          무료 · 로그인 없음 · 입력 내용은 내 브라우저에만
        </p>
        <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
          학교 행사 포스터,
          <br />
          <span className="bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
            프롬프트부터 쉽게
          </span>
        </h1>
        <p className="mt-4 max-w-xl text-slate-600 sm:text-lg">
          행사명을 쓰고 몇 번만 탭하면 ChatGPT 같은 이미지 AI에 바로 붙여 넣을 프롬프트가 완성돼요.
          행사에 맞는 장면과 소품도 알아서 제안해 드려요.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#builder"
            className="rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-lg shadow-pink-200 transition hover:brightness-110"
          >
            지금 만들기
          </a>
          <a href="#gallery" className="rounded-full bg-white px-6 py-3 font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
            예시 먼저 보기
          </a>
        </div>
        <dl className="mt-8 flex gap-6 sm:gap-10">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-2xl font-black text-slate-900">
                {s.value}
                <span className="ml-0.5 text-sm font-semibold text-slate-500">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
