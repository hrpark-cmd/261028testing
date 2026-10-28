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
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";
import MarkdownView from "../components/MarkdownView";
import PageHeader from "../components/PageHeader";
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
    <Link
      to={data.path}
      className="group mb-6 flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3 transition hover:border-brand-300"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 shadow-sm">
        <Icon name={post.relatedType === "research" ? "book" : "cap"} className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium text-brand-600">{post.relatedType === "research" ? "연결된 연구" : "연결된 수업자료"}</span>
        <span className="block truncate text-sm font-semibold text-slate-900 group-hover:text-brand-800">{data.title}</span>
      </span>
      <Icon name="arrowRight" className="h-4 w-4 shrink-0 text-brand-400" />
    </Link>
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
    <section className="card mt-6 p-6 sm:p-8">
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
        <Icon name="message" className="h-5 w-5 text-brand-600" />
        댓글
        {comments && <span className="text-sm font-medium text-slate-400">{comments.length}</span>}
      </h2>
      {loading && <Loading />}
      {error && <div className="mt-4"><ErrorMessage message={error} onRetry={reload} /></div>}
      {comments && comments.length === 0 && <p className="mt-4 text-sm text-slate-500">아직 댓글이 없습니다. 첫 댓글을 남겨 보세요.</p>}

      <ul className="mt-2 divide-y divide-slate-100" aria-label="댓글 목록">
        {comments?.map((c) => (
          <li key={c.id} className="flex gap-3 py-5">
            <Avatar name={c.authorName} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm">
                  <span className="font-semibold text-slate-900">{c.authorName}</span>
                  <span className="ml-2 text-xs text-slate-400">{formatDateTime(c.createdAt)}</span>
                </p>
                {canDelete(user, c.authorId) && (
                  <button
                    type="button"
                    className="rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDelete(c.id)}
                    aria-label="댓글 삭제"
                    title="삭제"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                )}
              </div>
              <MarkdownView content={c.content} className="mt-1 text-sm" />
            </div>
          </li>
        ))}
      </ul>

      {user ? (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-3 border-t border-slate-100 pt-6">
          <Avatar name={user.displayName} photoURL={user.photoURL} size="sm" />
          <div className="flex flex-1 flex-col gap-2">
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
          </div>
        </form>
      ) : (
        <p className="mt-4 rounded-xl bg-slate-50 px-4 py-4 text-center text-sm text-slate-600">
          댓글을 쓰려면{" "}
          <Link to={`/login?redirect=/discussion/${postId}`} className="font-semibold text-brand-700 underline underline-offset-2">
            로그인
          </Link>
          해 주세요.
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
  if (error) return <div className="container-page py-10"><ErrorMessage message={error} onRetry={reload} /></div>;
  if (!post)
    return (
      <div className="container-page py-16">
        <Empty>
          글을 찾을 수 없습니다. <Link to="/discussion" className="font-semibold text-brand-700 underline">목록으로</Link>
        </Empty>
      </div>
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
    <>
      <PageHeader
        eyebrow="Discussion"
        title={post.title}
        back={{ to: "/discussion", label: "토론 목록" }}
        actions={
          canDelete(user, post.authorId) && (
            <button type="button" className="btn-danger" onClick={handleDelete}>
              <Icon name="trash" className="h-4 w-4" />
              글 삭제
            </button>
          )
        }
      >
        <div className="flex items-center gap-3">
          <Avatar name={post.authorName} />
          <div className="text-sm">
            <p className="font-semibold text-slate-900">{post.authorName}</p>
            <p className="text-slate-500">{formatDateTime(post.createdAt)}</p>
          </div>
        </div>
      </PageHeader>

      <div className="container-page max-w-4xl py-10">
        <article className="card p-6 sm:p-8">
          <RelatedLink post={post} />
          <MarkdownView content={post.content} />
        </article>
        <Comments postId={post.id} />
      </div>
    </>
  );
}
