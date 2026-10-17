/** 기준일 (시각 없이 날짜만) */
export type DayKey = { y: number; m: number; d: number };

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function todayKey(now = new Date()): DayKey {
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

/** 오늘에서 minDays 이상 지난 첫 번째 해당 요일 (0=일 … 6=토) */
export function nextWeekday(today: DayKey, weekday: number, minDays: number): Date {
  const date = new Date(today.y, today.m - 1, today.d + minDays);
  while (date.getDay() !== weekday) date.setDate(date.getDate() + 1);
  return date;
}

/** 11월 4일(화) */
export function formatMD(date: Date): string {
  return `${date.getMonth() + 1}월 ${date.getDate()}일(${WEEKDAYS[date.getDay()]})`;
}

export function weekdayName(weekday: number): string {
  return WEEKDAYS[weekday];
}
