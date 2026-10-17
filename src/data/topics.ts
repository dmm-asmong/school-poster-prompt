/**
 * 강의 주제별 문구 은행. 주제/제목에 들어 있는 단어로 고르고, 없으면 GENERIC 을 써요.
 * {t} 는 입력한 강의 주제로 바뀝니다.
 */
export type TopicBank = {
  id: string;
  keywords: RegExp;
  motif: { ko: string; en: string };
  /** 실사 사진 스타일에서 쓰는 실제 장면 */
  photo: { ko: string; en: string };
  titles: string[];
  curriculum: string[];
  bio: string[];
  hashtags: string[];
};

export const TOPICS: TopicBank[] = [
  {
    id: "python",
    keywords: /파이썬|python|자동화/i,
    motif: { ko: "코드 줄을 읽을 수 없는 둥근 색 막대로 표현한 깔끔한 코드 에디터 카드 한 장", en: "one clean code-editor card in which the code lines are drawn as simple rounded color bars (no readable characters)" },
    photo: { ko: "저녁 창가 책상에서 노트북으로 코딩하는 직장인(화면 코드는 알아볼 수 없게)", en: "an office worker coding on a laptop at a desk by a window in the evening (screen code illegible)" },
    titles: ["코딩 몰라도 OK, 4주 완성 파이썬", "퇴근 후 시작하는 파이썬 자동화", "왕초보 파이썬 첫걸음", "반복 업무는 파이썬에게 맡기세요"],
    curriculum: ["파이썬 설치부터 첫 코드까지", "변수·조건문·반복문 한 번에 이해", "엑셀·파일 정리 업무 자동화", "웹에서 데이터 모으기(크롤링)", "나만의 미니 프로젝트 완성", "ChatGPT로 코드 도움받는 법"],
    bio: ["현직 백엔드 개발자 · 강의 경력 7년", "누적 수강생 3,000명 파이썬 강사"],
    hashtags: ["#파이썬", "#파이썬기초", "#코딩입문", "#업무자동화"],
  },
  {
    id: "excel",
    keywords: /엑셀|excel|스프레드시트|구글\s?시트/i,
    motif: { ko: "잘 디자인된 리포트에서 잘라 온 듯한 4~5개 막대의 단순한 평면 막대 차트 하나", en: "one simple flat bar chart of 4–5 bars, as if cropped from a well-designed annual report" },
    photo: { ko: "표와 막대 차트가 인쇄된 보고서 한 장과 만년필", en: "a printed report sheet with a table and a bar chart, and a fountain pen" },
    titles: ["야근을 줄이는 엑셀 실무", "칼퇴를 부르는 엑셀 함수 10", "보고서가 빨라지는 엑셀 특강", "실무 엑셀, 하루면 충분해요"],
    curriculum: ["VLOOKUP·XLOOKUP 완전 정복", "피벗 테이블로 1분 보고서", "실무 단축키 30가지", "조건부 서식으로 한눈에 보기", "차트로 설득하는 보고서", "매크로로 반복 작업 끝내기"],
    bio: ["대기업 재무팀 출신 엑셀 강사", "기업교육 500회 이상 · MOS 마스터"],
    hashtags: ["#엑셀", "#엑셀실무", "#엑셀함수", "#직장인공부"],
  },
  {
    id: "video",
    keywords: /유튜브|youtube|영상|편집|프리미어|캡컷|capcut|숏폼|릴스|썸네일/i,
    motif: { ko: "평평한 색면에서 오려 낸 듯한 큼직한 재생 버튼 모양 하나", en: "one oversized play-button shape cut out of a flat color field" },
    photo: { ko: "모니터에 편집 타임라인이 떠 있는 실제 영상 편집 책상, 마이크와 카메라", en: "a real video-editing desk with an editing timeline on the monitor, a microphone and a camera" },
    titles: ["AI 툴로 유튜브 10배 빠르게", "첫 영상부터 수익화까지", "스마트폰 하나로 숏폼 완성", "클릭을 부르는 썸네일의 비밀"],
    curriculum: ["기획과 대본 쓰기", "캡컷으로 컷 편집·자막", "AI로 목소리·자막 자동화", "썸네일·제목 공식", "숏폼·릴스 알고리즘", "채널 성장 전략"],
    bio: ["구독자 12만 유튜버 · 영상 편집 강사", "방송 PD 출신 크리에이터 코치"],
    hashtags: ["#유튜브", "#영상편집", "#AI툴", "#크리에이터"],
  },
  {
    id: "ai",
    keywords: /chat\s?gpt|챗gpt|챗지피티|생성형|\bai\b|인공지능|프롬프트|gemini|claude|grok/i,
    motif: { ko: "한 줄씩 작성되고 있는 문서 한 장(글자 대신 회색 막대, 한 줄만 포인트 색으로 강조) 또는 단순한 기하학 말풍선 두 개 — 칩·뇌·로봇·회로는 쓰지 않음", en: "one document page being drafted line by line (text shown as grey bars, a single line highlighted in the accent color), or two simple geometric speech bubbles — no chips, brains, robots or circuits" },
    photo: { ko: "회의실에서 노트북 화면을 함께 보며 문서를 검토하는 동료들", en: "colleagues in a meeting room reviewing a document on a laptop together" },
    titles: ["일 잘하는 사람의 ChatGPT 활용법", "업무 시간이 반으로, AI 실무 활용", "오늘부터 AI와 함께 일하기", "보고서·메일, AI로 10분 컷"],
    curriculum: ["좋은 프롬프트의 5가지 공식", "보고서·메일·기획서 초안 쓰기", "엑셀·데이터 정리에 AI 활용", "회의록 요약과 아이디어 발상", "이미지 생성 AI로 홍보물 만들기", "보안·저작권 주의사항"],
    bio: ["AI 활용 기업교육 전문 강사", "생성형 AI 컨설턴트 · 공공기관 출강"],
    hashtags: ["#ChatGPT", "#AI활용", "#생성형AI", "#업무효율"],
  },
  {
    id: "notion",
    keywords: /노션|notion|생산성|업무\s?정리/i,
    motif: { ko: "세 칸이 체크된 깔끔한 체크리스트 카드 한 장(글자 대신 선)", en: "one tidy checklist card with three ticked boxes (lines instead of text)" },
    photo: { ko: "노트북, 노트, 커피잔이 놓인 정돈된 책상", en: "a tidy desk with an open laptop, a notebook and a coffee cup" },
    titles: ["노션으로 정리하는 일과 삶", "흩어진 업무, 노션 하나로", "노션 생산성 시스템 만들기", "처음 쓰는 노션, 3시간이면 끝"],
    curriculum: ["페이지·블록 기본기", "데이터베이스와 보기(View) 활용", "할 일·프로젝트 관리 템플릿", "팀 위키와 회의록 정리", "자동화와 AI 기능 활용", "나만의 대시보드 완성"],
    bio: ["노션 공식 앰배서더 · 템플릿 크리에이터", "스타트업 운영 매니저 출신 생산성 강사"],
    hashtags: ["#노션", "#노션템플릿", "#생산성", "#업무정리"],
  },
  {
    id: "data",
    keywords: /데이터|분석|sql|태블로|tableau|파워\s?bi|통계|부트캠프/i,
    motif: { ko: "선 하나가 오르고 데이터 점 하나만 강조된 미니멀한 라인 차트", en: "a minimal line chart with one rising line and a single highlighted data point" },
    photo: { ko: "모니터의 차트를 보며 분석하는 사람", en: "an analyst studying charts on a monitor at a desk" },
    titles: ["비전공자를 위한 데이터분석 부트캠프", "숫자로 말하는 사람이 되는 법", "12주 데이터분석가 완성 과정", "SQL부터 대시보드까지"],
    curriculum: ["SQL로 데이터 뽑기", "파이썬 판다스로 데이터 정리", "시각화와 대시보드 만들기", "통계 기초와 가설 검증", "실전 데이터 프로젝트 3개", "포트폴리오·취업 코칭"],
    bio: ["현직 데이터 분석가 · 강의 경력 8년", "데이터 팀장 출신 · 부트캠프 리드 강사"],
    hashtags: ["#데이터분석", "#SQL", "#부트캠프", "#데이터분석가"],
  },
  {
    id: "smartphone",
    keywords: /스마트폰|핸드폰|휴대폰|키오스크|카카오톡|디지털\s?교육|시니어/i,
    motif: { ko: "손에 쥔 스마트폰 한 대, 화면에는 큼직하고 단순한 앱 타일 몇 개(글자 없음)", en: "one smartphone held in a hand, the screen showing a few large, simple app tiles (no text)" },
    photo: { ko: "다정한 강사와 함께 탁자에서 스마트폰을 배우는 어르신들", en: "older adults learning to use smartphones at a table with a friendly instructor" },
    titles: ["처음 만나는 스마트폰 교실", "자녀에게 묻지 않아도 돼요", "키오스크·카톡 한 번에 배우기", "쉽고 즐거운 스마트폰 활용"],
    curriculum: ["카카오톡 사진·영상 보내기", "키오스크로 주문하기", "지도 앱으로 길 찾기", "사진 정리와 앨범 만들기", "보이스피싱·스미싱 예방", "영상통화와 유튜브 즐기기"],
    bio: ["디지털 배움터 전문 강사 · 시니어 교육 10년", "평생학습관 스마트폰 교실 강사"],
    hashtags: ["#스마트폰교육", "#시니어교육", "#디지털배움터", "#평생학습"],
  },
  {
    id: "web",
    keywords: /웹|html|css|자바스크립트|javascript|react|리액트|프론트|홈페이지|next/i,
    motif: { ko: "글자 없이 블록으로만 된 와이어프레임이 들어간 브라우저 창 하나", en: "one browser window frame containing a simple block wireframe (no readable text)" },
    photo: { ko: "간단한 웹사이트 와이어프레임이 뜬 노트북과 종이 스케치", en: "a laptop showing a simple website wireframe next to a paper sketch" },
    titles: ["내 손으로 만드는 첫 웹사이트", "6주 완성 웹개발 라이브", "HTML부터 배포까지 한 번에", "포트폴리오 사이트 직접 만들기"],
    curriculum: ["HTML·CSS로 화면 만들기", "자바스크립트 핵심 문법", "반응형 웹 디자인", "React 기초와 컴포넌트", "API 연결과 데이터 표시", "Vercel로 무료 배포하기"],
    bio: ["프론트엔드 개발자 · 부트캠프 멘토", "웹 에이전시 10년 차 개발 강사"],
    hashtags: ["#웹개발", "#프론트엔드", "#코딩공부", "#개발자취업"],
  },
  {
    id: "coding",
    keywords: /코딩|프로그래밍|알고리즘|자바|java|c언어|스크래치|앱\s?개발/i,
    motif: { ko: "큼직한 기하학 도형으로 그린 중괄호 { } 한 쌍", en: "a pair of curly braces { } drawn as one large, bold geometric shape" },
    photo: { ko: "밝은 교실에서 노트북으로 프로그래밍하는 학생", en: "a student programming on a laptop in a bright classroom" },
    titles: ["코딩, 이제 시작해도 늦지 않아요", "처음 배우는 프로그래밍", "논리력이 자라는 코딩 수업", "기초부터 탄탄한 코딩 클래스"],
    curriculum: ["프로그래밍 기본 개념", "문제 해결 사고법", "조건·반복으로 프로그램 만들기", "함수와 자료구조 기초", "미니 게임 만들기", "결과물 발표와 피드백"],
    bio: ["SW 교육 전문 강사 · 정보처리기사", "개발자 출신 코딩 교육 강사"],
    hashtags: ["#코딩교육", "#프로그래밍", "#코딩입문", "#SW교육"],
  },
  {
    id: "design",
    keywords: /캔바|canva|디자인|피그마|figma|포토샵|일러스트레이터|카드뉴스|상세페이지/i,
    motif: { ko: "겹쳐 놓은 컬러 스와치 카드 세 장과 커서 화살표 하나", en: "three overlapping color-swatch cards and a single cursor arrow" },
    photo: { ko: "컬러 스와치, 레이아웃이 뜬 태블릿, 오린 종이가 놓인 작업대", en: "a worktable with color swatches, a tablet showing a layout and paper cut-outs" },
    titles: ["디자인 몰라도 캔바면 충분해", "하루 만에 끝내는 캔바 원데이", "SNS 홍보물 직접 만들기", "감각 없어도 예쁜 디자인 공식"],
    curriculum: ["캔바 기본 기능과 템플릿", "카드뉴스·썸네일 만들기", "브랜드 컬러와 폰트 고르기", "상세페이지 레이아웃", "AI 기능으로 이미지 다듬기", "완성작 피드백"],
    bio: ["캔바 공인 크리에이터 · 브랜드 디자이너", "디자인 에이전시 출신 강사"],
    hashtags: ["#캔바", "#캔바디자인", "#디자인클래스", "#원데이클래스"],
  },
  {
    id: "marketing",
    keywords: /마케팅|브랜딩|퍼스널|인스타|광고|세일즈|창업|스마트스토어/i,
    motif: { ko: "폰 화면 속 SNS 게시물 카드 하나(이미지 블록 + 하트 아이콘, 글자 없음)", en: "one social post card on a phone frame (an image block and a heart icon, no text)" },
    photo: { ko: "SNS용으로 제품 사진을 찍는 1인 사업자", en: "a small business owner photographing a product for social media" },
    titles: ["팔리는 글쓰기, 마케팅 실전", "작은 브랜드의 SNS 성장법", "나를 알리는 퍼스널 브랜딩", "광고비 없이 고객 모으기"],
    curriculum: ["타깃 고객 정의하기", "콘텐츠 기획과 카피라이팅", "인스타·스레드 운영 전략", "광고 기초와 성과 측정", "AI로 콘텐츠 제작 자동화", "실전 캠페인 설계"],
    bio: ["브랜드 마케터 · 스타트업 마케팅 10년", "누적 팔로워 30만 SNS 마케팅 강사"],
    hashtags: ["#마케팅", "#퍼스널브랜딩", "#SNS마케팅", "#1인사업"],
  },
];

export const GENERIC: TopicBank = {
  id: "generic",
  keywords: /$^/,
  motif: { ko: "위에서 내려다본 펼친 노트와 펜 하나", en: "an open notebook and a single pen, seen from directly above" },
  photo: { ko: "밝은 강의실에서 소규모 성인 수강생을 가르치는 강사", en: "an instructor teaching a small group of adults in a bright classroom" },
  titles: ["4주 만에 끝내는 {t}", "현업에서 바로 쓰는 {t}", "처음 배우는 {t}", "{t}, 오늘부터 제대로"],
  curriculum: ["핵심 개념 한 번에 정리", "실습으로 바로 익히기", "현업 사례로 배우는 노하우", "자주 하는 실수와 해결법", "나만의 결과물 완성", "1:1 질의응답과 피드백"],
  bio: ["현직 실무자 · 강의 경력 5년", "기업·대학 출강 전문 강사"],
  hashtags: ["#강의", "#자기계발", "#직장인공부"],
};

export function findTopic(text: string): TopicBank {
  const t = text.trim();
  if (!t) return GENERIC;
  return TOPICS.find((bank) => bank.keywords.test(t)) ?? GENERIC;
}
