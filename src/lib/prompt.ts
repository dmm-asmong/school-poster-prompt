import {
  AUDIENCES,
  AVOID_CHIPS,
  BRAND_COLORS,
  FORMATS,
  MOODS,
  OUTPUT_TYPES,
  PLATFORMS,
  byId,
  resolveStyle,
  type Label,
  type Style,
} from "@/data/options";
import type { DayKey } from "./dates";
import { josa } from "./josa";
import type { BuilderState, InfoKey, Lang } from "./state";
import { resolveInfo, type ResolvedInfo } from "./suggest";

/** 밝은 색인지 (밝은 브랜드 컬러는 글자색으로 쓰지 않아요) */
export function isLightHex(hex: string): boolean {
  const n = parseInt(hex.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return r * 0.299 + g * 0.587 + b * 0.114 > 160;
}

export function colorLabel(color: string): { ko: string; en: string; hex: string; accent: string; accentEn: string } {
  const preset = byId(BRAND_COLORS, color);
  if (preset)
    return { ko: `${preset.label}(${preset.hex})`, en: `${preset.en} (${preset.hex})`, hex: preset.hex, accent: preset.accent, accentEn: preset.accentEn };
  const hex = color.toUpperCase();
  const light = isLightHex(hex);
  return { ko: hex, en: hex, hex, accent: light ? "#2F4BFF" : "#F2B33D", accentEn: light ? "cobalt blue" : "mustard" };
}

type Key = InfoKey | "curriculum";

const ROLE: Record<Key, Label> = {
  title: { ko: "헤드라인", en: "Headline" },
  subtitle: { ko: "카피", en: "Tagline" },
  badge: { ko: "포인트 문구", en: "Badge" },
  curriculum: { ko: "커리큘럼", en: "Curriculum" },
  schedule: { ko: "일정", en: "Schedule" },
  place: { ko: "장소", en: "Place" },
  price: { ko: "수강료", en: "Price" },
  instructor: { ko: "강사", en: "Instructor" },
  bio: { ko: "강사 소개", en: "Bio" },
  cta: { ko: "신청 안내", en: "CTA" },
};

/** 결과물 종류에 맞게 역할 이름을 바꿔요. (수료증의 '일정' → '수료일' 등) */
function roleFor(key: Key, output: string, lang: Lang): string {
  const o: Partial<Record<string, Partial<Record<Key, Label>>>> = {
    certificate: {
      title: { ko: "과정명", en: "Course name" },
      schedule: { ko: "수료일", en: "Completion date" },
      instructor: { ko: "강사 서명", en: "Instructor signature" },
      subtitle: { ko: "수여 문구", en: "Statement line" },
    },
    profile: { curriculum: { ko: "강의 분야 태그", en: "Topic tags" }, instructor: { ko: "이름", en: "Name" } },
    seminar: { instructor: { ko: "연사", en: "Speaker" } },
  };
  return (o[output]?.[key] ?? ROLE[key])[lang];
}

export type TextItem = { key: Key | "fixed"; role: Label; text: string; lines?: string[] };

/**
 * 홍보물에 들어갈 글자 목록. 홍보물마다 정한 최대 개수를 넘으면 우선순위가 낮은 항목은 빠져요.
 * dropped 는 화면에서 '빠진 항목' 안내에 써요.
 */
export function textItems(state: BuilderState, info: ResolvedInfo): { items: TextItem[]; dropped: string[]; max: number } {
  const output = byId(OUTPUT_TYPES, state.output) ?? OUTPUT_TYPES[0];
  const available: TextItem[] = [];
  for (const key of output.priority as Key[]) {
    if (key === "curriculum") {
      if (info.curriculum.items.length)
        available.push({ key, role: { ko: roleFor(key, output.id, "ko"), en: roleFor(key, output.id, "en") }, text: info.curriculum.items.join(" / "), lines: info.curriculum.items });
    } else if (info[key].text) {
      available.push({ key, role: { ko: roleFor(key, output.id, "ko"), en: roleFor(key, output.id, "en") }, text: info[key].text });
    }
  }
  const fixed = output.id === "cardnews" && !state.swipeCue ? undefined : output.fixed;
  const room = output.maxText - (fixed ? 1 : 0);
  const kept = available.slice(0, room);
  const dropped = available.slice(room).map((i) => i.role.ko);
  // 화면 읽는 순서(헤드라인 → 핵심 정보 → 신청)로 다시 정렬
  const order: Key[] = ["title", "badge", "subtitle", "instructor", "bio", "curriculum", "schedule", "place", "price", "cta"];
  kept.sort((a, b) => order.indexOf(a.key as Key) - order.indexOf(b.key as Key));
  if (fixed) {
    const f: TextItem = { key: "fixed", role: fixed.role, text: fixed.text };
    if (fixed.first) kept.unshift(f);
    else kept.push(f);
  }
  return { items: kept, dropped, max: output.maxText };
}

/** AI 티를 없애는 기본 금지 목록 */
const ANTI_AI: Label = {
  ko: "네온 글로우, 렌즈 플레어, 빛나는 회로·AI 칩·뇌·로봇 같은 상투적 이미지, 홀로그램, 반짝이·스파클, 플라스틱 같은 광택 CGI, 글래스모피즘, 여기저기 떠 있는 아이콘, 가짜 UI 글자·로렘 입숨, 알아볼 수 없거나 중복된 글자, 목록에 없는 추가 글자, 워터마크·로고, 매끈한 AI 스톡 얼굴, 뻔한 템플릿 구도",
  en: "neon glow, lens flare, glowing circuits / AI chips / brains / robots clichés, holograms, sparkles, plastic glossy CGI, glassmorphism, random floating icons, fake UI gibberish or lorem ipsum, garbled or duplicated text, any extra text beyond the list, watermarks or logos, smooth stock-AI faces, generic template layouts",
};

/** 스타일 문장 안의 {B} {A} {hero} 를 채워요 */
function fillStyle(text: string, vars: { B: string; A: string; hero?: string }): string {
  return text.replaceAll("{B}", vars.B).replaceAll("{A}", vars.A).replaceAll("{hero}", vars.hero ?? "");
}

/** 프롬프트에 쓰는 스타일 (고르지 않았으면 홍보물에 맞는 기본값) */
export function styleFor(state: BuilderState): Style {
  const platform = byId(PLATFORMS, state.platform) ?? PLATFORMS[0];
  return resolveStyle(state.style, state.output, Boolean(platform.print));
}

export function buildPrompt(state: BuilderState, lang: Lang, today: DayKey | null = null): string {
  const info = resolveInfo(state, today);
  const output = byId(OUTPUT_TYPES, state.output) ?? OUTPUT_TYPES[0];
  const platform = byId(PLATFORMS, state.platform) ?? PLATFORMS[0];
  const audience = byId(AUDIENCES, state.audience);
  const format = byId(FORMATS, state.format);
  const mood = byId(MOODS, state.mood);
  const style = styleFor(state);
  const color = colorLabel(state.color);
  const topic = info.topicName;
  const { items } = textItems(state, info);
  const cert = output.id === "certificate";
  // 수료증은 스타일과 상관없이, 인쇄물은 목업 스타일이 아니면 정면 평면 원고로
  const flatPrint = cert || (Boolean(platform.print) && style.id !== "mockup");
  const extraAvoid = state.avoid
    .filter((id) => id !== "typo" && id !== "watermark")
    .map((id) => byId(AVOID_CHIPS, id))
    .filter((x) => x !== undefined);
  const showFormat = format && output.id !== "profile" && output.id !== "certificate";
  const scene = state.scene.trim();
  const sections: string[] = [];

  if (lang === "ko") {
    const vars = { B: color.ko, A: `포인트 색(${color.accent})` };
    const subject = topic ? `'${topic}' ` : "";
    const lead =
      output.id === "profile"
        ? `${subject ? `${subject}분야 ` : ""}강사를 소개하는 ${output.phrase.ko}`
        : `${audience ? `${audience.label} 대상 ` : ""}${showFormat ? `${format.label} ` : ""}${subject}강의의 ${output.phrase.ko}`;
    sections.push(
      `디자인 브리프: ${lead}${josa(output.phrase.ko, "을", "를")} 만들어 줘. ${cert ? "실제 교육기관이 발급하는 증서 수준의 완성도로." : "한국 에이전시 디자이너가 만든 실제 캠페인 결과물처럼."} 뻔한 템플릿이 아니라 이 아트 디렉션에 맞춘 의도적인 구도로 — 스타일이 요구하지 않는 한 '왼쪽 헤드라인 + 오른쪽 이미지' 같은 흔한 분할은 피해.`,
    );
    sections.push(`아트 디렉션: ${style.brief.ko}.${mood ? ` 톤: ${mood.label}.` : ""}`);
    sections.push(
      `캔버스: ${platform.label} ${platform.px}, 비율 ${platform.ratio}. 안전 영역: ${platform.safe.ko}.${flatPrint ? " 정면에서 본 평면 인쇄용 원고 그대로 캔버스 가장자리까지 꽉 채워 — 목업·사진·책상·원근·그림자 없음." : ""}`,
    );
    sections.push(
      `레이아웃: ${fillStyle(style.layout.ko, vars)}. 이 홍보물은 ${output.essentials.ko}. 정보 위계: ${output.hierarchy.ko}.${state.qrSlot ? " 오른쪽 아래 안전 여백 안쪽에 QR 코드를 붙일 단색 정사각형 빈칸(가짜 QR 무늬 금지)." : ""}`,
    );
    sections.push(`타이포그래피: ${style.type.ko}. 글자와 배경의 대비는 충분히.`);
    sections.push(`컬러: ${fillStyle(style.palette.ko, vars)}. (브랜드 컬러 ${color.ko}, 포인트 색 ${color.accent})`);
    sections.push(`질감·빛: ${style.texture.ko}.`);
    const hero = scene
      ? scene
      : state.photoSlot
        ? "강사 실제 사진을 합성할 단색 인물 실루엣 자리(둥근 사각형)"
        : cert
          ? "주제를 상징하는 작은 원형 선화 엠블럼 하나"
          : style.photo
            ? info.topic.photo.ko
            : info.topic.motif.ko;
    const people = style.photo ? " 사람이 나온다면 실제 교실·사무실의 자연스러운 한국인 성인으로, 매끈한 AI 얼굴 금지." : "";
    sections.push(
      `이미지: ${fillStyle(style.imagery.ko, { ...vars, hero })}. 장면에 필요한 것 말고 떠다니는 아이콘·장식은 넣지 마.${people}`,
    );
    const list = items
      .map((it, i) => (it.lines ? `${i + 1}) ${it.role.ko}(짧은 항목 ${it.lines.length}개, 레이아웃에서 정한 방식대로): ${it.lines.map((l) => `"${l}"`).join(" / ")}` : `${i + 1}) ${it.role.ko}: "${it.text}"`))
      .join("\n");
    const titleAi = info.title.mode === "ai" && items.some((i) => i.key === "title");
    sections.push(
      `들어갈 글자(따옴표 안 한글만 그대로, 각 항목은 정확히 한 번씩, 총 ${items.length}개 — 역할 이름은 쓰지 마):\n${list}${titleAi ? `\n헤드라인은 '${topic || "강의"}'가 바로 떠오르는 더 짧고 힘 있는 한글 카피(한 줄 12자 안팎, 최대 2줄)로 다듬어도 돼. 나머지는 한 글자도 바꾸지 마.` : "\n모든 글자는 한 글자도 바꾸지 마."} 목록 밖 글자는 넣지 마 — 화면·종이·간판 속 글자는 알아볼 수 없게 흐리거나 비워 둬.`,
    );
    sections.push(`제작·품질: ${platform.print ? "인쇄용 300dpi, " : ""}완성도 높은 프로 디자인 결과물, 선명한 한글.`);
    sections.push(`피할 것: ${ANTI_AI.ko}${extraAvoid.length ? `, ${extraAvoid.map((a) => a.label).join(", ")}` : ""}.`);
  } else {
    const vars = { B: color.en, A: `${color.accentEn} (${color.accent})` };
    const subject = topic ? `"${topic}"` : "a practical skills topic";
    const lead =
      output.id === "profile"
        ? `an ${output.phrase.en} introducing an instructor who teaches ${subject}`
        : `a ${output.phrase.en} for a Korean course on ${subject}${audience ? `, aimed at ${audience.en}` : ""}${showFormat ? `, taught as ${/^[aeiou]/i.test(format.en) ? "an" : "a"} ${format.en}` : ""}`;
    sections.push(
      `Design brief: Create ${lead}. ${cert ? "It should look like a real certificate issued by an established academy." : "It should look like a real campaign piece by a Korean agency designer."} Use a deliberate, non-template composition built for this art direction — avoid the generic "headline left, image right" split unless the style calls for it.`,
    );
    sections.push(`Art direction: ${style.brief.en}.${mood ? ` Tone: ${mood.en}.` : ""}`);
    sections.push(
      `Canvas: ${platform.en}, ${platform.px}, aspect ratio ${platform.ratio}. Safe zones: ${platform.safe.en}.${flatPrint ? " Flat, front-facing printable artwork filling the canvas edge to edge — no mockup, no photo of the print, no desk, no perspective, no shadow." : ""}`,
    );
    sections.push(
      `Layout: ${fillStyle(style.layout.en, vars)}. This piece is ${output.essentials.en}. Information hierarchy: ${output.hierarchy.en}.${state.qrSlot ? " Leave an empty solid square for a QR code at bottom-right inside the safe margin (no fake QR pattern)." : ""}`,
    );
    sections.push(`Typography: ${style.type.en}. Strong text/background contrast.`);
    sections.push(`Color: ${fillStyle(style.palette.en, vars)}. (Brand color: ${color.en}; accent: ${color.accentEn} ${color.accent}.)`);
    sections.push(`Texture & light: ${style.texture.en}.`);
    const hero = scene
      ? state.sceneEn.trim() || scene
      : state.photoSlot
        ? "a plain solid-color portrait silhouette placeholder (rounded rectangle) where the instructor's real photo will be placed later"
        : cert
          ? "one small round line-art emblem that nods to the topic"
          : style.photo
            ? info.topic.photo.en
            : info.topic.motif.en;
    const people = style.photo ? " If people appear: natural, candid Korean adults in a real setting — no smooth stock-AI faces." : "";
    sections.push(
      `Imagery: ${fillStyle(style.imagery.en, { ...vars, hero })}. No floating icons or decorations beyond what the scene needs.${people}`,
    );
    const list = items
      .map((it, i) => (it.lines ? `${i + 1}) ${it.role.en} (${it.lines.length} short items, arranged as the layout says): ${it.lines.map((l) => `"${l}"`).join(" / ")}` : `${i + 1}) ${it.role.en}: "${it.text}"`))
      .join("\n");
    const titleAi = info.title.mode === "ai" && items.some((i) => i.key === "title");
    sections.push(
      `Text to render (only the quoted Korean, verbatim, each item exactly once — ${items.length} items total; do not render the role labels):\n${list}${titleAi ? `\nThe headline may be rewritten into a shorter, punchier Korean line (about 12 characters per line, max 2 lines) that clearly signals the ${topic || "course"} topic. Keep every other item exactly as written.` : "\nDo not change any of the text."} No text outside the list — any text on screens, papers or signs in the scene must be illegible or blank.`,
    );
    sections.push(`Production: ${platform.print ? "print-ready at 300 dpi, " : ""}a finished, professional design piece with crisp Korean type.`);
    sections.push(`Avoid: ${ANTI_AI.en}${extraAvoid.length ? `, ${extraAvoid.map((a) => a.en).join(", ")}` : ""}.`);
  }
  sections.push(`AR ${platform.ratio}`);
  return sections.join("\n");
}
