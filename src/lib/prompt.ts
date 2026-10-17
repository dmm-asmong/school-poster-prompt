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
import { EVENT_PRESETS } from "@/data/presets";
import { REVISIONS } from "@/data/revisions";
import { findStyle } from "@/data/styles";
import type { BuilderState, Lang } from "./builder";
import { josa } from "./josa";

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

const clean = (s: string) => s.trim().replace(/[.。]+$/, "");

export function buildPrompt(state: BuilderState, lang: Lang): string {
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
    const event = name ? `"${name}" ` : "학교 행사 ";
    parts.push(`${target}${event}${purpose.phrase.ko}를 만들어 줘.`);
    if (scene) parts.push(`장면: ${scene}.`);
    if (elements) parts.push(`포함할 요소: ${elements}.`);
    if (mood && style) parts.push(`${mood.ko} 분위기에 '${style.ko}' 스타일로 표현해 줘.`);
    else if (mood) parts.push(`${mood.ko} 분위기로 표현해 줘.`);
    else if (style) parts.push(`'${style.ko}' 스타일로 표현해 줘.`);
    if (state.protectFaces)
      parts.push("인물은 얼굴이 식별되지 않게 뒷모습이나 단순한 캐릭터로 그려 줘.");
    if (space) parts.push(space.sentence.ko);
    if (!noText && name && state.titleText)
      parts.push(`행사명 "${name}"${josa(name, "은", "는")} 크게 한글로, 글자 정확히 써 줘.`);
    if (!noText && textGuide) parts.push(`글자 표현: ${textGuide}.`);
    if (avoid) parts.push(`피할 것: ${avoid}.`);
    if (revisions.length) parts.push(`추가 수정: ${revisions.join(", ")} 해 줘.`);
  } else {
    const event = name ? `"${name}"` : "a school event";
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
    if (!noText && name && state.titleText)
      parts.push(`Render the title "${name}" large in Korean (Hangul), spelled exactly.`);
    if (!noText && textGuide) parts.push(`Text notes: ${textGuide}.`);
    if (avoid) parts.push(`Avoid: ${avoid}.`);
    if (revisions.length) parts.push(`Revisions: ${revisions.join(", ")}.`);
  }

  parts.push(`AR ${ratio.ar}`);
  return parts.join(" ");
}
