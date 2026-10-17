type Props = {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
};

/** 폼 항목 하나 (라벨 + 내용) */
export default function Field({ label, hint, htmlFor, children }: Props) {
  const Title = htmlFor ? "label" : "p";
  return (
    <div className="space-y-2.5">
      <div className="flex items-baseline justify-between gap-2">
        <Title htmlFor={htmlFor} className="text-sm font-bold text-slate-800">
          {label}
        </Title>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
