import type { Label } from "./options";

export type Style = Label & { id: string };
export type StyleCategory = { id: string; ko: string; emoji: string; styles: Style[] };

/** [id, 한국어, 영어] 튜플로 짧게 정의한 뒤 객체로 바꿉니다. */
type Row = [string, string, string];

function category(id: string, ko: string, emoji: string, rows: Row[]): StyleCategory {
  return { id, ko, emoji, styles: rows.map(([sid, sko, sen]) => ({ id: sid, ko: sko, en: sen })) };
}

export const STYLE_CATEGORIES: StyleCategory[] = [
  category("toy", "장난감·공예", "🧱", [
    ["brick", "블록 장난감 디오라마", "plastic brick toy diorama"],
    ["clay", "말랑한 점토 클레이", "soft modeling clay"],
    ["felt", "펠트 인형", "handmade felt dolls"],
    ["origami", "종이접기", "folded origami paper"],
    ["papercut", "겹겹이 페이퍼 컷", "layered paper cut-out"],
    ["knit", "뜨개질 니트", "knitted yarn"],
    ["wood", "나무 장난감", "carved wooden toys"],
    ["miniature", "미니어처 모형", "tiny handcrafted miniature set"],
    ["vinyl", "말랑 3D 피규어", "glossy vinyl toy figures"],
    ["sticker", "다이컷 스티커", "die-cut sticker sheet"],
    ["bead", "비즈·퍼즐 공예", "bead and puzzle craft"],
  ]),
  category("illust", "일러스트", "🖍️", [
    ["flat", "플랫 일러스트", "clean flat illustration"],
    ["picturebook", "그림책 수채 일러스트", "watercolor picture-book illustration"],
    ["pencil", "색연필 드로잉", "colored pencil drawing"],
    ["crayon", "크레파스 그림", "wax crayon drawing"],
    ["isometric", "아이소메트릭", "isometric illustration"],
    ["infographic", "벡터 인포그래픽", "vector infographic"],
    ["linocut", "리노컷 판화", "linocut print"],
    ["collage", "잡지 콜라주", "magazine paper collage"],
    ["doodle", "손그림 낙서", "hand-drawn doodles"],
    ["retroillust", "레트로 교과서 삽화", "retro textbook illustration"],
  ]),
  category("photo", "사진", "📷", [
    ["realphoto", "자연스러운 실사 사진", "natural realistic photograph"],
    ["studio", "깔끔한 스튜디오 사진", "clean studio photograph"],
    ["drone", "드론 항공 사진", "aerial drone photograph"],
    ["film", "필름 카메라 감성", "film camera look with soft grain"],
    ["tiltshift", "틸트시프트 미니어처", "tilt-shift miniature photo"],
    ["bw", "흑백 다큐 사진", "black-and-white documentary photo"],
    ["macro", "접사 매크로", "macro close-up photo"],
    ["goldenhour", "노을빛 골든아워", "golden hour outdoor photo"],
    ["flatlay", "위에서 내려다본 플랫레이", "top-down flat lay photo"],
  ]),
  category("paint", "회화", "🎨", [
    ["watercolor", "맑은 수채화", "transparent watercolor painting"],
    ["oil", "두툼한 유화", "thick impasto oil painting"],
    ["acrylic", "팝 아크릴화", "bold pop acrylic painting"],
    ["minhwa", "한국 민화", "Korean folk painting (minhwa)"],
    ["ink", "수묵 담채화", "Korean ink wash painting"],
    ["impression", "인상파 붓터치", "impressionist brushwork"],
    ["pointillism", "점묘화", "pointillism"],
    ["pastel", "파스텔화", "soft chalk pastel drawing"],
    ["gouache", "과슈 일러스트", "matte gouache painting"],
  ]),
  category("anime", "애니·웹툰", "✨", [
    ["cel", "따뜻한 셀 애니메이션", "warm hand-drawn cel animation"],
    ["webtoon", "웹툰 컷", "Korean webtoon panel"],
    ["chibi", "SD 캐릭터", "chibi super-deformed characters"],
    ["3danim", "3D 애니메이션 영화", "3D animated film still"],
    ["pixel", "픽셀 아트", "pixel art"],
    ["retroanime", "90년대 레트로 애니", "1990s retro anime"],
    ["cartoon", "굵은 선 카툰", "bold outline cartoon"],
    ["halftone", "만화책 하프톤", "comic book halftone"],
    ["emoji", "이모지 캐릭터", "emoji-style characters"],
  ]),
  category("minimal", "미니멀", "◻️", [
    ["lineart", "한 줄 라인아트", "minimal single-line art"],
    ["geometric", "기하학 도형", "geometric shapes"],
    ["swiss", "스위스 그리드 포스터", "Swiss grid poster design"],
    ["silhouette", "단색 실루엣", "single-color silhouettes"],
    ["pastelmin", "파스텔 미니멀", "pastel minimalism"],
    ["negative", "여백의 미 네거티브 스페이스", "negative space composition"],
    ["bauhaus", "바우하우스", "Bauhaus-inspired design"],
    ["icons", "아이콘 패턴", "simple icon pattern"],
  ]),
  category("trend", "트렌디", "🪩", [
    ["y2k", "Y2K 크롬", "Y2K chrome aesthetic"],
    ["neon", "사이버펑크 네온", "cyberpunk neon"],
    ["vapor", "베이퍼웨이브", "vaporwave"],
    ["glass", "글래스모피즘", "glassmorphism"],
    ["holo", "홀로그램", "holographic iridescent"],
    ["claymorph", "클레이모피즘 3D", "claymorphism 3D icons"],
    ["mesh", "그라데이션 메시", "gradient mesh"],
    ["galaxy", "우주 갤럭시", "galaxy and outer space"],
    ["newsprint", "레트로 신문 지면", "vintage newspaper layout"],
    ["risograph", "리소그래프 인쇄", "risograph print"],
  ]),
  category("type", "타이포", "🔤", [
    ["bigtype", "대형 타이포 포스터", "bold typographic poster"],
    ["lettering", "손글씨 레터링", "hand lettering"],
    ["calligraphy", "붓글씨 캘리그래피", "Korean brush calligraphy"],
    ["signboard", "레트로 간판 글씨", "retro shop sign lettering"],
    ["balloon", "3D 풍선 글자", "inflated 3D balloon letters"],
    ["chalk", "칠판 분필 글씨", "chalkboard chalk lettering"],
    ["neonsign", "네온사인 글자", "glowing neon sign letters"],
    ["stencil", "스텐실 글자", "stencil lettering"],
  ]),
];

export const ALL_STYLES: Style[] = STYLE_CATEGORIES.flatMap((c) => c.styles);

export function findStyle(id: string | null): Style | undefined {
  return id ? ALL_STYLES.find((s) => s.id === id) : undefined;
}
