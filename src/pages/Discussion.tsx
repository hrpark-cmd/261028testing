// 토론 게시판 목록: 최신순 20개씩, "더 보기"로 추가 로드 (Firestore 무료 읽기 한도 절약)
// 비로그인 사용자도 읽을 수 있고, 글쓰기는 로그인 사용자만 가능합니다.
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postService } from "../services";
import type { Post } from "../services/types";
import { POSTS_PAGE_SIZE } from "../config/site";
import { useAuth } from "../contexts/AuthContext";
import { excerpt, formatDate, toErrorMessage } from "../lib/format";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import { Empty, ErrorMessage, Loading } from "../components/Status";

function RelatedBadge({ type }: { type: Post["relatedType"] }) {
  if (!type) return null;
  return type === "research" ? (
    <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-1.5 py-0.5 text-[11px] font-semibold text-brand-700">
      <Icon name="book" className="h-3 w-3" />
      연구
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-md bg-accent-50 px-1.5 py-0.5 text-[11px] font-semibold text-accent-600">
      <Icon name="cap" className="h-3 w-3" />
      수업
    </span>
  );
}

export default function Discussion() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // reset=true 이면 처음부터, 아니면 이어서 불러옵니다.
  const loadPage = useCallback(async (from: string | null, reset: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const page = await postService.listPosts(POSTS_PAGE_SIZE, from);
      setPosts((prev) => (reset ? page.items : [...prev, ...page.items]));
      setCursor(page.nextCursor);
      setHasMore(page.nextCursor !== null);
    } catch (err) {
      setError(toErrorMessage(err, "게시글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(null, true);
  }, [loadPage]);

  return (
    <>
      <PageHeader
        eyebrow="Discussion"
        title="토론"
        description="연구 결과와 수업 내용에 대해 자유롭게 질문하고 토론하세요."
        actions={
          user ? (
            <Link to="/discussion/new" className="btn-primary">
              <Icon name="pencil" className="h-4 w-4" />
              글쓰기
            </Link>
          ) : (
            <Link to="/login?redirect=/discussion/new" className="btn-secondary">
              로그인하고 글쓰기
            </Link>
          )
        }
      />

      <div className="container-page py-10">
        {error && <ErrorMessage message={error} onRetry={() => loadPage(null, true)} />}
        {!loading && !error && posts.length === 0 && <Empty>아직 글이 없습니다. 첫 글을 남겨 보세요.</Empty>}

        {posts.length > 0 && (
          <ul className="card divide-y divide-slate-100 overflow-hidden" aria-label="게시글 목록">
            {posts.map((p) => (
              <li key={p.id}>
                <Link to={`/discussion/${p.id}`} className="group flex gap-4 px-5 py-5 transition hover:bg-slate-50/80 sm:px-6">
                  <Avatar name={p.authorName} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <RelatedBadge type={p.relatedType} />
                      <h2 className="font-semibold text-slate-900 group-hover:text-brand-700">{p.title}</h2>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">{excerpt(p.content, 120)}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      <span className="font-medium text-slate-600">{p.authorName}</span> · {formatDate(p.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex h-fit shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      p.commentCount > 0 ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-500"
                    }`}
                    title="댓글 수"
                  >
                    <Icon name="message" className="h-3.5 w-3.5" />
                    {p.commentCount}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {loading && <Loading />}
        {!loading && hasMore && (
          <div className="mt-6 text-center">
            <button type="button" className="btn-secondary px-6" onClick={() => loadPage(cursor, false)}>
              더 보기
            </button>
          </div>
        )}
      </div>
    </>
  );
}
