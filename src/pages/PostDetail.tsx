// 게시글 상세 + 댓글
// - 누구나 읽을 수 있고, 댓글은 로그인 사용자만 작성
// - 본인 글/댓글은 삭제 가능, 관리자는 모두 삭제 가능
import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { courseService, postService, researchService } from "../services";
import type { Post } from "../services/types";
import { canDelete, useAuth } from "../contexts/AuthContext";
import { useAsync } from "../lib/useAsync";
import { formatDateTime, toErrorMessage } from "../lib/format";
import MarkdownView from "../components/MarkdownView";
import { Empty, ErrorMessage, Loading } from "../components/Status";

/** 글에 연결된 연구/수업자료 링크 */
function RelatedLink({ post }: { post: Post }) {
  const { data } = useAsync(async () => {
    if (!post.relatedType || !post.relatedId) return null;
    const item = post.relatedType === "research" ? await researchService.get(post.relatedId) : await courseService.get(post.relatedId);
    return item ? { title: item.title, path: `/${post.relatedType === "research" ? "research" : "courses"}/${item.id}` } : null;
  }, [post.relatedType, post.relatedId]);
  if (!data) return null;
  return (
    <p className="mb-4 rounded-md bg-brand-50 px-3 py-2 text-sm text-brand-800">
      {post.relatedType === "research" ? "연구" : "수업자료"}:{" "}
      <Link to={data.path} className="font-medium underline">{data.title}</Link>
    </p>
  );
}

function Comments({ postId }: { postId: string }) {
  const { user } = useAuth();
  const { data: comments, loading, error, reload } = useAsync(() => postService.listComments(postId), [postId]);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user || !content.trim()) return;
    setSending(true);
    setFormError(null);
    try {
      await postService.addComment(postId, content.trim(), user);
      setContent("");
      reload();
    } catch (err) {
      setFormError(toErrorMessage(err, "댓글을 저장하지 못했습니다."));
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(commentId: string) {
    if (!window.confirm("댓글을 삭제할까요?")) return;
    try {
      await postService.deleteComment(postId, commentId);
      reload();
    } catch (err) {
      window.alert(toErrorMessage(err, "댓글을 삭제하지 못했습니다."));
    }
  }

  return (
    <section className="mt-10 border-t border-slate-200 pt-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        댓글 {comments ? comments.length : ""}
      </h2>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} onRetry={reload} />}
      {comments && comments.length === 0 && <p className="text-sm text-slate-500">아직 댓글이 없습니다.</p>}
      <ul className="flex flex-col gap-3">
        {comments?.map((c) => (
          <li key={c.id} className="rounded-md bg-slate-50 px-4 py-3">
            <div className="mb-1 flex items-center justify-between gap-2 text-xs text-slate-500">
              <span>
                <span className="font-medium text-slate-700">{c.authorName}</span> · {formatDateTime(c.createdAt)}
              </span>
              {canDelete(user, c.authorId) && (
                <button type="button" className="text-red-600 hover:underline" onClick={() => handleDelete(c.id)}>
                  삭제
                </button>
              )}
            </div>
            <MarkdownView content={c.content} className="text-sm" />
          </li>
        ))}
      </ul>

      {user ? (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
          <label htmlFor="comment" className="sr-only">댓글 입력</label>
          <textarea
            id="comment"
            className="input"
            rows={3}
            maxLength={5000}
            value={content}
            placeholder="댓글을 입력하세요. 수식($...$)도 쓸 수 있습니다."
            onChange={(e) => setContent(e.target.value)}
          />
          {formError && <p className="text-sm text-red-700" role="alert">{formError}</p>}
          <button type="submit" className="btn-primary self-end" disabled={sending || !content.trim()}>
            {sending ? "등록 중…" : "댓글 등록"}
          </button>
        </form>
      ) : (
        <p className="mt-4 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-600">
          댓글을 쓰려면 <Link to={`/login?redirect=/discussion/${postId}`} className="text-brand-700 underline">로그인</Link>해 주세요.
        </p>
      )}
    </section>
  );
}

export default function PostDetail() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: post, loading, error, reload } = useAsync(() => postService.getPost(id), [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  if (!post)
    return (
      <Empty>
        글을 찾을 수 없습니다. <Link to="/discussion" className="text-brand-700 underline">목록으로</Link>
      </Empty>
    );

  async function handleDelete() {
    if (!window.confirm("이 글과 댓글을 모두 삭제할까요?")) return;
    try {
      await postService.deletePost(id);
      navigate("/discussion");
    } catch (err) {
      window.alert(toErrorMessage(err, "글을 삭제하지 못했습니다."));
    }
  }

  return (
    <article>
      <Link to="/discussion" className="text-sm text-slate-500 hover:text-brand-700">← 토론 목록</Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <h1 className="page-title">{post.title}</h1>
        {canDelete(user, post.authorId) && (
          <button type="button" className="btn-danger shrink-0" onClick={handleDelete}>삭제</button>
        )}
      </div>
      <p className="mt-2 mb-6 text-sm text-slate-500">
        {post.authorName} · {formatDateTime(post.createdAt)}
      </p>
      <RelatedLink post={post} />
      <MarkdownView content={post.content} />
      <Comments postId={post.id} />
    </article>
  );
}
