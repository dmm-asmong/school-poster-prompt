import { AUDIENCES, FORMATS, byId } from "@/data/options";
import type { DayKey } from "./dates";
import type { BuilderState } from "./state";
import { resolveInfo } from "./suggest";

export type Channel = "instagram" | "threads" | "blog";

export const CHANNELS: { id: Channel; label: string; emoji: string; hint: string }[] = [
  { id: "instagram", label: "인스타그램", emoji: "📷", hint: "이모지 + 해시태그 10개 안팎" },
  { id: "threads", label: "스레드", emoji: "🧵", hint: "대화체 · 태그는 1개만" },
  { id: "blog", label: "블로그", emoji: "✍️", hint: "제목 + 본문 + 키워드" },
];

export type Caption = { text: string; hashtags: string };

const HOOKS: Record<string, string[]> = {
  beginner: ["\"나도 할 수 있을까?\" 걱정했다면 이 강의가 딱이에요.", "어디서부터 시작할지 막막했다면, 여기서 시작하세요."],
  student: ["학점도, 스펙도, 포트폴리오도 챙기고 싶다면?", "졸업 전에 꼭 갖춰야 할 실전 스킬."],
  worker: ["매일 반복되는 그 일, 더 빨리 끝낼 수 있어요.", "퇴근 후 2시간 투자로 내일 업무가 달라집니다."],
  corporate: ["우리 팀 업무 방식, 이번 교육으로 바꿔 보세요.", "현업 사례로 바로 적용하는 임직원 맞춤 교육."],
  jobseeker: ["면접에서 \"해봤어요\"라고 말할 수 있게.", "취업 시장이 원하는 실전 역량, 직접 만들어요."],
  senior: ["천천히, 쉽게, 몇 번이고 다시 알려드려요.", "이제 자녀에게 묻지 않고 혼자서도 척척!"],
  creator: ["혼자 일하는 사람에게 필요한 건 시간을 아껴 주는 도구.", "작은 브랜드도 전문가처럼 보이게."],
};

const AUDIENCE_TAG: Record<string, string> = {
  beginner: "#왕초보",
  student: "#대학생",
  worker: "#직장인공부",
  corporate: "#기업교육",
  jobseeker: "#취준생",
  senior: "#시니어교육",
  creator: "#1인사업자",
};

const FORMAT_TAG: Record<string, string> = {
  live: "#온라인강의",
  offline: "#오프라인강의",
  vod: "#VOD강의",
  hybrid: "#하이브리드수업",
};

const OUTPUT_TAG: Record<string, string[]> = {
  recruit: ["#수강생모집", "#강의모집"],
  seminar: ["#특강", "#세미나"],
  cardnews: ["#카드뉴스", "#강의추천"],
  thumbnail: ["#강의추천"],
  certificate: ["#수료", "#수료증"],
  profile: ["#강사섭외", "#출강문의"],
};

const pick = <T,>(list: T[], seed: number): T => list[seed % list.length];
const uniq = (list: string[]) => [...new Set(list.map((t) => t.replace(/\s+/g, "")))];

/** 템플릿으로 SNS 홍보 문구와 해시태그를 만들어요. (API 호출 없이 브라우저에서만) */
export function buildCaption(state: BuilderState, channel: Channel, today: DayKey | null): Caption {
  const info = resolveInfo(state, today);
  const seed = state.seeds.caption;
  const audience = byId(AUDIENCES, state.audience);
  const format = byId(FORMATS, state.format);
  const title = info.title.text || info.topicName || "새 강의";
  const topicTag = info.topicName ? `#${info.topicName.replace(/[^0-9A-Za-z가-힣]/g, "")}` : "";
  const tags = uniq(
    [topicTag, ...info.topic.hashtags, ...(OUTPUT_TAG[state.output] ?? []), AUDIENCE_TAG[state.audience], FORMAT_TAG[state.format], "#강사"]
      .filter(Boolean)
      .filter((t) => t.length > 1),
  );
  const hook = pick(HOOKS[state.audience] ?? HOOKS.worker, seed);
  const items = info.curriculum.items;
  const name = info.instructor.text;
  const bio = info.bio.text;
  const cta = info.cta.text;
  const details: [string, string, string][] = [
    ["📅", "일정", info.schedule.text],
    ["📍", "장소", info.place.text],
    ["💰", "수강료", info.price.text],
  ];
  const detailLines = details.filter(([, , v]) => v).map(([e, k, v]) => `${e} ${k}: ${v}`);
  const lines: string[] = [];

  if (state.output === "certificate") {
    if (channel === "threads") {
      lines.push(`'${title}' 수료하신 분들 정말 수고 많으셨어요 👏`);
      lines.push(`마지막까지 함께해 주셔서 고마워요. 배운 걸 현업에서 꼭 써먹어 보시길!`);
      if (name) lines.push(`- ${name}`);
      return threads(lines, tags);
    }
    lines.push(`🎓 ${title} 수료를 축하합니다!`, "");
    lines.push("끝까지 함께해 주신 수강생 여러분, 정말 수고 많으셨어요.");
    if (items.length) lines.push(`${items.join(", ")}까지 해낸 여러분이 자랑스러워요.`);
    if (info.schedule.text) lines.push("", `📅 수료일: ${info.schedule.text}`);
    if (name) lines.push(`👤 ${name}${bio ? ` (${bio})` : ""}`);
    lines.push("", "다음 기수 소식은 프로필에서 확인해 주세요 🙌");
    return finish(lines, tags, channel, `[수료 후기] ${title}`);
  }

  if (state.output === "profile") {
    const who = name || "강사";
    if (channel === "threads") {
      lines.push(`안녕하세요, ${who}입니다${bio ? `. ${bio}` : ""}.`);
      if (items.length) lines.push(`${items.join(", ")} 강의를 하고 있어요.`);
      lines.push(cta ? `강의·출강 문의는 ${cta}` : "강의·출강 문의는 DM 주세요 🙂");
      return threads(lines, tags);
    }
    lines.push(`👋 안녕하세요, ${who}입니다.`);
    if (bio) lines.push(bio);
    if (items.length) lines.push("", "이런 강의를 합니다", ...items.map((x) => `✔ ${x}`));
    if (audience) lines.push("", `${audience.label} 맞춤으로 눈높이에 맞춰 진행해요.`);
    lines.push("", `📩 ${cta || "강의·출강 문의는 DM 또는 프로필 링크로"}`);
    return finish(lines, tags, channel, `[강사 소개] ${who} | ${info.topicName || "강의"} 출강`);
  }

  if (channel === "threads") {
    lines.push(hook);
    lines.push(`그래서 '${title}' ${state.output === "seminar" ? "특강을" : "강의를"} 열어요.`);
    if (items.length) lines.push(...items.map((x) => `- ${x}`));
    const facts = [info.schedule.text, info.place.text, info.price.text].filter(Boolean).join(" / ");
    if (facts) lines.push(facts);
    if (name) lines.push(`강의는 제가 직접 합니다${bio ? ` (${bio})` : ""}.`);
    lines.push(cta ? `신청: ${cta}` : "관심 있으면 댓글 남겨 주세요 🙌");
    return threads(lines, tags);
  }

  lines.push(hook, "");
  lines.push(`${state.output === "seminar" ? "🎤" : "📣"} ${title}`);
  if (info.subtitle.text) lines.push(info.subtitle.text);
  if (items.length) lines.push("", "이런 걸 배워요", ...items.map((x) => `✔ ${x}`));
  if (detailLines.length) lines.push("", ...detailLines);
  if (format && channel === "blog") lines.push(`🖥️ 형식: ${format.label}`);
  if (name) lines.push(`👤 강사: ${name}${bio ? ` · ${bio}` : ""}`);
  lines.push("", `👉 ${cta || "프로필 링크에서 신청하세요"}`);
  const blogTitle = `[${state.output === "seminar" ? "특강 안내" : "수강생 모집"}] ${title}${audience ? ` | ${audience.label} ${format?.label ?? ""} 강의` : ""}`;
  return finish(lines, tags, channel, blogTitle.trim());
}

function finish(lines: string[], tags: string[], channel: Channel, blogTitle: string): Caption {
  if (channel === "blog") {
    const keywords = tags.map((t) => t.replace("#", "")).join(", ");
    return {
      text: [`제목: ${blogTitle}`, "", ...lines, "", `키워드: ${keywords}`].join("\n"),
      hashtags: tags.slice(0, 10).join(" "),
    };
  }
  const hashtags = tags.slice(0, 12).join(" ");
  return { text: [...lines, "", hashtags].join("\n"), hashtags };
}

function threads(lines: string[], tags: string[]): Caption {
  const tag = tags[0] ?? "";
  return { text: tag ? [...lines, "", tag].join("\n") : lines.join("\n"), hashtags: tag };
}
