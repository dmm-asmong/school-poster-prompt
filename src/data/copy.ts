/**
 * 포스터 문구 자동 추천용 템플릿.
 * {event} 행사 이름 · {year} 연도 · {who} 학교급에 맞는 호칭 · {audience} 대상
 */

/** 날짜 규칙: month 월의 from~to 일 사이에서 고릅니다. */
export type DateRule = {
  month: number;
  from: number;
  to: number;
  /** 기간 행사면 일 수 (예: 한 주 5일, 한 달 30일) */
  span?: number;
  /** weekday: 평일 시작 · monday: 월요일 시작 · fixed: from 일에 고정 */
  start?: "weekday" | "monday" | "fixed";
};

export type CopyBank = {
  /** [초·중·고용, 유아용] 기본 행사 이름 */
  name: [string, string];
  titles: string[];
  slogans: string[];
  /** 비어 있으면 오늘부터 몇 주 뒤 평일로 고릅니다. */
  dates: DateRule[];
  times: string[];
  places: string[];
  contacts?: string[];
};

export const GENERIC_COPY: CopyBank = {
  name: ["{year} 우리 학교 행사", "{year} 우리 반 잔치"],
  titles: ["함께해서 더 즐거운 {event}", "{event}에 초대합니다", "모두가 기다린 {event}", "{who} 모두 모여라! {event}"],
  slogans: ["많은 관심과 참여 부탁드립니다", "함께 만드는 즐거운 하루", "모두가 주인공이 되는 시간"],
  dates: [],
  times: ["오전 10시", "오후 2시", "오전 9시 30분 ~ 11시 30분"],
  places: ["본교 강당", "본교 다목적실", "본교 체육관"],
};

export const DEFAULT_CONTACTS = [
  "대상: {audience} · 문의: 본교 교무실",
  "{audience} 누구나 참여할 수 있어요 · 문의: 담당 선생님",
  "참가 신청: 담임 선생님께 · 문의: 본교 교무실",
];

export const COPY_BANKS: Record<string, CopyBank> = {
  sports: {
    name: ["{year} 한마음 체육대회", "{year} 꼬마 운동회"],
    titles: ["달려라! {event}", "{event}, 함께 달려요!", "땀방울이 빛나는 날, {event}", "우리가 주인공! {event}"],
    slogans: ["청팀도 백팀도 오늘은 모두 한 팀", "끝까지 달리는 우리가 진짜 우승팀", "응원 소리로 운동장을 가득 채워요"],
    dates: [
      { month: 5, from: 8, to: 29 },
      { month: 10, from: 5, to: 30 },
    ],
    times: ["오전 9시 ~ 오후 2시", "오전 9시 30분 ~ 오후 12시 30분", "오전 9시 ~ 오후 3시"],
    places: ["본교 운동장", "본교 운동장 (우천 시 체육관)", "본교 대운동장"],
  },
  entrance: {
    name: ["{year} 입학식", "{year} 입학식"],
    titles: ["설레는 첫걸음, {event}", "반가워요! {event}", "새 친구, 새 교실, 새 꿈", "꽃처럼 피어날 {who}의 첫날"],
    slogans: ["입학을 진심으로 축하합니다", "오늘부터 우리는 한 가족이에요", "새로운 시작을 힘껏 응원해요"],
    dates: [{ month: 3, from: 2, to: 4 }],
    times: ["오전 10시", "오전 10시 30분", "오전 11시"],
    places: ["본교 강당", "본교 체육관", "본교 다목적실"],
  },
  graduation: {
    name: ["{year} 졸업식", "{year} 졸업식"],
    titles: ["고마웠어, 그리고 응원해! {event}", "{event}, 새로운 날개를 펴다", "함께한 시간을 기억하며, {event}", "빛나는 내일로, {event}"],
    slogans: ["졸업을 진심으로 축하합니다", "여기서 시작된 꿈이 더 멀리 날아가길", "우리의 추억은 계속됩니다"],
    dates: [
      { month: 2, from: 6, to: 14 },
      { month: 1, from: 6, to: 10 },
    ],
    times: ["오전 10시", "오전 10시 30분", "오전 11시"],
    places: ["본교 강당", "본교 체육관", "본교 시청각실"],
  },
  festival: {
    name: ["{year} 하늘빛 축제", "{year} 꼬마 한마당 잔치"],
    titles: ["두근두근 {event}", "{event}: 우리가 만드는 축제", "오늘은 우리가 주인공! {event}", "끼와 꿈이 터지는 {event}"],
    slogans: ["무대도 부스도 모두 우리 손으로", "재능을 마음껏 펼쳐 봐!", "함께 웃고 즐기는 이틀"],
    dates: [
      { month: 10, from: 14, to: 30, span: 2 },
      { month: 12, from: 14, to: 24, span: 2 },
      { month: 11, from: 2, to: 20, span: 2 },
    ],
    times: ["오전 10시 ~ 오후 4시", "오후 1시 ~ 오후 5시"],
    places: ["본교 운동장과 강당", "교내 일원", "본교 체육관"],
  },
  reading: {
    name: ["{year} 독서의 달", "그림책 잔치"],
    titles: ["책 속으로 떠나는 여행, {event}", "{event}: 펼치면 시작되는 모험", "한 권의 책, 한 뼘 더 자라는 우리", "책 읽는 {who}, 꿈꾸는 {who}"],
    slogans: ["하루 10분, 책과 친구 되기", "읽고 나누고 함께 자라요", "도서관에서 만나요"],
    dates: [
      { month: 9, from: 1, to: 1, span: 30, start: "fixed" },
      { month: 4, from: 1, to: 1, span: 30, start: "fixed" },
    ],
    times: ["매일 아침 독서 시간", "점심시간 · 방과 후"],
    places: ["학교 도서관", "본교 도서관 및 각 교실"],
  },
  science: {
    name: ["{year} 과학의 날 탐구 한마당", "꼬마 과학 놀이"],
    titles: ["궁금하면 실험해 봐! {event}", "{event}, 상상이 현실이 되는 날", "작은 호기심, 큰 발견! {event}", "미래 과학자들의 놀이터"],
    slogans: ["질문이 곧 발견의 시작", "보고 만지고 실험해요", "오늘의 실험이 내일의 발명"],
    dates: [
      { month: 4, from: 13, to: 24 },
      { month: 11, from: 2, to: 13 },
    ],
    times: ["오전 9시 ~ 오후 12시 30분", "1~4교시"],
    places: ["본교 과학실", "본교 체육관", "본교 과학실 및 운동장"],
  },
  openclass: {
    name: ["{year} 학부모 공개수업", "{year} 부모 참여 수업"],
    titles: ["우리 교실에 초대합니다", "함께 보는 배움의 순간, {event}", "{event}: 아이들의 성장을 만나 보세요", "손 들고 발표하는 우리를 보러 오세요"],
    slogans: ["학부모님의 많은 참석 부탁드립니다", "배움이 자라는 교실로 초대합니다", "작은 발표에 큰 박수를 보내 주세요"],
    dates: [
      { month: 4, from: 13, to: 30 },
      { month: 10, from: 12, to: 30 },
    ],
    times: ["2교시 (오전 9시 50분 ~ 10시 30분)", "오전 10시 ~ 11시 30분"],
    places: ["각 학급 교실", "본교 각 교실"],
    contacts: ["참관 신청: 회신서 제출 · 문의: 담임 선생님", "주차 공간이 부족하니 대중교통을 이용해 주세요"],
  },
  fieldtrip: {
    name: ["{year} 현장체험학습", "{year} 봄나들이"],
    titles: ["떠나자! {event}", "{event}, 교실 밖이 배움터", "오늘은 자연이 선생님!", "두 발로 배우는 하루, {event}"],
    slogans: ["보고 듣고 느끼는 진짜 공부", "안전하게, 즐겁게, 함께", "친구와 함께 떠나는 배움 여행"],
    dates: [
      { month: 5, from: 11, to: 29 },
      { month: 10, from: 12, to: 30 },
    ],
    times: ["오전 8시 50분 출발 ~ 오후 3시 도착", "오전 9시 ~ 오후 2시 30분"],
    places: ["○○ 자연휴양림", "○○ 어린이 과학관", "○○ 생태공원"],
    contacts: ["준비물: 도시락, 물, 편한 운동화 · 문의: 담임 선생님"],
  },
  eco: {
    name: ["{year} 지구 사랑 주간", "초록 지구 지킴이 주간"],
    titles: ["지구야, 우리가 지켜 줄게!", "{event}: 작은 실천, 큰 변화", "초록 지구를 부탁해, {event}", "오늘부터 지구를 위한 한 걸음"],
    slogans: ["텀블러 하나, 지구에는 큰 선물", "버리기 전에 한 번 더 생각해요", "우리 손으로 지키는 푸른 내일"],
    dates: [
      { month: 6, from: 1, to: 12, span: 5, start: "monday" },
      { month: 4, from: 13, to: 24, span: 5, start: "monday" },
    ],
    times: ["캠페인 기간 매일", "등교 시간 (오전 8시 20분 ~ 8시 50분)"],
    places: ["본교 중앙 현관", "교내 일원", "각 학급 교실"],
  },
  antibully: {
    name: ["{year} 친구 사랑 주간", "사이좋은 친구 주간"],
    titles: ["우리는 한 팀, {event}", "{event}: 말 한마디가 친구를 지켜요", "너와 나, 함께라서 든든해", "웃음이 넘치는 교실, 우리가 만들어요"],
    slogans: ["친구의 마음을 먼저 생각해요", "도움이 필요할 땐 언제든 말해 주세요", "존중과 배려로 하나 되는 학교"],
    dates: [
      { month: 3, from: 16, to: 27, span: 5, start: "monday" },
      { month: 9, from: 7, to: 18, span: 5, start: "monday" },
    ],
    times: ["캠페인 기간 매일", "등교 시간"],
    places: ["본교 중앙 현관", "교내 일원"],
    contacts: ["도움 요청: 상담실 · 담임 선생님 · 117 학교폭력 신고센터"],
  },
  digital: {
    name: ["{year} AI 디지털 캠프", "꼬마 로봇 놀이"],
    titles: ["AI랑 놀자! {event}", "{event}: 코드로 그리는 미래", "상상을 코딩하다, {event}", "미래 교실이 열린다!"],
    slogans: ["직접 만들어 보는 인공지능", "컴퓨터와 친구가 되는 시간", "오늘 배운 코드가 내일의 꿈이 돼요"],
    dates: [
      { month: 7, from: 20, to: 31 },
      { month: 11, from: 9, to: 27 },
      { month: 12, from: 1, to: 18 },
    ],
    times: ["오전 9시 ~ 오후 12시", "방과 후 오후 2시 ~ 4시"],
    places: ["본교 컴퓨터실", "본교 AI 융합 교실", "본교 메이커실"],
  },
  afterschool: {
    name: ["{year} 방과후학교 수강생 모집", "{year} 특성화 프로그램 모집"],
    titles: ["골라 듣는 재미! {event}", "{event}: 하고 싶은 거 다 해 봐!", "방과후가 기다려지는 이유", "꿈을 키우는 오후, {event}"],
    slogans: ["로봇·미술·음악·체육, 원하는 대로 골라요", "선착순 모집, 서둘러 신청하세요", "즐거운 배움이 기다리는 오후"],
    dates: [
      { month: 2, from: 16, to: 27, span: 5, start: "monday" },
      { month: 8, from: 17, to: 28, span: 5, start: "monday" },
    ],
    times: ["신청 마감 금요일 오후 4시", "온라인 신청 오전 9시부터"],
    places: ["학교 누리집 온라인 신청", "본교 방과후학교 교실"],
    contacts: ["신청: 가정통신문 회신서 제출 · 문의: 방과후학교 담당 선생님"],
  },
  career: {
    name: ["{year} 진로 체험의 날", "나는야 꼬마 직업인"],
    titles: ["내 꿈을 만나는 날, {event}", "{event}: 미래의 나에게 한 걸음", "궁금했던 직업, 직접 해 봐요", "꿈 찾기 대작전! {event}"],
    slogans: ["좋아하는 것에서 꿈이 시작돼요", "다양한 직업을 직접 체험해요", "오늘의 체험이 내일의 진로로"],
    dates: [
      { month: 5, from: 11, to: 29 },
      { month: 11, from: 2, to: 20 },
    ],
    times: ["오전 9시 ~ 오후 12시 30분", "1~5교시"],
    places: ["본교 체육관", "본교 각 체험 교실"],
  },
  safety: {
    name: ["{year} 안전한 등굣길 캠페인", "안전 약속 주간"],
    titles: ["안전이 먼저야! {event}", "{event}: 멈추고, 살피고, 건너요", "우리 모두의 약속, 안전", "손 들고 건너는 안전한 등굣길"],
    slogans: ["초록불에도 좌우를 살펴요", "작은 습관이 큰 사고를 막아요", "안전한 학교, 우리가 함께 만들어요"],
    dates: [
      { month: 3, from: 9, to: 20 },
      { month: 9, from: 1, to: 12 },
    ],
    times: ["오전 8시 20분 ~ 8시 50분", "2교시 (오전 9시 50분)"],
    places: ["본교 정문 앞 횡단보도", "본교 강당", "본교 운동장"],
  },
  arts: {
    name: ["{year} 꿈빛 학예 발표회", "{year} 재롱 잔치"],
    titles: ["반짝반짝 우리들의 무대, {event}", "{event}: 박수 받을 준비 됐나요?", "꿈이 무대가 되는 날", "{who}의 재능 대방출! {event}"],
    slogans: ["한 해 동안 키운 끼와 꿈을 펼쳐요", "큰 박수로 응원해 주세요", "노래하고 춤추고 연기하는 우리"],
    dates: [
      { month: 12, from: 1, to: 23 },
      { month: 11, from: 10, to: 28 },
    ],
    times: ["오전 10시 ~ 12시", "오후 2시"],
    places: ["본교 강당", "본교 다목적실", "○○ 문화예술회관 소공연장"],
  },
  lunch: {
    name: ["{year} 싹싹 식판 챌린지", "골고루 냠냠 주간"],
    titles: ["싹싹 비우면 지구가 웃어요", "{event}: 맛있게 먹고 깨끗하게!", "오늘도 식판 클리어!", "편식은 이제 그만, {event}"],
    slogans: ["먹을 만큼 받고 남김없이 먹어요", "골고루 먹는 우리가 건강 챔피언", "잔반 제로에 도전해요"],
    dates: [
      { month: 6, from: 8, to: 19, span: 5, start: "monday" },
      { month: 11, from: 9, to: 20, span: 5, start: "monday" },
    ],
    times: ["점심시간", "점심시간 (오후 12시 10분 ~ 1시)"],
    places: ["본교 급식실", "각 학급 교실"],
  },
};

/** 분위기별로 섞어 넣는 제목·슬로건 */
export const MOOD_COPY: Record<string, { titles: string[]; slogans: string[] }> = {
  bright: { titles: ["신나는 하루! {event}", "{event}, 다 함께 출발!"], slogans: ["웃음 가득한 하루를 함께해요"] },
  warm: { titles: ["마음이 따뜻해지는 {event}", "{event}, 함께라서 포근해요"], slogans: ["따뜻한 마음을 나누는 시간"] },
  calm: { titles: ["{event} 안내", "함께 배우고 함께 자라는 {event}"], slogans: ["많은 관심과 참여 부탁드립니다"] },
  moving: { titles: ["잊지 못할 순간, {event}", "오래 기억될 우리들의 {event}"], slogans: ["함께한 모든 순간에 감사합니다"] },
  dynamic: { titles: ["가자! 뛰자! {event}", "에너지 폭발! {event}"], slogans: ["끝까지 힘차게, 우리답게!"] },
  cute: { titles: ["콩닥콩닥 {event}", "방긋방긋 {event}"], slogans: ["모두모두 놀러 오세요"] },
  formal: { titles: ["{event}", "{event}에 정중히 초대합니다"], slogans: ["귀한 걸음 해 주시면 감사하겠습니다"] },
  curious: { titles: ["무엇이 기다리고 있을까? {event}", "궁금증 대폭발! {event}"], slogans: ["호기심을 가득 안고 오세요"] },
};

/** 학교급별 호칭 ({who}) */
export const WHO_BY_SCHOOL: Record<string, string> = {
  daycare: "꼬마 친구들",
  kinder: "꼬마 친구들",
  elementary: "어린이",
  middle: "우리",
  high: "우리",
};

/** 가상의 학교 이름 앞부분 (주최 예시용) */
export const SAMPLE_SCHOOL_NAMES = ["새빛", "한별", "푸른숲", "해오름", "라온"];
