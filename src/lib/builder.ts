import { PURPOSES } from "@/data/options";
import { findPreset, presetElementsText, type EventPreset } from "@/data/presets";

export type Lang = "ko" | "en";

export type BuilderState = {
  eventName: string;
  presetId: string | null;
  school: string;
  audience: string;
  purpose: string;
  mood: string | null;
  style: string | null;
  ratio: string;
  scene: string;
  elements: string;
  textSpace: string | null;
  textGuide: string;
  avoid: string;
  /** 행사명을 크게 한글로 정확히 쓰라는 문장을 넣을지 */
  titleText: boolean;
  /** 얼굴이 식별되지 않게 (초상권 보호) */
  protectFaces: boolean;
  revisions: string[];
};

export const DEFAULT_STATE: BuilderState = {
  eventName: "",
  presetId: null,
  school: "elementary",
  audience: "all",
  purpose: "poster",
  mood: "bright",
  style: null,
  ratio: "4:5",
  scene: "",
  elements: "",
  textSpace: "top",
  textGuide: "",
  avoid: "",
  titleText: true,
  protectFaces: true,
  revisions: [],
};

export function defaultRatioFor(purposeId: string): string {
  return PURPOSES.find((p) => p.id === purposeId)?.defaultRatio ?? "4:5";
}

/** 프리셋이 채워 주는 필드 값 */
export function presetFields(preset: EventPreset) {
  return {
    scene: preset.scene.ko,
    elements: presetElementsText(preset),
    textGuide: preset.textGuide.ko,
  };
}

/**
 * 프리셋을 적용합니다. 사용자가 직접 고친 칸은 건드리지 않고,
 * 비어 있거나 이전 프리셋 제안 그대로인 칸만 바꿉니다.
 */
export function applyPreset(state: BuilderState, preset: EventPreset | undefined): BuilderState {
  const prev = findPreset(state.presetId);
  const prevFields = prev ? presetFields(prev) : { scene: "", elements: "", textGuide: "" };
  const nextFields = preset ? presetFields(preset) : { scene: "", elements: "", textGuide: "" };
  const untouched = (key: keyof typeof prevFields) =>
    state[key].trim() === "" || state[key] === prevFields[key];

  const moodUntouched = !state.mood || state.mood === prev?.mood || state.mood === DEFAULT_STATE.mood;

  return {
    ...state,
    presetId: preset?.id ?? null,
    scene: untouched("scene") ? nextFields.scene : state.scene,
    elements: untouched("elements") ? nextFields.elements : state.elements,
    textGuide: untouched("textGuide") ? nextFields.textGuide : state.textGuide,
    mood: preset && moodUntouched ? preset.mood : state.mood,
  };
}

/** 갤러리 예시를 빌더 상태로 바꿉니다. */
export function stateFromExample(partial: Partial<BuilderState>): BuilderState {
  const purpose = partial.purpose ?? DEFAULT_STATE.purpose;
  const preset = findPreset(partial.presetId ?? null);
  const base: BuilderState = {
    ...DEFAULT_STATE,
    purpose,
    ratio: defaultRatioFor(purpose),
    ...(preset ? { ...presetFields(preset), mood: preset.mood } : {}),
  };
  return { ...base, ...partial, presetId: preset?.id ?? null };
}
