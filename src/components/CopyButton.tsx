"use client";

import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";

type Props = { text: string; className?: string; label?: string };

export default function CopyButton({ text, className = "", label = "복사" }: Props) {
  const [status, setStatus] = useState<"idle" | "done" | "fail">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const onClick = async () => {
    const ok = await copyText(text);
    setStatus(ok ? "done" : "fail");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 1800);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-live="polite"
      className={`inline-flex items-center justify-center gap-1.5 rounded-full font-bold transition active:scale-95 ${
        status === "done"
          ? "bg-emerald-500 text-white"
          : status === "fail"
            ? "bg-rose-500 text-white"
            : "bg-gradient-to-r from-pink-500 to-indigo-500 text-white hover:brightness-110"
      } ${className}`}
    >
      {status === "done" ? "✓ 복사됨" : status === "fail" ? "복사 실패 · 직접 선택해 주세요" : `📋 ${label}`}
    </button>
  );
}
