// 테두리가 있는 흰색 상자. 목록 항목, 폼 등을 감싸는 데 씁니다.
import type { ReactNode } from "react";

export default function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-slate-200 bg-white p-5 ${className}`}>{children}</div>;
}
