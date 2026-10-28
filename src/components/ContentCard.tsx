// 연구·수업자료 목록에서 쓰는 카드 (아이콘, 날짜, 제목, 요약, 태그)
import { Link } from "react-router-dom";
import { excerpt, formatDate } from "../lib/format";
import Icon, { type IconName } from "./Icon";
import TagList from "./TagList";

interface Props {
  to: string;
  title: string;
  summary: string;
  tags: string[];
  createdAt: number;
  icon?: IconName;
  badge?: string; // 예: "2주차"
}

export default function ContentCard({ to, title, summary, tags, createdAt, icon = "book", badge }: Props) {
  return (
    <article className="card group relative flex flex-col p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-800 group-hover:text-white">
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <span className="flex items-center gap-2 text-xs text-slate-500">
          {badge && <span className="rounded-md bg-accent-50 px-2 py-0.5 font-semibold text-accent-600">{badge}</span>}
          <time>{formatDate(createdAt)}</time>
        </span>
      </div>
      <h3 className="text-[17px] font-bold leading-snug text-slate-900">
        {/* 카드 전체를 누를 수 있도록 링크 영역을 카드 크기로 확장 */}
        <Link to={to} className="after:absolute after:inset-0 after:rounded-2xl group-hover:text-brand-800">
          {title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{excerpt(summary, 160)}</p>
      <div className="mt-5 flex items-end justify-between gap-3">
        <TagList tags={tags} />
        <Icon name="arrowRight" className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-700" />
      </div>
    </article>
  );
}
