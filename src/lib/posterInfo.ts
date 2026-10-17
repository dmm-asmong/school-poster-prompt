import { AUDIENCES } from "@/data/options";
import {
  COPY_BANKS,
  DEFAULT_CONTACTS,
  GENERIC_COPY,
  MOOD_COPY,
  SAMPLE_SCHOOL_NAMES,
  WHO_BY_SCHOOL,
  type CopyBank,
} from "@/data/copy";
import { SCHOOL_LEVELS } from "@/data/options";
import { sampleDate, type DayKey } from "./dates";

/** exact: 입력한 그대로 · ai: 앱이 추천한 예시(이미지 AI가 다듬어도 됨) · omit: 넣지 않기 */
export type InfoMode = "exact" | "ai" | "omit";
export type InfoField = { mode: InfoMode; value: string };
export type InfoKey = "title" | "subtitle" | "date" | "time" | "place" | "contact" | "host";
export type PosterInfo = Record<InfoKey, InfoField>;
export type InfoSeeds = Record<InfoKey, number>;

export const INFO_KEYS: InfoKey[] = ["title", "subtitle", "date", "time", "place", "contact", "host"];

export const INFO_META: Record<
  InfoKey,
  { label: string; promptKo: string; promptEn: string; placeholder: string; sample: boolean }
> = {
  title: { label: "행사명 / 타이틀", promptKo: "제목", promptEn: "Title", placeholder: "예: 2026 한마음 체육대회", sample: false },
  subtitle: { label: "부제 · 슬로건", promptKo: "부제", promptEn: "Subtitle", placeholder: "예: 청팀도 백팀도 오늘은 모두 한 팀", sample: false },
  date: { label: "날짜 (기간)", promptKo: "일시", promptEn: "Date", placeholder: "예: 2026년 10월 23일(금)", sample: true },
  time: { label: "시간", promptKo: "시간", promptEn: "Time", placeholder: "예: 오전 9시 ~ 오후 2시", sample: true },
  place: { label: "장소", promptKo: "장소", promptEn: "Place", placeholder: "예: 본교 운동장", sample: true },
  contact: { label: "대상 · 참가 방법 · 문의", promptKo: "안내", promptEn: "Info", placeholder: "예: 전교생 참여 · 문의 교무실", sample: true },
  host: { label: "주최 (학교명)", promptKo: "주최", promptEn: "Host", placeholder: "예: 새빛초등학교", sample: true },
};

export const DEFAULT_INFO: PosterInfo = {
  title: { mode: "ai", value: "" },
  subtitle: { mode: "ai", value: "" },
  date: { mode: "ai", value: "" },
  time: { mode: "ai", value: "" },
  place: { mode: "ai", value: "" },
  contact: { mode: "omit", value: "" },
  host: { mode: "omit", value: "" },
};

export const DEFAULT_SEEDS: InfoSeeds = { title: 0, subtitle: 0, date: 0, time: 0, place: 0, contact: 0, host: 0 };

/** 정적 HTML을 그릴 때(오늘 날짜를 모를 때) 쓰는 고정 기준일 */
export const FALLBACK_TODAY: DayKey = { y: 2026, m: 1, d: 1 };

export type InfoContext = {
  eventName: string;
  presetId: string | null;
  mood: string | null;
  school: string;
  audience: string;
  info: PosterInfo;
  seeds: InfoSeeds;
};

export type ResolvedField = {
  key: InfoKey;
  mode: InfoMode;
  /** 포스터에 들어갈 글자 (넣지 않거나 비어 있으면 "") */
  text: string;
  /** 앱이 만든 추천·가상 값인지 (사용자가 직접 쓰지 않음) */
  generated: boolean;
};

const pick = <T,>(list: T[], seed: number): T => list[((seed % list.length) + list.length) % list.length];

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "").replace(/\s+/g, " ").trim();
}

/** 프리셋 문구 사이사이에 분위기 문구를 섞습니다. (0번은 항상 프리셋 문구) */
function blend(preset: string[], mood: string[]): string[] {
  const out = [...preset];
  mood.forEach((m, i) => out.splice(Math.min(1 + i * 3, out.length), 0, m));
  return out;
}

function bankFor(presetId: string | null): CopyBank {
  return (presetId && COPY_BANKS[presetId]) || GENERIC_COPY;
}

/** 직접 입력한 날짜에서 연도를 읽습니다. 없으면 null */
function yearFromText(text: string): number | null {
  const m = text.match(/(20\d{2})/);
  return m ? Number(m[1]) : null;
}

/** 포스터 정보 칸마다 실제로 들어갈 글자를 계산합니다. */
export function resolveInfo(ctx: InfoContext, today: DayKey | null): Record<InfoKey, ResolvedField> {
  const day = today ?? FALLBACK_TODAY;
  const bank = bankFor(ctx.presetId);
  const moodCopy = (ctx.mood && MOOD_COPY[ctx.mood]) || { titles: [], slogans: [] };
  const preschool = ctx.school === "daycare" || ctx.school === "kinder";
  const audience = AUDIENCES.find((a) => a.id === ctx.audience);
  const schoolKo = SCHOOL_LEVELS.find((s) => s.id === ctx.school)?.ko ?? "학교";

  const { info, seeds } = ctx;
  const sample = sampleDate(bank.dates, day, seeds.date);
  const year =
    (info.date.mode === "exact" && yearFromText(info.date.value)) || sample.year;

  const vars: Record<string, string> = {
    year: String(year),
    who: WHO_BY_SCHOOL[ctx.school] ?? "우리",
    audience: audience?.id === "all" && preschool ? "전체 원아" : (audience?.ko ?? "전교생"),
  };
  vars.event = ctx.eventName.trim() || fill(bank.name[preschool ? 1 : 0], vars);

  const suggestions: Record<InfoKey, string> = {
    title: fill(pick(blend(bank.titles, moodCopy.titles), seeds.title), vars),
    subtitle: fill(pick(blend(bank.slogans, moodCopy.slogans), seeds.subtitle), vars),
    date: sample.text,
    time: pick(bank.times, seeds.time),
    place: pick(bank.places, seeds.place),
    contact: fill(pick(bank.contacts ?? DEFAULT_CONTACTS, seeds.contact), vars),
    host: `${pick(SAMPLE_SCHOOL_NAMES, seeds.host)}${schoolKo}`,
  };

  const out = {} as Record<InfoKey, ResolvedField>;
  for (const key of INFO_KEYS) {
    const field = info[key];
    const typed = field.value.trim();
    let text = "";
    let generated = false;
    if (field.mode === "exact") {
      // 타이틀을 그대로 쓰면 위에서 입력한 행사명을 기본값으로 씁니다.
      text = typed || (key === "title" ? ctx.eventName.trim() : "");
    } else if (field.mode === "ai") {
      text = typed || suggestions[key];
      generated = !typed;
    }
    out[key] = { key, mode: field.mode, text, generated };
  }
  return out;
}
