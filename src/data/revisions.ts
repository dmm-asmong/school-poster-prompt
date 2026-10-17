import type { Label } from "./options";

/** 한 번 탭으로 프롬프트 끝에 덧붙이는 수정 요청 */
export const REVISIONS: (Label & { id: string })[] = [
  { id: "bigText", ko: "제목 글자를 더 크게", en: "make the title text bigger" },
  { id: "brighter", ko: "색감을 더 밝고 선명하게", en: "use brighter, more vivid colors" },
  { id: "softer", ko: "색감을 부드러운 파스텔톤으로", en: "switch to soft pastel tones" },
  { id: "backView", ko: "인물은 뒷모습으로", en: "show people from behind" },
  { id: "moreSpace", ko: "글자 여백을 더 넓게", en: "leave more empty space for text" },
  { id: "simpler", ko: "배경을 더 단순하게", en: "simplify the background" },
  { id: "fewer", ko: "등장인물은 적게", en: "reduce the number of people" },
  { id: "diverse", ko: "다양한 친구들이 함께하는 모습으로", en: "show a diverse group of children together" },
  { id: "spelling", ko: "한글 맞춤법은 정확하게", en: "double-check the Korean spelling" },
  { id: "print", ko: "인쇄용으로 또렷하게", en: "make it look crisp for printing" },
];
