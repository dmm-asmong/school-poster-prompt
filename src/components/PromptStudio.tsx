"use client";

import { useState } from "react";
import { EXAMPLE_IMAGES } from "@/data/exampleImages";
import type { Example } from "@/data/examples";
import { findPreset, matchPreset } from "@/data/presets";
import {
  applyPreset,
  DEFAULT_STATE,
  defaultRatioFor,
  stateFromExample,
  type BuilderState,
  type Lang,
} from "@/lib/builder";
import { resolveInfo, type InfoKey, type InfoMode } from "@/lib/posterInfo";
import { buildPrompt } from "@/lib/prompt";
import { useToday } from "@/lib/useToday";
import BuilderForm from "./builder/BuilderForm";
import Gallery from "./Gallery";
import PromptPanel from "./PromptPanel";
import SectionTitle from "./SectionTitle";

/** 빌더 + 결과 + 예시 갤러리를 묶는 화면. 모든 처리는 브라우저 안에서만 일어나요. */
export default function PromptStudio() {
  const [state, setState] = useState<BuilderState>(DEFAULT_STATE);
  const [lang, setLang] = useState<Lang>("ko");
  /** 사용자가 프리셋을 직접 고르면 행사명 자동 추천을 멈춥니다. */
  const [presetPinned, setPresetPinned] = useState(false);
  /** 갤러리에서 불러온 예시 (결과 미리보기 이미지용) */
  const [loadedExample, setLoadedExample] = useState<Example | null>(null);

  const today = useToday();
  const prompt = buildPrompt(state, lang, today);
  const resolved = resolveInfo(state, today);
  const patch = (p: Partial<BuilderState>) => setState((s) => ({ ...s, ...p }));

  const onEventNameChange = (eventName: string) => {
    setState((s) => {
      const next = { ...s, eventName };
      if (presetPinned) return next;
      const match = matchPreset(eventName);
      if (match && match.id !== s.presetId) return applyPreset(next, match);
      return next;
    });
  };

  const onPresetSelect = (id: string | null) => {
    setPresetPinned(id !== null);
    setState((s) => applyPreset(s, findPreset(id)));
  };

  const onPurposeChange = (purpose: string) => patch({ purpose, ratio: defaultRatioFor(purpose) });

  const onToggleRevision = (id: string) =>
    setState((s) => ({
      ...s,
      revisions: s.revisions.includes(id) ? s.revisions.filter((r) => r !== id) : [...s.revisions, id],
    }));

  const onInfoChange = (key: InfoKey, p: { mode?: InfoMode; value?: string }) =>
    setState((s) => ({ ...s, info: { ...s.info, [key]: { ...s.info[key], ...p } } }));

  /** '다른 문구': 추천 번호를 바꾸고 직접 고친 글자는 지웁니다. */
  const onShuffle = (key: InfoKey) =>
    setState((s) => ({
      ...s,
      seeds: { ...s.seeds, [key]: s.seeds[key] + 1 },
      info: { ...s.info, [key]: { ...s.info[key], value: "" } },
    }));

  const onReset = () => {
    setState(DEFAULT_STATE);
    setPresetPinned(false);
    setLoadedExample(null);
  };

  const onStartExample = (example: Example) => {
    setState(stateFromExample(example.state));
    setPresetPinned(Boolean(example.state.presetId));
    setLoadedExample(example);
    document.getElementById("builder")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section id="builder" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:py-14">
        <SectionTitle
          eyebrow="프롬프트 빌더"
          title="골라서 탭, 프롬프트 완성"
          desc="행사명을 쓰고 칩을 고르면 ChatGPT에 붙여 넣을 문장이 바로 만들어져요."
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
          <BuilderForm
            state={state}
            onPatch={patch}
            onEventNameChange={onEventNameChange}
            onPresetSelect={onPresetSelect}
            onPurposeChange={onPurposeChange}
            onReset={onReset}
            resolved={resolved}
            onInfoChange={onInfoChange}
            onShuffle={onShuffle}
          />
          <div className="lg:sticky lg:top-20">
            <PromptPanel
              prompt={prompt}
              lang={lang}
              onLangChange={setLang}
              revisions={state.revisions}
              onToggleRevision={onToggleRevision}
              preview={
                loadedExample && EXAMPLE_IMAGES[loadedExample.id]
                  ? { title: loadedExample.title, image: EXAMPLE_IMAGES[loadedExample.id] }
                  : null
              }
            />
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-20 bg-gradient-to-b from-indigo-50/60 to-pink-50/40 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            eyebrow="예시 갤러리"
            title="아쉬운 프롬프트 vs 좋은 프롬프트"
            desc="마음에 드는 예시를 눌러 빌더로 불러온 뒤, 우리 학교에 맞게 고쳐 쓰세요."
          />
          <Gallery onStart={onStartExample} today={today} />
        </div>
      </section>
    </>
  );
}
