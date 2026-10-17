import { OUTPUT_TYPES, byId, type OutputId } from "@/data/options";

export type Lang = "ko" | "en";

/** exact: 입력한 그대로 · ai: 앱이 만든 예시 문구(이미지 AI가 다듬어도 됨) · omit: 넣지 않기 */
export type InfoMode = "exact" | "ai" | "omit";
export type InfoField = { mode: InfoMode; value: string };
export type InfoKey = "title" | "subtitle" | "badge" | "schedule" | "place" | "price" | "instructor" | "bio" | "cta";
export type SeedKey = InfoKey | "curriculum" | "caption";

export const INFO_KEYS: InfoKey[] = ["title", "subtitle", "badge", "schedule", "place", "price", "instructor", "bio", "cta"];

export type BuilderState = {
  /** 강의 주제 (주제별 문구·비주얼을 고르는 기준) */
  topic: string;
  output: OutputId;
  platform: string;
  audience: string;
  format: string;
  mood: string | null;
  /** null 이면 홍보물 종류에 맞는 기본 스타일 */
  style: string | null;
  /** 메인 장면을 직접 적을 때 (비우면 주제에 맞춰 자동) */
  scene: string;
  /** 갤러리 예시용 영어 장면 설명 (사용자가 장면을 고치면 비워요) */
  sceneEn: string;
  /** 카드뉴스 스와이프 신호 넣기 */
  swipeCue: boolean;
  /** 수료증 전용 칸 (비우면 빼거나, 성명은 빈 밑줄) */
  cert: CertInfo;
  /** 수료증 스타일 A 전통 공문형 / B 모던 기업형 / C 온라인 강의 가로형 / D 따뜻한 아카데미형 */
  certStyle: "A" | "B" | "C" | "D";
  /** 수료증 홍보용 목업 사진 (인쇄용 원고 규칙을 빼요) */
  certMockup: boolean;
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

export type CertInfo = { no: string; name: string; period: string; hours: string; org: string; role: string };

export const DEFAULT_CERT: CertInfo = { no: "", name: "", period: "", hours: "", org: "", role: "대표" };

const field = (mode: InfoMode, value = ""): InfoField => ({ mode, value });

export const DEFAULT_INFO: Record<InfoKey, InfoField> = {
  title: field("ai"),
  subtitle: field("ai"),
  badge: field("omit"),
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
  badge: 0,
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
  style: null,
  scene: "",
  sceneEn: "",
  swipeCue: true,
  cert: DEFAULT_CERT,
  certStyle: "A",
  certMockup: false,
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
    platform: output === "certificate" ? (state.certStyle === "C" ? "a4l" : "a4") : next.platform,
    info,
    curriculum,
    qrSlot: output === "recruit" || output === "seminar" ? state.qrSlot : false,
  };
}

/** 갤러리 예시에 담는 값 (칸별로 일부만 적어도 됩니다) */
export type ExampleState = Partial<Omit<BuilderState, "info" | "seeds" | "curriculum" | "cert">> & {
  cert?: Partial<CertInfo>;
  info?: Partial<Record<InfoKey, Partial<InfoField>>>;
  curriculum?: { mode: InfoMode; items?: string[] };
};

export function stateFromExample(partial: ExampleState): BuilderState {
  const { info: infoPatch, curriculum, cert, ...rest } = partial;
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
    cert: { ...DEFAULT_CERT, ...cert },
    curriculum: curriculum ? { mode: curriculum.mode, items } : base.curriculum,
    seeds: DEFAULT_SEEDS,
  };
}
