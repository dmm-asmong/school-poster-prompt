import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// 정적 사이트용 CSP. Next.js가 넣는 인라인 부트스트랩 스크립트 때문에 script-src 에 'unsafe-inline' 이 필요해요.
// (nonce 방식은 모든 페이지를 동적 렌더링으로 바꿔야 해서 쓰지 않아요.)
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "font-src 'self' https://cdn.jsdelivr.net data:",
  "img-src 'self' data: blob:",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    // 원격 이미지는 쓰지 않아요: /_next/image 가 외부 URL 프록시로 쓰이지 않게 로컬 예시 이미지만 허용.
    remotePatterns: [],
    localPatterns: [{ pathname: "/examples/**", search: "" }],
    dangerouslyAllowSVG: false,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
