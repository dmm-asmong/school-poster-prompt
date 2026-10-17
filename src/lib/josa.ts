/** 마지막 글자의 받침 유무에 따라 조사를 고릅니다. (예: 을/를, 은/는) */
export function josa(word: string, withBatchim: string, withoutBatchim: string): string {
  const trimmed = word.trim().replace(/["'”’)\]]+$/, "");
  const last = trimmed.charCodeAt(trimmed.length - 1);
  if (last >= 0xac00 && last <= 0xd7a3) {
    return (last - 0xac00) % 28 === 0 ? withoutBatchim : withBatchim;
  }
  // 숫자로 끝나면 읽는 소리 기준 (0,1,3,6,7,8 은 받침 있음)
  if (last >= 48 && last <= 57) {
    return "013678".includes(String.fromCharCode(last)) ? withBatchim : withoutBatchim;
  }
  return `${withBatchim}(${withoutBatchim})`;
}
