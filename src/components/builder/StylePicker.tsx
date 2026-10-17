"use client";

import { useState } from "react";
import { STYLE_CATEGORIES, ALL_STYLES } from "@/data/styles";
import ChipGroup from "./ChipGroup";

type Props = {
  value: string | null;
  onChange: (id: string | null) => void;
};

export default function StylePicker({ value, onChange }: Props) {
  const initial =
    STYLE_CATEGORIES.find((c) => c.styles.some((s) => s.id === value))?.id ?? STYLE_CATEGORIES[0].id;
  const [tab, setTab] = useState(initial);
  // 예시를 불러와 선택된 화풍이 다른 탭에 있으면 그 탭을 보여 줍니다.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    const owner = STYLE_CATEGORIES.find((c) => c.styles.some((s) => s.id === value));
    if (owner) setTab(owner.id);
  }

  const category = STYLE_CATEGORIES.find((c) => c.id === tab) ?? STYLE_CATEGORIES[0];
  const selected = ALL_STYLES.find((s) => s.id === value);

  return (
    <div className="space-y-3">
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="tablist" aria-label="화풍 분류">
        {STYLE_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={c.id === tab}
            onClick={() => setTab(c.id)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
              c.id === tab
                ? "bg-indigo-100 text-indigo-700"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <span aria-hidden>{c.emoji}</span> {c.ko}
            <span className="ml-1 text-xs font-normal opacity-60">{c.styles.length}</span>
          </button>
        ))}
      </div>
      <ChipGroup
        ariaLabel={`${category.ko} 화풍`}
        tone="indigo"
        allowDeselect
        value={value}
        onChange={onChange}
        options={category.styles.map((s) => ({ id: s.id, label: s.ko }))}
      />
      <p className="text-xs text-slate-500">
        {selected ? (
          <>
            선택한 화풍: <b className="text-indigo-600">{selected.ko}</b> · 다시 누르면 해제돼요
          </>
        ) : (
          "화풍을 고르지 않으면 AI가 알아서 정해요."
        )}
      </p>
    </div>
  );
}
