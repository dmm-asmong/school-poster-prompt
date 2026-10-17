import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink py-8 text-zinc-500">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 text-xs sm:flex-row sm:items-center sm:justify-between">
        <Logo dark />
        <p>무료 · 로그인 없음 · 입력 내용은 브라우저 밖으로 나가지 않아요. 예시 이미지는 AI로 생성했어요.</p>
      </div>
    </footer>
  );
}
