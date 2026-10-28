// 토론 게시판 목록: 최신순 20개씩, "더 보기"로 추가 로드 (Firestore 무료 읽기 한도 절약)
// 비로그인 사용자도 읽을 수 있고, 글쓰기는 로그인 사용자만 가능합니다.
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postService } from "../services";
import type { Post } from "../services/types";
import { POSTS_PAGE_SIZE } from "../config/site";
import { useAuth } from "../contexts/AuthContext";
import { formatDate, toErrorMessage } from "../lib/format";
import { Empty, ErrorMessage, Loading } from "../components/Status";

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
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">토론</h1>
          <p className="mt-1 text-slate-600">연구 결과와 수업 내용에 대해 자유롭게 질문하고 토론하세요.</p>
        </div>
        {user ? (
          <Link to="/discussion/new" className="btn-primary">글쓰기</Link>
        ) : (
          <Link to="/login?redirect=/discussion/new" className="btn-secondary">로그인하고 글쓰기</Link>
        )}
      </div>

      {error && <ErrorMessage message={error} onRetry={() => loadPage(null, true)} />}
      {!loading && !error && posts.length === 0 && <Empty>아직 글이 없습니다. 첫 글을 남겨 보세요.</Empty>}

      <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
        {posts.map((p) => (
          <li key={p.id}>
            <Link to={`/discussion/${p.id}`} className="block px-4 py-3 hover:bg-slate-50 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-medium text-slate-900">
                  {p.relatedType && (
                    <span className="mr-2 rounded bg-brand-50 px-1.5 py-0.5 align-middle text-xs font-normal text-brand-700">
                      {p.relatedType === "research" ? "연구" : "수업"}
                    </span>
                  )}
                  {p.title}
                </h2>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600" title="댓글 수">
                  💬 {p.commentCount}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {p.authorName} · {formatDate(p.createdAt)}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {loading && <Loading />}
      {!loading && hasMore && (
        <div className="mt-4 text-center">
          <button type="button" className="btn-secondary" onClick={() => loadPage(cursor, false)}>
            더 보기
          </button>
        </div>
      )}
    </div>
  );
}
