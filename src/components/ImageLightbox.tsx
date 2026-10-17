"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Props = { src: string | null; title: string; onClose: () => void };

/** 예시 이미지를 크게 보여 주는 모달. Esc·배경 클릭·닫기 버튼으로 닫혀요. */
export default function ImageLightbox({ src, title, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (src && !dialog.open) dialog.showModal();
    if (!src && dialog.open) dialog.close();
  }, [src]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={`${title} 크게 보기`}
      className="m-auto w-[min(94vw,1000px)] overflow-hidden rounded-3xl bg-ink p-0 text-white shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      {src && (
        <figure>
          <div className="relative aspect-video w-full bg-black">
            <Image src={src} alt={`${title} AI 생성 예시 이미지`} fill sizes="(max-width: 1000px) 94vw, 1000px" loading="eager" className="object-contain" />
          </div>
          <figcaption className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="min-w-0">
              <span className="block truncate font-bold">{title}</span>
              <span className="block text-xs text-zinc-400">AI 생성 예시 · 같은 프롬프트라도 이미지 AI와 시도마다 결과가 달라요</span>
            </span>
            <button type="button" onClick={onClose} className="shrink-0 rounded-xl bg-volt px-4 py-2 text-sm font-bold text-ink">
              닫기
            </button>
          </figcaption>
        </figure>
      )}
    </dialog>
  );
}
