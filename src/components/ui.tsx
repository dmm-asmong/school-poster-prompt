import type { ReactNode } from "react";

type ChipOption = { id: string; label: string; emoji?: string; hint?: string };

/** 칩 하나만 고르기 */
export function Chips({
  options,
  value,
  onChange,
  allowDeselect = false,
  ariaLabel,
}: {
  options: ChipOption[];
  value: string | null;
  onChange: (id: string | null) => void;
  allowDeselect?: boolean;
  ariaLabel: string;
}) {
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
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition active:scale-95 ${
              selected
                ? "border-ink bg-ink text-volt shadow-sm"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
            }`}
          >
            {o.emoji && <span aria-hidden>{o.emoji}</span>}
            <span>{o.label}</span>
            {o.hint && <span className={`text-xs ${selected ? "text-white/60" : "text-zinc-400"}`}>{o.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** 폼 항목 (라벨 + 내용) */
export function Field({ label, hint, htmlFor, children }: { label: string; hint?: string; htmlFor?: string; children: ReactNode }) {
  const Title = htmlFor ? "label" : "p";
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <Title htmlFor={htmlFor} className="text-sm font-bold text-zinc-800">
          {label}
        </Title>
        {hint && <span className="text-xs text-zinc-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

/** 번호가 붙은 단계 카드 */
export function StepCard({ step, title, desc, children }: { step: number; title: string; desc: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`step-${step}`} className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-5 flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink text-sm font-black text-volt">
          {String(step).padStart(2, "0")}
        </span>
        <div>
          <h3 id={`step-${step}`} className="text-lg font-extrabold text-ink">
            {title}
          </h3>
          <p className="text-sm text-zinc-500">{desc}</p>
        </div>
      </header>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-zinc-400 focus:border-ink focus:outline-none focus:ring-2 focus:ring-volt/60";

export function Toggle({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 hover:border-zinc-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-[#0e1116]"
      />
      <span>
        <span className="block text-sm font-bold text-zinc-800">{label}</span>
        <span className="block text-xs text-zinc-500">{desc}</span>
      </span>
    </label>
  );
}

export function SectionTitle({ eyebrow, title, desc, dark = false }: { eyebrow: string; title: string; desc?: string; dark?: boolean }) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className={`mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] ${dark ? "text-volt" : "text-volt-dark"}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-volt" : "bg-volt-dark"}`} />
        {eyebrow}
      </p>
      <h2 className={`text-2xl font-black tracking-tight sm:text-3xl ${dark ? "text-white" : "text-ink"}`}>{title}</h2>
      {desc && <p className={`mt-2 text-sm leading-relaxed sm:text-base ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{desc}</p>}
    </div>
  );
}
