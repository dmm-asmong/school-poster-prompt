import { PURPOSES } from "@/data/options";
import { findPreset, presetElementsText, type EventPreset } from "@/data/presets";
import {
  DEFAULT_INFO,
  DEFAULT_SEEDS,
  type InfoField,
  type InfoKey,
  type InfoSeeds,
  type PosterInfo,
} from "./posterInfo";

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
  /** 포스터에 들어갈 글자 정보 (제목·부제·일시·장소…) */
  info: PosterInfo;
  /** '다른 문구' 버튼으로 바뀌는 추천 번호 */
  seeds: InfoSeeds;
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
  info: DEFAULT_INFO,
  seeds: DEFAULT_SEEDS,
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

/** 갤러리 예시에 담는 값 (포스터 정보는 칸별로 일부만 적어도 됩니다) */
export type ExampleState = Partial<Omit<BuilderState, "info">> & {
  info?: Partial<Record<InfoKey, Partial<InfoField>>>;
};

/** 갤러리 예시를 빌더 상태로 바꿉니다. */
export function stateFromExample(partial: ExampleState): BuilderState {
  const { info: infoPatch, ...rest } = partial;
  const purpose = rest.purpose ?? DEFAULT_STATE.purpose;
  const preset = findPreset(rest.presetId ?? null);
  const info = { ...DEFAULT_INFO };
  for (const [key, field] of Object.entries(infoPatch ?? {}) as [InfoKey, Partial<InfoField>][]) {
    info[key] = { ...DEFAULT_INFO[key], ...field };
  }
  const base: BuilderState = {
    ...DEFAULT_STATE,
    purpose,
    ratio: defaultRatioFor(purpose),
    ...(preset ? { ...presetFields(preset), mood: preset.mood } : {}),
  };
  return { ...base, ...rest, info, seeds: DEFAULT_SEEDS, presetId: preset?.id ?? null };
}
