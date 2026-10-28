// 연구·수업자료 목록에서 쓰는 카드 (제목, 요약, 태그, 날짜)
import { Link } from "react-router-dom";
import { excerpt, formatDate } from "../lib/format";
import TagList from "./TagList";

interface Props {
  to: string;
  title: string;
  summary: string;
  tags: string[];
  createdAt: number;
  badge?: string; // 예: "2주차"
}

export default function ContentCard({ to, title, summary, tags, createdAt, badge }: Props) {
  return (
    <article className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:border-brand-600 hover:shadow-sm">
      <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
        {badge && <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-700">{badge}</span>}
        <time>{formatDate(createdAt)}</time>
      </div>
      <h3 className="text-base font-semibold text-slate-900">
        <Link to={to} className="hover:text-brand-700">
          {title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-slate-600">{excerpt(summary)}</p>
      <div className="mt-3">
        <TagList tags={tags} />
      </div>
    </article>
  );
}
