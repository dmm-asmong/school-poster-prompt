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
  /** 스타일과 상관없이 이 홍보물이 꼭 지켜야 할 것 */
  essentials: Label;
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
    priority: ["title", "badge", "subtitle", "curriculum", "schedule", "price", "cta", "place", "instructor", "bio"],
    essentials: { ko: "수강생 모집 포스터라서 헤드라인이 가장 먼저 읽히고, 그다음 혜택·일정, 마지막에 신청 안내가 보여야 해", en: "an enrollment poster: the headline reads first, then the benefit and schedule, then the CTA" },
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
    priority: ["title", "instructor", "schedule", "place", "badge", "subtitle", "bio", "price", "cta", "curriculum"],
    essentials: { ko: "행사 안내라서 날짜와 장소를 한눈에 찾을 수 있어야 해", en: "an event announcement: date and venue must be easy to find at a glance" },
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
    priority: ["title", "subtitle", "badge", "curriculum", "schedule", "place", "price", "cta", "instructor", "bio"],
    fixed: { role: { ko: "스와이프 신호", en: "Swipe cue" }, text: "넘겨 보기 →" },
    essentials: { ko: "캐러셀 첫 장이라서 짧은 헤드라인이 한눈에 읽혀야 하고, 스와이프 신호(목록에 있을 때)는 오른쪽 아래에 작게", en: "the first slide of a carousel: the short headline must read at a glance; the swipe cue (if listed) small in the bottom-right corner" },
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
    priority: ["title", "badge", "subtitle", "instructor", "curriculum", "schedule", "place", "price", "bio", "cta"],
    essentials: { ko: "썸네일이라서 가로 120px로 줄여도 읽혀야 해 — 글자는 최대 2개 항목, 아주 크게", en: "a thumbnail that must stay readable when shown 120px wide — at most 2 text items, set huge" },
    hierarchy: { ko: "1순위 헤드라인, 2순위 라벨 배지 하나뿐", en: "primary = headline; secondary = one small label badge only" },
  },
  {
    id: "certificate",
    label: "수료증",
    emoji: "🎓",
    desc: "과정 수료 · 서명란",
    phrase: { ko: "과정 수료증", en: "course completion certificate" },
    platform: "a4",
    omit: ["place", "price", "cta", "bio", "badge"],
    maxText: 5,
    priority: ["title", "schedule", "instructor", "subtitle", "bio", "badge", "curriculum", "place", "price", "cta"],
    fixed: { role: { ko: "표제", en: "Heading" }, text: "수 료 증", first: true },
    essentials: { ko: "바로 인쇄해 나눠 줄 수료증이라서 수료자 이름 자리는 빈 밑줄로 남겨", en: "a certificate that will be printed and handed out directly, so leave the recipient name as a blank underline" },
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
    priority: ["instructor", "bio", "curriculum", "subtitle", "cta", "title", "badge", "schedule", "place", "price"],
    essentials: { ko: "강사 소개 카드라서 이름과 인물이 주인공", en: "an instructor profile card: the name and the portrait are the focus" },
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

/**
 * 디자인 스타일 (아트 디렉션). 스타일마다 서체·레이아웃·색 쓰는 법·질감이 따로 있어요.
 * palette / imagery / layout 안의 {B} 는 브랜드 컬러, {A} 는 포인트 색, {hero} 는 메인 장면으로 바뀝니다.
 */
export type Style = Option & {
  /** 아트 디렉션 한 줄 */
  brief: Label;
  /** 추천 서체와 글자 위계 */
  type: Label;
  /** 구도·배치 패턴 (포인트 문구·신청 안내를 어떻게 보여 줄지 포함) */
  layout: Label;
  /** 색 쓰는 법 */
  palette: Label;
  /** 질감·빛·그림자 */
  texture: Label;
  /** 메인 장면 표현 방식 */
  imagery: Label;
  /** 실사 사진 스타일 (주제별 '사진 장면'을 써요) */
  photo?: boolean;
  /** 인쇄용 정면 평면 작업물 */
  flat?: boolean;
};

export const STYLES: Style[] = [
  {
    id: "cinematic", label: "시네마틱 실사", emoji: "🎬", hint: "영화 포스터처럼", en: "full-bleed cinematic photo poster", photo: true,
    brief: { ko: "화면 전체를 채운 시네마틱 실사 사진 위에 글자를 얹은 포스터 — 영화 포스터나 프리미엄 브랜드 캠페인처럼", en: "a full-bleed cinematic photograph with typography overlaid — like a film poster or a premium brand campaign" },
    type: { ko: "헤드라인은 검은고딕·G마켓 산스 Bold 같은 굵고 좁은 한글 고딕을 아주 크게, 자간 촘촘하게. 위에는 자간을 넓힌 작은 키커 한 줄, 세부 정보는 작은 레귤러 고딕", en: "a condensed, heavy Korean gothic display face (in the style of Black Han Sans / Gmarket Sans Bold) for the headline, very large with tight tracking; a small, widely spaced kicker line above it; small regular sans for details" },
    layout: { ko: "사진이 가장자리까지 캔버스 전체를 채움. 글자는 사진에서 가장 어둡고 비어 있는 곳(보통 왼쪽 아래)에 한 덩어리로: 카피를 작은 키커로 → 헤드라인 → 정보 한 줄(일정·장소). 포인트 문구는 반대쪽 모서리에 {B} 둥근 고무 도장 스티커로. 글자 뒤에 상자·패널 없음", en: "the photo fills the entire canvas edge to edge; text sits in the photo's darkest, emptiest area (usually bottom-left) as one tight block: the Tagline as a small kicker → the headline → one detail line (schedule · place); the Badge item as a round rubber-stamp sticker in {B} in the opposite corner; no boxes or panels behind the text" },
    palette: { ko: "사진 자체의 자연스럽고 살짝 차가운 색보정이 팔레트. 글자는 흰색, {B}는 도장이나 강조 하나에만", en: "the photograph's own natural, slightly cool color grade carries the palette; text in white; {B} only on the stamp or one highlight" },
    texture: { ko: "실제 사진의 입자감과 심도, 창가·실내 조명의 자연광과 진짜 그림자", en: "real photographic grain and depth of field; natural window or practical light with real shadows" },
    imagery: { ko: "CGI가 아닌 실제 스냅 사진 한 장: {hero}. 영화 스틸처럼 낮은 조도, 글자를 놓을 어두운 여백 넉넉히", en: "one real, candid photograph (not CGI): {hero}; shot like a film still in low-key light, with plenty of dark negative space for the type" },
  },
  {
    id: "magazine", label: "매거진 명조", emoji: "📰", hint: "세련·에디토리얼", en: "editorial magazine cover", photo: true,
    brief: { ko: "한국 에디토리얼 매거진 표지 — 크림색 비코팅 종이, 품격 있는 명조 타이포, 실물 오브젝트 사진 콜라주", en: "a Korean editorial magazine cover — cream uncoated paper, refined serif typography and a real-object photo collage" },
    type: { ko: "헤드라인은 Noto Serif KR ExtraBold·마루 부리 같은 대비 강한 한글 명조. 포인트 문구는 콜라주 뒤에 일부 가려지는 거대한 명조 숫자로. 정보 줄은 작고 단정한 고딕", en: "a high-contrast Korean Myeongjo serif (in the style of Noto Serif KR ExtraBold / Maru Buri) for the headline; the Badge item as a giant serif numeral partly tucked behind the collage; a small, clean sans for the info line" },
    layout: { ko: "잡지 표지처럼 좌우 대칭 가운데 정렬: 위에 헤드라인, 가운데 뒤쪽에 거대한 숫자, 그 위로 겹치는 오브젝트 콜라주, 아래 카피, 그 아래 얇은 선 사이에 정보 한 줄(세로 막대로 구분), 맨 아래 짧은 {A} 선", en: "centered and symmetrical like a magazine cover: headline across the top, the giant numeral behind the middle, the object collage overlapping it, tagline below, then one info line between thin hairline rules (items separated by vertical bars) and a short {A} rule at the very bottom" },
    palette: { ko: "크림색 종이 배경, 헤드라인과 숫자는 {B}, 포인트는 얇은 {A} 선 하나, 오브젝트는 자연색", en: "cream paper background; headline and numeral in {B}; a single thin {A} rule as the only accent; objects in their natural colors" },
    texture: { ko: "비코팅 종이 결, 콜라주한 오브젝트 아래 부드러운 실제 그림자", en: "uncoated paper grain, soft real shadows under the collaged objects" },
    imagery: { ko: "실물을 촬영해 오려 붙인 콜라주: {hero}. 잡지 정물 화보처럼", en: "a cut-out collage of real photographed objects: {hero}, placed like a magazine still life" },
  },
  {
    id: "newspaper", label: "신문 1면", emoji: "🗞️", hint: "기업교육·공지", en: "broadsheet newspaper front page", photo: true,
    brief: { ko: "신문 1면 — 신문 용지, 제호, 단 나눔 그리드, 망점 다큐멘터리 사진", en: "a broadsheet newspaper front page — newsprint paper, masthead, column grid and a documentary halftone photo" },
    type: { ko: "헤드라인은 굵은 한글 명조를 전체 폭에 걸쳐 크게. 제호는 이중선 사이 작은 명조, 정보는 촘촘한 명조", en: "a heavy Korean Myeongjo headline set across the full width; the masthead in a smaller serif between double rules; info in a compact serif" },
    layout: { ko: "포인트 문구가 맨 위 이중선 사이 제호. 그 아래 헤드라인이 모든 단에 걸침. 아래는 3단: 양옆 단은 읽을 수 없는 회색 막대(본문 자리), 가운데 단은 망점 사진, 오른쪽 아래 {B} 테두리 사이드 박스에 강의 정보(카피·일정·장소)", en: "the Badge item is the masthead between double rules at the top; the headline spans all columns below; then a 3-column grid: plain grey bars standing in for body text in the side columns (no readable text), the halftone photo in the center column, and the class info (tagline, schedule, place) in a {B} outlined sidebar box at bottom-right" },
    palette: { ko: "미색 신문 용지와 검정 잉크, {B}는 사이드 박스 테두리와 그 안 글자에만", en: "off-white newsprint and black ink; {B} only for the sidebar box border and its text" },
    texture: { ko: "신문 용지 결, 거친 흑백 망점, 살짝 고르지 않은 잉크", en: "newsprint grain, coarse black-and-white halftone dots, slightly uneven ink" },
    imagery: { ko: "흑백 다큐멘터리 보도사진 한 장: {hero}", en: "one black-and-white documentary news photo: {hero}" },
  },
  {
    id: "flatlay", label: "데스크 플랫레이", emoji: "☕", hint: "차분·감성", en: "overhead flat-lay lifestyle photo", photo: true,
    brief: { ko: "위에서 내려다본 플랫레이 라이프스타일 사진 — 북유럽·일본풍의 산뜻한 책상, 빈 바닥 위에 글자", en: "an overhead flat-lay lifestyle photograph — an airy Scandinavian-Japanese desk scene with typography placed on the empty surface" },
    type: { ko: "헤드라인은 Noto Serif KR Light 같은 가늘고 우아한 한글 명조, 부제는 작고 깨끗한 고딕. 두꺼운 굵기 없음", en: "a light, elegant Korean Myeongjo (in the style of Noto Serif KR Light) for the headline; a small, clean sans for the subline; no heavy weights" },
    layout: { ko: "정면 부감 촬영, 소품은 가장자리와 모서리로 밀어 둠. 헤드라인과 부제는 왼쪽 위 빈 책상 위에, 포인트 문구(가격·혜택)는 오른쪽 아래 작은 {B} 단색 태그로. 여백 넉넉히", en: "a top-down shot with the objects pushed to the edges and corners; the headline and subline sit top-left on empty desk surface; the Badge item (price/offer) as a small solid {B} tag at bottom-right; lots of open space" },
    palette: { ko: "밝은 오크 나무, 흰색, 리넨, 도자기 톤. {B}는 작은 태그에만", en: "natural light oak, white, linen and ceramic tones; {B} appears only on the small tag" },
    texture: { ko: "한쪽에서 드는 실제 자연광, 부드러운 그림자, 진짜 나뭇결", en: "real daylight from one side, soft natural shadows, true wood grain" },
    imagery: { ko: "실제 부감 플랫레이 사진: {hero}", en: "a real overhead flat-lay photograph: {hero}" },
  },
  {
    id: "brutal", label: "네오 브루탈", emoji: "⬛", hint: "강렬·대담", en: "neo-brutalist block-grid poster",
    brief: { ko: "네오 브루탈리즘 포스터 — 굵은 검정 테두리, 딱딱한 모듈 블록 그리드, 거대한 글자, 장식 없음", en: "a neo-brutalist poster — thick black borders, a hard modular block grid, giant type, zero decoration" },
    type: { ko: "포인트 문구는 거대한 굵은 그로테스크 숫자, 헤드라인은 Pretendard Black 같은 아주 굵은 한글 고딕, 목록·작은 정보는 모노스페이스", en: "giant heavy grotesque numerals for the Badge item; an extra-heavy Korean gothic (in the style of Pretendard Black) for the headline; a monospace face for lists and small data" },
    layout: { ko: "캔버스를 굵은(폭의 약 1%) 검정 선으로 직사각형 블록들로 나눔. 가장 큰 블록에 포인트 문구를 거대하게, 헤드라인은 자기 블록에, 커리큘럼은 슬래시로 구분한 모노스페이스 한 줄, 일정·수강료는 아래 반전 블록(검정 바탕 흰 글자, 검정 바탕 {B} 글자)", en: "the canvas is divided into rectangular blocks by thick (≈1% of width) black borders; the Badge item fills the largest block at huge size; the headline gets its own block; the curriculum runs as one monospace line separated by slashes; schedule and price sit in inverted blocks at the bottom (white on black, and {B} on black)" },
    palette: { ko: "순백과 검정, 색은 {B} 하나만 원색 그대로", en: "pure white and black, with {B} as the only color, used at full strength" },
    texture: { ko: "평평한 인쇄, 칼같이 선명한 모서리, 그림자·그라데이션 없음", en: "flat print, perfectly crisp edges, no shadows, no gradients" },
    imagery: { ko: "{hero} — 한 칸 안에 검정 블록 도형으로", en: "{hero}, drawn as solid black blocky shapes inside one grid cell" },
  },
  {
    id: "gouache", label: "그림책 과슈", emoji: "🖌️", hint: "따뜻·친근", en: "gouache picture-book illustration",
    brief: { ko: "손으로 그린 과슈 그림책 일러스트 — 따뜻하고 사람 냄새 나는, 한국 그림책 펼침면 같은", en: "a hand-painted gouache picture-book illustration — warm, human and gentle, like a Korean picture-book spread" },
    type: { ko: "배민 주아 같은 부드럽고 둥근 한글 고딕을 진한 갈색으로 크게(아주 읽기 쉽게), 정보 줄은 작은 둥근 고딕", en: "a soft, rounded Korean gothic (in the style of Jua) in dark brown, large and very easy to read; a small rounded sans for the info line" },
    layout: { ko: "그림 장면이 캔버스 전체를 채움. 위 가운데 차분한 벽면에 헤드라인, 그 아래 정보 한 줄(일정·장소·수강료를 가운뎃점으로 구분), 신청 안내는 말하는 인물 옆 {B} 말풍선 안에", en: "the illustrated scene fills the canvas; the headline is centered at the top on a calm wall area, the info line (schedule · place · price separated by middots) under it, and the CTA inside a {B} speech bubble next to the speaking character" },
    palette: { ko: "따뜻한 버터 옐로·크림 벽, 부드러운 초록과 라일락, {B} 말풍선", en: "warm butter-yellow and cream walls, soft greens and lilacs; {B} for the speech bubble" },
    texture: { ko: "보이는 과슈 붓 자국과 종이 질감, 창으로 드는 부드럽게 칠한 빛", en: "visible gouache brush strokes and paper texture, soft painted light from a window" },
    imagery: { ko: "그린 장면 하나: {hero}. 인물은 단순하고 다정한 얼굴로", en: "one painted scene: {hero}; characters with kind, simple faces" },
  },
  {
    id: "classic", label: "클래식 인쇄물", emoji: "📜", hint: "A4 안내문", en: "classic formal print document", flat: true,
    brief: { ko: "격식 있는 클래식 인쇄물 — 정면에서 본 평면 작업물이 캔버스를 가장자리까지 채움(인쇄 원고 그대로)", en: "a classic, formal printed document — flat, front-facing artwork that fills the canvas edge to edge, exactly like the print file" },
    type: { ko: "표제는 Noto Serif KR 같은 전통 한글 명조를 크게, 자간을 넓게. 나머지도 크기만 줄인 명조", en: "a traditional Korean Myeongjo (in the style of Noto Serif KR) for the heading, large and generously letter-spaced; smaller Myeongjo for everything else" },
    layout: { ko: "섬세한 길로셰 무늬 테두리(모서리 장식) 안에 좌우 대칭 가운데 정렬: 위 작은 원형 엠블럼, 표제, 장식 구분선, 과정명·제목, 이름을 쓸 빈 밑줄, 문구, 아래 왼쪽 날짜, 아래 오른쪽 서명 줄, 오른쪽 아래 평면 금색 인장", en: "a fine guilloche border with corner ornaments; a symmetrical, centered layout inside it: a small round emblem at the top, the heading, an ornamental divider, the course name/title, a blank underline for a name, the statement line, the date bottom-left, a signature line bottom-right and a flat gold seal at lower-right" },
    palette: { ko: "크림색 종이 바탕, 테두리와 글자는 {B} 잉크, 인장은 평면 금색", en: "cream paper background; border and type in {B} ink; a flat gold seal" },
    texture: { ko: "아주 은은한 종이 결만. 원근·그림자·조명 효과 없음", en: "only a very subtle paper grain; no perspective, no shadows, no lighting effects" },
    imagery: { ko: "{hero}", en: "{hero}" },
  },
  {
    id: "interview", label: "흑백 인터뷰", emoji: "🎙️", hint: "강사 프로필", en: "black-and-white magazine interview spread", photo: true,
    brief: { ko: "흑백 매거진 인터뷰 펼침면 — 실제 에디토리얼 인물 사진과 조용한 명조 인용문", en: "a black-and-white magazine interview spread — a real editorial portrait beside a quiet serif pull-quote" },
    type: { ko: "인용문은 Noto Serif KR 같은 한글 명조를 크게, 둥근 따옴표와 함께. 이름·소개·태그·연락처는 작고 가는 고딕", en: "a Korean Myeongjo (in the style of Noto Serif KR) for the pull-quote, large with curly quotation marks; a small, light sans for the name, bio, tags and contact" },
    layout: { ko: "펼침면 분할: 왼쪽 약 48%를 인물 사진이 가장자리까지 채움. 오른쪽은 차분한 미색 종이에 인용문을 가운데, 그 아래 짧고 가는 {B} 선, 이어서 이름·소개·분야(가운뎃점 구분)·연락처를 작게 가운데 정렬", en: "a split spread: the portrait fills the left ~48% edge to edge; the right side is calm off-white paper with the pull-quote centered, a short thin {B} rule below it, then name, bio, topics (separated by middots) and contact as small centered lines" },
    palette: { ko: "흑백 사진, 따뜻한 미색 종이, 검정 글자, {B}는 가는 선 하나에만", en: "black-and-white photo, warm off-white paper, black text; {B} only for the thin rule" },
    texture: { ko: "사진의 고운 필름 입자, 무광 종이", en: "fine film grain in the photo, matte paper" },
    imagery: { ko: "실제 흑백 에디토리얼 인물 사진: {hero}", en: "a real black-and-white editorial portrait: {hero}" },
  },
  {
    id: "youtube", label: "유튜브 썸네일", emoji: "▶️", hint: "가독성 최우선", en: "Korean YouTube thumbnail", photo: true,
    brief: { ko: "한국 테크 유튜버 썸네일 — 가독성 최우선, 강한 대비, 어둡게 깐 실사 배경", en: "a Korean tech-YouTuber thumbnail — maximum legibility and contrast over a darkened real photo" },
    type: { ko: "G마켓 산스 Bold·검은고딕 같은 아주 굵은 한글 고딕을 거대하게, 흰 글자에 두꺼운 검정 외곽선과 그림자. 핵심 문구는 {B} 단색 강조 박스 안에", en: "huge, extra-heavy Korean gothic (in the style of Gmarket Sans Bold / Black Han Sans), white with a thick black outline and drop shadow; the key phrase set inside a solid {B} highlight box" },
    layout: { ko: "헤드라인을 왼쪽 2/3에 큰 두 줄로, 둘째 줄은 {B} 박스 안에. 포인트 문구는 오른쪽 위 모서리 작은 {A} 태그. 배경 사진은 어둡고 흐리게 해서 글자가 튀게", en: "the headline breaks into 2 big lines across the left two-thirds, the second line inside the {B} box; the Badge item as a small {A} tag in the top-right corner; the background photo darkened and blurred so the type pops" },
    palette: { ko: "어둡고 채도 낮춘 배경 사진, 흰 글자, {B} 강조 박스, {A} 태그", en: "a dark, desaturated background photo; white type; {B} highlight box; {A} tag" },
    texture: { ko: "실제 사진, 얕은 심도, 약 50% 어둡게", en: "a real photo with shallow depth of field, darkened about 50%" },
    imagery: { ko: "어둡고 초점이 나간 실제 사진: {hero}", en: "a real photograph, darkened and out of focus: {hero}" },
  },
  {
    id: "riso", label: "리소 진(zine)", emoji: "🖨️", hint: "개성·캠퍼스", en: "two-ink risograph zine", photo: true,
    brief: { ko: "잉크 2색 리소그래프 캠퍼스 진 — 형광 잉크, 망점 사진, 굵은 세로쓰기", en: "a two-ink risograph campus zine — fluorescent ink, a halftone photo and bold vertical type" },
    type: { ko: "헤드라인은 굵은 한글 고딕을 오른쪽 가장자리를 따라 위에서 아래로 세로쓰기, 정보 칸은 미디엄 고딕", en: "a heavy Korean gothic headline set vertically (top to bottom) along the right edge; a medium gothic for the info column" },
    layout: { ko: "세 구역: 왼쪽 좁은 칸에 정보 줄을 위아래로(연사, 카피, 일시, 장소, 참가 안내), 가운데 큰 망점 사진, 오른쪽 가장자리를 따라 세로 헤드라인", en: "three zones: a narrow left column of stacked info lines (speaker, tagline, date, place, price), a large halftone photo in the center, and the vertical headline running down the right edge" },
    palette: { ko: "정확히 잉크 2색: 사진은 {B}, 글자는 {A}, 미색 재생지 위", en: "exactly two inks — {B} for the photo and {A} for the type — on off-white recycled paper" },
    texture: { ko: "리소 입자, 망점, 두 잉크 사이 살짝 어긋난 판", en: "riso grain, halftone dots, slight misregistration between the two inks" },
    imagery: { ko: "잉크 한 색으로 찍은 망점 사진: {hero}", en: "a halftone photo printed in one ink: {hero}" },
  },
  {
    id: "collage", label: "종이 콜라주", emoji: "✂️", hint: "손맛·발랄", en: "handmade paper collage", photo: true,
    brief: { ko: "손으로 만든 종이 콜라주 — 오리고 찢은 종이, 마스킹 테이프, 실제 공작 소품을 색지 위에, 발랄하고 손에 잡힐 듯", en: "a handmade paper collage — cut and torn paper, masking tape and real craft objects on colored paper, playful and tactile" },
    type: { ko: "헤드라인은 색 펠트·색지를 오려 만든 통통하고 둥근 손글씨, 단어마다 다른 색. 정보는 찢은 종이 라벨 위 친근한 고딕", en: "chunky, rounded hand-lettering cut from colored felt or paper, each word in a different color; info in a friendly sans on a torn-paper label" },
    layout: { ko: "가운데 쌓기: 가운데 손글씨 헤드라인, 그 아래 찢은 흰 종이 띠에 카피. 공작 소품은 모서리 쪽에 흩어 두고 글자를 가리지 않게", en: "a centered stack: the hand-lettered headline in the middle, the tagline on a torn white paper strip below; craft objects scattered toward the corners, never covering the text" },
    palette: { ko: "{B} 색지 배경, 글자는 빨강·파랑·노랑 색지에 {A}를 조금", en: "{B} colored paper as the background; lettering in red, blue and yellow paper with touches of {A}" },
    texture: { ko: "실제 종이 섬유, 찢긴 가장자리, 마스킹 테이프, 조각마다 부드러운 자연 그림자", en: "real paper fibers, torn edges, masking tape, soft natural shadows under each piece" },
    imagery: { ko: "위에서 촬영한 실제 공작 소품: {hero}", en: "real craft objects photographed from above: {hero}" },
  },
  {
    id: "retro", label: "90s 레트로 OS", emoji: "💾", hint: "개발·IT", en: "tasteful 90s retro OS interface",
    brief: { ko: "세련된 90년대 레트로 운영체제 UI — 점 격자 위 입체 테두리 회색 창, 고전 데스크톱 같은", en: "a tasteful 90s retro operating-system UI — bevelled grey windows on a dotted grid, like a classic desktop" },
    type: { ko: "헤드라인은 갈무리·둥근모꼴 같은 픽셀(비트맵) 한글 서체, 창 제목 표시줄과 아래 정보 띠는 모노스페이스", en: "a pixel/bitmap Korean display face (in the style of Galmuri / DungGeunMo) for the headline; a monospace face for the window title bar and the bottom info strip" },
    layout: { ko: "메인 창(제목 표시줄에 카피, 창 버튼)에 큰 픽셀 헤드라인, 작은 별표가 있는 가는 선, 입체 버튼 모양의 신청 안내. 그 뒤로 비주얼이 든 작은 두 번째 창이 겹침(제목 표시줄은 비움). 맨 아래 모노스페이스 정보 띠 한 줄(커리큘럼을 화살표로 잇고, 일정·장소를 점으로 구분)", en: "a main window with a title bar (carrying the tagline) and window buttons holds the big pixel headline, a thin rule with a small asterisk, and the CTA as a bevelled 3D button; a smaller second window overlaps behind it with the visual (its title bar left empty); one monospace info strip runs along the bottom (curriculum joined by arrows, then schedule and place separated by dots)" },
    palette: { ko: "베이지 점 격자 배경, 밝은 회색 창, 검정 글자, 그림과 화살표는 {B} 잉크, 작은 별표는 {A}", en: "a beige dotted-grid background, light grey windows, black text; {B} ink for the drawing and arrows; {A} for small asterisks" },
    texture: { ko: "평면 UI, 선명한 1px 입체 테두리, 딱딱한 창 그림자", en: "flat UI with crisp 1px bevels and a hard offset window shadow" },
    imagery: { ko: "{hero} — 두 번째 창 안에 {B} 잉크 손그림으로", en: "{hero}, sketched in {B} ink inside the second window" },
  },
  {
    id: "swiss", label: "스위스 그리드", emoji: "📐", hint: "정돈·신뢰", en: "Swiss / International Typographic Style",
    brief: { ko: "스위스(인터내셔널) 타이포그래피 스타일 — 엄격한 모듈 그리드, 비대칭, 큰 색면, 강한 크기 대비", en: "Swiss / International Typographic Style — a strict modular grid, asymmetry, big color fields and strong scale contrast" },
    type: { ko: "Pretendard 같은 네오 그로테스크 한글 고딕. 헤드라인은 아주 굵고 크게, 나머지는 작게 — 크기 대비를 과감하게", en: "a neo-grotesque Korean gothic (in the style of Pretendard); the headline very bold and large, everything else small — dramatic scale contrast" },
    layout: { ko: "비대칭 모듈 그리드: 헤드라인이 폭의 2/3를 가로지르고, 비주얼은 큰 기하 도형으로 그리드 칸을 채우거나 가장자리 밖으로 잘림. 정보는 가는 선으로 나눈 그리드 칸에, 신청 안내는 단색 알약 버튼", en: "an asymmetric modular grid: the headline spans two-thirds of the width; the visual fills grid cells as large geometric shapes or bleeds off an edge; info sits in grid cells divided by hairline rules; the CTA as a solid pill" },
    palette: { ko: "{B}를 화면 전체 색면이나 큰 블록으로 과감하게, 글자는 흰색·검정, {A}는 작은 포인트", en: "{B} used boldly as a full-bleed field or large block; white and black type; {A} as a small spot" },
    texture: { ko: "평면 인쇄, 선명한 모서리", en: "flat print, crisp edges" },
    imagery: { ko: "{hero} — 평면 기하 도형으로", en: "{hero}, as flat geometric shapes" },
  },
  {
    id: "saas", label: "SaaS 플랫", emoji: "🧩", hint: "친근·깔끔", en: "flat SaaS-style illustration",
    brief: { ko: "잘 만든 SaaS 랜딩 페이지(노션·슬랙·토스) 스타일의 플랫 일러스트 — 제한된 팔레트, 단순한 형태, 일정한 선", en: "flat illustration in the style of a top SaaS landing page (Notion, Slack, Toss) — limited palette, simple forms, consistent line weight" },
    type: { ko: "Pretendard SemiBold~Bold 같은 둥글고 친근한 한글 고딕, 헤드라인과 본문 크기 대비 뚜렷하게", en: "a friendly, rounded Korean sans (in the style of Pretendard SemiBold–Bold), with a clear size step between headline and body" },
    layout: { ko: "헤드라인과 카피를 위에, 그 아래 큰 일러스트 장면이 주인공. 정보는 일러스트 아래 짧은 줄로, 신청 안내는 둥근 버튼", en: "headline and tagline on top, a large illustrated scene as the hero below; info as short lines under the illustration; the CTA as a rounded button" },
    palette: { ko: "밝은 배경, 일러스트는 {B}와 {A} 위주의 3~4색", en: "a light background; the illustration in 3–4 colors led by {B} and {A}" },
    texture: { ko: "플랫 벡터, 일정한 2px 선", en: "flat vector with a consistent 2px line" },
    imagery: { ko: "플랫 벡터 일러스트: {hero}", en: "a flat vector illustration: {hero}" },
  },
];

/** 스타일을 고르지 않았을 때 홍보물·사이즈에 맞춰 쓰는 기본 스타일 */
export const DEFAULT_STYLE: Record<OutputId, string> = {
  recruit: "cinematic",
  seminar: "magazine",
  cardnews: "collage",
  thumbnail: "youtube",
  certificate: "classic",
  profile: "interview",
};

export function resolveStyle(styleId: string | null, output: OutputId, print = false): Style {
  const chosen = styleId ? STYLES.find((s) => s.id === styleId) : undefined;
  if (chosen) return chosen;
  const id = output === "certificate" || print ? "classic" : DEFAULT_STYLE[output];
  return STYLES.find((s) => s.id === id) ?? STYLES[0];
}

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
  { id: "forest", label: "포레스트", hex: "#1F4A35", en: "deep forest green", accent: "#8C2A2A", accentEn: "burgundy" },
  { id: "pink", label: "핑크", hex: "#FF4F9A", en: "fluorescent pink", accent: "#1F6FB2", accentEn: "teal blue" },
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
  { ko: "빛 번짐·광택·떠다니는 아이콘 같은 AI 느낌 효과를 모두 빼고, 실제로 촬영하거나 인쇄한 결과물처럼 다시 만들어 줘.", en: "Remove every AI-looking effect (glow, gloss, floating icons) and redo it so it looks really photographed or printed." },
  { ko: "목록에 없는 글자를 모두 지우고, 각 문구를 한 번씩만 정확히 써 줘.", en: "Remove any text that is not in the list and render each line exactly once." },
  { ko: "뻔한 템플릿처럼 보이지 않게, 같은 스타일 안에서 구도를 더 과감하게 바꿔 줘.", en: "Make the composition bolder and less template-like while keeping the same style." },
  { ko: "헤드라인을 더 크게, 나머지 글자는 작게 해서 위계를 분명히 해 줘.", en: "Make the headline bigger and the rest smaller so the hierarchy is obvious." },
  { ko: "한글 맞춤법이 틀린 글자를 목록 그대로 고쳐서 다시 만들어 줘.", en: "Fix any misspelled Korean text exactly as listed and regenerate." },
  { ko: "같은 디자인 시스템으로 9:16 스토리 사이즈 버전도 만들어 줘(위·아래 14%는 비우기).", en: "Make a 9:16 story version with the same design system (keep the top and bottom 14% clear)." },
];

export const byId = <T extends { id: string }>(list: T[], id: string | null | undefined) =>
  id ? list.find((item) => item.id === id) : undefined;
