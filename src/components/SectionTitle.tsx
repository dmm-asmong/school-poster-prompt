type Props = { eyebrow: string; title: string; desc?: string };

export default function SectionTitle({ eyebrow, title, desc }: Props) {
  return (
    <div className="mb-6 space-y-2 sm:mb-8">
      <p className="text-sm font-bold text-pink-500">{eyebrow}</p>
      <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
      {desc && <p className="text-slate-600">{desc}</p>}
    </div>
  );
}
