"use client";

import { useMemo, useState } from "react";
import { EXAMPLE_CATEGORIES, EXAMPLES, type Example, type ExampleCategory } from "@/data/examples";
import { stateFromExample } from "@/lib/builder";
import { buildPrompt } from "@/lib/prompt";
import ExampleCard from "./ExampleCard";

type Props = { onStart: (example: Example) => void };

export default function Gallery({ onStart }: Props) {
  const [category, setCategory] = useState<ExampleCategory | "전체">("전체");

  const prompts = useMemo(
    () => new Map(EXAMPLES.map((ex) => [ex.id, buildPrompt(stateFromExample(ex.state), "ko")])),
    [],
  );
  const list = category === "전체" ? EXAMPLES : EXAMPLES.filter((ex) => ex.category === category);
  const tabs: (ExampleCategory | "전체")[] = ["전체", ...EXAMPLE_CATEGORIES];

  return (
    <div className="space-y-5">
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
          <ExampleCard key={ex.id} example={ex} goodPrompt={prompts.get(ex.id) ?? ""} onStart={onStart} />
        ))}
      </div>
    </div>
  );
}
