"use client";

import Image from "next/image";
import type { ExampleImage } from "@/data/exampleImages";
import { REVISIONS } from "@/data/revisions";
import type { Lang } from "@/lib/builder";
import CopyButton from "./CopyButton";

type Props = {
  prompt: string;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  revisions: string[];
  onToggleRevision: (id: string) => void;
  /** 갤러리에서 불러온 예시의 생성 이미지 */
  preview?: { title: string; image: ExampleImage } | null;
};

export default function PromptPanel({ prompt, lang, onLangChange, revisions, onToggleRevision, preview }: Props) {
  return (
    <div className="space-y-4 rounded-3xl border border-indigo-100 bg-white p-5 shadow-lg shadow-indigo-100/50 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-extrabold text-slate-900">✨ 완성된 프롬프트</h3>
        <div role="group" aria-label="프롬프트 언어" className="flex rounded-full bg-slate-100 p-1 text-xs font-bold">
          {(["ko", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={lang === l}
              onClick={() => onLangChange(l)}
              className={`rounded-full px-3 py-1.5 transition ${
                lang === l ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
              }`}
            >
              {l === "ko" ? "한국어" : "English"}
            </button>
          ))}
        </div>
      </div>

      <p
        className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-2xl bg-gradient-to-br from-pink-50 via-white to-indigo-50 p-4 text-[15px] leading-relaxed text-slate-800"
        lang={lang}
      >
        {prompt}
      </p>
      {lang === "en" && (
        <p className="text-xs text-slate-500">
          프리셋·칩으로 고른 내용은 영어로 바뀌고, 직접 입력한 문장과 행사명은 그대로 들어가요.
        </p>
      )}

      {preview && (
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-2.5 ring-1 ring-slate-100">
          <Image
            src={preview.image.src}
            alt={`${preview.title} AI 생성 예시 이미지`}
            width={preview.image.width}
            height={preview.image.height}
            sizes="72px"
            className="size-16 shrink-0 rounded-xl object-cover"
          />
          <p className="text-xs leading-relaxed text-slate-500">
            <b className="block text-slate-700">불러온 예시: {preview.title}</b>
            원래 예시 프롬프트로 만든 AI 이미지예요. 고친 내용과 이미지 AI에 따라 결과는 달라져요.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <CopyButton text={prompt} label="프롬프트 복사" className="flex-1 px-5 py-3 text-sm" />
        <a
          href="https://chatgpt.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          ChatGPT 열기 ↗
        </a>
      </div>

      <div className="space-y-2 border-t border-slate-100 pt-4">
        <p className="text-sm font-bold text-slate-800">
          결과가 아쉬우면? <span className="font-normal text-slate-500">탭해서 수정 요청 추가</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {REVISIONS.map((r) => {
            const on = revisions.includes(r.id);
            return (
              <button
                key={r.id}
                type="button"
                aria-pressed={on}
                onClick={() => onToggleRevision(r.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition active:scale-95 ${
                  on
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-600 hover:border-indigo-300"
                }`}
              >
                {on ? "✓ " : "+ "}
                {r.ko}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
