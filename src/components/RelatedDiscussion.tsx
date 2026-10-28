// 연구·수업자료 상세 페이지 하단: 이 자료에 연결된 토론 글 + "이 자료에 대해 토론하기" 버튼
import { Link } from "react-router-dom";
import { postService } from "../services";
import type { RelatedType } from "../services/types";
import { useAsync } from "../lib/useAsync";
import { formatDate } from "../lib/format";
import { ErrorMessage } from "./Status";

export default function RelatedDiscussion({ type, id }: { type: RelatedType; id: string }) {
  const { data, error } = useAsync(() => postService.listPostsByRelated(type, id, 10), [type, id]);

  return (
    <section className="mt-10 border-t border-slate-200 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">관련 토론</h2>
        <Link to={`/discussion/new?type=${type}&id=${encodeURIComponent(id)}`} className="btn-primary">
          이 자료에 대해 토론하기
        </Link>
      </div>
      {error && <div className="mt-3"><ErrorMessage message={error} /></div>}
      {data && data.length === 0 && <p className="mt-3 text-sm text-slate-500">아직 이 자료에 대한 토론 글이 없습니다.</p>}
      {data && data.length > 0 && (
        <ul className="mt-3 divide-y divide-slate-100">
          {data.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 py-2">
              <Link to={`/discussion/${p.id}`} className="truncate text-sm text-slate-800 hover:text-brand-700">
                {p.title}
              </Link>
              <span className="shrink-0 text-xs text-slate-500">
                {p.authorName} · {formatDate(p.createdAt)} · 댓글 {p.commentCount}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
