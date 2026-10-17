/** 한국어 / 영어 짝 */
export type Label = { ko: string; en: string };

export type Option = { id: string; label: string; emoji?: string; hint?: string; en: string };

/** 홍보물 종류 */
export type OutputType = {
  id: OutputId;
  label: string;
  emoji: string;
  desc: string;
  /** 프롬프트 첫 문장에 들어갈 결과물 이름 */
  phrase: Label;
  /** 기본 플랫폼 사이즈 */
  platform: string;
  /** 고를 때 기본으로 '넣지 않기'로 돌릴 정보 칸 */
  omit: string[];
  /** 글자 항목 최대 개수 (고정 문구 포함) */
  maxText: number;
  /** 글자가 넘칠 때 남길 우선순위 */
  priority: string[];
  /** 앱이 자동으로 넣는 고정 문구 (예: 수료증 제목) */
  fixed?: { role: Label; text: string; first?: boolean };
  /** 세로·정사각형 캔버스 배치 */
  layoutV: Label;
  /** 가로 캔버스 배치 */
  layoutH: Label;
  /** 정보 위계: 1순위 / 2순위 / 3순위 */
  hierarchy: Label;
};

export type OutputId = "recruit" | "seminar" | "cardnews" | "thumbnail" | "certificate" | "profile";

export const OUTPUT_TYPES: OutputType[] = [
  {
    id: "recruit",
    label: "강의 모집 포스터",
    emoji: "📣",
    desc: "수강생 모집 · 얼리버드",
    phrase: { ko: "수강생 모집 포스터", en: "course enrollment poster" },
    platform: "feed",
    omit: ["instructor", "bio"],
    maxText: 7,
    priority: ["title", "subtitle", "curriculum", "schedule", "price", "cta", "place", "instructor", "bio"],
    layoutV: {
      ko: "위 45%: 헤드라인과 카피를 그리드 왼쪽에 정렬. 가운데 30%: 왼쪽은 커리큘럼 목록, 오른쪽은 메인 비주얼. 아래 25%: 1px 얇은 선으로 구분한 정보 띠(일정·장소·수강료 2단 배치), 신청 안내는 왼쪽 아래 단색 알약 버튼",
      en: "Top 45%: headline and tagline, left-aligned on the grid. Middle 30%: curriculum list on the left, hero visual on the right. Bottom 25%: an info band separated by a thin 1px rule, with schedule / place / price in two columns; the CTA as a solid pill at bottom-left",
    },
    layoutH: {
      ko: "왼쪽 58%(7칸): 헤드라인 → 카피 → 커리큘럼 → 정보 → 신청 안내 순서로 배치. 오른쪽 42%(5칸): 메인 비주얼, 오른쪽 끝으로 살짝 잘리게",
      en: "Left 58% (7 columns): headline, tagline, curriculum, info block, then CTA in reading order. Right 42% (5 columns): the hero visual, bleeding slightly off the right edge",
    },
    hierarchy: {
      ko: "1순위 헤드라인, 2순위 카피·커리큘럼, 3순위 일정·장소·수강료·신청 안내",
      en: "primary = headline; secondary = tagline and curriculum; tertiary = schedule, place, price and CTA",
    },
  },
  {
    id: "seminar",
    label: "특강·세미나 안내",
    emoji: "🎤",
    desc: "연사 · 일시 · 장소 중심",
    phrase: { ko: "특강·세미나 안내 포스터", en: "special lecture / seminar announcement poster" },
    platform: "feed",
    omit: ["price"],
    maxText: 7,
    priority: ["title", "instructor", "schedule", "place", "bio", "subtitle", "cta", "price", "curriculum"],
    layoutV: {
      ko: "위 40%: 세미나 제목을 가장 큰 헤드라인으로. 가운데 35%: 연사 블록 — 메인 비주얼(연사 사진 자리 또는 주제 비주얼) 옆에 연사 이름과 한 줄 소개. 아래 25%: 일시와 장소를 티켓처럼 크고 또렷하게, 신청 안내는 맨 아래 작게",
      en: "Top 40%: the seminar title as the dominant headline. Middle 35%: a speaker block — the hero visual (speaker portrait area or topic visual) with the speaker name and one-line bio beside it. Bottom 25%: date and venue set large and clear like an event ticket; the CTA small at the very bottom",
    },
    layoutH: {
      ko: "왼쪽 60%: 제목 → 연사 이름·소개 → 일시·장소. 오른쪽 40%: 연사 사진 자리 또는 주제 비주얼",
      en: "Left 60%: title, speaker name and bio, then date and venue. Right 40%: speaker portrait area or topic visual",
    },
    hierarchy: {
      ko: "1순위 제목, 2순위 연사·일시·장소, 3순위 소개·신청 안내",
      en: "primary = title; secondary = speaker, date and venue; tertiary = bio and CTA",
    },
  },
  {
    id: "cardnews",
    label: "카드뉴스 표지",
    emoji: "🗂️",
    desc: "첫 장에서 스와이프 유도",
    phrase: { ko: "카드뉴스 첫 장 표지", en: "card-news cover slide (first slide of a carousel)" },
    platform: "feed",
    omit: ["schedule", "place", "price", "cta", "instructor", "bio"],
    maxText: 3,
    priority: ["title", "subtitle", "curriculum", "schedule", "place", "price", "cta", "instructor", "bio"],
    fixed: { role: { ko: "스와이프 신호", en: "Swipe cue" }, text: "넘겨 보기 →" },
    layoutV: {
      ko: "짧은 헤드라인(최대 2줄)이 화면 중상단을 아주 크게 채우고, 카피는 그 아래 작게. 메인 비주얼은 작고 보조적으로 오른쪽 아래. 오른쪽 아래 모서리에 작은 스와이프 신호",
      en: "One short headline (2 lines max) fills the upper-middle area at a very large size, with the tagline small beneath it. The hero visual is small and supportive at the lower right. A tiny swipe cue sits in the bottom-right corner",
    },
    layoutH: {
      ko: "왼쪽 60%: 아주 큰 헤드라인과 작은 카피. 오른쪽 40%: 메인 비주얼. 오른쪽 아래 모서리에 작은 스와이프 신호",
      en: "Left 60%: a very large headline with a small tagline. Right 40%: the hero visual. A tiny swipe cue in the bottom-right corner",
    },
    hierarchy: { ko: "1순위 헤드라인, 2순위 카피, 3순위 스와이프 신호", en: "primary = headline; secondary = tagline; tertiary = swipe cue" },
  },
  {
    id: "thumbnail",
    label: "SNS 썸네일",
    emoji: "▶️",
    desc: "유튜브 · 블로그 대표이미지",
    phrase: { ko: "유튜브·블로그 썸네일", en: "YouTube / blog thumbnail" },
    platform: "youtube",
    omit: ["schedule", "place", "price", "instructor", "bio", "cta"],
    maxText: 2,
    priority: ["title", "subtitle", "instructor", "curriculum", "schedule", "place", "price", "bio", "cta"],
    layoutV: {
      ko: "위 절반: 헤드라인을 최대 크기 2줄로. 아래 절반: 메인 비주얼을 크게, 타이트하게 크롭",
      en: "Top half: the headline in 2 short lines at maximum size. Bottom half: the hero visual, large and tightly cropped",
    },
    layoutH: {
      ko: "왼쪽 55%: 헤드라인을 최대 크기 2줄로(가로 120px 크기에서도 읽히게), 카피는 작은 라벨 배지로. 오른쪽 45%: 메인 비주얼을 크게, 타이트하게 크롭",
      en: "Left 55%: the headline in 2 short lines at maximum size (readable when the thumbnail is 120px wide), the tagline as a small label badge. Right 45%: the hero visual, large and tightly cropped",
    },
    hierarchy: { ko: "1순위 헤드라인, 2순위 라벨 배지 하나뿐", en: "primary = headline; secondary = one small label badge only" },
  },
  {
    id: "certificate",
    label: "수료증",
    emoji: "🎓",
    desc: "과정 수료 · 서명란",
    phrase: { ko: "과정 수료증", en: "course completion certificate" },
    platform: "a4l",
    omit: ["place", "price", "cta", "subtitle", "bio"],
    maxText: 4,
    priority: ["title", "schedule", "instructor", "bio", "subtitle", "curriculum", "place", "price", "cta"],
    fixed: { role: { ko: "표제", en: "Heading" }, text: "수료증", first: true },
    layoutV: {
      ko: "8% 여백 안쪽 얇은 이중선 테두리, 좌우 대칭 가운데 정렬. 위: 브랜드 컬러의 단순한 선형 엠블럼 하나. 가운데: '수료증' 표제를 크게, 그 아래 과정명, 수료자 이름을 쓸 빈 밑줄. 아래: 왼쪽 수료일, 오른쪽 강사 서명란",
      en: "A thin double-rule border inside 8% margins; symmetrical, centered layout. Top: one simple monoline emblem in the brand color. Center: the heading set large, the course name below it, then a blank underline for the graduate's name. Bottom: completion date on the left, instructor signature line on the right",
    },
    layoutH: {
      ko: "8% 여백 안쪽 얇은 이중선 테두리, 좌우 대칭 가운데 정렬. 위: 브랜드 컬러의 단순한 선형 엠블럼 하나. 가운데: '수료증' 표제를 크게, 그 아래 과정명, 수료자 이름을 쓸 빈 밑줄. 아래: 왼쪽 수료일, 오른쪽 강사 서명란",
      en: "A thin double-rule border inside 8% margins; symmetrical, centered layout. Top: one simple monoline emblem in the brand color. Center: the heading set large, the course name below it, then a blank underline for the graduate's name. Bottom: completion date on the left, instructor signature line on the right",
    },
    hierarchy: { ko: "1순위 표제, 2순위 과정명, 3순위 수료일·서명", en: "primary = heading; secondary = course name; tertiary = date and signature" },
  },
  {
    id: "profile",
    label: "강사 프로필 카드",
    emoji: "🪪",
    desc: "섭외 · 소개용 명함 카드",
    phrase: { ko: "강사 프로필 카드", en: "instructor profile card" },
    platform: "feed",
    omit: ["schedule", "place", "price"],
    maxText: 6,
    priority: ["instructor", "bio", "curriculum", "subtitle", "cta", "title", "schedule", "place", "price"],
    layoutV: {
      ko: "위 50%: 인물 사진 자리(메인 비주얼), 단색 배경 위 가슴 높이로 크롭. 아래 50%: 이름을 크게 → 한 줄 소개 → 강의 분야를 작은 외곽선 태그 3~4개로 한 줄 → 맨 아래 연락처",
      en: "Top 50%: the portrait area (hero visual), cropped at chest height on a flat color field. Bottom 50%: the name large, the one-line bio, teaching topics as 3–4 small outlined tags in one row, contact at the very bottom",
    },
    layoutH: {
      ko: "왼쪽 45%: 인물 사진 자리. 오른쪽 55%: 이름 → 소개 → 분야 태그 → 연락처, 왼쪽 정렬",
      en: "Left 45%: the portrait area. Right 55%: name, bio, topic tags, then contact, left-aligned",
    },
    hierarchy: { ko: "1순위 이름, 2순위 소개·분야 태그, 3순위 카피·연락처", en: "primary = name; secondary = bio and topic tags; tertiary = tagline and contact" },
  },
];

/** 플랫폼 사이즈 → 프롬프트 비율 + 안전 영역 */
export type Platform = {
  id: string;
  label: string;
  emoji: string;
  ratio: string;
  px: string;
  en: string;
  safe: Label;
  print?: boolean;
};

export const PLATFORMS: Platform[] = [
  { id: "feed", label: "인스타 피드", emoji: "📷", ratio: "4:5", px: "1080×1350", en: "Instagram feed post",
    safe: { ko: "사방 6% 안전 여백, 핵심 내용은 가운데 1:1 영역 안(그리드 미리보기 크롭 대비)", en: "6% safe margins on all sides; keep key content inside the central 1:1 area (profile-grid crop)" } },
  { id: "story", label: "스토리·릴스", emoji: "📱", ratio: "9:16", px: "1080×1920", en: "Instagram story / Reels cover",
    safe: { ko: "위·아래 14%는 글자 없이 비우기(앱 UI가 덮는 영역), 좌우 6% 여백", en: "keep the top 14% and bottom 14% free of text (app UI overlays), 6% side margins" } },
  { id: "threads", label: "스레드", emoji: "🧵", ratio: "1:1", px: "1080×1080", en: "Threads post",
    safe: { ko: "사방 8% 안전 여백", en: "8% safe margins on all sides" } },
  { id: "youtube", label: "유튜브 썸네일", emoji: "▶️", ratio: "16:9", px: "1280×720", en: "YouTube thumbnail",
    safe: { ko: "오른쪽 아래 모서리 비우기(영상 길이 표시), 5% 여백, 작게 줄여도 읽히는 대비", en: "keep the bottom-right corner empty (video length overlay), 5% margins, contrast that survives small sizes" } },
  { id: "blog", label: "블로그 대표", emoji: "✍️", ratio: "1.91:1", px: "1200×630", en: "blog cover / link-preview image",
    safe: { ko: "핵심 내용은 가운데 1:1 영역 안(정사각 크롭 대비), 6% 여백", en: "keep key content inside the central square (square crops), 6% margins" } },
  { id: "a4", label: "A4 세로", emoji: "📄", ratio: "1:1.414", px: "210×297mm", en: "A4 portrait print poster", print: true,
    safe: { ko: "재단선 3mm, 안전 여백 10mm, 300dpi 인쇄용", en: "3mm bleed, 10mm safe margin, 300 dpi print-ready" } },
  { id: "a4l", label: "A4 가로", emoji: "📃", ratio: "1.414:1", px: "297×210mm", en: "A4 landscape print", print: true,
    safe: { ko: "재단선 3mm, 안전 여백 10mm, 300dpi 인쇄용", en: "3mm bleed, 10mm safe margin, 300 dpi print-ready" } },
];

export const AUDIENCES: Option[] = [
  { id: "beginner", label: "왕초보 입문자", emoji: "🌱", en: "complete beginners" },
  { id: "student", label: "대학생", emoji: "🎒", en: "university students" },
  { id: "worker", label: "성인 직장인", emoji: "💼", en: "working professionals" },
  { id: "corporate", label: "기업 임직원", emoji: "🏢", en: "corporate employees (in-house training)" },
  { id: "jobseeker", label: "취준생", emoji: "🧭", en: "job seekers" },
  { id: "senior", label: "시니어", emoji: "🧓", en: "seniors aged 60 and over" },
  { id: "creator", label: "1인 사업자·크리에이터", emoji: "🚀", en: "solo business owners and creators" },
];

export const FORMATS: Option[] = [
  { id: "live", label: "온라인 라이브", emoji: "🔴", en: "live online class" },
  { id: "offline", label: "오프라인", emoji: "🏫", en: "in-person class" },
  { id: "vod", label: "VOD", emoji: "🎬", en: "on-demand video (VOD) course" },
  { id: "hybrid", label: "하이브리드", emoji: "🔀", en: "hybrid in-person and live online class" },
];

export const MOODS: Option[] = [
  { id: "trust", label: "신뢰감 있는", emoji: "🤝", en: "trustworthy, calm and professional" },
  { id: "energy", label: "활기찬", emoji: "🔥", en: "confident and energetic, but never loud" },
  { id: "friendly", label: "친근한", emoji: "😊", en: "warm, friendly and approachable" },
  { id: "premium", label: "고급스러운", emoji: "💎", en: "premium, quiet and refined" },
  { id: "future", label: "모던한", emoji: "🧭", en: "modern and forward-looking (not sci-fi)" },
  { id: "calm", label: "차분한", emoji: "🍃", en: "calm, focused and airy" },
];

/** 디자인 접근법 (아트 디렉션) */
export type Style = Option & {
  /** 브리프에 쓰는 이름과 설명 */
  brief: Label;
  /** 메인 비주얼 표현 방식 */
  treatment: Label;
  align: "left" | "center";
  /** 메인 비주얼이 차지하는 대략적 비율 (%) */
  heroSize: number;
  /** 배경을 스타일이 정하는 경우 */
  bg?: Label;
  /** 사진 스타일: 사람 표현 규칙이 달라요 */
  photo?: boolean;
};

export const STYLES: Style[] = [
  {
    id: "swiss", label: "스위스 그리드", emoji: "📐", hint: "정돈·신뢰",
    en: "Swiss / International Typographic Style",
    brief: { ko: "스위스(인터내셔널) 타이포그래피 스타일 — 엄격한 모듈 그리드, 비대칭 왼쪽 정렬, 평면 색면, 얇은 구분선", en: "Swiss / International Typographic Style — strict modular grid, asymmetric left-aligned type, flat color fields, thin hairline rules" },
    treatment: { ko: "브랜드 컬러의 평면 기하 도형으로, 날카로운 모서리·음영 없음", en: "flat geometric vector shapes in the brand color, hard edges, no shading" },
    align: "left", heroSize: 35,
  },
  {
    id: "editorial", label: "에디토리얼 매거진", emoji: "📰", hint: "감각·세련",
    en: "Korean editorial magazine layout",
    brief: { ko: "한국 에디토리얼 매거진 레이아웃(매거진 B·디자인 잡지 펼침면 느낌) — 과감한 크롭, 넉넉한 여백, 큰 제목과 작은 본문의 강한 대비, 얇은 캡션 선", en: "Korean editorial magazine layout (like a Magazine B or design-journal spread) — bold crops, generous margins, strong scale contrast between a large title and small body text, thin caption rules" },
    treatment: { ko: "잡지 화보처럼 과감하게 크롭한 사진 또는 절제된 평면 일러스트, 차분한 자연색", en: "art-directed like a magazine spread: a boldly cropped photograph or restrained flat illustration in calm, natural tones" },
    align: "left", heroSize: 45,
  },
  {
    id: "saas", label: "SaaS 플랫 일러스트", emoji: "🧩", hint: "친근·깔끔",
    en: "flat corporate illustration (top SaaS landing page)",
    brief: { ko: "잘 만든 SaaS 랜딩 페이지(노션·슬랙·토스) 스타일의 플랫 기업 일러스트 — 제한된 팔레트, 단순한 기하 형태, 일정한 선 굵기", en: "flat corporate illustration in the style of a top SaaS landing page (Notion, Slack, Toss) — limited palette, simple geometric forms, consistent line weight" },
    treatment: { ko: "플랫 벡터 일러스트, 일정한 2px 선, 그라데이션·음영 없음", en: "flat vector illustration with a consistent 2px line weight, no gradients, no shading" },
    align: "left", heroSize: 40,
  },
  {
    id: "photo", label: "실사 포토", emoji: "📸", hint: "현장감",
    en: "photographic, real stock-photo look",
    brief: { ko: "실사 사진 중심 광고 디자인 — 실제 촬영한 스톡 사진처럼 자연광, 사진 위 깔끔한 단색 글자 영역", en: "photography-led ad design — looks like a real stock-photo shoot with natural light, and a clean solid text area beside or over the photo" },
    treatment: { ko: "실제 에디토리얼 사진처럼: 창가 자연광, 얕은 심도, 실제와 같은 색감(언스플래시 촬영 느낌), CGI 아님", en: "a real-looking editorial photograph: natural window light, shallow depth of field, true-to-life colors (like an Unsplash shoot), not CGI" },
    align: "left", heroSize: 55, photo: true,
  },
  {
    id: "riso", label: "리소·듀오톤", emoji: "🖨️", hint: "개성·인쇄감",
    en: "risograph / duotone print",
    brief: { ko: "리소그래프 듀오톤 인쇄물 — 잉크 2색(브랜드 컬러 + 차콜), 망점 질감, 은은한 입자, 살짝 어긋난 판", en: "two-ink risograph / duotone print — brand color plus charcoal, halftone texture, subtle grain, slight misregistration" },
    treatment: { ko: "잉크 2색 리소 인쇄 질감의 평면 그래픽", en: "a flat graphic printed in two risograph inks with halftone texture" },
    align: "left", heroSize: 40,
    bg: { ko: "코팅 안 된 미색 종이", en: "uncoated off-white paper" },
  },
  {
    id: "typo", label: "타이포 포스터", emoji: "🅰️", hint: "임팩트",
    en: "bold typographic poster",
    brief: { ko: "볼드 타이포그래피 포스터 — 헤드라인 자체가 메인 비주얼, 아주 큰 한글 글자, 과감한 크롭과 대비", en: "bold typographic poster — the headline itself is the main visual: oversized Korean type, confident cropping and contrast" },
    treatment: { ko: "아주 작고 단순한 평면 도형 하나만 — 글자가 주인공", en: "kept minimal: one small, simple flat shape — the type is the hero" },
    align: "left", heroSize: 15,
  },
  {
    id: "clay", label: "매트 클레이 3D", emoji: "🧱", hint: "부드러움",
    en: "subtle matte clay 3D (Apple / Toss marketing)",
    brief: { ko: "애플·토스 마케팅처럼 절제된 매트 클레이 3D — 메인 오브젝트 하나에만 3D, 나머지는 평면 그래픽", en: "subtle matte clay 3D like Apple or Toss marketing — 3D is used for a single hero object only; everything else is flat graphic design" },
    treatment: { ko: "매트한 클레이 3D 오브젝트 하나: 부드러운 확산광, 바닥 그림자 하나, 단색 배경, 광택·반사 없음", en: "one matte clay 3D object: soft diffuse light, a single gentle contact shadow, flat solid background, no gloss, no reflections" },
    align: "center", heroSize: 35,
  },
  {
    id: "minimal", label: "미니멀", emoji: "◻️", hint: "여백·고급",
    en: "Japanese-inspired minimalism",
    brief: { ko: "일본풍 미니멀리즘 — 화면의 60% 이상을 여백으로, 작은 포커스 하나, 가는 글자", en: "Japanese-inspired minimalism — at least 60% negative space, one small focal element, light and precise type" },
    treatment: { ko: "작고 단순한 평면 오브젝트 하나, 주변을 넓게 비움", en: "one small, simple flat object with lots of empty space around it" },
    align: "center", heroSize: 15,
  },
  {
    id: "business", label: "기업 리포트형", emoji: "📊", hint: "기업교육",
    en: "corporate annual-report design",
    brief: { ko: "기업 연차보고서 스타일 — 단색 컬러 블록, 단정한 그리드, 데이터 그래픽 하나", en: "corporate annual-report design — solid color blocks, a disciplined grid, one data-style graphic" },
    treatment: { ko: "연차보고서에 나올 법한 깔끔한 평면 데이터 그래픽(단순한 차트나 다이어그램)", en: "a clean flat data-style graphic (a simple chart or diagram) like a corporate annual report" },
    align: "left", heroSize: 30,
  },
];

/** accent: 브랜드 컬러와 짝을 이루는 포인트 색 */
export type BrandColor = { id: string; label: string; hex: string; en: string; accent: string; accentEn: string };

export const BRAND_COLORS: BrandColor[] = [
  { id: "navy", label: "네이비", hex: "#1E3A8A", en: "deep navy", accent: "#F2B33D", accentEn: "mustard" },
  { id: "blue", label: "블루", hex: "#2563EB", en: "bright blue", accent: "#FF7A59", accentEn: "coral" },
  { id: "teal", label: "틸", hex: "#0D9488", en: "teal", accent: "#F4A259", accentEn: "apricot" },
  { id: "green", label: "그린", hex: "#16A34A", en: "fresh green", accent: "#F6C445", accentEn: "sunflower" },
  { id: "lime", label: "라임", hex: "#A3E635", en: "electric lime", accent: "#5B5BD6", accentEn: "indigo" },
  { id: "yellow", label: "옐로", hex: "#FACC15", en: "warm yellow", accent: "#2F4BFF", accentEn: "cobalt blue" },
  { id: "orange", label: "오렌지", hex: "#F97316", en: "vivid orange", accent: "#1F3A5F", accentEn: "deep navy" },
  { id: "red", label: "레드", hex: "#DC2626", en: "strong red", accent: "#F2C14E", accentEn: "golden yellow" },
  { id: "purple", label: "퍼플", hex: "#7C3AED", en: "violet purple", accent: "#FFB547", accentEn: "amber" },
  { id: "black", label: "블랙", hex: "#111827", en: "near-black charcoal", accent: "#FF5A36", accentEn: "vermilion" },
];

/** '피할 것' 칩 */
export const AVOID_CHIPS: Option[] = [
  { id: "typo", label: "깨진 한글", en: "garbled or misspelled Korean text" },
  { id: "clutter", label: "복잡한 장식", en: "cluttered decorations" },
  { id: "stock", label: "뻔한 스톡사진 느낌", en: "generic stock-photo look" },
  { id: "watermark", label: "워터마크·로고", en: "watermarks or random logos" },
  { id: "english", label: "불필요한 영어 문구", en: "unnecessary English filler text" },
];

/** 결과가 아쉬울 때 이어서 보낼 수정 요청 */
export const FOLLOW_UPS: Label[] = [
  { ko: "빛 번짐·광택·그라데이션 같은 AI 느낌 효과를 모두 빼고, 평면적인 실제 인쇄물처럼 다시 만들어 줘.", en: "Remove every AI-looking effect (glow, gloss, gradients) and redo it as a flat, real printed piece." },
  { ko: "목록에 없는 글자를 모두 지우고, 각 문구를 한 번씩만 정확히 써 줘.", en: "Remove any text that is not in the list and render each line exactly once." },
  { ko: "요소 수를 줄이고 여백을 늘려서 메인 비주얼 하나만 남겨 줘.", en: "Cut the number of elements, add negative space and keep only one hero visual." },
  { ko: "헤드라인을 더 크게, 나머지 글자는 작게 해서 위계를 분명히 해 줘.", en: "Make the headline bigger and the rest smaller so the hierarchy is obvious." },
  { ko: "한글 맞춤법이 틀린 글자를 목록 그대로 고쳐서 다시 만들어 줘.", en: "Fix any misspelled Korean text exactly as listed and regenerate." },
  { ko: "같은 디자인 시스템으로 9:16 스토리 사이즈 버전도 만들어 줘(위·아래 14%는 비우기).", en: "Make a 9:16 story version with the same design system (keep the top and bottom 14% clear)." },
];

export const byId = <T extends { id: string }>(list: T[], id: string | null | undefined) =>
  id ? list.find((item) => item.id === id) : undefined;
