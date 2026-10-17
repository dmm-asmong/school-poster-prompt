"use client";

import {
  AUDIENCES,
  AVOID_CHIPS,
  MOODS,
  PURPOSES,
  RATIOS,
  SCHOOL_LEVELS,
  TEXT_SPACES,
} from "@/data/options";
import { findPreset, presetElementsText } from "@/data/presets";
import type { BuilderState } from "@/lib/builder";
import ChipGroup from "./ChipGroup";
import Field from "./Field";
import PresetPicker from "./PresetPicker";
import StylePicker from "./StylePicker";

type Props = {
  state: BuilderState;
  onPatch: (patch: Partial<BuilderState>) => void;
  onEventNameChange: (name: string) => void;
  onPresetSelect: (id: string | null) => void;
  onPurposeChange: (id: string) => void;
  onReset: () => void;
};

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100";

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
        <span className="grid size-6 place-items-center rounded-full bg-gradient-to-br from-pink-500 to-indigo-500 text-xs text-white">
          {step}
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function SuggestedBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[11px] font-semibold text-pink-600">
      프리셋 제안
    </span>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  desc,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-5 shrink-0 accent-pink-500"
      />
      <span>
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        <span className="block text-xs text-slate-500">{desc}</span>
      </span>
    </label>
  );
}

export default function BuilderForm({
  state,
  onPatch,
  onEventNameChange,
  onPresetSelect,
  onPurposeChange,
  onReset,
}: Props) {
  const preset = findPreset(state.presetId);

  const addAvoid = (word: string) => {
    const items = state.avoid.split(/\s*,\s*/).filter(Boolean);
    if (items.includes(word)) return;
    onPatch({ avoid: [...items, word].join(", ") });
  };

  return (
    <div className="space-y-5">
      <Section step={1} title="어떤 행사인가요?">
        <Field label="행사명" htmlFor="eventName" hint="입력하면 어울리는 프리셋을 찾아 줘요">
          <input
            id="eventName"
            className={inputClass}
            value={state.eventName}
            onChange={(e) => onEventNameChange(e.target.value)}
            placeholder="예: 2026 가을 전교 체육대회"
            maxLength={60}
          />
        </Field>
        <Field label="행사 프리셋" hint="탭하면 장면·요소 자동 제안">
          <PresetPicker value={state.presetId} onSelect={onPresetSelect} />
        </Field>
      </Section>

      <Section step={2} title="누구를 위한 이미지인가요?">
        <Field label="학교급">
          <ChipGroup
            ariaLabel="학교급"
            value={state.school}
            onChange={(id) => id && onPatch({ school: id })}
            options={SCHOOL_LEVELS.map((o) => ({ id: o.id, label: o.ko, emoji: o.emoji }))}
          />
        </Field>
        <Field label="대상">
          <ChipGroup
            ariaLabel="대상"
            value={state.audience}
            onChange={(id) => id && onPatch({ audience: id })}
            options={AUDIENCES.map((o) => ({ id: o.id, label: o.ko }))}
          />
        </Field>
      </Section>

      <Section step={3} title="어디에 쓰나요?">
        <Field label="용도" hint="고르면 비율이 자동으로 맞춰져요">
          <ChipGroup
            ariaLabel="용도"
            value={state.purpose}
            onChange={(id) => id && onPurposeChange(id)}
            options={PURPOSES.map((o) => ({ id: o.id, label: o.ko, emoji: o.emoji }))}
          />
        </Field>
        <Field label="비율">
          <ChipGroup
            ariaLabel="비율"
            tone="indigo"
            value={state.ratio}
            onChange={(id) => id && onPatch({ ratio: id })}
            options={RATIOS.map((r) => ({ id: r.id, label: r.label, hint: r.hint }))}
          />
        </Field>
      </Section>

      <Section step={4} title="어떤 느낌으로?">
        <Field label="분위기">
          <ChipGroup
            ariaLabel="분위기"
            allowDeselect
            value={state.mood}
            onChange={(id) => onPatch({ mood: id })}
            options={MOODS.map((o) => ({ id: o.id, label: o.ko, emoji: o.emoji }))}
          />
        </Field>
        <Field label="화풍">
          <StylePicker value={state.style} onChange={(id) => onPatch({ style: id })} />
        </Field>
      </Section>

      <Section step={5} title="자세히 (선택)">
        <Field label="주요 장면" htmlFor="scene" hint={preset && state.scene === preset.scene.ko ? undefined : "한 문장으로"}>
          <div className="space-y-1.5">
            <SuggestedBadge show={!!preset && state.scene === preset.scene.ko} />
            <textarea
              id="scene"
              rows={3}
              className={inputClass}
              value={state.scene}
              onChange={(e) => onPatch({ scene: e.target.value })}
              placeholder="예: 운동장에서 학생들이 줄다리기를 하며 응원하는 장면"
            />
          </div>
        </Field>
        <Field label="포함할 요소" htmlFor="elements" hint="쉼표로 구분">
          <div className="space-y-1.5">
            <SuggestedBadge show={!!preset && state.elements === presetElementsText(preset)} />
            <input
              id="elements"
              className={inputClass}
              value={state.elements}
              onChange={(e) => onPatch({ elements: e.target.value })}
              placeholder="예: 만국기, 응원 피켓, 바통"
            />
          </div>
        </Field>
        <Field label="텍스트 여백 위치">
          <ChipGroup
            ariaLabel="텍스트 여백 위치"
            tone="indigo"
            allowDeselect
            value={state.textSpace}
            onChange={(id) => onPatch({ textSpace: id })}
            options={TEXT_SPACES.map((o) => ({ id: o.id, label: o.ko }))}
          />
        </Field>
        <Field label="글자 가이드" htmlFor="textGuide" hint="한글 글자 표현 요청">
          <div className="space-y-1.5">
            <SuggestedBadge show={!!preset && state.textGuide === preset.textGuide.ko} />
            <input
              id="textGuide"
              className={inputClass}
              value={state.textGuide}
              onChange={(e) => onPatch({ textGuide: e.target.value })}
              placeholder="예: 날짜·장소는 아래쪽에 작게"
            />
          </div>
        </Field>
        <Field label="피할 것" htmlFor="avoid">
          <input
            id="avoid"
            className={inputClass}
            value={state.avoid}
            onChange={(e) => onPatch({ avoid: e.target.value })}
            placeholder="예: 알아볼 수 없는 글자, 실제 학생 얼굴"
          />
          <div className="flex flex-wrap gap-1.5">
            {AVOID_CHIPS.map((c) => (
              <button
                key={c.ko}
                type="button"
                onClick={() => addAvoid(c.ko)}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 transition hover:bg-slate-200"
              >
                + {c.ko}
              </button>
            ))}
          </div>
        </Field>
        <div className="grid gap-2 sm:grid-cols-2">
          <Toggle
            checked={state.titleText}
            onChange={(v) => onPatch({ titleText: v })}
            label="행사명을 크게 한글로"
            desc="글자를 정확히 쓰라는 요청을 넣어요"
          />
          <Toggle
            checked={state.protectFaces}
            onChange={(v) => onPatch({ protectFaces: v })}
            label="얼굴 식별 안 되게"
            desc="초상권 보호: 뒷모습·캐릭터로"
          />
        </div>
      </Section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="rounded-full px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
        >
          ↺ 처음부터 다시
        </button>
      </div>
    </div>
  );
}
