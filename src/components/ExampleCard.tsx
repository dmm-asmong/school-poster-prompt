import type { Example } from "@/data/examples";
import { findStyle } from "@/data/styles";
import CopyButton from "./CopyButton";

type Props = {
  example: Example;
  goodPrompt: string;
  onStart: (example: Example) => void;
};

export default function ExampleCard({ example, goodPrompt, onStart }: Props) {
  const style = findStyle(example.state.style ?? null);
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${example.gradient}`}>
        <span className="text-5xl drop-shadow-sm" aria-hidden>
          {example.emoji}
        </span>
        {style && (
          <span className="absolute bottom-2 right-2 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-slate-600 backdrop-blur">
            {style.ko}
          </span>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-slate-600 backdrop-blur">
          {example.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-extrabold text-slate-900">{example.title}</h3>
        <div className="rounded-2xl bg-rose-50 p-3">
          <p className="mb-1 text-[11px] font-bold text-rose-500">😕 아쉬운 프롬프트</p>
          <p className="text-sm text-slate-700">“{example.bad}”</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-3">
          <p className="mb-1 text-[11px] font-bold text-emerald-600">😊 좋은 프롬프트</p>
          <p className="max-h-36 overflow-y-auto text-sm leading-relaxed text-slate-700">{goodPrompt}</p>
        </div>
        <p className="text-xs leading-relaxed text-slate-500">💡 {example.tip}</p>
        <div className="mt-auto flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => onStart(example)}
            className="flex-1 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 active:scale-95"
          >
            이 예시로 시작
          </button>
          <CopyButton text={goodPrompt} className="px-4 py-2.5 text-sm" />
        </div>
      </div>
    </article>
  );
}
