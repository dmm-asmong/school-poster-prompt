"use client";

import { useState } from "react";
import { FOLLOW_UPS, OUTPUT_TYPES, PLATFORMS, byId } from "@/data/options";
import { josa } from "@/lib/josa";
import { CHANNELS, type Caption, type Channel } from "@/lib/caption";
import type { BuilderState, Lang } from "@/lib/state";
import { RatioIcon } from "./builder/Steps";
import CopyButton from "./CopyButton";

type Props = {
  state: BuilderState;
  prompt: string;
  lang: Lang;
  onLang: (l: Lang) => void;
  caption: Caption;
  channel: Channel;
  onChannel: (c: Channel) => void;
  onShuffleCaption: () => void;
  onReset: () => void;
  loadedTitle: string | null;
  dropped: string[];
  maxText: number;
};

export default function OutputPanel(props: Props) {
  const { state, prompt, lang, onLang, caption, channel, onChannel, onShuffleCaption, onReset, loadedTitle, dropped, maxText } = props;
  const [tab, setTab] = useState<"prompt" | "caption">("prompt");
  const output = byId(OUTPUT_TYPES, state.output);
  const platform = byId(PLATFORMS, state.platform);

  return (
    <div id="result" className="scroll-mt-20 overflow-hidden rounded-3xl bg-ink text-white shadow-xl">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          {platform && <RatioIcon ratio={platform.ratio} on size={28} />}
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold">
              {output?.emoji} {output?.label}
            </p>
            <p className="text-xs text-zinc-400">
              {platform?.label} · {platform?.ratio} · {platform?.px}
            </p>
          </div>
        </div>
        <button type="button" onClick={onReset} className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold text-zinc-400 hover:bg-white/10 hover:text-white">
          ↺ 처음부터
        </button>
      </div>
      {loadedTitle && (
        <p className="border-b border-white/10 bg-volt/10 px-5 py-2 text-xs text-volt">📌 &lsquo;{loadedTitle}&rsquo; 예시를 불러왔어요. 내 강의에 맞게 고쳐 보세요.</p>
      )}

      <div role="tablist" aria-label="결과 종류" className="grid grid-cols-2 gap-1 p-2">
        {(
          [
            ["prompt", "🖼️ 이미지 프롬프트"],
            ["caption", "✍️ 홍보 문구"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`rounded-xl py-2.5 text-sm font-bold transition ${tab === id ? "bg-volt text-ink" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "prompt" ? (
        <div className="space-y-4 px-5 pb-5" role="tabpanel" aria-label="이미지 프롬프트">
          <div className="flex items-center justify-between">
            <div role="radiogroup" aria-label="프롬프트 언어" className="inline-flex rounded-lg bg-white/10 p-0.5 text-xs font-bold">
              {(
                [
                  ["ko", "한국어"],
                  ["en", "English"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={lang === id}
                  onClick={() => onLang(id)}
                  className={`rounded-md px-3 py-1 ${lang === id ? "bg-white text-ink" : "text-zinc-400"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-zinc-500">{prompt.length.toLocaleString()}자</span>
          </div>
          <p data-testid="prompt" className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-2xl bg-white/5 p-4 text-sm leading-relaxed text-zinc-100 ring-1 ring-white/10">
            {prompt}
          </p>
          {dropped.length > 0 && (
            <p data-testid="dropped" className="rounded-xl bg-amber-400/10 px-3 py-2 text-xs leading-relaxed text-amber-200 ring-1 ring-amber-400/30">
              ✂️ {output?.label}{josa(output?.label ?? "", "은", "는")} 글자 항목을 {maxText}개까지만 넣어요. 깔끔한 디자인을 위해{" "}
              <b>{dropped.join(", ")}</b>{josa(dropped[dropped.length - 1], "은", "는")} 프롬프트에서 뺐어요.
              꼭 넣고 싶다면 다른 칸을 &lsquo;넣지 않기&rsquo;로 바꿔 주세요.
            </p>
          )}
          <CopyButton text={prompt} label="📋 프롬프트 복사" className="w-full py-3 text-sm" />
          <details className="group rounded-2xl bg-white/5 ring-1 ring-white/10">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold text-zinc-300 marker:hidden">
              🔧 결과가 아쉬우면 이어서 보낼 수정 요청 <span className="float-right text-zinc-500 group-open:rotate-180">▾</span>
            </summary>
            <ul className="space-y-2 px-4 pb-4">
              {FOLLOW_UPS.map((f) => (
                <li key={f.ko} className="flex items-center justify-between gap-2 text-xs text-zinc-300">
                  <span>{f[lang]}</span>
                  <CopyButton text={f[lang]} label="복사" variant="ghost" className="shrink-0 px-2.5 py-1 text-[11px]" />
                </li>
              ))}
            </ul>
          </details>
        </div>
      ) : (
        <div className="space-y-4 px-5 pb-5" role="tabpanel" aria-label="홍보 문구">
          <div role="radiogroup" aria-label="채널" className="grid grid-cols-3 gap-1 rounded-xl bg-white/10 p-1 text-xs font-bold">
            {CHANNELS.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={channel === c.id}
                onClick={() => onChannel(c.id)}
                className={`rounded-lg py-1.5 ${channel === c.id ? "bg-white text-ink" : "text-zinc-400 hover:text-white"}`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-zinc-500">{CHANNELS.find((c) => c.id === channel)?.hint} · 템플릿으로 만든 초안이니 내 말투로 다듬어 쓰세요.</p>
          <p data-testid="caption" className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-2xl bg-white p-4 text-sm leading-relaxed text-ink">
            {caption.text}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <CopyButton text={caption.text} label="📋 문구 전체 복사" className="py-3 text-sm" />
            <CopyButton text={caption.hashtags} label="# 해시태그만" variant="ghost" className="py-3 text-sm" />
          </div>
          <button type="button" onClick={onShuffleCaption} className="w-full rounded-xl border border-white/15 py-2.5 text-sm font-bold text-zinc-300 hover:bg-white/5">
            🔀 다른 버전으로
          </button>
        </div>
      )}
    </div>
  );
}
