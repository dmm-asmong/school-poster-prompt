/**
 * 갤러리 예시 12개의 이미지 프롬프트를 raw-examples/instructor-prompts.json 으로 내보냅니다.
 * 날짜 추천이 실행일에 따라 달라지지 않게 기준일을 고정해요.
 *
 *   npx tsx --tsconfig tsconfig.json scripts/export-instructor-prompts.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { OUTPUT_TYPES, PLATFORMS, byId } from "../src/data/options";
import { EXAMPLES } from "../src/data/examples";
import { buildPrompt } from "../src/lib/prompt";
import { stateFromExample } from "../src/lib/state";

const today = { y: 2026, m: 10, d: 17 };
const rows = EXAMPLES.map((ex) => {
  const state = stateFromExample(ex.state);
  const platform = byId(PLATFORMS, state.platform);
  return {
    id: ex.id,
    title: ex.title,
    output: byId(OUTPUT_TYPES, state.output)?.label,
    platform: platform ? `${platform.label} ${platform.ratio}` : undefined,
    file: `public/examples/${ex.id}.webp`,
    prompt: buildPrompt(state, "en", today),
    promptKo: buildPrompt(state, "ko", today),
  };
});

mkdirSync("raw-examples", { recursive: true });
writeFileSync("raw-examples/instructor-prompts.json", JSON.stringify(rows, null, 2) + "\n");
console.log(`exported ${rows.length} prompts → raw-examples/instructor-prompts.json`);
