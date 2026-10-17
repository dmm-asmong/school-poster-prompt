import type { InfoKey, InfoMode } from "@/lib/state";
import type { Resolved } from "@/lib/suggest";
import { inputClass } from "../ui";

export const MODES: { id: InfoMode; label: string }[] = [
  { id: "exact", label: "직접 입력" },
  { id: "ai", label: "AI 예시" },
  { id: "omit", label: "넣지 않기" },
];

export function ModeSwitch({ value, onChange, label }: { value: InfoMode; onChange: (m: InfoMode) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={`${label} 입력 방식`} className="inline-flex rounded-lg bg-zinc-100 p-0.5 text-xs font-bold">
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          role="radio"
          aria-checked={value === m.id}
          onClick={() => onChange(m.id)}
          className={`rounded-md px-2.5 py-1 transition ${
            value === m.id ? "bg-white text-ink shadow-sm" : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

type Props = {
  k: InfoKey;
  label: string;
  placeholder: string;
  note?: string;
  value: string;
  resolved: Resolved;
  onMode: (k: InfoKey, mode: InfoMode) => void;
  onValue: (k: InfoKey, value: string) => void;
  onShuffle: (k: InfoKey) => void;
};

export default function InfoRow({ k, label, placeholder, note, value, resolved, onMode, onValue, onShuffle }: Props) {
  const { mode } = resolved;
  const id = `info-${k}`;
  return (
    <div className={`rounded-2xl border p-3 transition ${mode === "omit" ? "border-dashed border-zinc-200 bg-zinc-50" : "border-zinc-200 bg-white"}`}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className={`text-sm font-bold ${mode === "omit" ? "text-zinc-400" : "text-zinc-800"}`}>
          {label}
          {mode === "ai" && (
            <span className="ml-1.5 rounded bg-volt/40 px-1.5 py-0.5 text-[10px] font-bold text-ink">예시</span>
          )}
        </label>
        <ModeSwitch value={mode} onChange={(m) => onMode(k, m)} label={label} />
      </div>
      {mode === "omit" ? (
        <p className="text-xs text-zinc-400">홍보물에 넣지 않아요.</p>
      ) : (
        <div className="flex gap-2">
          <input
            id={id}
            value={mode === "ai" ? value || resolved.suggestion : value}
            onChange={(e) => onValue(k, e.target.value)}
            placeholder={mode === "ai" && !resolved.suggestion ? "추천 문구 준비 중…" : placeholder}
            className={inputClass}
          />
          {mode === "ai" && (
            <button
              type="button"
              onClick={() => onShuffle(k)}
              aria-label={`${label} 다른 예시`}
              title="다른 예시"
              className="shrink-0 rounded-xl border border-zinc-200 px-3 text-sm hover:border-ink"
            >
              🔀
            </button>
          )}
        </div>
      )}
      {note && mode !== "omit" && <p className="mt-1.5 text-[11px] text-zinc-400">{note}</p>}
    </div>
  );
}
