import { EVENT_PRESETS, findPreset } from "@/data/presets";

type Props = {
  value: string | null;
  onSelect: (id: string | null) => void;
};

export default function PresetPicker({ value, onSelect }: Props) {
  const current = findPreset(value);
  return (
    <div className="space-y-3">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
        {EVENT_PRESETS.map((p) => {
          const selected = p.id === value;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(selected ? null : p.id)}
              className={`shrink-0 rounded-2xl border px-3 py-2 text-sm font-medium transition active:scale-95 ${
                selected
                  ? "border-pink-400 bg-pink-50 text-pink-700 ring-2 ring-pink-200"
                  : "border-dashed border-slate-300 bg-white text-slate-600 hover:border-pink-300"
              }`}
            >
              <span aria-hidden>{p.emoji}</span> {p.ko}
            </button>
          );
        })}
      </div>
      {current && (
        <p className="rounded-xl bg-gradient-to-r from-pink-50 to-indigo-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
          ✨ <b className="text-pink-600">{current.ko}</b> 프리셋으로 장면·요소·글자 가이드를 채웠어요.
          아래에서 마음대로 고쳐 쓰면 돼요.
        </p>
      )}
    </div>
  );
}
