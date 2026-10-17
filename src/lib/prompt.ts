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
  type Label,
  type OutputType,
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
  const room = output.maxText - (output.fixed ? 1 : 0);
  const kept = available.slice(0, room);
  const dropped = available.slice(room).map((i) => i.role.ko);
  // 화면 읽는 순서(헤드라인 → 핵심 정보 → 신청)로 다시 정렬
  const order: Key[] = ["title", "subtitle", "instructor", "bio", "curriculum", "schedule", "place", "price", "cta"];
  kept.sort((a, b) => order.indexOf(a.key as Key) - order.indexOf(b.key as Key));
  if (output.fixed) {
    const f: TextItem = { key: "fixed", role: output.fixed.role, text: output.fixed.text };
    if (output.fixed.first) kept.unshift(f);
    else kept.push(f);
  }
  return { items: kept, dropped, max: output.maxText };
}

const ratioValue = (r: string) => {
  const [w, h] = r.split(":").map(Number);
  return w / h;
};

/** AI 티를 없애는 기본 금지 목록 */
const ANTI_AI: Label = {
  ko: "네온 글로우, 렌즈 플레어, 빛나는 회로·AI 칩·뇌·로봇 같은 상투적 이미지, 홀로그램, 과한 그라데이션, 글래스모피즘, 플라스틱 같은 광택 3D, 여기저기 떠 있는 아이콘, 가짜 UI 글자·로렘 입숨, 알아볼 수 없거나 중복된 글자, 목록에 없는 추가 글자, 워터마크·로고, 모든 요소에 드롭섀도, 과포화된 색, AI 스톡 얼굴",
  en: "neon glow, lens flare, glowing circuits / AI chips / brains / robots clichés, holograms, excessive gradients, glassmorphism, plastic glossy 3D, random floating icons, fake UI text or lorem ipsum, gibberish or duplicated text, any extra text beyond the list, watermarks or logos, drop shadows everywhere, oversaturated colors, stock-AI faces",
};

function typography(output: OutputType, align: "left" | "center", lang: Lang): string {
  const cert = output.id === "certificate";
  const thumb = output.id === "thumbnail";
  if (lang === "ko") {
    const family = cert
      ? "표제는 Noto Serif KR 같은 단정한 한글 명조, 나머지는 Pretendard·Noto Sans KR 같은 모던 한글 고딕"
      : "Pretendard·Noto Sans KR 같은 모던 한글 고딕 한 가족";
    const scale = thumb
      ? "헤드라인 ExtraBold로 캔버스 높이의 약 20%(줄당), 라벨 배지는 헤드라인의 30%"
      : "헤드라인 ExtraBold(기준 100%) → 카피·소제목 Medium 약 40% → 본문·정보 Regular 약 25% → 작은 글씨 약 18%";
    return `${family}, 굵기는 최대 2가지. 위계: ${scale}. 헤드라인은 자간 -2~-3%, 행간 1.15로 촘촘하게. 정렬: ${align === "left" ? "모든 글자를 그리드 왼쪽 기준선에 맞춰 왼쪽 정렬" : "가운데 정렬, 중심축을 엄격하게 맞춤"}. 글자와 배경의 대비는 충분히(WCAG AA 이상).`;
  }
  const family = cert
    ? "a refined Korean serif in the style of Noto Serif KR for the heading, a modern Korean sans in the style of Pretendard / Noto Sans KR for everything else"
    : "one modern Korean sans-serif family in the style of Pretendard / Noto Sans KR";
  const scale = thumb
    ? "headline in ExtraBold at about 20% of canvas height per line; label badge at 30% of the headline size"
    : "headline ExtraBold (100%) → tagline / subheads Medium (~40%) → body and info Regular (~25%) → small print (~18%)";
  return `${family}, max 2 weights. Hierarchy: ${scale}. Headline with tight letter-spacing (−2 to −3%) and 1.15 line-height. Alignment: ${align === "left" ? "everything flush-left on one grid baseline" : "centered on a strict central axis"}. Strong text/background contrast (WCAG AA or better).`;
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
  const lightBrand = isLightHex(color.hex);
  // 어두운 배경은 화면용에서만 (인쇄물은 밝은 종이 배경)
  const dark = (state.mood === "premium" || state.mood === "future") && !platform.print;
  const topic = info.topicName;
  const { items } = textItems(state, info);
  const horizontal = ratioValue(platform.ratio) > 1.2;
  const layout = horizontal ? output.layoutH : output.layoutV;
  const align = output.id === "certificate" ? "center" : (style?.align ?? "left");
  const heroSize = style?.heroSize ?? 35;
  const portrait = output.id === "profile" || output.id === "seminar";
  const extraAvoid = state.avoid
    .filter((id) => id !== "typo" && id !== "watermark")
    .map((id) => byId(AVOID_CHIPS, id))
    .filter((x) => x !== undefined);
  const showFormat = format && output.id !== "profile" && output.id !== "certificate";
  const sections: string[] = [];

  if (lang === "ko") {
    const subject = topic ? `'${topic}' ` : "";
    const lead =
      output.id === "profile"
        ? `${subject ? `${subject}분야 ` : ""}강사를 소개하는 ${output.phrase.ko}`
        : `${audience ? `${audience.label} 대상 ` : ""}${showFormat ? `${format.label} ` : ""}${subject}강의의 ${output.phrase.ko}`;
    sections.push(
      `디자인 브리프: ${lead}${josa(output.phrase.ko, "을", "를")} 만들어 줘. 한국 에이전시 디자이너가 만든 실제 교육 마케팅 캠페인처럼(Behance·Pinterest 수준). 일러스트 작품이나 디지털 아트가 아니라 실무용 그래픽 디자인이야.`,
    );
    sections.push(
      `아트 디렉션: ${style ? style.brief.ko : "절제된 모던 그래픽 디자인 — 그리드, 평면 색, 넉넉한 여백"}.${mood ? ` 톤: ${mood.label}.` : ""}`,
    );
    sections.push(
      `캔버스: ${platform.label} ${platform.px}, 비율 ${platform.ratio}. 안전 영역: ${platform.safe.ko}.`,
    );
    sections.push(
      `레이아웃: 12칸 그리드, 사방 8% 여백. ${layout.ko}. 읽는 순서는 헤드라인 → 핵심 정보 → 신청 안내. 정보 위계: ${output.hierarchy.ko}. 모든 요소를 그리드에 정렬하고 여백을 넉넉히(정보 밀도는 낮게).${state.qrSlot ? " 오른쪽 아래 안전 여백 안쪽에 QR 코드를 붙일 단색 정사각형 빈칸(가짜 QR 무늬 금지)." : ""}`,
    );
    sections.push(`타이포그래피: ${typography(output, align, "ko")}`);
    const bg = style?.bg?.ko ?? (dark ? "차콜(#15171C)" : "따뜻한 오프화이트(#F7F5F0)");
    sections.push(
      `컬러: 메인 ${color.ko} — ${lightBrand ? "헤드라인 뒤 큰 색면·패널로 사용(글자색으로 쓰지 않음)" : "헤드라인 강조·색면·핵심 도형"}. 배경 ${bg}. 포인트 ${color.accent} — 신청 버튼이나 핵심 숫자 하나에만(면적 5% 이하). 글자 ${dark && !style?.bg ? "흰색" : "차콜(#111111)"}. ${style?.photo ? "사진 외의 그래픽 요소는 단색 평면." : "그라데이션 없이 평면 단색만."}`,
    );
    const hero = state.photoSlot
      ? "강사 실제 사진을 합성할 단색 인물 실루엣 자리(둥근 사각형, 평면)"
      : output.id === "certificate"
        ? "브랜드 컬러의 단순한 선형 엠블럼 하나(주제 상징을 아주 작게)"
        : info.topic.motif.ko;
    const people = style?.photo
      ? " 사람이 나온다면 실제 교실·사무실의 한국인 성인을 자연스럽게, 매끈한 AI 얼굴 금지."
      : portrait && !state.photoSlot
        ? " 사람이 필요하면 얼굴 디테일 없는 단순한 평면 인물로."
        : "";
    sections.push(
      `이미지: 포커스 비주얼은 단 하나 — ${hero}. 표현: ${style ? style.treatment.ko : "평면 벡터 그래픽"}. 화면의 약 ${state.photoSlot ? 40 : heroSize}%를 차지하고, 레이아웃에서 정한 위치에 둬. 그 밖의 아이콘·장식·배경 소품은 넣지 마.${people}`,
    );
    const list = items
      .map((it, i) => (it.lines ? `${i + 1}) ${it.role.ko}(짧은 줄 ${it.lines.length}개, 한 줄에 하나씩): ${it.lines.map((l) => `"${l}"`).join(" / ")}` : `${i + 1}) ${it.role.ko}: "${it.text}"`))
      .join("\n");
    const titleAi = info.title.mode === "ai" && items.some((i) => i.key === "title");
    sections.push(
      `들어갈 글자(따옴표 안 한글만 그대로, 각 항목은 정확히 한 번씩, 총 ${items.length}개 — 역할 이름은 쓰지 마):\n${list}${titleAi ? `\n헤드라인은 '${topic || "강의"}'가 바로 떠오르는 더 짧고 힘 있는 한글 카피(한 줄 12자 안팎, 최대 2줄)로 다듬어도 돼. 나머지는 한 글자도 바꾸지 마.` : "\n모든 글자는 한 글자도 바꾸지 마."}`,
    );
    sections.push(
      `제작·품질: ${platform.print ? "인쇄용(300dpi), " : ""}벡터처럼 선명한 가장자리, 프로 그래픽 디자인 결과물. 목록 외 글자·가짜 UI 글자 없음.`,
    );
    sections.push(`피할 것: ${ANTI_AI.ko}${extraAvoid.length ? `, ${extraAvoid.map((a) => a.label).join(", ")}` : ""}.`);
  } else {
    const subject = topic ? `"${topic}"` : "a practical skills topic";
    const lead =
      output.id === "profile"
        ? `an ${output.phrase.en} introducing an instructor who teaches ${subject}`
        : `a ${output.phrase.en} for a Korean course on ${subject}${audience ? `, aimed at ${audience.en}` : ""}${showFormat ? `, taught as ${/^[aeiou]/i.test(format.en) ? "an" : "a"} ${format.en}` : ""}`;
    sections.push(
      `Design brief: Create ${lead}. It should look like a real education-marketing campaign by a Korean agency designer (Behance / Pinterest quality) — professional graphic design, not an illustration or digital art piece.`,
    );
    sections.push(
      `Art direction: ${style ? style.brief.en : "restrained modern graphic design — grid, flat color, generous negative space"}.${mood ? ` Tone: ${mood.en}.` : ""}`,
    );
    sections.push(`Canvas: ${platform.en}, ${platform.px}, aspect ratio ${platform.ratio}. Safe zones: ${platform.safe.en}.`);
    sections.push(
      `Layout: 12-column grid with 8% safe margins. ${layout.en}. Reading order: headline → key info → CTA. Information hierarchy: ${output.hierarchy.en}. Align every element to the grid; generous negative space, low information density.${state.qrSlot ? " Leave an empty solid square for a QR code at bottom-right inside the safe margin (no fake QR pattern)." : ""}`,
    );
    sections.push(`Typography: ${typography(output, align, "en")}`);
    const bg = style?.bg?.en ?? (dark ? "charcoal (#15171C)" : "warm off-white (#F7F5F0)");
    sections.push(
      `Color: primary ${color.en} — ${lightBrand ? "used as a large color field / panel behind the headline (never as text color)" : "for headline emphasis, color blocks and the key shape"}. Background ${bg}. Accent ${color.accentEn} (${color.accent}) — only on the CTA or one key number (under 5% of the area). Text ${dark && !style?.bg ? "white" : "charcoal (#111111)"}. ${style?.photo ? "Graphic elements besides the photo are flat solid color." : "Flat color only, no gradients."}`,
    );
    const hero = state.photoSlot
      ? "a plain solid-color portrait silhouette placeholder (flat rounded rectangle) where the instructor's real photo will be placed later"
      : output.id === "certificate"
        ? "one simple monoline emblem in the brand color (a tiny nod to the topic)"
        : info.topic.motif.en;
    const people = style?.photo
      ? " If people appear: natural, candid Korean adults in a real classroom or office — no smooth stock-AI faces."
      : portrait && !state.photoSlot
        ? " If a person is needed, use a simple flat figure without facial detail."
        : "";
    sections.push(
      `Imagery: exactly one focal visual — ${hero}. Treatment: ${style ? style.treatment.en : "flat vector graphic"}. It takes about ${state.photoSlot ? 40 : heroSize}% of the canvas, placed where the layout says. No other icons, decorations or background props.${people}`,
    );
    const list = items
      .map((it, i) => (it.lines ? `${i + 1}) ${it.role.en} (${it.lines.length} short lines, one per line): ${it.lines.map((l) => `"${l}"`).join(" / ")}` : `${i + 1}) ${it.role.en}: "${it.text}"`))
      .join("\n");
    const titleAi = info.title.mode === "ai" && items.some((i) => i.key === "title");
    sections.push(
      `Text to render (only the quoted Korean, verbatim, each item exactly once — ${items.length} items total; do not render the role labels):\n${list}${titleAi ? `\nThe headline may be rewritten into a shorter, punchier Korean line (about 12 characters per line, max 2 lines) that clearly signals the ${topic || "course"} topic. Keep every other item exactly as written.` : "\nDo not change any of the text."}`,
    );
    sections.push(
      `Production: ${platform.print ? "print-ready at 300 dpi, " : ""}vector-crisp edges, professional graphic design output. No text outside the list, no fake UI copy.`,
    );
    sections.push(`Avoid: ${ANTI_AI.en}${extraAvoid.length ? `, ${extraAvoid.map((a) => a.en).join(", ")}` : ""}.`);
  }
  sections.push(`AR ${platform.ratio}`);
  return sections.join("\n");
}
