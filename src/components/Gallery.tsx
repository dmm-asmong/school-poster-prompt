"use client";

import { useMemo, useState } from "react";
import { EXAMPLE_IMAGES } from "@/data/exampleImages";
import { EXAMPLE_CATEGORIES, EXAMPLES, type Example, type ExampleCategory } from "@/data/examples";
import { stateFromExample } from "@/lib/builder";
import { buildPrompt } from "@/lib/prompt";
import type { DayKey } from "@/lib/dates";
import ExampleCard from "./ExampleCard";
import ImageLightbox from "./ImageLightbox";

type Props = { onStart: (example: Example) => void; today: DayKey | null };

export default function Gallery({ onStart, today }: Props) {
  const [category, setCategory] = useState<ExampleCategory | "전체">("전체");
  const [opened, setOpened] = useState<Example | null>(null);
  const hasImages = Object.keys(EXAMPLE_IMAGES).length > 0;

  const prompts = useMemo(
    () => new Map(EXAMPLES.map((ex) => [ex.id, buildPrompt(stateFromExample(ex.state), "ko", today)])),
    [today],
  );
  const list = category === "전체" ? EXAMPLES : EXAMPLES.filter((ex) => ex.category === category);
  const tabs: (ExampleCategory | "전체")[] = ["전체", ...EXAMPLE_CATEGORIES];

  return (
    <div className="space-y-5">
      {hasImages && (
        <p className="rounded-2xl bg-white/70 px-4 py-2.5 text-xs leading-relaxed text-slate-500 ring-1 ring-slate-200">
          🖼️ 카드 이미지는 각 예시의 &lsquo;좋은 프롬프트&rsquo;로 실제 생성한 AI 예시예요. 같은 프롬프트라도 이미지
          AI 종류와 시도마다 결과가 달라지고, 한글 글자가 틀리게 나올 수 있으니 꼭 확인하세요. 예시 이미지는 가로형으로
          생성되어 실제 비율과 다를 수 있어요.
        </p>
      )}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {tabs.map((t) => {
          const count = t === "전체" ? EXAMPLES.length : EXAMPLES.filter((ex) => ex.category === t).length;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={category === t}
              onClick={() => setCategory(t)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === t
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {t} <span className="text-xs opacity-70">{count}</span>
            </button>
          );
        })}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((ex) => (
          <ExampleCard
            key={ex.id}
            example={ex}
            goodPrompt={prompts.get(ex.id) ?? ""}
            image={EXAMPLE_IMAGES[ex.id]}
            onStart={onStart}
            onOpenImage={setOpened}
          />
        ))}
      </div>
      <ImageLightbox
        image={opened ? (EXAMPLE_IMAGES[opened.id] ?? null) : null}
        title={opened?.title ?? ""}
        onClose={() => setOpened(null)}
      />
    </div>
  );
}
