// 항목에 붙은 태그 표시. basePath 를 주면 태그를 눌렀을 때 그 목록 페이지로 이동해 필터링합니다.
// 태그마다 색이 자동으로 정해져 같은 태그는 항상 같은 색으로 보입니다.
import { Link } from "react-router-dom";
import { colorIndex } from "./Avatar";

const TAG_COLORS = [
  "bg-brand-50 text-brand-700 ring-brand-100",
  "bg-emerald-50 text-emerald-700 ring-emerald-100",
  "bg-amber-50 text-amber-800 ring-amber-100",
  "bg-violet-50 text-violet-700 ring-violet-100",
  "bg-rose-50 text-rose-700 ring-rose-100",
  "bg-sky-50 text-sky-700 ring-sky-100",
];

export function tagClass(tag: string): string {
  return `rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TAG_COLORS[colorIndex(tag, TAG_COLORS.length)]}`;
}

export default function TagList({ tags, basePath }: { tags: string[]; basePath?: string }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) =>
        basePath ? (
          <Link key={t} to={`${basePath}?tag=${encodeURIComponent(t)}`} className={`${tagClass(t)} hover:opacity-80`}>
            #{t}
          </Link>
        ) : (
          <span key={t} className={tagClass(t)}>
            #{t}
          </span>
        )
      )}
    </div>
  );
}
