/**
 * 수료증 전용 프롬프트. 실제 한국 수료증 11종을 분석한 규칙(작은 표제, 쌍점을 맞춘 항목 목록,
 * 본문 한 문장, 날짜, 발급기관 + 직인)을 그대로 따릅니다. 포스터용 스타일 엔진은 쓰지 않아요.
 */
import { colorLabel } from "./prompt";
import type { BuilderState, Lang } from "./state";
import type { ResolvedInfo } from "./suggest";

export type CertStyleId = "A" | "B" | "C" | "D";

export const CERT_STYLES: { id: CertStyleId; label: string; emoji: string; hint: string; en: string }[] = [
  { id: "A", label: "전통 공문형", emoji: "📜", hint: "A4 세로 · 명조 · 금색 테두리", en: "traditional formal" },
  { id: "B", label: "모던 기업형", emoji: "🏢", hint: "A4 세로 · 네이비×골드 · 고딕", en: "modern corporate" },
  { id: "C", label: "온라인 강의 가로형", emoji: "💻", hint: "A4 가로 · 이름 강조 · QR", en: "online-course landscape" },
  { id: "D", label: "따뜻한 아카데미형", emoji: "🌿", hint: "A4 세로 · 크림 · 보태니컬", en: "warm academy" },
];

export const CERT_ROLES = ["대표", "원장", "강사"] as const;

/** 수료증 칸에 실제로 들어갈 값 */
export function certFields(state: BuilderState, info: ResolvedInfo) {
  const c = state.cert;
  const org = c.org.trim();
  const name = info.instructor.text.replace(/\s*강사$/, "");
  return {
    no: c.no.trim(),
    heading: state.certStyle === "B" ? "교 육 수 료 증" : "수 료 증",
    name: c.name.trim(),
    course: info.title.text,
    period: c.period.trim(),
    hours: c.hours.trim().replace(/^총\s*/, "").replace(/시간$/, ""),
    org,
    date: info.schedule.text,
    issuer: [state.certStyle === "C" ? "" : org, c.role, name].filter(Boolean).join(" "),
    signer: [c.role, name].filter(Boolean).join(" "),
  };
}

/** 화면의 '들어갈 글자' 수 계산용 */
export function certTexts(state: BuilderState, info: ResolvedInfo): string[] {
  const f = certFields(state, info);
  return [f.no, f.heading, f.course, f.period, f.hours, f.date, f.issuer].filter(Boolean);
}

const BLANK = "____________";

export function buildCertificatePrompt(state: BuilderState, info: ResolvedInfo, lang: Lang): string {
  const f = certFields(state, info);
  const s = state.certStyle;
  const ko = lang === "ko";
  const landscape = s === "C";
  const paper = landscape ? (ko ? "A4 가로(297×210)" : "A4 landscape (297×210)") : ko ? "A4 세로(210×297)" : "A4 portrait (210×297)";
  const brand = colorLabel(state.color);
  const q = (t: string) => `"${t}"`;
  const fieldLines = [
    `성명 : ${f.name || BLANK}`,
    f.course && `과정명 : ${f.course}`,
    f.period && `교육기간 : ${f.period}`,
    f.hours && `교육시간 : 총 ${f.hours}시간`,
  ].filter(Boolean) as string[];
  const fields = fieldLines.map((l) => `   ${q(l)}`).join("\n");
  const at = f.org ? `${f.org}에서 실시한 ` : "";
  const body =
    s === "D"
      ? `위 사람은 ${at}위 과정을 즐겁고 성실하게 마쳤기에 이 증서를 드립니다.`
      : s === "C"
        ? "아래 과정을 성실히 이수하였기에 이 증서를 수여합니다."
        : `위 사람은 ${at}위 과정을 성실히 이수하였기에 이 증서를 수여합니다.`;
  const no = f.no ? (s === "B" ? `발급번호 제 ${f.no} 호` : `제 ${f.no} 호`) : "";

  const flat = state.certMockup
    ? ko
      ? `홍보용 목업 사진: 아래 수료증을 인쇄해 책상 위에 놓고 자연광에서 촬영한 장면, ${paper} 종이 전체가 보이게(인쇄용 원고가 아니라 SNS 홍보용).`
      : `Promotional mockup photo: the certificate below printed and lying on a desk in soft natural light, the whole ${paper} sheet visible (for social promotion, not the print file).`
    : null;

  const steps: string[] = [];
  const add = (t: string) => steps.push(`${steps.length + 1}) ${t}`);
  let head: string[];
  let tail: string;

  if (s === "A") {
    head = ko
      ? [
          flat ?? `캔버스 전체를 채우는 정면 평면 인쇄용 수료증 원고, ${paper}, 편집 프로그램에서 바로 내보낸 그대로 — 사진·목업 아님, 그림자·원근·책상 없음.`,
          "종이: 따뜻한 아이보리 화이트. 테두리: 차분한 앤티크 골드의 얇은 이중선, 두 선 사이에 섬세한 길로셰 로프 무늬, 종이 가장자리에서 약 6% 안쪽. 모서리 장식은 작고 절제되게. 그 밖의 장식 없음.",
          "타이포그래피: 모든 글자를 나눔명조 같은 한글 명조/바탕체로, 검정 잉크(#1a1a1a).",
          "레이아웃(위에서 아래로, 모두 넉넉한 여백 안):",
        ]
      : [
          flat ?? `Flat, front-facing printable certificate artwork filling the entire canvas, ${paper}, exported straight from a layout program — not a photo or mockup, no shadows, no perspective, no desk.`,
          "Paper: warm ivory white. Border: a thin double rule in muted antique gold with a fine guilloche rope pattern between the two lines, inset about 6% from the paper edge; small restrained corner ornaments. Nothing else decorative.",
          "Typography: Korean 명조/바탕 serif (Nanum Myeongjo style) for everything, black ink (#1a1a1a).",
          "Layout, top to bottom, all inside generous margins:",
        ];
    if (no) add(ko ? `왼쪽 위 모서리, 작고 가늘게(페이지 높이의 약 1.2%): ${q(no)}` : `Top-left corner, small and light (about 1.2% of page height): ${q(no)}`);
    add(ko ? `위에서 약 15% 지점 가운데, 넓은 자간의 절제된 표제 — 글자 높이 페이지 높이의 약 4.5%, 폭은 페이지의 40% 이하: ${q(f.heading)}` : `Centered at ~15% from top, modest heading with wide spacing, cap height about 4.5% of page height, spanning no more than 40% of the page width: ${q(f.heading)}`);
    add(ko ? `쌍점을 맞춘 왼쪽 정렬 항목 목록, 가운데 단에 한 덩어리로(위에서 약 28~42%), 글자 높이 약 2%, 줄 간격 여유 있게:\n${fields}` : `A left-aligned field list with aligned colons, placed as a block in the center column (~28–42% from top), text about 2% of page height, comfortable line spacing:\n${fields}`);
    add(ko ? `본문 문장, 글줄 폭에 맞춰 양끝 정렬, 2~3줄, 페이지 높이의 약 2%, 행간 1.8, 약 50~60% 지점: ${q(body)}` : `Body sentence, justified across the text width, 2–3 lines, ~2% of page height, line-height 1.8, at ~50–60%: ${q(body)}`);
    add(ko ? `약 72% 지점 가운데 날짜: ${q(f.date)}` : `Centered date at ~72%: ${q(f.date)}`);
    add(ko ? `약 85% 지점 가운데 발급자 줄, 굵게 조금 크게(약 2.6%): ${q(f.issuer)} — 이름 마지막 글자에 겹쳐 찍힌 붉은 주홍색 정사각형 전통 직인(새긴 글자 느낌, 살짝 고르지 않은 인주)` : `Centered issuer line at ~85%, bold, slightly larger (~2.6%): ${q(f.issuer)} with a square vermilion-red traditional seal (직인, carved-character look, slightly uneven ink) overlapping the last character of the name.`);
    tail = ko
      ? "모든 문자열은 정확히 한 번씩만, 다른 단어·영어 없음. 블록 사이 여백을 넉넉히. 인쇄용으로 선명하게, 색은 2가지만(금색 테두리 + 붉은 직인)과 검정 글자."
      : "Each text string appears exactly once; no other words, no English. Lots of empty space between blocks. Print-ready, crisp, 2 colors only (gold border + red seal) plus black text.";
  } else if (s === "B") {
    head = ko
      ? [
          flat ?? `캔버스 전체를 채우는 정면 평면 인쇄용 수료증 원고, ${paper}, 디자인 툴에서 내보낸 그대로 — 목업 아님, 그림자·원근 없음.`,
          "종이: 깨끗한 흰색. 포인트는 딥 네이비(#1F2A44)와 차분한 골드(#B08D57)뿐 — 왼쪽 위와 오른쪽 아래 모서리에 가는 금색 사선이 들어간 얇은 네이비 띠, 나머지는 여백. 표제 위 가운데에 작은 평면 금색 로제트 엠블럼(글자 없음).",
          "타이포그래피: Pretendard·Noto Sans KR 같은 모던 한글 고딕. 표제는 굵게 네이비, 나머지는 진회색.",
          "레이아웃:",
        ]
      : [
          flat ?? `Flat, front-facing printable certificate artwork filling the entire canvas, ${paper}, design-tool export — not a mockup, no shadow, no perspective.`,
          "Paper: clean white. Accents: deep navy (#1F2A44) and muted gold (#B08D57) only — a slim navy band with a thin diagonal gold stripe in the top-left and bottom-right corners; otherwise white space. A small flat gold rosette emblem (no text on it) centered above the heading.",
          "Typography: modern Korean sans (Pretendard / Noto Sans KR). Heading heavy weight in navy; everything else dark grey.",
          "Layout:",
        ];
    if (no) add(ko ? `오른쪽 위 모서리, 작게(약 1.2%): ${q(no)}` : `Top-right corner, small (~1.2%): ${q(no)}`);
    add(ko ? `약 18% 지점 가운데 표제 ${q(f.heading)} — 글자 높이 페이지 높이의 약 4.5%, 넓은 자간, 폭은 페이지의 약 45% 이하. 그 아래 자간을 넓힌 아주 작은 금색 대문자(약 1.3%): "CERTIFICATE OF COMPLETION"` : `Centered at ~18%: heading ${q(f.heading)}, cap height ~4.5% of page height, wide tracking, max ~45% of page width. Under it, tiny letter-spaced gold caps (~1.3%): "CERTIFICATE OF COMPLETION"`);
    add(ko ? `쌍점을 맞춘 왼쪽 정렬 항목 블록을 가운데 단에(약 32~46%), 글자 약 1.9%, 항목 이름은 미디엄 굵기:\n${fields}` : `Left-aligned, colon-aligned field block in the center column (~32–46%), ~1.9% text, labels in medium weight:\n${fields}`);
    add(ko ? `가운데 정렬 본문 2줄(약 2%): ${q(body)}` : `Centered body, 2 lines, ~2%: ${q(body)}`);
    add(ko ? `약 72% 지점 가운데 날짜: ${q(f.date)}` : `Centered date at ~72%: ${q(f.date)}`);
    add(ko ? `약 85% 지점 가운데 발급자, 굵게 약 2.6%: ${q(f.issuer)} — 이름 끝에 겹쳐 찍힌 붉은 정사각형 직인` : `Centered issuer at ~85%, bold ~2.6%: ${q(f.issuer)} with a square red 직인 stamp overlapping the end of the name.`);
    tail = ko
      ? "모든 문자열은 정확히 한 번씩, 그대로. 깔끔한 그리드, 넉넉한 여백, 평면 인쇄 색, 그라데이션·빛 효과 없음."
      : "Every string exactly once, verbatim. Clean grid, generous whitespace, flat print colors, no gradients or glow.";
  } else if (s === "C") {
    head = ko
      ? [
          flat ?? `캔버스를 채우는 정면 평면 디지털 수료증 원고, ${paper}, 온라인 강의 플랫폼이 발급하는 PDF처럼 — 목업 아님, 그림자 없음.`,
          `종이: 흰색, 오른쪽 1/3에만 아주 옅은 회색 선 질감. 브랜드 포인트 색은 하나(${brand.ko})만, 왼쪽 가장자리의 가는 세로 막대로 아껴서. 화려한 테두리 없음.`,
          "타이포그래피: Pretendard 계열 한글 고딕, 작은 라벨은 자간을 넓게.",
          "레이아웃(왼쪽에서 약 10% 지점부터 시작하는 왼쪽 정렬 단):",
        ]
      : [
          flat ?? `Flat, front-facing digital certificate artwork filling the canvas, ${paper}, like a PDF issued by an online learning platform — not a mockup, no shadow.`,
          `Paper: white with a very faint light-grey line texture only in the right third. One brand accent color: ${brand.en} used sparingly as a thin vertical bar on the left edge. No ornate border.`,
          "Typography: Pretendard-style Korean sans; small labels letter-spaced.",
          "Layout (left-aligned column starting at ~10% from the left edge):",
        ];
    const meta = [f.period, f.hours && `총 ${f.hours}시간`].filter(Boolean).join(" · ");
    if (f.org || no)
      add(
        ko
          ? `${f.org ? `왼쪽 위: 단순한 워드마크 글자 ${q(f.org)}(굵게, 페이지 높이의 약 2.5%).` : ""}${no ? ` 오른쪽 위, 아주 작은 회색(약 1.2%): ${q(no)}` : ""}`.trim()
          : `${f.org ? `Top-left: a simple wordmark text ${q(f.org)} (bold, ~2.5% of page height).` : ""}${no ? ` Top-right, tiny grey (~1.2%): ${q(no)}` : ""}`.trim(),
      );
    add(ko ? `위에서 약 25% 지점, 자간을 넓힌 작은 회색 라벨(약 1.8%): ${q(f.heading)}` : `At ~25% from top, small letter-spaced label (~1.8%, grey): ${q(f.heading)}`);
    add(ko ? `수료자 이름 — 가장 큰 글자지만 절제해서(글자 높이 페이지 높이의 약 7%): ${f.name ? q(f.name) : "이름을 적을 빈 밑줄"}` : `Recipient name, the largest text but restrained (cap height ~7% of page height): ${f.name ? q(f.name) : "a blank underline for the name"}`);
    add(ko ? `그 아래 한 줄(약 2%): ${q(body)}` : `Below, one line (~2%): ${q(body)}`);
    if (f.course) add(ko ? `과정명, 굵게(약 3.5%): ${q(f.course)}` : `Course title, bold (~3.5%): ${q(f.course)}`);
    if (meta) add(ko ? `작은 회색 정보 줄(약 1.8%): ${q(meta)}` : `Small grey meta line (~1.8%): ${q(meta)}`);
    add(ko ? `왼쪽 아래: 가는 선 위에 검정 잉크 손글씨 서명, 그 아래(약 1.8%) ${q(f.signer)}; 옆에 가는 선 위 ${q(f.date)}` : `Bottom-left: a handwritten-style signature in black ink above a thin rule, and under it (~1.8%): ${q(f.signer)}; next to it: ${q(f.date)} above a thin rule.`);
    add(ko ? "오른쪽 아래: 작은 단색 QR 코드 사각형과 작은 둥근 붉은 직인 — 주변에 글자 없음." : "Bottom-right: a small plain QR code square and a small round red seal (직인) — no text near them.");
    tail = ko
      ? "모든 문자열은 정확히 한 번씩, 그대로, 다른 글자 없음. 여백 넉넉히, 평면적이고 선명하게, 화면·인쇄 모두 잘 보이게."
      : "Each string exactly once, verbatim, nothing else written. Lots of white space; flat, crisp, screen- and print-friendly.";
  } else {
    head = ko
      ? [
          flat ?? `캔버스 전체를 채우는 정면 평면 인쇄용 수료증 원고, ${paper} — 사진 아님, 원근·책상·그림자 없음.`,
          "종이: 은은한 종이 결의 부드러운 크림색(#F7F1E6). 장식: 왼쪽 위와 오른쪽 아래 모서리에서만 자라는 섬세한 올리브그린 보태니컬 선화 잎, 약 6% 안쪽의 가는 테라코타(#B5654A) 안쪽 선. 왼쪽 아래 근처에 작은 평면 테라코타 밀랍 인장 모양(글자 없음).",
          "타이포그래피: 표제와 발급자는 우아한 한글 명조, 항목과 본문은 부드러운 고딕, 글자색 진갈색(#3B2F2A).",
          "레이아웃:",
        ]
      : [
          flat ?? `Flat, front-facing printable certificate artwork filling the entire canvas, ${paper} — not a photo, no perspective, no desk, no shadow.`,
          "Paper: soft cream (#F7F1E6) with subtle paper grain. Decoration: delicate hand-drawn olive-green botanical line-art leaves growing from the top-left and bottom-right corners only, plus a thin terracotta (#B5654A) inner rule inset ~6%. A small flat terracotta wax-seal shape (no text) near the bottom-left.",
          "Typography: elegant Korean 명조 for the heading and issuer, soft sans for fields and body; ink color dark brown (#3B2F2A).",
          "Layout:",
        ];
    if (no) add(ko ? `오른쪽 위, 작게(약 1.2%): ${q(no)}` : `Top-right, small (~1.2%): ${q(no)}`);
    add(ko ? `약 16% 지점 가운데: ${q(f.heading)} — 글자 높이 페이지 높이의 약 4.5%, 넓은 자간, 폭은 페이지의 40% 이하` : `Centered at ~16%: ${q(f.heading)}, cap height ~4.5% of page height, wide letter-spacing, max 40% of page width.`);
    add(ko ? `쌍점을 맞춘 왼쪽 정렬 항목 블록을 가운데에 한 덩어리로(약 30~44%), 약 1.9%:\n${fields}` : `Left-aligned, colon-aligned field block centered as a block (~30–44%), ~1.9%:\n${fields}`);
    add(ko ? `가운데 정렬 본문 2~3줄(약 2%): ${q(body)}` : `Centered body, 2–3 lines (~2%): ${q(body)}`);
    add(ko ? `가운데 날짜(약 72%): ${q(f.date)}` : `Centered date (~72%): ${q(f.date)}`);
    add(ko ? `가운데 발급자(약 85%, 약 2.5%): ${q(f.issuer)} — 이름 끝에 겹친 작은 붉은 정사각형 직인` : `Centered issuer (~85%, ~2.5%): ${q(f.issuer)} with a small square red seal overlapping the end of the name.`);
    tail = ko
      ? "모든 문자열은 정확히 한 번씩, 그대로, 영어·추가 단어 없음. 차분하고 산뜻하게, 손맛 있지만 전문적인 평면 인쇄 색."
      : "Each string exactly once, verbatim, no English, no extra words. Calm, airy, handmade-but-professional, flat print colors.";
  }

  const rules = ko
    ? `규칙: 표제와 본문 글자 크기 비율은 약 2.5:1(표제를 포스터처럼 크게 쓰지 마). 발급자 줄이 두 번째로 눈에 띄고 증서번호가 가장 작게. 글자가 테두리에 닿지 않게. ${state.certMockup ? "" : "종이 말림·손·액자 없음. "}그라데이션·반짝이·빛 번짐·3D 리본·스파클 없음. 표제와 과정명은 다른 곳에 반복하지 마. 비어 있는 값은 빈 밑줄로 남겨.`
    : `Rules: heading-to-body size ratio about 2.5:1 (never a poster-size heading). The issuer line is the second most prominent text and the certificate number the smallest. Keep text well away from the border. ${state.certMockup ? "" : "No paper curl, hands or frame. "}No gradients, glitter, glow, 3D ribbons or sparkles. Do not repeat the heading or the course title anywhere else. Leave a blank underline for any empty value.`;

  return [...head, ...steps, tail, rules, `AR ${landscape ? "1.414:1" : "1:1.414"}`].join("\n");
}
