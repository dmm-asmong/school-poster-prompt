import { SectionTitle } from "./ui";

const STEPS = [
  { n: "01", t: "고르기", d: "홍보물 종류와 올릴 곳(사이즈)을 고르고, 강의 정보를 칸마다 '직접 입력 · AI 예시 · 넣지 않기' 중에서 정해요." },
  { n: "02", t: "복사하기", d: "오른쪽 결과판에서 이미지 프롬프트(한/영)와 채널별 홍보 문구를 복사해요." },
  { n: "03", t: "붙여 넣기", d: "ChatGPT, Gemini 같은 이미지 AI에 프롬프트를 넣고, 완성된 이미지와 홍보 문구를 함께 올려요." },
];

const TIPS = [
  "이미지 AI는 한글을 틀리기 쉬워요. 글자가 틀리면 결과판의 '수정 요청' 문장을 이어서 보내 보세요.",
  "AI 예시로 채운 일정·장소·가격은 가상이에요. 올리기 전에 꼭 실제 정보로 바꾸세요.",
  "강사 사진을 쓰고 싶다면 '사진 합성 자리 남기기'를 켜고, 나중에 캔바 등에서 실제 사진을 얹으세요.",
  "QR 코드는 AI가 그리면 작동하지 않아요. 빈칸만 남기고 실제 QR을 붙이세요.",
];

export default function HowTo() {
  return (
    <section id="how" className="scroll-mt-16 bg-ink py-14 text-white sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle dark eyebrow="How it works" title="3단계면 홍보 준비 끝" desc="이 사이트는 프롬프트와 문구(글)만 만들어요. 입력한 내용은 서버로 보내지 않고 브라우저 안에서만 처리돼요." />
        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <span className="text-sm font-black text-volt">{s.n}</span>
              <p className="mt-1 text-lg font-extrabold">{s.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.d}</p>
            </li>
          ))}
        </ol>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {TIPS.map((t) => (
            <li key={t} className="flex gap-2 rounded-2xl bg-white/5 p-4 text-sm leading-relaxed text-zinc-300">
              <span className="text-volt" aria-hidden>
                ✦
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
