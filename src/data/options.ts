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
  /** 이 홍보물에 맞는 구도 · 글자 배치 */
  layout: Label;
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
    omit: [],
    layout: {
      ko: "강의 제목을 가장 크게, 커리큘럼은 체크 아이콘 목록으로, 일정·수강료·신청 방법은 하단 정보 영역에 정리해 줘",
      en: "make the course title the largest element, show the curriculum as a checklist with icons, and group schedule, price and how to apply in a clean info block at the bottom",
    },
  },
  {
    id: "seminar",
    label: "특강·세미나 안내",
    emoji: "🎤",
    desc: "연사 · 일시 · 장소 중심",
    phrase: { ko: "특강·세미나 안내 포스터", en: "special lecture and seminar announcement poster" },
    platform: "feed",
    omit: ["price"],
    layout: {
      ko: "연사(강사) 영역을 크게 두고, 세미나 주제와 일시·장소를 행사 안내처럼 또렷하게 배치해 줘",
      en: "give the speaker a prominent area, and lay out the seminar topic, date and venue clearly like an event announcement",
    },
  },
  {
    id: "cardnews",
    label: "카드뉴스 표지",
    emoji: "🗂️",
    desc: "첫 장에서 스와이프 유도",
    phrase: { ko: "카드뉴스 첫 장 표지", en: "card news cover slide (first slide of a carousel)" },
    platform: "feed",
    omit: ["schedule", "place", "price", "cta"],
    layout: {
      ko: "짧고 강한 헤드라인 하나가 화면을 채우게 하고, 오른쪽 아래에 '넘겨 보기 →' 같은 스와이프 신호를 작게 넣어 줘",
      en: "let one short, bold headline dominate the slide, and add a small swipe cue such as '넘겨 보기 →' in the bottom-right corner",
    },
  },
  {
    id: "thumbnail",
    label: "SNS 썸네일",
    emoji: "▶️",
    desc: "유튜브 · 블로그 대표이미지",
    phrase: { ko: "유튜브·블로그 썸네일", en: "YouTube and blog thumbnail" },
    platform: "youtube",
    omit: ["schedule", "place", "price", "instructor", "bio", "cta"],
    layout: {
      ko: "작은 화면에서도 읽히게 2~6단어의 아주 큰 글자와 강한 대비를 쓰고, 한쪽에 주제를 상징하는 큰 오브젝트나 강사 자리를 둬",
      en: "use huge 2–6 word text with strong contrast so it reads at small sizes, with a large symbolic object or a spot for the instructor on one side",
    },
  },
  {
    id: "certificate",
    label: "수료증",
    emoji: "🎓",
    desc: "과정 수료 · 서명란",
    phrase: { ko: "과정 수료증", en: "course completion certificate" },
    platform: "a4l",
    omit: ["place", "price", "cta", "subtitle"],
    layout: {
      ko: "격식 있는 테두리와 엠블럼, 가운데 큰 '수료증' 글자, 수료자 이름이 들어갈 빈 줄, 아래쪽에 날짜와 강사 서명란을 넣어 줘",
      en: "use an elegant border and emblem, a large centered '수료증' heading, an empty line for the graduate's name, and the date with an instructor signature line at the bottom",
    },
  },
  {
    id: "profile",
    label: "강사 프로필 카드",
    emoji: "🪪",
    desc: "섭외 · 소개용 명함 카드",
    phrase: { ko: "강사 프로필 카드", en: "instructor profile card" },
    platform: "feed",
    omit: ["schedule", "place", "price"],
    layout: {
      ko: "강사 사진(또는 일러스트) 영역을 크게 두고, 이름과 한 줄 소개, 강의 분야를 태그처럼 정리하고 연락처·링크는 맨 아래에 둬",
      en: "give the instructor photo (or illustration) a large area, then the name, one-line bio and teaching topics as tags, with contact or link at the bottom",
    },
  },
];

/** 플랫폼 사이즈 → 프롬프트 비율 */
export type Platform = { id: string; label: string; emoji: string; ratio: string; px: string; en: string };

export const PLATFORMS: Platform[] = [
  { id: "feed", label: "인스타 피드", emoji: "📷", ratio: "4:5", px: "1080×1350", en: "Instagram feed post" },
  { id: "story", label: "스토리·릴스", emoji: "📱", ratio: "9:16", px: "1080×1920", en: "Instagram story / Reels cover" },
  { id: "threads", label: "스레드", emoji: "🧵", ratio: "1:1", px: "1080×1080", en: "Threads post" },
  { id: "youtube", label: "유튜브 썸네일", emoji: "▶️", ratio: "16:9", px: "1280×720", en: "YouTube thumbnail" },
  { id: "blog", label: "블로그 대표", emoji: "✍️", ratio: "1.91:1", px: "1200×630", en: "blog cover / link preview image" },
  { id: "a4", label: "A4 세로", emoji: "📄", ratio: "1:1.414", px: "210×297mm", en: "A4 portrait print poster" },
  { id: "a4l", label: "A4 가로", emoji: "📃", ratio: "1.414:1", px: "297×210mm", en: "A4 landscape print" },
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
  { id: "live", label: "온라인 라이브", emoji: "🔴", en: "live online class (real-time video)" },
  { id: "offline", label: "오프라인", emoji: "🏫", en: "in-person class" },
  { id: "vod", label: "VOD", emoji: "🎬", en: "on-demand video course (VOD)" },
  { id: "hybrid", label: "하이브리드", emoji: "🔀", en: "hybrid class (in-person + live online)" },
];

export const MOODS: Option[] = [
  { id: "trust", label: "신뢰감 있는", emoji: "🤝", en: "trustworthy and professional" },
  { id: "energy", label: "열정적인", emoji: "🔥", en: "energetic and motivating" },
  { id: "friendly", label: "친근한", emoji: "😊", en: "friendly and approachable" },
  { id: "premium", label: "고급스러운", emoji: "💎", en: "premium and refined" },
  { id: "future", label: "미래지향적", emoji: "🛰️", en: "futuristic and innovative" },
  { id: "calm", label: "차분한", emoji: "🍃", en: "calm and focused" },
];

export const STYLES: Option[] = [
  { id: "minimal", label: "미니멀", emoji: "◻️", en: "clean minimal layout with generous white space and a strict grid" },
  { id: "tech", label: "테크/IT", emoji: "💻", en: "dark tech aesthetic with code snippets, terminal windows and subtle neon glow" },
  { id: "business", label: "신뢰감 비즈니스", emoji: "📊", en: "corporate business design with solid color blocks, charts and crisp sans-serif type" },
  { id: "illust", label: "친근한 일러스트", emoji: "🖍️", en: "friendly flat vector illustration with rounded shapes and soft colors" },
  { id: "3d", label: "3D 오브젝트", emoji: "🧊", en: "glossy 3D rendered icons and objects with soft studio lighting" },
  { id: "gradient", label: "그라데이션", emoji: "🌈", en: "vivid mesh gradient background with glassmorphism cards" },
  { id: "photo", label: "실사 사진", emoji: "📸", en: "realistic editorial photography of a modern classroom or workspace" },
  { id: "bold", label: "볼드 타이포", emoji: "🅰️", en: "bold typographic layout where large Korean lettering is the main visual" },
];

export type BrandColor = { id: string; label: string; hex: string; en: string };

export const BRAND_COLORS: BrandColor[] = [
  { id: "navy", label: "네이비", hex: "#1E3A8A", en: "deep navy" },
  { id: "blue", label: "블루", hex: "#2563EB", en: "bright blue" },
  { id: "teal", label: "틸", hex: "#0D9488", en: "teal" },
  { id: "green", label: "그린", hex: "#16A34A", en: "fresh green" },
  { id: "lime", label: "라임", hex: "#A3E635", en: "electric lime" },
  { id: "yellow", label: "옐로", hex: "#FACC15", en: "warm yellow" },
  { id: "orange", label: "오렌지", hex: "#F97316", en: "vivid orange" },
  { id: "red", label: "레드", hex: "#DC2626", en: "strong red" },
  { id: "purple", label: "퍼플", hex: "#7C3AED", en: "violet purple" },
  { id: "black", label: "블랙", hex: "#111827", en: "near-black charcoal" },
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
  { ko: "제목 글자를 더 크고 굵게, 나머지 글자는 줄여 줘.", en: "Make the title bigger and bolder and shrink the other text." },
  { ko: "한글 맞춤법이 틀린 글자를 그대로 고쳐서 다시 만들어 줘.", en: "Fix any misspelled Korean text exactly as given and regenerate." },
  { ko: "여백을 넓히고 요소 수를 줄여서 더 깔끔하게 해 줘.", en: "Add more white space and remove some elements for a cleaner look." },
  { ko: "브랜드 컬러를 더 확실하게, 배경은 차분하게 바꿔 줘.", en: "Use the brand color more clearly and calm down the background." },
  { ko: "같은 디자인으로 9:16 스토리 사이즈 버전도 만들어 줘.", en: "Make a 9:16 story-size version with the same design." },
];

export const byId = <T extends { id: string }>(list: T[], id: string | null | undefined) =>
  id ? list.find((item) => item.id === id) : undefined;
