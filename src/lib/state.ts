import { OUTPUT_TYPES, byId, type OutputId } from "@/data/options";

export type Lang = "ko" | "en";

/** exact: 입력한 그대로 · ai: 앱이 만든 예시 문구(이미지 AI가 다듬어도 됨) · omit: 넣지 않기 */
export type InfoMode = "exact" | "ai" | "omit";
export type InfoField = { mode: InfoMode; value: string };
export type InfoKey = "title" | "subtitle" | "schedule" | "place" | "price" | "instructor" | "bio" | "cta";
export type SeedKey = InfoKey | "curriculum" | "caption";

export const INFO_KEYS: InfoKey[] = ["title", "subtitle", "schedule", "place", "price", "instructor", "bio", "cta"];

export type BuilderState = {
  /** 강의 주제 (주제별 문구·비주얼을 고르는 기준) */
  topic: string;
  output: OutputId;
  platform: string;
  audience: string;
  format: string;
  mood: string | null;
  style: string | null;
  /** 팔레트 id 또는 직접 고른 #RRGGBB */
  color: string;
  info: Record<InfoKey, InfoField>;
  curriculum: { mode: InfoMode; items: string[] };
  /** 강사 실제 사진을 합성할 빈자리 남기기 */
  photoSlot: boolean;
  /** QR 코드 빈자리 남기기 */
  qrSlot: boolean;
  avoid: string[];
  seeds: Record<SeedKey, number>;
};

const field = (mode: InfoMode, value = ""): InfoField => ({ mode, value });

export const DEFAULT_INFO: Record<InfoKey, InfoField> = {
  title: field("ai"),
  subtitle: field("ai"),
  schedule: field("ai"),
  place: field("ai"),
  price: field("ai"),
  instructor: field("omit"),
  bio: field("omit"),
  cta: field("ai"),
};

export const DEFAULT_SEEDS: Record<SeedKey, number> = {
  title: 0,
  subtitle: 0,
  schedule: 0,
  place: 0,
  price: 0,
  instructor: 0,
  bio: 0,
  cta: 0,
  curriculum: 0,
  caption: 0,
};

export const DEFAULT_STATE: BuilderState = {
  topic: "",
  output: "recruit",
  platform: "feed",
  audience: "worker",
  format: "live",
  mood: "trust",
  style: "swiss",
  color: "teal",
  info: DEFAULT_INFO,
  curriculum: { mode: "ai", items: ["", "", "", ""] },
  photoSlot: false,
  qrSlot: true,
  avoid: ["typo", "watermark"],
  seeds: DEFAULT_SEEDS,
};

/**
 * 홍보물 종류를 바꿀 때: 기본 사이즈로 바꾸고, 그 홍보물에 안 어울리는 칸은 '넣지 않기'로,
 * 이전 종류 때문에 꺼 둔 칸은 다시 'AI 예시'로 돌려요. 직접 입력한 칸은 그대로 둡니다.
 */
export function switchOutput(state: BuilderState, output: OutputId): BuilderState {
  const prev = byId(OUTPUT_TYPES, state.output);
  const next = byId(OUTPUT_TYPES, output);
  if (!next) return state;
  const info = { ...state.info };
  for (const key of INFO_KEYS) {
    const f = info[key];
    if (f.mode === "exact") continue;
    if (next.omit.includes(key)) info[key] = { ...f, mode: "omit" };
    else if (f.mode === "omit" && prev?.omit.includes(key)) info[key] = { ...f, mode: "ai" };
  }
  const curriculum =
    output === "thumbnail" || output === "certificate"
      ? { ...state.curriculum, mode: state.curriculum.mode === "exact" ? "exact" : ("omit" as InfoMode) }
      : state.curriculum.mode === "omit" && (prev?.id === "thumbnail" || prev?.id === "certificate")
        ? { ...state.curriculum, mode: "ai" as InfoMode }
        : state.curriculum;
  return {
    ...state,
    output,
    platform: next.platform,
    info,
    curriculum,
    qrSlot: output === "recruit" || output === "seminar" ? state.qrSlot : false,
  };
}

/** 갤러리 예시에 담는 값 (칸별로 일부만 적어도 됩니다) */
export type ExampleState = Partial<Omit<BuilderState, "info" | "seeds" | "curriculum">> & {
  info?: Partial<Record<InfoKey, Partial<InfoField>>>;
  curriculum?: { mode: InfoMode; items?: string[] };
};

export function stateFromExample(partial: ExampleState): BuilderState {
  const { info: infoPatch, curriculum, ...rest } = partial;
  let base = DEFAULT_STATE;
  if (rest.output) base = switchOutput(base, rest.output);
  const info = { ...base.info };
  for (const [key, f] of Object.entries(infoPatch ?? {}) as [InfoKey, Partial<InfoField>][]) {
    info[key] = { ...info[key], ...f };
  }
  const items = [...(curriculum?.items ?? []), "", "", "", ""].slice(0, 4);
  return {
    ...base,
    ...rest,
    info,
    curriculum: curriculum ? { mode: curriculum.mode, items } : base.curriculum,
    seeds: DEFAULT_SEEDS,
  };
}
