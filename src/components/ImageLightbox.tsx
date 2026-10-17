"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { ExampleImage } from "@/data/exampleImages";

type Props = {
  image: ExampleImage | null;
  title: string;
  onClose: () => void;
};

/** 예시 이미지를 크게 보여 주는 모달. Esc·배경 클릭·닫기 버튼으로 닫혀요. */
export default function ImageLightbox({ image, title, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (image && !dialog.open) dialog.showModal();
    if (!image && dialog.open) dialog.close();
  }, [image]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={`${title} 크게 보기`}
      className="m-auto max-h-[92vh] w-[min(92vw,900px)] overflow-hidden rounded-3xl bg-white p-0 shadow-2xl backdrop:bg-slate-900/70 backdrop:backdrop-blur-sm"
    >
      {image && (
        <figure className="flex max-h-[92vh] flex-col">
          <div className="relative min-h-0 flex-1 bg-slate-100">
            <Image
              src={image.src}
              alt={`${title} AI 생성 예시 이미지`}
              width={image.width}
              height={image.height}
              sizes="(max-width: 900px) 92vw, 900px"
              className="mx-auto h-auto max-h-[78vh] w-auto object-contain"
            />
          </div>
          <figcaption className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="min-w-0">
              <span className="block truncate font-bold text-slate-900">{title}</span>
              <span className="block text-xs text-slate-500">
                AI 생성 예시 이미지 · 같은 프롬프트라도 이미지 AI와 시도마다 결과가 달라요
              </span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
            >
              닫기
            </button>
          </figcaption>
        </figure>
      )}
    </dialog>
  );
}
