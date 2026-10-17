#!/usr/bin/env python3
"""raw-examples/<id>.(png|jpg|jpeg|webp) 원본을 public/examples/<id>.webp 로 줄입니다.
예시 id 목록은 raw-examples/instructor-prompts.json 에서 읽어요. (원본 폴더는 git에 올리지 않아요)
빌드할 때 public/examples/<id>.webp 가 있는 예시만 이미지로 보이고, 없으면 미리보기 카드가 나와요.

    python3 scripts/optimize-example-images.py [--long 1024] [--quality 80]
"""
import argparse
import json
import pathlib

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / "raw-examples"
OUT = ROOT / "public" / "examples"
EXTS = (".png", ".jpg", ".jpeg", ".webp")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--long", type=int, default=1024)
    ap.add_argument("--quality", type=int, default=80)
    args = ap.parse_args()

    known = {row["id"] for row in json.loads((RAW / "instructor-prompts.json").read_text())}
    OUT.mkdir(parents=True, exist_ok=True)

    done = {}
    for src in sorted(RAW.iterdir()):
        if src.suffix.lower() not in EXTS or src.stem not in known:
            continue
        im = Image.open(src).convert("RGB")
        im.thumbnail((args.long, args.long), Image.LANCZOS)
        dst = OUT / f"{src.stem}.webp"
        im.save(dst, "WEBP", quality=args.quality, method=6)
        done[src.stem] = dst.stat().st_size

    present = {p.stem for p in OUT.glob("*.webp") if p.stem in known}
    print(f"converted: {len(done)}  present: {len(present)}/{len(known)}  ({sum(done.values()) / 1024:.0f} KB new)")
    missing = sorted(known - present)
    if missing:
        print("missing:", ", ".join(missing))


if __name__ == "__main__":
    main()
