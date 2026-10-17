import type { Metadata, Viewport } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "클래스부스트 | 강사를 위한 강의 홍보물 프롬프트 메이커",
  description:
    "강의 주제와 대상만 고르면 모집 포스터·특강 안내·카드뉴스·유튜브 썸네일·수료증·강사 프로필 카드용 이미지 AI 프롬프트와 인스타·스레드·블로그 홍보 문구를 한 번에. 무료, 로그인 없음.",
  openGraph: {
    title: "클래스부스트 ClassBoost",
    description: "강사를 위한 강의 홍보물 프롬프트 + SNS 홍보 문구 메이커",
    type: "website",
    locale: "ko_KR",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e1116",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full scroll-smooth antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          integrity="sha384-GIdEBaqGN9mNkDkMkzMHW8EKUqtpPIe/sLj1X7DIrnc9uPtLROJgmuDlh+3rBw0j"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="flex min-h-full flex-col bg-paper font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
