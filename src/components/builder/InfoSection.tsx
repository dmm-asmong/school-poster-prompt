"use client";

import { INFO_KEYS, INFO_META, type InfoKey, type InfoMode, type ResolvedField } from "@/lib/posterInfo";
import type { BuilderState } from "@/lib/builder";

type Props = {
  state: BuilderState;
  resolved: Record<InfoKey, ResolvedField>;
  onFieldChange: (key: InfoKey, patch: { mode?: InfoMode; value?: string }) => void;
  onShuffle: (key: InfoKey) => void;
};

const MODES: { id: InfoMode; label: string }[] = [
  { id: "exact", label: "정확히 입력" },
  { id: "ai", label: "AI가 예시로 채우기" },
  { id: "omit", label: "포스터에 넣지 않기" },
];

const inputClass =
  "w-full rounded-xl border bg-white px-3.5 py-2.5 text-[15px] text-slate-800 placeholder:text-slate-400 outline-none transition focus:ring-4";

function Badge({ field }: { field: ResolvedField }) {
  if (field.mode !== "ai") return null;
  const meta = INFO_META[field.key];
  if (!field.generated)
    return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">직접 수정함</span>;
  return meta.sample ? (
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">예시(가상) · 바꿔 쓰세요</span>
  ) : (
    <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[11px] font-bold text-pink-600">AI 추천 문구</span>
  );
}

function InfoRow({
  k,
  state,
  field,
  onFieldChange,
  onShuffle,
}: {
  k: InfoKey;
  state: BuilderState;
  field: ResolvedField;
  onFieldChange: Props["onFieldChange"];
  onShuffle: Props["onShuffle"];
}) {
  const meta = INFO_META[k];
  const raw = state.info[k];
  const id = `info-${k}`;
  // AI 모드에서는 추천 문구를 칸에 보여 주고, 고치면 그 글자가 우선합니다.
  const shown = raw.mode === "ai" ? field.text : raw.value;
  const placeholder =
    raw.mode === "exact" && k === "title" && state.eventName ? state.eventName : meta.placeholder;
  const tone =
    raw.mode === "ai" && field.generated && meta.sample
      ? "border-amber-300 bg-amber-50/40 focus:border-amber-400 focus:ring-amber-100"
      : "border-slate-200 focus:border-pink-400 focus:ring-pink-100";

  return (
    <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-bold text-slate-800">
          {meta.label}
        </label>
        <Badge field={field} />
      </div>
      <div role="group" aria-label={`${meta.label} 넣는 방식`} className="grid grid-cols-3 gap-1 rounded-xl bg-white p-1 ring-1 ring-slate-200">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={raw.mode === m.id}
            onClick={() => onFieldChange(k, { mode: m.id })}
            className={`rounded-lg px-1.5 py-1.5 text-[11.5px] font-semibold leading-tight transition sm:text-xs ${
              raw.mode === m.id ? "bg-indigo-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      {raw.mode !== "omit" && (
        <div className="flex gap-2">
          {k === "title" || k === "subtitle" ? (
            // 긴 제목도 모바일에서 다 보이도록 두 줄 칸 (줄바꿈은 공백으로)
            <textarea
              id={id}
              rows={2}
              className={`${inputClass} ${tone} resize-none`}
              value={shown}
              placeholder={placeholder}
              maxLength={80}
              onChange={(e) => onFieldChange(k, { value: e.target.value.replace(/\s*\n\s*/g, " ") })}
            />
          ) : (
            <input
              id={id}
              className={`${inputClass} ${tone}`}
              value={shown}
              placeholder={placeholder}
              maxLength={80}
              onChange={(e) => onFieldChange(k, { value: e.target.value })}
            />
          )}
          {raw.mode === "ai" && (
            <button
              type="button"
              onClick={() => onShuffle(k)}
              className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-pink-300 hover:text-pink-600 active:scale-95"
              aria-label={`${meta.label} 다른 문구 추천`}
            >
              🔀 다른 문구
            </button>
          )}
        </div>
      )}
      {raw.mode === "exact" && !field.text && (
        <p className="text-xs text-slate-400">비워 두면 포스터에 넣지 않아요.</p>
      )}
    </div>
  );
}

export default function InfoSection({ state, resolved, onFieldChange, onShuffle }: Props) {
  const noText = state.textSpace === "none";
  return (
    <div className="space-y-3">
      <p className="text-xs leading-relaxed text-slate-500">
        정해진 정보는 <b className="text-indigo-600">정확히 입력</b>, 아직 미정이면{" "}
        <b className="text-pink-600">AI가 예시로 채우기</b>를 고르세요. 예시 날짜·장소는 가상이니 실제 정보로 바꿔 쓰세요.
      </p>
      {noText && (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
          텍스트 여백이 &lsquo;없음 (그림만)&rsquo;이라 지금은 포스터에 글자가 들어가지 않아요.
        </p>
      )}
      <div className={`grid gap-3 sm:grid-cols-2 ${noText ? "opacity-50" : ""}`}>
        {INFO_KEYS.map((k) => (
          <div key={k} className={k === "title" || k === "subtitle" ? "sm:col-span-2" : ""}>
            <InfoRow k={k} state={state} field={resolved[k]} onFieldChange={onFieldChange} onShuffle={onShuffle} />
          </div>
        ))}
      </div>
    </div>
  );
}
