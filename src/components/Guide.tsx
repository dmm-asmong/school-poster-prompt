import SectionTitle from "./SectionTitle";

const TIPS = [
  { emoji: "🎯", title: "보이는 것을 적기", body: "'예쁘게', '멋있게' 대신 운동장, 만국기, 벚꽃처럼 눈에 보이는 장면과 소품을 적어 주세요." },
  { emoji: "🖌️", title: "화풍은 하나만", body: "여러 화풍을 섞으면 결과가 흐려져요. 한 가지를 고르고 분위기로 느낌을 더하세요." },
  { emoji: "🔤", title: "정해진 건 정확히, 미정이면 예시로", body: "'포스터에 들어갈 정보'에서 확정된 제목·일시·장소는 '정확히 입력'으로, 아직 미정이면 'AI가 예시로 채우기'로 시안부터 받아 보세요. 글자는 짧을수록 정확하게 나와요." },
  { emoji: "📐", title: "용도에 맞는 비율", body: "포스터 4:5, 현수막 21:9, 발표 자료 16:9, 가정통신문은 A4 세로처럼 쓰임새에 맞춰 고르세요." },
  { emoji: "🔁", title: "한 번에 끝내지 않기", body: "첫 결과가 아쉬우면 '수정 요청' 칩을 눌러 같은 대화에 이어서 보내 보세요." },
  { emoji: "🧾", title: "마지막은 사람 눈으로", body: "'예시(가상)'로 표시된 날짜·장소는 실제 정보가 아니에요. 맞춤법, 날짜, 학교 이름은 꼭 직접 확인한 뒤 배포하세요." },
];

export default function Guide() {
  return (
    <section id="guide" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:py-14">
      <SectionTitle eyebrow="사용 가이드" title="더 좋은 결과를 위한 팁" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TIPS.map((t) => (
          <div key={t.title} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-2xl" aria-hidden>
              {t.emoji}
            </p>
            <h3 className="mt-2 font-extrabold text-slate-900">{t.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{t.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-extrabold text-amber-900">🛡️ 초상권, 꼭 챙겨 주세요</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-amber-900/80">
            <li>실제 학생 사진을 AI에 올리거나, 학생 얼굴을 닮게 만들지 마세요.</li>
            <li>인물은 뒷모습, 먼 거리, 그림책·캐릭터 화풍으로 표현하는 걸 권장해요.</li>
            <li>빌더의 &lsquo;얼굴 식별 안 되게&rsquo; 옵션을 켜 두면 프롬프트에 자동으로 들어가요.</li>
            <li>학교 로고나 실제 교복을 넣을 때는 학교 방침을 먼저 확인하세요.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-5">
          <h3 className="font-extrabold text-indigo-900">🤖 이미지는 어디서 만드나요?</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-indigo-900/80">
            <li>이 사이트는 프롬프트(문장)만 만들어요. 이미지를 직접 생성하지 않아요.</li>
            <li>복사한 문장을 ChatGPT나 다른 이미지 생성 AI에 붙여 넣으면 돼요.</li>
            <li>무료 플랜은 하루 생성 횟수가 제한될 수 있어요. 서비스별 정책을 확인하세요.</li>
            <li>입력한 내용은 서버로 전송되지 않고 내 브라우저 안에서만 처리돼요.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
