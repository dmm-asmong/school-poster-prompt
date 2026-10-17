# ▲ 클래스부스트 ClassBoost

**강사를 위한 강의 홍보물 프롬프트 메이커.** 강의 주제와 대상만 고르면 이미지 생성 AI에 붙여 넣을 홍보물 프롬프트와
인스타·스레드·블로그용 홍보 문구를 한 번에 만들어 줍니다. IT·컴퓨터 강사, 프리랜서 강사, 대학·성인·기업교육 강사를 위해 만들었어요.

- 무료, 로그인 없음, 광고·추적 없음
- 모든 처리는 브라우저 안에서만 이루어지고 서버로 아무것도 보내지 않습니다
- 이 사이트는 **프롬프트와 문구(글)만** 만듭니다. 이미지는 ChatGPT·Gemini 등 이미지 AI에서 생성하세요

## 주요 기능

| 기능 | 설명 |
| --- | --- |
| 홍보물 6종 | 강의 모집 포스터, 특강·세미나 안내, 카드뉴스 표지, SNS 썸네일, 수료증, 강사 프로필 카드 |
| 플랫폼 사이즈 7종 | 인스타 피드 4:5, 스토리·릴스 9:16, 스레드 1:1, 유튜브 16:9, 블로그 1.91:1, A4 세로/가로 → 프롬프트 비율(AR) 자동 |
| 강의 정보 칸별 모드 | 제목·카피·일정·장소·수강료·강사명·소개·신청 안내를 칸마다 **직접 입력 / AI 예시 / 넣지 않기** |
| 제목 다듬기 | 제목을 AI 예시로 두면 프롬프트가 더 짧고 눈에 띄는 제목으로 다듬게 지시 |
| 주제 인식 | 파이썬·엑셀·ChatGPT·노션·데이터·웹·캔바·유튜브 등 주제에 맞는 비주얼·커리큘럼·해시태그 자동 제안 |
| 디자인 | 분위기 6종, 스타일 8종, 브랜드 컬러(팔레트 + 직접 선택), 강사 사진 합성 자리, QR 빈칸, 피할 것 |
| 홍보 문구 패널 | 인스타(이모지+해시태그)·스레드(대화체, 태그 1개)·블로그(제목+본문+키워드) 템플릿 문구, 전체/해시태그 복사 |
| 한/영 프롬프트 | 같은 설정을 영어 프롬프트로 전환, 수정 요청 문장 복사 |
| 예시 갤러리 12개 | '이 예시로 시작'으로 빌더에 불러오기. `public/examples/<id>.webp`가 있으면 이미지, 없으면 미리보기 카드 |

## 예시 이미지 넣기

```bash
npx tsx --tsconfig tsconfig.json scripts/export-instructor-prompts.ts   # raw-examples/instructor-prompts.json
# raw-examples/<id>.jpg|png 로 이미지를 저장한 뒤
python3 scripts/optimize-example-images.py                               # public/examples/<id>.webp
```

빌드할 때 `public/examples/<id>.webp`가 있는 예시만 이미지로 보여 줍니다.

## 기술 스택

- Next.js 16 (App Router, 정적 페이지) · React 19 · TypeScript · Tailwind CSS v4 · Pretendard (CDN, SRI)
- 보안 헤더(CSP 등)는 `next.config.ts`에서 설정
- 백엔드, API 키, 데이터베이스 없음

## 로컬 실행

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```
