import {
  AUDIENCES,
  AVOID_CHIPS,
  MOODS,
  PURPOSES,
  RATIOS,
  SCHOOL_LEVELS,
  TEXT_SPACES,
  type Label,
} from "@/data/options";
import { EVENT_PRESETS, findPreset } from "@/data/presets";
import { REVISIONS } from "@/data/revisions";
import { findStyle } from "@/data/styles";
import type { BuilderState, Lang } from "./builder";
import type { DayKey } from "./dates";
import { josa } from "./josa";
import { INFO_META, resolveInfo, type InfoKey } from "./posterInfo";

const byId = <T extends { id: string }>(list: T[], id: string | null) =>
  id ? list.find((item) => item.id === id) : undefined;

/** 프리셋·칩에서 온 한국어 문구 → 영어 사전 (직접 입력한 문장은 그대로 둡니다) */
const KO_TO_EN = new Map<string, string>(
  [
    ...EVENT_PRESETS.flatMap((p) => [p.scene, p.textGuide, ...p.elements]),
    ...AVOID_CHIPS,
  ].map((l: Label) => [l.ko, l.en]),
);

function translate(text: string, lang: Lang): string {
  const trimmed = text.trim();
  if (lang === "ko") return trimmed;
  const whole = KO_TO_EN.get(trimmed);
  if (whole) return whole;
  return trimmed
    .split(/\s*,\s*/)
    .filter(Boolean)
    .map((part) => KO_TO_EN.get(part) ?? part)
    .join(", ");
}

/** 행사명이 비어 있을 때 첫 문장에 쓰는 프리셋 이름 (영어) */
const PRESET_EN: Record<string, string> = {
  sports: "sports day",
  entrance: "entrance ceremony",
  graduation: "graduation ceremony",
  festival: "school festival",
  reading: "reading month",
  science: "science day",
  openclass: "parent open class",
  fieldtrip: "field trip",
  eco: "environmental campaign",
  antibully: "anti-bullying campaign",
  digital: "digital and AI education event",
  afterschool: "after-school program sign-up",
  career: "career exploration day",
  safety: "safety education campaign",
  arts: "school arts show",
  lunch: "school lunch no-waste campaign",
};

const clean = (s: string) => s.trim().replace(/[.。]+$/, "");

export function buildPrompt(state: BuilderState, lang: Lang, today: DayKey | null = null): string {
  const school = byId(SCHOOL_LEVELS, state.school);
  const audience = byId(AUDIENCES, state.audience);
  const isPreschool = state.school === "daycare" || state.school === "kinder";
  // 유아 기관에서 '전교생'은 '전체 원아'로 부릅니다.
  const audienceLabel =
    audience?.id === "all" && isPreschool ? { ko: "전체 원아", en: "all the children" } : audience;
  const purpose = byId(PURPOSES, state.purpose) ?? PURPOSES[0];
  const mood = byId(MOODS, state.mood);
  const style = findStyle(state.style);
  const ratio = byId(RATIOS, state.ratio) ?? RATIOS[0];
  const space = byId(TEXT_SPACES, state.textSpace);
  const name = state.eventName.trim();
  const scene = clean(translate(state.scene, lang));
  const elements = clean(translate(state.elements, lang));
  const textGuide = clean(translate(state.textGuide, lang));
  const avoid = clean(translate(state.avoid, lang));
  const revisions = state.revisions
    .map((id) => byId(REVISIONS, id)?.[lang])
    .filter((r): r is string => Boolean(r));
  const noText = space?.id === "none";

  const parts: string[] = [];

  if (lang === "ko") {
    const who = [school?.ko, audienceLabel?.ko].filter(Boolean).join(" ");
    const target = who ? `${who} 대상 ` : "";
    const preset = findPreset(state.presetId);
    const event = name ? `"${name}" ` : preset ? `학교 ${preset.ko} ` : "학교 행사 ";
    parts.push(`${target}${event}${purpose.phrase.ko}를 만들어 줘.`);
    if (scene) parts.push(`장면: ${scene}.`);
    if (elements) parts.push(`포함할 요소: ${elements}.`);
    if (mood && style) parts.push(`${mood.ko} 분위기에 '${style.ko}' 스타일로 표현해 줘.`);
    else if (mood) parts.push(`${mood.ko} 분위기로 표현해 줘.`);
    else if (style) parts.push(`'${style.ko}' 스타일로 표현해 줘.`);
    if (state.protectFaces)
      parts.push("인물은 얼굴이 식별되지 않게 뒷모습이나 단순한 캐릭터로 그려 줘.");
    if (space) parts.push(space.sentence.ko);
    if (!noText) parts.push(...posterTextBlock(state, "ko", today));
    if (!noText && textGuide) parts.push(`글자 표현: ${textGuide}.`);
    if (avoid) parts.push(`피할 것: ${avoid}.`);
    if (revisions.length) parts.push(`추가 수정: ${revisions.join(", ")} 해 줘.`);
  } else {
    const presetEn = state.presetId ? PRESET_EN[state.presetId] : undefined;
    const event = name ? `"${name}"` : presetEn ? `a school ${presetEn}` : "a school event";
    const forWho = audienceLabel ? ` for ${audienceLabel.en}` : "";
    const at = school ? ` at a ${school.en}` : "";
    parts.push(`Create a ${purpose.phrase.en} for ${event}${forWho}${at} in Korea.`);
    if (scene) parts.push(`Scene: ${scene}.`);
    if (elements) parts.push(`Include: ${elements}.`);
    if (mood) parts.push(`Mood: ${mood.en}.`);
    if (style) parts.push(`Style: ${style.en}.`);
    if (state.protectFaces)
      parts.push("Keep faces unidentifiable: show people from behind or as simple characters.");
    if (space) parts.push(space.sentence.en);
    if (!noText) parts.push(...posterTextBlock(state, "en", today));
    if (!noText && textGuide) parts.push(`Text notes: ${textGuide}.`);
    if (avoid) parts.push(`Avoid: ${avoid}.`);
    if (revisions.length) parts.push(`Revisions: ${revisions.join(", ")}.`);
  }

  parts.push(`AR ${ratio.ar}`);
  return parts.join(" ");
}

type Line = { label: Label; text: string; key: InfoKey };

/**
 * 포스터에 들어갈 글자 목록과 배치(위계)를 문장으로 만듭니다.
 * 따옴표 안 글자는 포스터에 그대로 들어갈 한글이라 영어 프롬프트에서도 번역하지 않습니다.
 */
export function posterTextBlock(state: BuilderState, lang: Lang, today: DayKey | null): string[] {
  const info = resolveInfo(state, today);
  const label = (key: InfoKey): Label => ({ ko: INFO_META[key].promptKo, en: INFO_META[key].promptEn });

  const lines: Line[] = [];
  if (info.title.text) lines.push({ key: "title", label: label("title"), text: info.title.text });
  if (info.subtitle.text) lines.push({ key: "subtitle", label: label("subtitle"), text: info.subtitle.text });
  const when = [info.date.text, info.time.text].filter(Boolean).join(" ");
  if (when)
    lines.push({
      key: info.date.text ? "date" : "time",
      label: info.date.text ? { ko: "일시", en: "Date & time" } : label("time"),
      text: when,
    });
  for (const key of ["place", "contact", "host"] as const) {
    if (info[key].text) lines.push({ key, label: label(key), text: info[key].text });
  }
  if (lines.length === 0) return [];

  const list = lines.map((l) => `${l.label[lang]} "${l.text}"`).join(" / ");
  const details = lines.filter((l) => ["date", "time", "place", "contact"].includes(l.key));
  const has = (key: InfoKey) => lines.some((l) => l.key === key);

  // 이미지 AI가 다듬어도 되는 칸: AI 모드인 제목·부제·안내
  const polish = (["title", "subtitle", "contact"] as const).filter(
    (k) => info[k].mode === "ai" && info[k].text,
  );

  const out: string[] = [];
  if (lang === "ko") {
    out.push(`포스터 문구(아래 글자를 정확히 한글로): ${list}.`);
    const layout: string[] = [];
    if (has("title")) layout.push("제목은 가장 크고 눈에 띄게");
    if (has("subtitle")) layout.push("부제는 제목 아래 중간 크기로");
    if (details.length) {
      const names = details.map((d) => d.label.ko).join("·");
      layout.push(`${names}${josa(names, "은", "는")} 하단에 작고 읽기 쉽게`);
    }
    if (has("host")) layout.push("주최는 맨 아래 가장 작게");
    if (layout.length > 1 || details.length) out.push(`글자 배치: ${layout.join(", ")}.`);
    if (polish.length) {
      const names = polish.map((k) => INFO_META[k].promptKo).join("·");
      out.push(
        `${names} 문구는 분위기에 맞게 살짝 다듬어도 되지만 한글로 쓰고, 나머지 글자는 바꾸지 말고 그대로 써 줘.`,
      );
    } else {
      out.push("모든 글자는 바꾸지 말고 맞춤법 그대로 써 줘.");
    }
  } else {
    out.push(`Poster text (render exactly in Korean Hangul; keep the quoted text as is): ${list}.`);
    const layout: string[] = [];
    if (has("title")) layout.push("title largest and most prominent");
    if (has("subtitle")) layout.push("subtitle medium-sized under the title");
    if (details.length) layout.push(`${details.map((d) => d.label.en.toLowerCase()).join(", ")} small and legible at the bottom`);
    if (has("host")) layout.push("host smallest at the very bottom");
    if (layout.length > 1 || details.length) out.push(`Text layout: ${layout.join("; ")}.`);
    if (polish.length) {
      const names = polish.map((k) => INFO_META[k].promptEn.toLowerCase()).join(" and ");
      out.push(`You may lightly polish the ${names} wording to fit the mood (keep it in Korean); write all other text exactly as given.`);
    } else {
      out.push("Do not change any of the text; keep the Korean spelling exactly.");
    }
  }
  return out;
}
