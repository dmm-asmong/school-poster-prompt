import type { Label } from "./options";

export type EventPreset = {
  id: string;
  ko: string;
  emoji: string;
  /** 행사명에 이 단어가 들어 있으면 자동으로 추천합니다. */
  keywords: string[];
  scene: Label;
  elements: Label[];
  /** 한글 글자 표현 가이드 (행사명 가이드 뒤에 덧붙음) */
  textGuide: Label;
  mood: string;
};

export const EVENT_PRESETS: EventPreset[] = [
  {
    id: "sports",
    ko: "체육대회",
    emoji: "🏃",
    keywords: ["체육대회", "운동회", "체육", "스포츠"],
    scene: {
      ko: "넓은 운동장에서 청팀과 백팀 학생들이 이어달리기를 하며 힘차게 응원하는 장면",
      en: "students of the blue and white teams running a relay race on a wide schoolyard while classmates cheer",
    },
    elements: [
      { ko: "이어달리기 바통", en: "relay baton" },
      { ko: "만국기", en: "strings of colorful flags" },
      { ko: "청백 머리띠", en: "blue and white headbands" },
      { ko: "응원 피켓", en: "cheering signs" },
    ],
    textGuide: { ko: "청팀·백팀 글자는 작게", en: "keep any team labels small" },
    mood: "dynamic",
  },
  {
    id: "entrance",
    ko: "입학식",
    emoji: "🌸",
    keywords: ["입학", "신입생", "환영"],
    scene: {
      ko: "벚꽃이 핀 교문 앞에서 새 가방을 멘 신입생들이 설레는 마음으로 학교에 들어서는 뒷모습",
      en: "new students with fresh backpacks walking through the school gate under cherry blossoms, seen from behind",
    },
    elements: [
      { ko: "벚꽃잎", en: "cherry blossom petals" },
      { ko: "새 책가방", en: "new school bags" },
      { ko: "환영 리본", en: "welcome ribbon" },
      { ko: "교문", en: "school gate" },
    ],
    textGuide: { ko: "글자는 둥글고 친근한 서체로", en: "use a round, friendly typeface" },
    mood: "warm",
  },
  {
    id: "graduation",
    ko: "졸업식",
    emoji: "🎓",
    keywords: ["졸업", "수료"],
    scene: {
      ko: "졸업생들이 학사모를 하늘로 던지며 함께 웃는 모습을 먼 거리에서 바라본 장면",
      en: "graduates tossing their caps into the sky together, viewed from a distance",
    },
    elements: [
      { ko: "학사모", en: "graduation caps" },
      { ko: "꽃다발", en: "bouquets" },
      { ko: "졸업장 두루마리", en: "rolled diplomas" },
      { ko: "종이 꽃가루", en: "confetti" },
    ],
    textGuide: { ko: "제목은 우아한 붓글씨 느낌으로", en: "give the title an elegant brush-lettering feel" },
    mood: "moving",
  },
  {
    id: "festival",
    ko: "학교축제",
    emoji: "🎪",
    keywords: ["축제", "페스티벌", "한마당", "제전"],
    scene: {
      ko: "알록달록한 부스와 무대가 가득한 교정에서 학생들이 공연과 체험을 즐기는 장면",
      en: "a school campus full of colorful booths and a stage where students enjoy performances and activities",
    },
    elements: [
      { ko: "공연 무대 조명", en: "stage lights" },
      { ko: "체험 부스 천막", en: "activity booth tents" },
      { ko: "가랜드", en: "garlands" },
      { ko: "풍선", en: "balloons" },
    ],
    textGuide: { ko: "부스 간판에는 글자를 넣지 않기", en: "no text on the booth signs" },
    mood: "bright",
  },
  {
    id: "reading",
    ko: "독서의 달",
    emoji: "📚",
    keywords: ["독서", "책", "도서"],
    scene: {
      ko: "쌓아 올린 커다란 책 위에서 아이들이 책을 펼치자 이야기 속 세상이 튀어나오는 장면",
      en: "children sitting on a giant stack of books as a story world pops out of the open pages",
    },
    elements: [
      { ko: "펼쳐진 책", en: "open books" },
      { ko: "책갈피", en: "bookmarks" },
      { ko: "도서관 책장", en: "library shelves" },
      { ko: "따뜻한 스탠드 불빛", en: "warm reading lamp" },
    ],
    textGuide: { ko: "책 표지 속 글자는 넣지 않기", en: "no text on the book covers" },
    mood: "warm",
  },
  {
    id: "science",
    ko: "과학의 날",
    emoji: "🔬",
    keywords: ["과학", "발명", "탐구", "실험"],
    scene: {
      ko: "실험실에서 학생들이 보안경을 쓰고 로켓과 화산 실험을 하며 신기해하는 장면",
      en: "students in safety goggles launching a model rocket and running a volcano experiment in a lab",
    },
    elements: [
      { ko: "물병 로켓", en: "water bottle rocket" },
      { ko: "비커와 플라스크", en: "beakers and flasks" },
      { ko: "현미경", en: "microscope" },
      { ko: "행성 모형", en: "planet models" },
    ],
    textGuide: { ko: "수식이나 영어는 넣지 않기", en: "no formulas or English words" },
    mood: "curious",
  },
  {
    id: "openclass",
    ko: "학부모 공개수업",
    emoji: "👨‍👩‍👧",
    keywords: ["공개수업", "참관", "학부모"],
    scene: {
      ko: "밝은 교실에서 아이들이 손을 들고 발표하고, 교실 뒤편에서 부모님들이 미소 지으며 지켜보는 장면",
      en: "children raising hands in a bright classroom while parents smile from the back of the room",
    },
    elements: [
      { ko: "칠판", en: "blackboard" },
      { ko: "발표하는 손", en: "raised hands" },
      { ko: "교실 뒤 학부모석", en: "parents at the back" },
      { ko: "창가 화분", en: "window plants" },
    ],
    textGuide: { ko: "안내 글자는 읽기 쉬운 굵은 서체로", en: "use a bold, easy-to-read typeface for the details" },
    mood: "calm",
  },
  {
    id: "fieldtrip",
    ko: "현장체험학습",
    emoji: "🚌",
    keywords: ["체험학습", "현장학습", "소풍", "수학여행", "견학"],
    scene: {
      ko: "노란 버스에서 내린 아이들이 지도와 탐험 노트를 들고 숲길로 출발하는 장면",
      en: "kids stepping off a yellow bus with maps and explorer notebooks, heading down a forest trail",
    },
    elements: [
      { ko: "노란 버스", en: "yellow school bus" },
      { ko: "배낭", en: "backpacks" },
      { ko: "지도", en: "a map" },
      { ko: "도시락", en: "lunch boxes" },
    ],
    textGuide: { ko: "준비물 글자는 넣지 않기", en: "no checklist text" },
    mood: "bright",
  },
  {
    id: "eco",
    ko: "환경 캠페인",
    emoji: "🌱",
    keywords: ["환경", "지구", "탄소", "분리수거", "에너지", "플라스틱"],
    scene: {
      ko: "아이들이 손을 맞잡아 작은 지구를 감싸고, 주변에 새싹과 나무가 자라나는 장면",
      en: "children joining hands around a small Earth as sprouts and trees grow around it",
    },
    elements: [
      { ko: "새싹", en: "sprouts" },
      { ko: "분리수거함", en: "recycling bins" },
      { ko: "텀블러", en: "reusable tumblers" },
      { ko: "작은 지구", en: "a small globe" },
    ],
    textGuide: { ko: "구호는 짧게 한 줄로", en: "keep the slogan to one short line" },
    mood: "bright",
  },
  {
    id: "antibully",
    ko: "학교폭력 예방",
    emoji: "🤝",
    keywords: ["학교폭력", "학폭", "폭력", "따돌림", "친구사랑", "우정"],
    scene: {
      ko: "서로 다른 친구들이 어깨동무를 하고 하나의 큰 우산 아래 함께 서 있는 따뜻한 장면",
      en: "different friends standing arm in arm together under one big umbrella",
    },
    elements: [
      { ko: "커다란 우산", en: "a big umbrella" },
      { ko: "맞잡은 손", en: "holding hands" },
      { ko: "하트", en: "hearts" },
      { ko: "무지개", en: "a rainbow" },
    ],
    textGuide: { ko: "다치거나 우는 모습은 그리지 않기", en: "do not depict injury or crying" },
    mood: "warm",
  },
  {
    id: "digital",
    ko: "디지털·AI 교육",
    emoji: "🤖",
    keywords: ["AI", "인공지능", "디지털", "코딩", "SW", "소프트웨어", "로봇", "메이커"],
    scene: {
      ko: "학생들이 태블릿과 노트북으로 친근한 로봇과 함께 코딩 블록을 조립하는 미래 교실 장면",
      en: "students building code blocks with a friendly robot on tablets and laptops in a futuristic classroom",
    },
    elements: [
      { ko: "친근한 로봇", en: "a friendly robot" },
      { ko: "코딩 블록", en: "coding blocks" },
      { ko: "태블릿", en: "tablets" },
      { ko: "빛나는 회로 무늬", en: "glowing circuit patterns" },
    ],
    textGuide: { ko: "화면 속 글자는 흐리게 처리", en: "keep on-screen text blurred" },
    mood: "curious",
  },
  {
    id: "afterschool",
    ko: "방과후 모집",
    emoji: "🧩",
    keywords: ["방과후", "모집", "늘봄", "돌봄", "동아리"],
    scene: {
      ko: "로봇, 미술, 음악, 축구 등 여러 프로그램 교실 문이 나란히 열려 있고 아이들이 골라 들어가는 장면",
      en: "a hallway of open classroom doors for robotics, art, music and soccer as children choose where to go",
    },
    elements: [
      { ko: "프로그램 아이콘", en: "program icons" },
      { ko: "모집 배지", en: "recruiting badge" },
      { ko: "달력", en: "a calendar" },
      { ko: "악기와 축구공", en: "instruments and a soccer ball" },
    ],
    textGuide: { ko: "'모집' 글자를 눈에 띄게", en: "make the word '모집' stand out" },
    mood: "bright",
  },
  {
    id: "career",
    ko: "진로 체험의 날",
    emoji: "🧑‍🚀",
    keywords: ["진로", "직업", "꿈"],
    scene: {
      ko: "아이들이 소방관, 의사, 우주인, 요리사 옷을 입고 꿈의 문을 향해 걸어가는 장면",
      en: "children dressed as a firefighter, doctor, astronaut and chef walking toward a door of dreams",
    },
    elements: [
      { ko: "직업 의상", en: "career costumes" },
      { ko: "꿈의 문", en: "a door of dreams" },
      { ko: "별", en: "stars" },
      { ko: "이정표", en: "signposts" },
    ],
    textGuide: { ko: "직업 이름 글자는 넣지 않기", en: "no job title text" },
    mood: "curious",
  },
  {
    id: "safety",
    ko: "안전 교육",
    emoji: "🦺",
    keywords: ["안전", "교통", "소방", "대피", "재난", "생존수영"],
    scene: {
      ko: "초록불 횡단보도를 손을 들고 건너는 아이들과 안전 지킴이 선생님이 함께 있는 장면",
      en: "children raising their hands while crossing at a green light with a crossing guard teacher",
    },
    elements: [
      { ko: "횡단보도", en: "crosswalk" },
      { ko: "초록 신호등", en: "green traffic light" },
      { ko: "노란 안전모", en: "yellow safety helmets" },
      { ko: "안전 표지판", en: "safety signs" },
    ],
    textGuide: { ko: "표지판에는 그림 기호만", en: "use pictograms only on signs" },
    mood: "calm",
  },
  {
    id: "arts",
    ko: "학예회·발표회",
    emoji: "🎭",
    keywords: ["학예회", "발표회", "공연", "연주회", "음악회", "전시"],
    scene: {
      ko: "붉은 커튼이 열린 강당 무대에서 아이들이 합창과 연극을 선보이고 객석이 박수 치는 장면",
      en: "children performing a choir and play on an auditorium stage as the red curtain opens and the audience applauds",
    },
    elements: [
      { ko: "붉은 무대 커튼", en: "red stage curtain" },
      { ko: "스포트라이트", en: "spotlight" },
      { ko: "음표", en: "music notes" },
      { ko: "박수 치는 객석", en: "applauding audience" },
    ],
    textGuide: { ko: "객석 인물은 실루엣으로", en: "audience as silhouettes" },
    mood: "warm",
  },
  {
    id: "lunch",
    ko: "급식·잔반 줄이기",
    emoji: "🍱",
    keywords: ["급식", "잔반", "식판", "편식", "영양"],
    scene: {
      ko: "깨끗하게 비운 식판을 들고 엄지를 치켜세우는 아이들과 웃는 채소 캐릭터들이 함께 있는 장면",
      en: "kids holding up spotless empty lunch trays with thumbs up, joined by smiling vegetable characters",
    },
    elements: [
      { ko: "깨끗한 식판", en: "clean lunch trays" },
      { ko: "채소 캐릭터", en: "vegetable characters" },
      { ko: "숟가락과 젓가락", en: "spoon and chopsticks" },
      { ko: "반짝이 효과", en: "sparkle effects" },
    ],
    textGuide: { ko: "구호는 짧고 크게", en: "short, large slogan" },
    mood: "cute",
  },
];

export function findPreset(id: string | null): EventPreset | undefined {
  return id ? EVENT_PRESETS.find((p) => p.id === id) : undefined;
}

/** 행사명에서 가장 먼저 맞는 프리셋을 찾습니다. */
export function matchPreset(eventName: string): EventPreset | undefined {
  const name = eventName.replace(/\s+/g, "").toLowerCase();
  if (!name) return undefined;
  return EVENT_PRESETS.find((p) =>
    p.keywords.some((k) => name.includes(k.replace(/\s+/g, "").toLowerCase())),
  );
}

export function presetElementsText(preset: EventPreset): string {
  return preset.elements.map((e) => e.ko).join(", ");
}
