"use client";

import { useState } from "react";
import type { OutputId } from "@/data/options";
import type { Example } from "@/data/examples";
import { buildCaption, type Channel } from "@/lib/caption";
import { buildPrompt, textItems } from "@/lib/prompt";
import {
  DEFAULT_STATE,
  stateFromExample,
  switchOutput,
  type BuilderState,
  type InfoKey,
  type InfoMode,
  type Lang,
  type SeedKey,
} from "@/lib/state";
import { resolveInfo } from "@/lib/suggest";
import { useToday } from "@/lib/useToday";
import { StepDesign, StepLecture, StepOutput } from "./builder/Steps";
import Gallery from "./Gallery";
import OutputPanel from "./OutputPanel";
import { SectionTitle } from "./ui";

/** 빌더 + 결과판 + 예시 갤러리. 모든 처리는 브라우저 안에서만 일어나요. */
export default function Studio({ images }: { images: Record<string, string> }) {
  const [state, setState] = useState<BuilderState>(DEFAULT_STATE);
  const [lang, setLang] = useState<Lang>("ko");
  const [channel, setChannel] = useState<Channel>("instagram");
  const [loaded, setLoaded] = useState<string | null>(null);
  const today = useToday();

  const resolved = resolveInfo(state, today);
  const prompt = buildPrompt(state, lang, today);
  const caption = buildCaption(state, channel, today);
  const { dropped, max } = textItems(state, resolved);

  const patch = (p: Partial<BuilderState>) => setState((s) => ({ ...s, ...p }));
  const bump = (key: SeedKey) => setState((s) => ({ ...s, seeds: { ...s.seeds, [key]: s.seeds[key] + 1 } }));

  const onMode = (k: InfoKey, mode: InfoMode) =>
    setState((s) => {
      const f = s.info[k];
      // AI 예시 → 직접 입력: 지금 보이는 문구를 그대로 가져와 고쳐 쓰게 해요.
      const value = mode === "exact" && !f.value.trim() ? resolved[k].text : f.value;
      return { ...s, info: { ...s.info, [k]: { mode, value } } };
    });
  const onValue = (k: InfoKey, value: string) =>
    setState((s) => ({ ...s, info: { ...s.info, [k]: { ...s.info[k], value } } }));
  const onShuffle = (k: InfoKey | "curriculum") =>
    setState((s) => ({
      ...s,
      seeds: { ...s.seeds, [k]: s.seeds[k] + 1 },
      info: k === "curriculum" ? s.info : { ...s.info, [k]: { ...s.info[k], value: "" } },
    }));
  const onCurriculum = (p: Partial<BuilderState["curriculum"]>) =>
    setState((s) => {
      const next = { ...s.curriculum, ...p };
      if (p.mode === "exact" && s.curriculum.items.every((x) => !x.trim())) {
        next.items = [...resolved.curriculum.suggestion, ""].slice(0, 4);
      }
      return { ...s, curriculum: next };
    });
  const onOutput = (id: OutputId) => setState((s) => switchOutput(s, id));
  const onReset = () => {
    setState(DEFAULT_STATE);
    setLoaded(null);
  };
  const onStart = (example: Example) => {
    setState(stateFromExample(example.state));
    setLoaded(example.title);
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section id="studio" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-12 sm:py-16">
        <SectionTitle
          eyebrow="Promo Studio"
          title="3단계로 강의 홍보물 프롬프트 완성"
          desc="고르는 즉시 오른쪽 결과판에 이미지 프롬프트와 SNS 홍보 문구가 같이 만들어져요."
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div className="space-y-5">
            <StepOutput state={state} onPatch={patch} onOutput={onOutput} />
            <StepLecture
              state={state}
              onPatch={patch}
              resolved={resolved}
              onMode={onMode}
              onValue={onValue}
              onShuffle={onShuffle}
              onCurriculum={onCurriculum}
            />
            <StepDesign state={state} onPatch={patch} />
            {/* 모바일: 입력하는 동안 화면 아래에 붙어 있다가 결과판에 닿으면 멈춰요. */}
            <a
              href="#result"
              className="sticky bottom-4 z-20 block rounded-2xl bg-volt py-3 text-center text-sm font-extrabold text-ink shadow-lg shadow-black/20 lg:hidden"
            >
              결과 보기 · 복사하기 ↓
            </a>
          </div>
          <div className="lg:sticky lg:top-20">
            <OutputPanel
              state={state}
              prompt={prompt}
              lang={lang}
              onLang={setLang}
              caption={caption}
              channel={channel}
              onChannel={setChannel}
              onShuffleCaption={() => bump("caption")}
              onReset={onReset}
              loadedTitle={loaded}
              dropped={dropped}
              maxText={max}
            />
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-16 border-t border-zinc-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            eyebrow="Showcase"
            title="강사들이 바로 쓰는 예시 12개"
            desc="마음에 드는 예시를 눌러 빌더로 불러온 뒤, 내 강의 정보로 바꿔 쓰세요."
          />
          <Gallery images={images} onStart={onStart} today={today} />
        </div>
      </section>
    </>
  );
}
