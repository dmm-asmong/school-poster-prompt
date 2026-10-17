/**
 * 갤러리 예시 36개의 '좋은 프롬프트'를 raw-examples/prompts.json 으로 내보냅니다.
 * 이미지 생성 AI에 넣을 원본 프롬프트와 비율이 들어 있어요.
 *
 *   npx tsx --tsconfig tsconfig.json scripts/export-example-prompts.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { RATIOS } from "../src/data/options";
import { EXAMPLES } from "../src/data/examples";
import { stateFromExample } from "../src/lib/builder";
import { todayKey } from "../src/lib/dates";
import { buildPrompt } from "../src/lib/prompt";

const today = todayKey();
const rows = EXAMPLES.map((ex) => {
  const state = stateFromExample(ex.state);
  const ratio = RATIOS.find((r) => r.id === state.ratio) ?? RATIOS[0];
  return {
    id: ex.id,
    title: ex.title,
    ratio: ratio.label,
    ar: ratio.ar,
    prompt: buildPrompt(state, "ko", today),
    promptEn: buildPrompt(state, "en", today),
  };
});

mkdirSync("raw-examples", { recursive: true });
writeFileSync("raw-examples/prompts.json", JSON.stringify(rows, null, 2));
console.log(`exported ${rows.length} prompts → raw-examples/prompts.json`);
