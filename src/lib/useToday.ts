"use client";

import { useSyncExternalStore } from "react";
import { todayKey, type DayKey } from "./dates";

const subscribe = () => () => {};
let cached: { key: string; value: DayKey } | null = null;

function getSnapshot(): DayKey {
  const value = todayKey();
  const key = `${value.y}-${value.m}-${value.d}`;
  if (!cached || cached.key !== key) cached = { key, value };
  return cached.value;
}

/**
 * 오늘 날짜. 정적 HTML(서버)에서는 null 이고, 브라우저에서 실제 날짜로 바뀝니다.
 * 빌드한 날과 방문한 날이 달라도 화면이 어긋나지 않게 하려는 장치예요.
 */
export function useToday(): DayKey | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
