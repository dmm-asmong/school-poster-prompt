#!/usr/bin/env python3
"""raw-examples/<id>.(png|jpg|jpeg|webp) 원본을 public/examples/<id>.webp 로 줄이고
src/data/exampleImages.ts 목록을 다시 만듭니다. (원본 폴더는 git에 올리지 않아요)

    python3 scripts/optimize-example-images.py [--long 800] [--quality 80]
"""
import argparse
import json
import pathlib

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / "raw-examples"
OUT = ROOT / "public" / "examples"
MANIFEST = ROOT / "src" / "data" / "exampleImages.ts"
EXTS = (".png", ".jpg", ".jpeg", ".webp")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--long", type=int, default=800)
    ap.add_argument("--quality", type=int, default=80)
    args = ap.parse_args()

    ids = json.loads((RAW / "prompts.json").read_text())
    known = {row["id"] for row in ids}
    OUT.mkdir(parents=True, exist_ok=True)

    sizes = {}
    for src in sorted(RAW.iterdir()):
        if src.suffix.lower() not in EXTS or src.stem not in known:
            continue
        im = Image.open(src).convert("RGB")
        im.thumbnail((args.long, args.long), Image.LANCZOS)
        dst = OUT / f"{src.stem}.webp"
        im.save(dst, "WEBP", quality=args.quality, method=6)
        sizes[src.stem] = (im.width, im.height, dst.stat().st_size)

    # 원본이 없어진 예시의 오래된 webp 는 목록에서 빠지도록 현재 파일 기준으로 만듭니다.
    for webp in sorted(OUT.glob("*.webp")):
        if webp.stem in known and webp.stem not in sizes:
            with Image.open(webp) as im:
                sizes[webp.stem] = (im.width, im.height, webp.stat().st_size)

    lines = [
        "// 이 파일은 scripts/optimize-example-images.py 가 자동으로 만듭니다. 직접 고치지 마세요.",
        "// 예시 id → public/examples/<id>.webp 이미지 크기. 목록에 없는 예시는 그라데이션 카드로 보여 줍니다.",
        "",
        "export type ExampleImage = { src: string; width: number; height: number };",
        "",
        "export const EXAMPLE_IMAGES: Record<string, ExampleImage> = {",
    ]
    for key in sorted(sizes):
        w, h, _ = sizes[key]
        lines.append(f'  "{key}": {{ src: "/examples/{key}.webp", width: {w}, height: {h} }},')
    lines.append("};")
    MANIFEST.write_text("\n".join(lines) + "\n")

    total = sum(s for *_, s in sizes.values())
    missing = sorted(known - set(sizes))
    print(f"images: {len(sizes)}/{len(known)}  total: {total / 1024 / 1024:.2f} MB")
    if missing:
        print("missing:", ", ".join(missing))


if __name__ == "__main__":
    main()
