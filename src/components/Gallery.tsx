"use client";

import { useMemo, useState } from "react";
import { OUTPUT_TYPES } from "@/data/options";
import { EXAMPLES, type Example } from "@/data/examples";
import type { DayKey } from "@/lib/dates";
import { buildPrompt } from "@/lib/prompt";
import { stateFromExample } from "@/lib/state";
import ExampleCard from "./ExampleCard";
import ImageLightbox from "./ImageLightbox";

type Props = { images: Record<string, string>; onStart: (example: Example) => void; today: DayKey | null };

export default function Gallery({ images, onStart, today }: Props) {
  const [filter, setFilter] = useState<string>("all");
  const [opened, setOpened] = useState<Example | null>(null);
  const items = useMemo(
    () =>
      EXAMPLES.map((ex) => {
        const state = stateFromExample(ex.state);
        return { ex, state, prompt: buildPrompt(state, "ko", today) };
      }),
    [today],
  );
  const srcOf = (id: string) => images[id] ?? null;
  const tabs = [
    { id: "all", label: "전체", count: items.length },
    ...OUTPUT_TYPES.map((o) => ({ id: o.id, label: o.label, count: items.filter((i) => i.state.output === o.id).length })).filter((t) => t.count > 0),
  ];
  const list = filter === "all" ? items : items.filter((i) => i.state.output === filter);

  return (
    <div className="space-y-5">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={filter === t.id}
            onClick={() => setFilter(t.id)}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filter === t.id ? "bg-ink text-volt" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {t.label} <span className="text-xs opacity-60">{t.count}</span>
          </button>
        ))}
      </div>
      {Object.keys(images).length > 0 && (
        <p className="text-xs text-zinc-500">
          🖼️ 이미지는 각 예시 프롬프트로 생성한 AI 예시예요. 가로형(16:9)으로 생성되어 실제 사이즈 비율과 다를 수 있고, 한글이 틀리게 나올 수 있어요.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(({ ex, state, prompt }) => (
          <ExampleCard key={ex.id} example={ex} state={state} prompt={prompt} image={srcOf(ex.id)} onStart={onStart} onOpen={setOpened} />
        ))}
      </div>
      <ImageLightbox src={opened ? srcOf(opened.id) : null} title={opened?.title ?? ""} onClose={() => setOpened(null)} />
    </div>
  );
}
