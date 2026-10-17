import {
  AUDIENCES,
  AVOID_CHIPS,
  BRAND_COLORS,
  FORMATS,
  MOODS,
  OUTPUT_TYPES,
  PLATFORMS,
  STYLES,
  byId,
} from "@/data/options";
import type { DayKey } from "./dates";
import { josa } from "./josa";
import type { BuilderState, InfoKey, Lang } from "./state";
import { resolveInfo, type ResolvedInfo } from "./suggest";

export function colorLabel(color: string): { ko: string; en: string; hex: string } {
  const preset = byId(BRAND_COLORS, color);
  if (preset) return { ko: `${preset.label}(${preset.hex})`, en: `${preset.en} (${preset.hex})`, hex: preset.hex };
  return { ko: color.toUpperCase(), en: color.toUpperCase(), hex: color };
}

const LABELS: Record<InfoKey | "curriculum", { ko: string; en: string }> = {
  title: { ko: "제목", en: "Title" },
  subtitle: { ko: "카피", en: "Tagline" },
  curriculum: { ko: "커리큘럼", en: "Curriculum" },
  schedule: { ko: "일정", en: "Schedule" },
  place: { ko: "장소", en: "Place" },
  price: { ko: "수강료", en: "Price" },
  instructor: { ko: "강사", en: "Instructor" },
  bio: { ko: "강사 소개", en: "Bio" },
  cta: { ko: "신청", en: "Call to action" },
};

/** 결과물 종류에 맞게 칸 이름을 바꿔요. (수료증의 '일정' → '수료일' 등) */
function labelFor(key: InfoKey | "curriculum", state: BuilderState, lang: Lang): string {
  if (state.output === "certificate") {
    if (key === "title") return lang === "ko" ? "과정명" : "Course name";
    if (key === "schedule") return lang === "ko" ? "수료일" : "Completion date";
    if (key === "instructor") return lang === "ko" ? "강사 서명" : "Instructor signature";
  }
  if (state.output === "profile" && key === "curriculum") return lang === "ko" ? "강의 분야" : "Teaching topics";
  if (state.output === "seminar" && key === "instructor") return lang === "ko" ? "연사" : "Speaker";
  return LABELS[key][lang];
}

const ORDER: InfoKey[] = ["title", "subtitle", "schedule", "place", "price", "instructor", "bio", "cta"];

function textBlock(state: BuilderState, info: ResolvedInfo, lang: Lang): string[] {
  const pairs: string[] = [];
  for (const key of ["title", "subtitle", "curriculum", ...ORDER.slice(2)] as const) {
    if (key === "curriculum") {
      if (info.curriculum.items.length)
        pairs.push(`${labelFor(key, state, lang)} "${info.curriculum.items.join(" · ")}"`);
    } else if (info[key].text) {
      pairs.push(`${labelFor(key, state, lang)} "${info[key].text}"`);
    }
  }
  if (!pairs.length) return [];

  const polish = (["title", "subtitle", "cta"] as const).filter((k) => info[k].mode === "ai" && info[k].text);
  const out: string[] = [];
  if (lang === "ko") {
    out.push(`들어갈 글자(따옴표 안 한글을 정확히): ${pairs.join(" / ")}.`);
    if (info.title.mode === "ai" && info.title.text) {
      out.push(
        `제목은 '${info.topicName || "강의"}' 강의가 바로 떠오르게 더 짧고 눈에 띄는 한글 카피로 다듬어도 좋아.`,
      );
    }
    const others = polish.filter((k) => k !== "title").map((k) => labelFor(k, state, "ko"));
    if (others.length) out.push(`${others.join("·")} 문구도 분위기에 맞게 살짝 다듬어도 돼.`);
    out.push(polish.length ? "그 밖의 글자(일정·장소·수강료·이름 등)는 한 글자도 바꾸지 말고 그대로 써 줘." : "모든 글자는 한 글자도 바꾸지 말고 그대로 써 줘.");
  } else {
    out.push(`Text to render (keep the quoted Korean exactly, in Hangul): ${pairs.join(" / ")}.`);
    if (info.title.mode === "ai" && info.title.text) {
      out.push(
        `You may rewrite the title into a shorter, catchier Korean headline that clearly signals the ${info.topicName || "course"} topic.`,
      );
    }
    const others = polish.filter((k) => k !== "title").map((k) => labelFor(k, state, "en").toLowerCase());
    if (others.length) out.push(`The ${others.join(" and ")} may also be lightly polished to fit the mood (keep it in Korean).`);
    out.push(polish.length ? "Keep all other text (schedule, place, price, names) exactly as given." : "Do not change any of the text.");
  }
  return out;
}

export function buildPrompt(state: BuilderState, lang: Lang, today: DayKey | null = null): string {
  const info = resolveInfo(state, today);
  const output = byId(OUTPUT_TYPES, state.output) ?? OUTPUT_TYPES[0];
  const platform = byId(PLATFORMS, state.platform) ?? PLATFORMS[0];
  const audience = byId(AUDIENCES, state.audience);
  const format = byId(FORMATS, state.format);
  const mood = byId(MOODS, state.mood);
  const style = byId(STYLES, state.style);
  const color = colorLabel(state.color);
  const avoid = state.avoid.map((id) => byId(AVOID_CHIPS, id)).filter((x) => x !== undefined);
  const topic = info.topicName;
  const people = state.output === "profile" || state.output === "seminar" || state.output === "thumbnail";
  const parts: string[] = [];

  if (lang === "ko") {
    const who = audience ? `${audience.label} 대상 ` : "";
    const fmt = format && state.output !== "profile" && state.output !== "certificate" ? `${format.label} ` : "";
    const subject = topic ? `'${topic}' ` : "";
    parts.push(
      state.output === "profile"
        ? `${subject ? `${subject}분야 ` : ""}강사를 소개하는 ${output.phrase.ko}${josa(output.phrase.ko, "을", "를")} 만들어 줘.`
        : `${who}${fmt}${subject}강의의 ${output.phrase.ko}${josa(output.phrase.ko, "을", "를")} 만들어 줘.`,
    );
    parts.push(`용도: ${platform.label}(${platform.px}).`);
    parts.push(`주제 비주얼: ${info.topic.motif.ko}.`);
    if (mood && style) parts.push(`${mood.label} 분위기에 '${style.label}' 스타일로 표현해 줘.`);
    else if (mood) parts.push(`${mood.label} 분위기로 표현해 줘.`);
    else if (style) parts.push(`'${style.label}' 스타일로 표현해 줘.`);
    parts.push(`메인 브랜드 컬러: ${color.ko}. 나머지는 무채색과 포인트 색 1개로 절제해 줘.`);
    parts.push(`구성: ${output.layout.ko}.`);
    if (state.photoSlot)
      parts.push("강사 실제 사진을 나중에 합성할 수 있게 인물 자리는 단색 실루엣 영역으로 비워 둬.");
    else if (people) parts.push("사람이 나온다면 실존 인물처럼 보이지 않는 세련된 일러스트 인물로 그려 줘.");
    parts.push(...textBlock(state, info, "ko"));
    if (state.qrSlot) parts.push("오른쪽 아래에 QR 코드를 붙일 정사각형 빈칸을 남겨 줘(가짜 QR 무늬는 그리지 마).");
    if (avoid.length) parts.push(`피할 것: ${avoid.map((a) => a.label).join(", ")}.`);
  } else {
    const subject = topic ? `"${topic}"` : "a practical skills topic";
    parts.push(
      state.output === "profile"
        ? `Create an ${output.phrase.en} introducing an instructor who teaches ${subject}, for the Korean market.`
        : `Create a ${output.phrase.en} for a Korean course on ${subject}${audience ? `, aimed at ${audience.en}` : ""}.`,
    );
    if (format && state.output !== "profile" && state.output !== "certificate") parts.push(`Class format: ${format.en}.`);
    parts.push(`Canvas: ${platform.en} (${platform.px}).`);
    parts.push(`Visual motif: ${info.topic.motif.en}.`);
    if (mood) parts.push(`Mood: ${mood.en}.`);
    if (style) parts.push(`Style: ${style.en}.`);
    parts.push(`Use ${color.en} as the main brand color, keep the rest neutral with one accent color.`);
    parts.push(`Layout: ${output.layout.en}.`);
    if (state.photoSlot)
      parts.push("Leave the instructor area as a plain solid silhouette placeholder so a real photo can be added later.");
    else if (people) parts.push("If people appear, draw them as stylish illustrated characters, not realistic real people.");
    parts.push(...textBlock(state, info, "en"));
    if (state.qrSlot) parts.push("Leave an empty square in the bottom-right corner for a QR code (do not draw a fake QR pattern).");
    if (avoid.length) parts.push(`Avoid: ${avoid.map((a) => a.en).join(", ")}.`);
  }
  parts.push(`AR ${platform.ratio}`);
  return parts.join(" ");
}
