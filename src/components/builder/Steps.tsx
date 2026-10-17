import {
  AUDIENCES,
  AVOID_CHIPS,
  BRAND_COLORS,
  FORMATS,
  MOODS,
  OUTPUT_TYPES,
  PLATFORMS,
  STYLES,
  type OutputId,
} from "@/data/options";
import { INFO_KEYS, type BuilderState, type InfoKey, type InfoMode } from "@/lib/state";
import type { ResolvedInfo } from "@/lib/suggest";
import { Chips, Field, StepCard, Toggle, inputClass } from "../ui";
import InfoRow, { ModeSwitch } from "./InfoRow";

type Common = { state: BuilderState; onPatch: (p: Partial<BuilderState>) => void };

export function StepOutput({ state, onPatch, onOutput }: Common & { onOutput: (id: OutputId) => void }) {
  return (
    <StepCard step={1} title="무엇을 만들까요?" desc="홍보물 종류를 고르면 어울리는 사이즈와 정보 칸이 자동으로 맞춰져요.">
      <div role="radiogroup" aria-label="홍보물 종류" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {OUTPUT_TYPES.map((o) => {
          const on = state.output === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onOutput(o.id)}
              className={`rounded-2xl border p-3 text-left transition active:scale-[0.98] ${
                on ? "border-ink bg-ink text-white shadow-md" : "border-zinc-200 bg-white hover:border-zinc-400"
              }`}
            >
              <span className="text-xl" aria-hidden>
                {o.emoji}
              </span>
              <span className={`mt-1 block text-sm font-extrabold ${on ? "text-volt" : "text-ink"}`}>{o.label}</span>
              <span className={`block text-xs ${on ? "text-zinc-400" : "text-zinc-500"}`}>{o.desc}</span>
            </button>
          );
        })}
      </div>
      <Field label="올릴 곳 · 사이즈" hint="프롬프트 비율(AR)이 바뀌어요">
        <div role="radiogroup" aria-label="플랫폼 사이즈" className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => {
            const on = state.platform === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => onPatch({ platform: p.id })}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition ${
                  on ? "border-ink bg-ink text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                }`}
              >
                <RatioIcon ratio={p.ratio} on={on} />
                <span>
                  <span className="block font-bold leading-tight">{p.label}</span>
                  <span className={`block text-[11px] ${on ? "text-volt" : "text-zinc-400"}`}>{p.ratio}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Field>
    </StepCard>
  );
}

/** 비율 모양 아이콘 */
export function RatioIcon({ ratio, on, size = 22 }: { ratio: string; on?: boolean; size?: number }) {
  const [w, h] = ratio.split(":").map(Number);
  const scale = size / Math.max(w, h);
  return (
    <span className="grid shrink-0 place-items-center" style={{ width: size, height: size }} aria-hidden>
      <span
        className={`block rounded-[3px] border-2 ${on ? "border-volt" : "border-zinc-400"}`}
        style={{ width: Math.max(w * scale, 6), height: Math.max(h * scale, 6) }}
      />
    </span>
  );
}

const META: Record<InfoKey, { label: string; placeholder: string; note?: string }> = {
  title: { label: "강의 제목", placeholder: "예: 코딩 몰라도 OK, 4주 완성 파이썬", note: "AI 예시를 고르면 프롬프트가 더 눈에 띄는 제목으로 다듬게 해요." },
  subtitle: { label: "한 줄 카피", placeholder: "예: 퇴근 후 2시간, 반복 업무를 자동화하세요" },
  schedule: { label: "일정 · 기간", placeholder: "예: 11월 10일(화) 시작 · 매주 화 20:00 (4주)", note: "AI 예시 날짜는 가상이에요. 요일은 실제 달력 기준." },
  place: { label: "장소 · 플랫폼", placeholder: "예: Zoom 실시간 라이브 / 강남 OO교육센터" },
  price: { label: "수강료 · 혜택", placeholder: "예: 얼리버드 99,000원 (정가 149,000원)" },
  instructor: { label: "강사명", placeholder: "예: 김OO 강사" },
  bio: { label: "강사 한 줄 소개", placeholder: "예: IT 교육 12년 · 기업·대학 출강 300회" },
  cta: { label: "신청 안내 (CTA)", placeholder: "예: 프로필 링크에서 신청 / bit.ly/내강의" },
};

type LectureProps = Common & {
  resolved: ResolvedInfo;
  onMode: (k: InfoKey, mode: InfoMode) => void;
  onValue: (k: InfoKey, value: string) => void;
  onShuffle: (k: InfoKey | "curriculum") => void;
  onCurriculum: (p: Partial<BuilderState["curriculum"]>) => void;
};

export function StepLecture({ state, onPatch, resolved, onMode, onValue, onShuffle, onCurriculum }: LectureProps) {
  const cert = state.output === "certificate";
  const labels: Partial<Record<InfoKey, string>> = cert
    ? { title: "과정명", schedule: "수료일", instructor: "강사 서명" }
    : state.output === "seminar"
      ? { instructor: "연사(강사)명" }
      : {};
  const cm = state.curriculum.mode;
  return (
    <StepCard step={2} title="강의 정보" desc="칸마다 직접 입력할지, AI 예시로 채울지, 아예 뺄지 고르세요.">
      <Field label="강의 주제" htmlFor="topic" hint="주제에 맞는 비주얼·커리큘럼·해시태그를 골라요">
        <input
          id="topic"
          value={state.topic}
          onChange={(e) => onPatch({ topic: e.target.value })}
          placeholder="예: 파이썬 입문, 엑셀 실무, ChatGPT 업무활용"
          className={inputClass}
        />
      </Field>
      <Field label="대상">
        <Chips ariaLabel="대상" options={AUDIENCES} value={state.audience} onChange={(id) => id && onPatch({ audience: id })} />
      </Field>
      <Field label="형식">
        <Chips ariaLabel="형식" options={FORMATS} value={state.format} onChange={(id) => id && onPatch({ format: id })} />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        {INFO_KEYS.map((k) => (
          <div key={k} className={k === "title" || k === "subtitle" ? "sm:col-span-2" : ""}>
            <InfoRow
              k={k}
              label={labels[k] ?? META[k].label}
              placeholder={META[k].placeholder}
              note={META[k].note}
              value={state.info[k].value}
              resolved={resolved[k]}
              onMode={onMode}
              onValue={onValue}
              onShuffle={onShuffle}
            />
          </div>
        ))}
      </div>

      <div className={`rounded-2xl border p-3 ${cm === "omit" ? "border-dashed border-zinc-200 bg-zinc-50" : "border-zinc-200"}`}>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className={`text-sm font-bold ${cm === "omit" ? "text-zinc-400" : "text-zinc-800"}`}>
            {state.output === "profile" ? "강의 분야" : "핵심 커리큘럼"} <span className="font-normal text-zinc-400">(2~4개)</span>
          </p>
          <ModeSwitch value={cm} onChange={(mode) => onCurriculum({ mode })} label="커리큘럼" />
        </div>
        {cm === "exact" && (
          <div className="grid gap-2 sm:grid-cols-2">
            {state.curriculum.items.map((item, i) => (
              <input
                key={i}
                aria-label={`커리큘럼 ${i + 1}`}
                value={item}
                onChange={(e) => {
                  const items = [...state.curriculum.items];
                  items[i] = e.target.value;
                  onCurriculum({ items });
                }}
                placeholder={resolved.curriculum.suggestion[i] ? `예: ${resolved.curriculum.suggestion[i]}` : "예: 나만의 미니 프로젝트"}
                className={inputClass}
              />
            ))}
          </div>
        )}
        {cm === "ai" && (
          <div className="flex items-start gap-2">
            <ul className="flex flex-1 flex-wrap gap-2">
              {resolved.curriculum.suggestion.map((s) => (
                <li key={s} className="rounded-lg bg-volt/30 px-2.5 py-1 text-sm text-ink">
                  ✔ {s}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => onShuffle("curriculum")}
              aria-label="커리큘럼 다른 예시"
              className="shrink-0 rounded-xl border border-zinc-200 px-3 py-1.5 text-sm hover:border-ink"
            >
              🔀
            </button>
          </div>
        )}
        {cm === "omit" && <p className="text-xs text-zinc-400">홍보물에 넣지 않아요.</p>}
      </div>
    </StepCard>
  );
}

export function StepDesign({ state, onPatch }: Common) {
  const custom = !BRAND_COLORS.some((c) => c.id === state.color);
  const toggleAvoid = (id: string) =>
    onPatch({ avoid: state.avoid.includes(id) ? state.avoid.filter((a) => a !== id) : [...state.avoid, id] });
  return (
    <StepCard step={3} title="디자인" desc="분위기·스타일·브랜드 컬러를 고르면 강의 브랜드가 일관돼 보여요.">
      <Field label="분위기" hint="다시 누르면 해제">
        <Chips ariaLabel="분위기" allowDeselect options={MOODS} value={state.mood} onChange={(mood) => onPatch({ mood })} />
      </Field>
      <Field label="디자인 스타일" hint="다시 누르면 해제">
        <Chips ariaLabel="디자인 스타일" allowDeselect options={STYLES} value={state.style} onChange={(style) => onPatch({ style })} />
      </Field>
      <Field label="브랜드 컬러">
        <div role="radiogroup" aria-label="브랜드 컬러" className="flex flex-wrap items-center gap-2">
          {BRAND_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={state.color === c.id}
              aria-label={c.label}
              title={c.label}
              onClick={() => onPatch({ color: c.id })}
              className={`h-9 w-9 rounded-full border-2 transition ${state.color === c.id ? "scale-110 border-ink ring-2 ring-volt" : "border-white shadow ring-1 ring-zinc-200"}`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
          <label
            className={`flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-bold ${custom ? "border-ink ring-2 ring-volt" : "border-zinc-200"}`}
          >
            <input
              type="color"
              aria-label="직접 고르기"
              value={custom ? state.color : "#0d9488"}
              onChange={(e) => onPatch({ color: e.target.value })}
              className="h-5 w-6 cursor-pointer border-0 bg-transparent p-0"
            />
            직접 {custom && <span className="font-mono text-zinc-500">{state.color.toUpperCase()}</span>}
          </label>
        </div>
      </Field>
      <div className="grid gap-2 sm:grid-cols-2">
        <Toggle
          checked={state.photoSlot}
          onChange={(photoSlot) => onPatch({ photoSlot })}
          label="강사 사진 합성 자리 남기기"
          desc="실제 프로필 사진을 나중에 얹을 빈 실루엣 영역"
        />
        <Toggle checked={state.qrSlot} onChange={(qrSlot) => onPatch({ qrSlot })} label="QR 코드 빈칸 남기기" desc="신청 링크 QR을 직접 붙일 정사각형 자리" />
      </div>
      <Field label="피할 것">
        <div role="group" aria-label="피할 것" className="flex flex-wrap gap-2">
          {AVOID_CHIPS.map((a) => {
            const on = state.avoid.includes(a.id);
            return (
              <button
                key={a.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleAvoid(a.id)}
                className={`rounded-xl border px-3 py-1.5 text-sm transition ${on ? "border-rose-300 bg-rose-50 text-rose-700" : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400"}`}
              >
                {on ? "🚫 " : ""}
                {a.label}
              </button>
            );
          })}
        </div>
      </Field>
    </StepCard>
  );
}
