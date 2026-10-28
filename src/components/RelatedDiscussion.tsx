// 연구·수업자료 상세 페이지 하단: 이 자료에 연결된 토론 글 목록
import { Link } from "react-router-dom";
import { postService } from "../services";
import type { RelatedType } from "../services/types";
import { useAsync } from "../lib/useAsync";
import { formatDate } from "../lib/format";
import Avatar from "./Avatar";
import Icon from "./Icon";
import { ErrorMessage } from "./Status";

export default function RelatedDiscussion({ type, id }: { type: RelatedType; id: string }) {
  const { data, error } = useAsync(() => postService.listPostsByRelated(type, id, 10), [type, id]);

  return (
    <section className="card mt-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <Icon name="message" className="h-5 w-5 text-brand-600" />
          관련 토론
          {data && data.length > 0 && <span className="text-sm font-medium text-slate-400">{data.length}</span>}
        </h2>
        <Link to={`/discussion/new?type=${type}&id=${encodeURIComponent(id)}`} className="btn-secondary px-3 py-1.5">
          <Icon name="plus" className="h-4 w-4" />
          이 자료에 대해 토론하기
        </Link>
      </div>
      {error && <div className="mt-4"><ErrorMessage message={error} /></div>}
      {data && data.length === 0 && (
        <p className="mt-4 rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          아직 이 자료에 대한 토론이 없습니다. 첫 질문을 남겨 보세요.
        </p>
      )}
      {data && data.length > 0 && (
        <ul className="mt-4 divide-y divide-slate-100">
          {data.map((p) => (
            <li key={p.id}>
              <Link to={`/discussion/${p.id}`} className="group flex items-center gap-3 py-3">
                <Avatar name={p.authorName} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-800 group-hover:text-brand-700">{p.title}</span>
                  <span className="block text-xs text-slate-500">
                    {p.authorName} · {formatDate(p.createdAt)}
                  </span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs text-slate-500">
                  <Icon name="message" className="h-3.5 w-3.5" />
                  {p.commentCount}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
