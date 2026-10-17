export const BRAND = { name: "클래스부스트", en: "ClassBoost" };

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-volt text-sm font-black text-ink">
        ▲
      </span>
      <span className="leading-none">
        <span className={`block text-base font-black tracking-tight ${dark ? "text-white" : "text-ink"}`}>{BRAND.name}</span>
        <span className={`block text-[10px] font-semibold tracking-[0.18em] ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
          {BRAND.en.toUpperCase()}
        </span>
      </span>
    </span>
  );
}
