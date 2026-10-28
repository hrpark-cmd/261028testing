// 어두운 배경 위에 깔리는 삼각형 메시(유한요소 격자) 무늬 장식
import { useId } from "react";
export default function MeshPattern({ className = "" }: { className?: string }) {
  // 한 화면에 여러 개 있어도 겹치지 않도록 고유 id 사용
  const uid = useId().replace(/:/g, "");
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true">
      <defs>
        <pattern id={`fem-mesh-${uid}`} width="56" height="48" patternUnits="userSpaceOnUse">
          <path d="M0 0h56M0 48h56M0 0l28 48M28 48 56 0M28 0 0 48M56 48 28 0" fill="none" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="0" cy="0" r="1.4" fill="currentColor" />
          <circle cx="28" cy="0" r="1.4" fill="currentColor" />
          <circle cx="28" cy="48" r="1.4" fill="currentColor" />
        </pattern>
        <radialGradient id={`mesh-fade-${uid}`} cx="75%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`mesh-mask-${uid}`}>
          <rect width="100%" height="100%" fill={`url(#mesh-fade-${uid})`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#fem-mesh-${uid})`} mask={`url(#mesh-mask-${uid})`} />
    </svg>
  );
}
