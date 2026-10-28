// 둥근 모서리와 엷은 그림자가 있는 흰색 상자. 목록, 폼 등을 감싸는 데 씁니다.
import type { ReactNode } from "react";

export default function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card p-5 sm:p-6 ${className}`}>{children}</div>;
}
