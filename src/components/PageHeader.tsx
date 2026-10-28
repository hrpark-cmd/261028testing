// 각 페이지 상단의 머리말 띠 (작은 영문 제목, 큰 제목, 설명, 오른쪽 버튼 자리)
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

interface Props {
  eyebrow?: string; // 제목 위 작은 글씨 (예: "Research")
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { to: string; label: string }; // 상세 페이지의 "← 목록" 링크
  children?: ReactNode; // 제목 아래 추가 정보 (작성자, 태그 등)
}

export default function PageHeader({ eyebrow, title, description, actions, back, children }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/80 bg-white">
      <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
      <div className="container-page relative py-10 sm:py-14">
        {back && (
          <Link to={back.to} className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-700">
            <Icon name="arrowLeft" className="h-4 w-4" />
            {back.label}
          </Link>
        )}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 max-w-3xl">
            {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
            <h1 className="page-title break-words">{title}</h1>
            {description && <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
        </div>
        {children && <div className="mt-5">{children}</div>}
      </div>
    </section>
  );
}
