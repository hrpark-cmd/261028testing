// 항목에 붙은 태그 표시. basePath 를 주면 태그를 눌렀을 때 그 목록 페이지로 이동해 필터링합니다.
import { Link } from "react-router-dom";

export default function TagList({ tags, basePath }: { tags: string[]; basePath?: string }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) =>
        basePath ? (
          <Link
            key={t}
            to={`${basePath}?tag=${encodeURIComponent(t)}`}
            className="rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-700 hover:bg-brand-100"
          >
            #{t}
          </Link>
        ) : (
          <span key={t} className="rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
            #{t}
          </span>
        )
      )}
    </div>
  );
}
