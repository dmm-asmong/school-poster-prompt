/** 다국어 라벨 (한국어 + 영어 프롬프트용) */
export type Label = { ko: string; en: string };

export type Option = Label & { id: string; emoji?: string };

export const SCHOOL_LEVELS: Option[] = [
  { id: "daycare", ko: "어린이집", en: "daycare center", emoji: "🧸" },
  { id: "kinder", ko: "유치원", en: "kindergarten", emoji: "🎈" },
  { id: "elementary", ko: "초등학교", en: "elementary school", emoji: "🎒" },
  { id: "middle", ko: "중학교", en: "middle school", emoji: "📘" },
  { id: "high", ko: "고등학교", en: "high school", emoji: "🎓" },
];

export const AUDIENCES: Option[] = [
  { id: "all", ko: "전교생", en: "the whole student body" },
  { id: "lower", ko: "저학년", en: "younger grades" },
  { id: "upper", ko: "고학년", en: "older grades" },
  { id: "grade", ko: "특정 학년", en: "a single grade" },
  { id: "freshmen", ko: "신입생", en: "new students" },
  { id: "seniors", ko: "졸업반", en: "graduating students" },
  { id: "parents", ko: "학부모", en: "parents" },
  { id: "staff", ko: "교직원", en: "teachers and staff" },
  { id: "community", ko: "지역 주민", en: "local residents" },
];

export type Purpose = Option & {
  /** 프롬프트 첫 문장에 들어갈 결과물 이름 (항상 '이미지'로 끝나게) */
  phrase: Label;
  defaultRatio: string;
};

export const PURPOSES: Purpose[] = [
  {
    id: "poster",
    ko: "홍보 포스터",
    en: "promo poster",
    emoji: "📣",
    phrase: { ko: "홍보 포스터 이미지", en: "promotional poster" },
    defaultRatio: "4:5",
  },
  {
    id: "banner",
    ko: "현수막",
    en: "banner",
    emoji: "🏳️",
    phrase: { ko: "가로형 현수막 이미지", en: "wide horizontal banner" },
    defaultRatio: "21:9",
  },
  {
    id: "newsletter",
    ko: "가정통신문",
    en: "newsletter",
    emoji: "✉️",
    phrase: { ko: "가정통신문 머리 삽화 이미지", en: "header illustration for a school newsletter" },
    defaultRatio: "a4",
  },
  {
    id: "sns",
    ko: "SNS 게시물",
    en: "social post",
    emoji: "📱",
    phrase: { ko: "SNS 게시물 이미지", en: "social media post image" },
    defaultRatio: "1:1",
  },
  {
    id: "board",
    ko: "학급 게시판",
    en: "class board",
    emoji: "📌",
    phrase: { ko: "학급 게시판 꾸미기 이미지", en: "classroom bulletin board decoration" },
    defaultRatio: "3:4",
  },
  {
    id: "slides",
    ko: "발표 자료",
    en: "slides",
    emoji: "🖥️",
    phrase: { ko: "발표 자료 표지 이미지", en: "presentation title slide image" },
    defaultRatio: "16:9",
  },
  {
    id: "notice",
    ko: "안내문 배경",
    en: "notice background",
    emoji: "📄",
    phrase: { ko: "안내문 배경 이미지", en: "background image for a printed notice" },
    defaultRatio: "2:3",
  },
  {
    id: "story",
    ko: "세로 스토리",
    en: "vertical story",
    emoji: "🎬",
    phrase: { ko: "세로형 스토리 이미지", en: "vertical story image" },
    defaultRatio: "9:16",
  },
];

/** 분위기 라벨은 '~한' 꼴이라 뒤에 '분위기'를 붙여 자연스럽게 읽힙니다. */
export const MOODS: Option[] = [
  { id: "bright", ko: "밝고 활기찬", en: "bright and lively", emoji: "☀️" },
  { id: "warm", ko: "따뜻하고 포근한", en: "warm and cozy", emoji: "🧣" },
  { id: "calm", ko: "차분하고 신뢰감 있는", en: "calm and trustworthy", emoji: "🌿" },
  { id: "moving", ko: "감동적이고 뭉클한", en: "heartfelt and moving", emoji: "💐" },
  { id: "dynamic", ko: "신나고 역동적인", en: "exciting and dynamic", emoji: "⚡" },
  { id: "cute", ko: "귀엽고 사랑스러운", en: "cute and lovely", emoji: "🐣" },
  { id: "formal", ko: "단정하고 격식 있는", en: "neat and formal", emoji: "🎀" },
  { id: "curious", ko: "신비롭고 호기심 가득한", en: "mysterious and full of curiosity", emoji: "🔭" },
];

export type Ratio = { id: string; label: string; ar: string; hint: string };

export const RATIOS: Ratio[] = [
  { id: "4:5", label: "4:5", ar: "4:5", hint: "포스터·인스타" },
  { id: "3:4", label: "3:4", ar: "3:4", hint: "게시판" },
  { id: "2:3", label: "2:3", ar: "2:3", hint: "세로 안내문" },
  { id: "a4", label: "A4 세로", ar: "1:1.414", hint: "인쇄물" },
  { id: "1:1", label: "1:1", ar: "1:1", hint: "SNS" },
  { id: "16:9", label: "16:9", ar: "16:9", hint: "발표·모니터" },
  { id: "9:16", label: "9:16", ar: "9:16", hint: "스토리·숏폼" },
  { id: "2:1", label: "2:1", ar: "2:1", hint: "배너" },
  { id: "21:9", label: "21:9", ar: "21:9", hint: "현수막" },
];

export type TextSpace = Option & { sentence: Label };

export const TEXT_SPACES: TextSpace[] = [
  {
    id: "top",
    ko: "상단",
    en: "top",
    sentence: {
      ko: "상단에 제목을 넣을 여백을 넉넉히 비워 줘.",
      en: "Leave generous empty space at the top for the title.",
    },
  },
  {
    id: "bottom",
    ko: "하단",
    en: "bottom",
    sentence: {
      ko: "하단에 날짜와 장소를 넣을 여백을 비워 줘.",
      en: "Leave empty space at the bottom for the date and place.",
    },
  },
  {
    id: "left",
    ko: "좌측",
    en: "left",
    sentence: {
      ko: "왼쪽에 글자를 넣을 여백을 두고 그림은 오른쪽에 배치해 줘.",
      en: "Keep the left side empty for text and place the artwork on the right.",
    },
  },
  {
    id: "none",
    ko: "없음 (그림만)",
    en: "none",
    sentence: {
      ko: "글자는 넣지 말고 그림만 그려 줘.",
      en: "Do not add any text; artwork only.",
    },
  },
];

/** 피할 것 빠른 추가 칩 */
export const AVOID_CHIPS: Label[] = [
  { ko: "알아볼 수 없는 글자", en: "garbled or unreadable text" },
  { ko: "실제 학생 얼굴", en: "realistic student faces" },
  { ko: "영어 문구", en: "English words" },
  { ko: "과한 장식", en: "excessive decoration" },
  { ko: "어두운 색감", en: "dark colors" },
  { ko: "폭력적인 표현", en: "violent imagery" },
];
