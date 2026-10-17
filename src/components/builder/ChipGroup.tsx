type ChipOption = { id: string; label: string; emoji?: string; hint?: string };

type Props = {
  options: ChipOption[];
  value: string | null;
  onChange: (id: string | null) => void;
  /** 다시 누르면 선택 해제 */
  allowDeselect?: boolean;
  tone?: "pink" | "indigo";
  ariaLabel: string;
};

export default function ChipGroup({
  options,
  value,
  onChange,
  allowDeselect = false,
  tone = "pink",
  ariaLabel,
}: Props) {
  const active =
    tone === "pink"
      ? "border-pink-500 bg-pink-500 text-white shadow-sm shadow-pink-200"
      : "border-indigo-500 bg-indigo-500 text-white shadow-sm shadow-indigo-200";

  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const selected = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(selected && allowDeselect ? null : o.id)}
            className={`inline-flex items-center gap-1 rounded-full border px-3.5 py-2 text-sm font-medium transition active:scale-95 ${
              selected
                ? active
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {o.emoji && <span aria-hidden>{o.emoji}</span>}
            <span>{o.label}</span>
            {o.hint && (
              <span className={`text-xs ${selected ? "text-white/80" : "text-slate-400"}`}>
                {o.hint}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
