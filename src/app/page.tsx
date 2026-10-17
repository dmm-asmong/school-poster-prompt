import { readdirSync } from "node:fs";
import path from "node:path";
import HowTo from "@/components/HowTo";
import Hero from "@/components/Hero";
import Studio from "@/components/Studio";
import { EXAMPLES } from "@/data/examples";

/** 빌드할 때 public/examples/<id>.webp 가 있는 예시만 이미지로 보여 줘요. (없으면 미리보기 카드) */
function exampleImages(): string[] {
  try {
    const files = new Set(readdirSync(path.join(process.cwd(), "public", "examples")));
    return EXAMPLES.map((ex) => ex.id).filter((id) => files.has(`${id}.webp`));
  } catch {
    return [];
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
