// 연구·수업자료 상세 페이지 상단 (뒤로가기, 제목, 날짜, 태그, 관리자 버튼)
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../lib/format";
import TagList from "./TagList";

interface Props {
  backTo: string;
  backLabel: string;
  title: string;
  createdAt: number;
  tags: string[];
  meta?: ReactNode; // 예: 과목명·주차
  adminActions?: ReactNode;
}

export default function DetailHeader({ backTo, backLabel, title, createdAt, tags, meta, adminActions }: Props) {
  return (
    <header className="mb-6">
      <Link to={backTo} className="text-sm text-slate-500 hover:text-brand-700">
        ← {backLabel}
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <h1 className="page-title">{title}</h1>
        {adminActions && <div className="flex shrink-0 gap-2">{adminActions}</div>}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
        {meta}
        <time>{formatDate(createdAt)}</time>
        <TagList tags={tags} basePath={backTo} />
      </div>
    </header>
  );
}
