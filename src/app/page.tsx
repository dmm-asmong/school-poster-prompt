import { readdirSync } from "node:fs";
import path from "node:path";
import HowTo from "@/components/HowTo";
import Hero from "@/components/Hero";
import Studio from "@/components/Studio";
import { EXAMPLES } from "@/data/examples";

/**
 * 빌드할 때 public/examples 에 이미지가 있는 예시만 이미지로 보여 줘요. (없으면 미리보기 카드)
 * 파일 이름은 <id>.<내용해시>.webp — 이미지를 바꾸면 주소가 바뀌어 캐시된 옛 이미지가 나오지 않아요.
 */
function exampleImages(): Record<string, string> {
  try {
    const files = readdirSync(path.join(process.cwd(), "public", "examples"));
    const out: Record<string, string> = {};
    for (const ex of EXAMPLES) {
      const file =
        files.find((f) => new RegExp(`^${ex.id}\\.[0-9a-f]{8}\\.webp$`).test(f)) ?? files.find((f) => f === `${ex.id}.webp`);
      if (file) out[ex.id] = `/examples/${file}`;
    }
    return out;
  } catch {
    return {};
  }
}

export default function Home() {
  return (
    <>
      <Hero />
      <Studio images={exampleImages()} />
      <HowTo />
    </>
  );
}
