import Image from "next/image";
import type { ExampleImage } from "@/data/exampleImages";
import type { Example } from "@/data/examples";
import { findStyle } from "@/data/styles";
import CopyButton from "./CopyButton";

type Props = {
  example: Example;
  goodPrompt: string;
  image?: ExampleImage;
  onStart: (example: Example) => void;
  onOpenImage: (example: Example) => void;
};

export default function ExampleCard({ example, goodPrompt, image, onStart, onOpenImage }: Props) {
  const style = findStyle(example.state.style ?? null);
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {image ? (
        <button
          type="button"
          onClick={() => onOpenImage(example)}
          aria-label={`${example.title} 예시 이미지 크게 보기`}
          className="group block w-full text-left"
        >
          {/* 예시 이미지는 모두 16:9 가로형이라 aspect-video + contain 으로 글자가 잘리지 않게 전체를 보여 줘요. */}
          <span className={`relative block aspect-video w-full overflow-hidden bg-gradient-to-br ${example.gradient}`}>
            <Image
              src={image.src}
              alt={`${example.title} AI 생성 예시 이미지`}
              width={image.width}
              height={image.height}
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
              className="h-full w-full object-contain transition duration-300 group-hover:brightness-105"
            />
            <span className="absolute left-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-semibold text-slate-600 shadow-sm backdrop-blur">
              {example.category}
            </span>
          </span>
          <span className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold">
            <span className="text-slate-500">AI 생성 예시 이미지</span>
            <span className="rounded-full bg-white px-2 py-0.5 text-slate-700 ring-1 ring-slate-200 transition group-hover:bg-slate-900 group-hover:text-white group-hover:ring-slate-900">
              🔍 크게 보기
            </span>
          </span>
        </button>
      ) : (
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
      )}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-extrabold text-slate-900">{example.title}</h3>
          {image && style && (
            <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600">
              {style.ko}
            </span>
          )}
        </div>
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
