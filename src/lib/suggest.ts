import { findTopic, type TopicBank } from "@/data/topics";
import { formatMD, nextWeekday, weekdayName, type DayKey } from "./dates";
import type { BuilderState, InfoKey, InfoMode } from "./state";

export type Resolved = { mode: InfoMode; text: string; suggestion: string };
export type ResolvedInfo = Record<InfoKey, Resolved> & {
  curriculum: { mode: InfoMode; items: string[]; suggestion: string[] };
  topic: TopicBank;
  /** 화면·프롬프트에 쓸 강의 주제 이름 */
  topicName: string;
};

const pick = <T,>(list: T[], seed: number): T => list[((seed % list.length) + list.length) % list.length];

function fill(template: string, topic: string): string {
  return template.replaceAll("{t}", topic);
}

function titleIdeas(state: BuilderState, bank: TopicBank, topic: string): string[] {
  const t = topic || "실무 클래스";
  const own = bank.id === "generic" ? [] : bank.titles;
  const byOutput: Record<string, string[]> = {
    seminar: [`${t} 특강`, `${t}, 지금 알아야 할 것들`, `현업자가 말하는 ${t}`],
    certificate: [`${t} 과정`],
    profile: [`${t} 전문 강사`],
    thumbnail: [`${t} 이것만 보세요`, `${t} 10분 정리`],
  };
  const byAudience: Record<string, string[]> = {
    senior: [`어르신을 위한 ${t}`],
    corporate: [`임직원 맞춤 ${t} 교육`],
    beginner: [`왕초보도 따라 하는 ${t}`],
    student: [`대학생을 위한 ${t}`],
    jobseeker: [`취업에 강해지는 ${t}`],
  };
  if (state.output === "certificate" || state.output === "profile") return byOutput[state.output];
  return [...(byOutput[state.output] ?? []), ...own, ...(byAudience[state.audience] ?? []), ...GENERIC_TITLES.map((x) => fill(x, t))];
}

/** 주제가 들어간 후보가 모두 카피와 겹칠 때 쓰는 주제 없는 제목 */
const FALLBACK_TITLES: Record<string, string[]> = {
  recruit: ["수강생 모집", "지금 신청하세요"],
  seminar: ["특별 세미나 안내", "무료 특강 안내"],
  cardnews: ["이것만 알면 됩니다", "지금 알아야 할 것"],
  thumbnail: ["이것만 보세요", "10분 정리"],
  certificate: ["과정 수료", "교육 과정 수료"],
  profile: ["강의·출강 전문 강사", "현장형 실무 강사"],
};

const GENERIC_TITLES = ["4주 만에 끝내는 {t}", "현업에서 바로 쓰는 {t}", "{t}, 오늘부터 제대로"];

const SUBTITLES: Record<string, string[]> = {
  beginner: ["처음이어도 괜찮아요, 하나씩 같이 해요", "어려운 용어 없이 쉽게 시작해요"],
  student: ["스펙이 되는 실전 스킬, 지금 시작하세요", "과제도 취업 준비도 한 번에"],
  worker: ["퇴근 후 2시간, 내일 업무가 달라집니다", "바로 써먹는 실무 노하우만 담았어요"],
  corporate: ["팀 전체의 업무 방식이 바뀝니다", "현업 사례 중심의 맞춤형 실습 교육"],
  jobseeker: ["포트폴리오까지 완성하는 실전 과정", "면접에서 말할 수 있는 결과물을 만들어요"],
  senior: ["천천히, 쉽게, 몇 번이고 다시 알려드려요", "자녀에게 묻지 않고 혼자서도 척척"],
  creator: ["혼자서도 전문가처럼, 시간은 절반으로", "내 브랜드를 키우는 실전 도구"],
};

const BADGES: Record<string, string[]> = {
  recruit: ["얼리버드 혜택", "선착순 20명", "1기 모집"],
  seminar: ["무료 특강", "선착순 100명"],
  cardnews: ["저장 필수", "총정리"],
  thumbnail: ["10분 정리", "총정리"],
  certificate: ["우수 수료"],
  profile: ["출강 300회"],
};

const CERT_STATEMENT = "위 사람은 본 과정을 성실히 이수하였기에 이 증서를 수여합니다.";

const CTAS: Record<string, string[]> = {
  feed: ["프로필 링크에서 신청하기", "지금 신청하면 얼리버드 혜택"],
  story: ["위로 밀어서 신청하기", "링크 스티커 눌러 신청"],
  threads: ["댓글에 신청 링크 있어요", "프로필 링크에서 신청"],
  youtube: ["설명란 링크에서 신청"],
  blog: ["본문 하단 링크에서 신청"],
  a4: ["QR 코드 찍고 바로 신청", "선착순 마감, 지금 신청하세요"],
  a4l: ["QR 코드 찍고 바로 신청"],
};

function scheduleIdeas(state: BuilderState, today: DayKey | null, seed: number): string {
  if (!today) return "";
  const weeks = (seed % 3) * 7;
  if (state.output === "certificate") {
    const d = nextWeekday(today, 5, 7 + weeks);
    return `${d.getFullYear()}년 ${formatMD(d)}`;
  }
  if (state.audience === "corporate") {
    const d = nextWeekday(today, 4, 14 + weeks);
    return `${formatMD(d)} 14:00~18:00 (4시간)`;
  }
  switch (state.format) {
    case "offline": {
      const d = nextWeekday(today, 6, 10 + weeks);
      return seed % 2 ? `${formatMD(d)} 시작 · 매주 토 10:00~13:00 (4주)` : `${formatMD(d)} 10:00~17:00 원데이`;
    }
    case "vod": {
      const d = nextWeekday(today, 1, 7 + weeks);
      return seed % 2 ? `${formatMD(d)} 오픈 · 수강 기간 1년` : `${formatMD(d)} 오픈 · 언제든 무제한 시청`;
    }
    case "hybrid": {
      const d = nextWeekday(today, 6, 10 + weeks);
      return `${formatMD(d)} 시작 · 매주 토 10:00~12:00 (6주)`;
    }
    default: {
      const wd = seed % 2 ? 4 : 2;
      const d = nextWeekday(today, wd, 10 + weeks);
      return `${formatMD(d)} 시작 · 매주 ${weekdayName(wd)} 20:00~22:00 (4주)`;
    }
  }
}

function placeIdeas(state: BuilderState): string[] {
  if (state.audience === "corporate") return ["귀사 교육장 방문 또는 Zoom", "사내 교육장 (출강)"];
  if (state.audience === "senior" && state.format !== "vod")
    return ["OO구 평생학습관 2층 강의실", "OO복지관 디지털 교육실"];
  switch (state.format) {
    case "offline":
      return state.audience === "student"
        ? ["OO대학교 공학관 101호", "OO대학교 학생회관 세미나실"]
        : ["서울 강남역 OO교육센터 3층", "판교 OO캠퍼스 세미나실", "성수 OO라운지"];
    case "vod":
      return ["온라인 강의실 · PC/모바일 수강", "클래스 플랫폼 VOD"];
    case "hybrid":
      return ["강남 OO교육센터 + Zoom 동시 진행", "현장 + 온라인 라이브 동시 진행"];
    default:
      return ["Zoom 실시간 라이브", "구글 미트 실시간 라이브", "온라인 라이브 (다시보기 제공)"];
  }
}

function priceIdeas(state: BuilderState): string[] {
  if (state.audience === "corporate") return ["기업 맞춤 견적 · 문의 환영", "인원·일정 맞춤 출강"];
  if (state.audience === "senior") return ["무료 (구민 대상 · 선착순 20명)", "수강료 무료 · 교재 제공"];
  if (state.output === "seminar") return ["무료 특강 · 선착순 50명", "참가비 10,000원 · 자료집 제공"];
  if (state.format === "vod") return ["오픈 기념 40% 할인 59,000원", "평생 소장 79,000원"];
  if (state.audience === "student") return ["학생 할인 49,000원", "선착순 30명 · 수료 시 환급"];
  return ["얼리버드 99,000원 (정가 149,000원)", "1기 한정 30% 할인 · 선착순 20명", "얼리버드 마감 D-7 · 129,000원"];
}

function bullets(bank: TopicBank, seed: number): string[] {
  const list = bank.curriculum;
  const start = (seed * 3) % list.length;
  return [0, 1, 2].map((i) => list[(start + i) % list.length]);
}

/** 띄어쓰기·문장부호를 빼고 비교했을 때 한쪽이 다른 쪽을 품으면 겹친다고 봐요. */
const norm = (t: string) => t.replace(/[^0-9A-Za-z가-힣]/g, "").toLowerCase();
export function overlaps(a: string, b: string): boolean {
  const x = norm(a);
  const y = norm(b);
  return Boolean(x && y) && (x.includes(y) || y.includes(x));
}

/** seed 번째부터 돌면서 avoid 와 겹치지 않는 첫 후보 (모두 겹치면 빈 문자열) */
function pickDistinct(list: string[], seed: number, avoid: string): string {
  for (let i = 0; i < list.length; i++) {
    const c = pick(list, seed + i);
    if (!avoid || !overlaps(c, avoid)) return c;
  }
  return "";
}

function resolveField(mode: InfoMode, value: string, suggestion: string): Resolved {
  if (mode === "omit") return { mode, text: "", suggestion };
  if (mode === "exact") return { mode, text: value.trim(), suggestion };
  return { mode, text: value.trim() || suggestion, suggestion };
}

/** 칸별 모드에 따라 실제로 쓸 문구를 정합니다. */
export function resolveInfo(state: BuilderState, today: DayKey | null): ResolvedInfo {
  const titleValue = state.info.title.mode === "exact" ? state.info.title.value.trim() : "";
  const topicName = state.topic.trim() || titleValue;
  const bank = findTopic(`${state.topic} ${state.info.title.value}`);
  const s = state.seeds;
  // 제목과 카피가 같은 말을 되풀이하지 않게: 직접 입력한 쪽을 기준으로 다른 쪽 예시를 고릅니다.
  const own = (k: InfoKey) => (state.info[k].mode === "omit" ? "" : state.info[k].value.trim());
  const titleSugg = pickDistinct(titleIdeas(state, bank, topicName), s.title, own("subtitle"));
  const titleText = state.info.title.mode === "omit" ? "" : own("title") || titleSugg;
  const sugg: Record<InfoKey, string> = {
    title: titleSugg || pickDistinct(FALLBACK_TITLES[state.output] ?? FALLBACK_TITLES.recruit, s.title, own("subtitle")),
    subtitle:
      state.output === "certificate" ? CERT_STATEMENT : pickDistinct(SUBTITLES[state.audience] ?? SUBTITLES.worker, s.subtitle, titleText),
    badge: pick(BADGES[state.output] ?? BADGES.recruit, s.badge),
    schedule: scheduleIdeas(state, today, s.schedule),
    place: pick(placeIdeas(state), s.place),
    price: pick(priceIdeas(state), s.price),
    instructor: pick(["김OO 강사", "이OO 강사", "박OO 강사"], s.instructor),
    bio: pick(bank.bio, s.bio),
    cta: pick(CTAS[state.platform] ?? CTAS.feed, s.cta),
  };
  const out = {} as Record<InfoKey, Resolved>;
  for (const key of Object.keys(sugg) as InfoKey[]) {
    out[key] = resolveField(state.info[key].mode, state.info[key].value, sugg[key]);
  }
  const suggestion = bullets(bank, s.curriculum);
  const cm = state.curriculum.mode;
  const typed = state.curriculum.items.map((x) => x.trim()).filter(Boolean);
  const items = cm === "omit" ? [] : cm === "exact" ? typed : suggestion;
  return { ...out, curriculum: { mode: cm, items, suggestion }, topic: bank, topicName };
}
