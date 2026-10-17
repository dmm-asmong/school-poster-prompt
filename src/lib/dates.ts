import type { DateRule } from "@/data/copy";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 기준일 (시각 없이 날짜만) */
export type DayKey = { y: number; m: number; d: number };

export function toDate({ y, m, d }: DayKey): Date {
  return new Date(y, m - 1, d);
}

function fromDate(date: Date): DayKey {
  return { y: date.getFullYear(), m: date.getMonth() + 1, d: date.getDate() };
}

function addDays(date: Date, n: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + n);
  return next;
}

/** 2026년 10월 23일(금) */
export function formatDay(date: Date, withYear = true): string {
  const md = `${date.getMonth() + 1}월 ${date.getDate()}일(${WEEKDAYS[date.getDay()]})`;
  return withYear ? `${date.getFullYear()}년 ${md}` : md;
}

function formatRange(start: Date, end: Date): string {
  return `${formatDay(start)} ~ ${formatDay(end, start.getFullYear() !== end.getFullYear())}`;
}

/** 시작 요일 조건에 맞게 앞으로(넘치면 뒤로) 옮깁니다. */
function alignStart(date: Date, rule: DateRule): Date {
  const mode = rule.start ?? "weekday";
  if (mode === "fixed") return date;
  const ok = (dt: Date) => (mode === "monday" ? dt.getDay() === 1 : dt.getDay() >= 1 && dt.getDay() <= 5);
  for (let i = 0; i < 7; i++) {
    const fwd = addDays(date, i);
    if (ok(fwd) && fwd.getMonth() === date.getMonth()) return fwd;
  }
  for (let i = 1; i < 7; i++) {
    const back = addDays(date, -i);
    if (ok(back)) return back;
  }
  return date;
}

function dateFromRule(rule: DateRule, year: number, seed: number, notBefore?: Date): Date {
  let from = rule.from;
  if (notBefore && notBefore.getFullYear() === year && notBefore.getMonth() === rule.month - 1) {
    from = Math.max(from, notBefore.getDate());
  }
  const width = Math.max(rule.to - from + 1, 1);
  const day = from + ((seed * 7 + 3) % width);
  return alignStart(new Date(year, rule.month - 1, day), rule);
}

/** 이 규칙이 다음에 돌아오는 해 (올해 기간이 아직 남았으면 올해) */
function nextYearFor(rule: DateRule, soonest: Date): number {
  const y = soonest.getFullYear();
  const lastDay = new Date(y, rule.month - 1, rule.to);
  return lastDay >= soonest ? y : y + 1;
}

/**
 * 행사에 어울리는 가상의 날짜를 만듭니다.
 * 가장 가까이 돌아오는 시기를 먼저 추천하고(올해 남아 있으면 올해), 요일은 실제 달력으로 계산합니다.
 */
export function sampleDate(rules: DateRule[], today: DayKey, seed: number): { text: string; year: number } {
  const base = toDate(today);
  if (rules.length === 0) {
    // 규칙이 없으면 2~5주 뒤 평일
    const start = alignStart(addDays(base, 14 + ((seed * 5) % 21)), {} as DateRule);
    return { text: formatDay(start), year: start.getFullYear() };
  }
  // 준비 기간을 생각해 최소 사흘 뒤부터 고릅니다.
  const soonest = addDays(base, 3);
  const ordered = rules
    .map((rule) => {
      const year = nextYearFor(rule, soonest);
      return { rule, year, first: new Date(year, rule.month - 1, rule.from) };
    })
    .sort((a, b) => a.first.getTime() - b.first.getTime());
  const { rule, year } = ordered[seed % ordered.length];
  const roundSeed = Math.floor(seed / ordered.length);
  let start = dateFromRule(rule, year, roundSeed, soonest);
  if (start < soonest) start = dateFromRule(rule, year + 1, roundSeed);
  if (rule.span && rule.span > 1) {
    // 며칠짜리 평일 행사는 주말에 걸치지 않게 앞당깁니다. (예: 금~토 → 목~금)
    if ((rule.start ?? "weekday") === "weekday" && rule.span <= 5) {
      while (start.getDay() + rule.span - 1 > 5) start = addDays(start, -1);
    }
    const end = addDays(start, rule.span - 1);
    return { text: formatRange(start, end), year: start.getFullYear() };
  }
  return { text: formatDay(start), year: start.getFullYear() };
}

export function todayKey(now = new Date()): DayKey {
  return fromDate(now);
}
