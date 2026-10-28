// 연구실 로고 표시 (삼각형 유한요소 모양). 실제 로고가 생기면 이 파일만 바꾸면 됩니다.
export default function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#1b2d4b" />
      <g fill="none" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M7 24 16 8l9 16Z" />
        <path d="M11.5 16h9M16 24l-4.5-8M16 24l4.5-8" />
      </g>
      <circle cx="16" cy="8" r="2" fill="#e0a83a" />
    </svg>
  );
}
