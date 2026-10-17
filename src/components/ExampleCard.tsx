"use client";

import Image from "next/image";
import { useState } from "react";
import { OUTPUT_TYPES, PLATFORMS, byId } from "@/data/options";
import type { Example } from "@/data/examples";
import { colorLabel, styleFor } from "@/lib/prompt";
import type { BuilderState } from "@/lib/state";
import CopyButton from "./CopyButton";

type Props = {
  example: Example;
  state: BuilderState;
  prompt: string;
  image: string | null;
  onStart: (example: Example) => void;
  onOpen: (example: Example) => void;
};

/** 밝은 색 위에는 검은 글자, 어두운 색 위에는 흰 글자 */
function isLight(hex: string): boolean {
  const n = parseInt(hex.replace("#", ""), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return r * 0.299 + g * 0.587 + b * 0.114 > 160;
}

export default function ExampleCard({ example, state, prompt, image, onStart, onOpen }: Props) {
  const [failed, setFailed] = useState(false);
  const output = byId(OUTPUT_TYPES, state.output);
  const platform = byId(PLATFORMS, state.platform);
  const showImage = image && !failed;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
      {showImage ? (
        <button type="button" onClick={() => onOpen(example)} aria-label={`${example.title} 예시 이미지 크게 보기`} className="relative block aspect-video w-full overflow-hidden bg-zinc-100">
          <Image
            src={image}
            alt={`${example.title} AI 생성 예시 이미지`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            className="object-contain transition duration-300 group-hover:scale-[1.02]"
            onError={() => setFailed(true)}
          />
          <span className="absolute bottom-2 right-2 rounded-lg bg-ink/80 px-2 py-1 text-[11px] font-bold text-white backdrop-blur">🔍 크게 보기</span>
        </button>
      ) : (
        <Placeholder example={example} state={state} />
      )}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
          <span className="rounded-md bg-ink px-2 py-0.5 text-volt">
            {output?.emoji} {output?.label}
          </span>
          <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-zinc-600">
            {platform?.label} {platform?.ratio}
          </span>
          <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-zinc-600">
            {styleFor(state).emoji} {styleFor(state).label}
          </span>
        </div>
        <div>
          <h3 className="font-extrabold text-ink">{example.title}</h3>
          <p className="text-sm text-zinc-500">{example.desc}</p>
        </div>
        <details className="rounded-2xl bg-zinc-50 text-sm ring-1 ring-zinc-100">
          <summary className="cursor-pointer px-3 py-2 text-xs font-bold text-zinc-600">프롬프트 보기</summary>
          <p className="max-h-40 overflow-y-auto px-3 pb-3 text-xs leading-relaxed text-zinc-600">{prompt}</p>
        </details>
        <div className="mt-auto flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => onStart(example)}
            className="flex-1 rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:bg-ink-2 active:scale-95"
          >
            이 예시로 시작
          </button>
          <CopyButton text={prompt} label="📋 복사" className="px-4 py-2.5 text-sm" />
        </div>
      </div>
    </article>
  );
}

/** 이미지가 아직 없을 때 보여 주는 미리보기 카드 (브랜드 컬러 + 제목 타이포) */
function Placeholder({ example, state }: { example: Example; state: BuilderState }) {
  const hex = colorLabel(state.color).hex;
  const light = isLight(hex);
  const title = state.info.title.value || example.title;
  const sub = state.info.subtitle.mode !== "omit" ? state.info.subtitle.value : "";
  return (
    <div
      data-testid="example-placeholder"
      className="relative flex aspect-video w-full flex-col justify-between overflow-hidden p-4"
      style={{ background: `linear-gradient(135deg, ${hex} 0%, #0e1116 140%)`, color: light ? "#0e1116" : "#ffffff" }}
    >
      <span aria-hidden className="absolute -right-4 -top-6 text-[7rem] leading-none opacity-20">
        {example.emoji}
      </span>
      <span className="relative w-fit rounded-md bg-black/25 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">이미지 준비 중</span>
      <div className="relative">
        <p className="line-clamp-2 text-lg font-black leading-snug">{title}</p>
        {sub && <p className="mt-1 line-clamp-1 text-xs opacity-80">{sub}</p>}
      </div>
    </div>
  );
}
