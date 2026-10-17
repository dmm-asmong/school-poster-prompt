"use client";

import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";

type Props = { text: string; className?: string; label?: string; variant?: "volt" | "ink" | "ghost" };

export default function CopyButton({ text, className = "", label = "복사", variant = "volt" }: Props) {
  const [status, setStatus] = useState<"idle" | "done" | "fail">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const onClick = async () => {
    const ok = await copyText(text);
    setStatus(ok ? "done" : "fail");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 1800);
  };

  const idle =
    variant === "volt"
      ? "bg-volt text-ink hover:brightness-95"
      : variant === "ink"
        ? "bg-ink text-white hover:bg-ink-2"
        : "bg-white text-ink ring-1 ring-zinc-200 hover:ring-zinc-400";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-live="polite"
      data-copy-status={status}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl font-bold transition active:scale-95 ${
        status === "done" ? "bg-emerald-500 text-white" : status === "fail" ? "bg-rose-500 text-white" : idle
      } ${className}`}
    >
      {status === "done" ? "✓ 복사됨" : status === "fail" ? "복사 실패 · 직접 선택해 주세요" : label}
    </button>
  );
}
