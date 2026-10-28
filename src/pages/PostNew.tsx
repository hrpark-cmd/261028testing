// 새 글 작성 (로그인 필요)
// 주소에 ?type=research&id=... 가 있으면 해당 자료와 연결된 글로 작성됩니다.
import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { courseService, postService, researchService } from "../services";
import type { RelatedType } from "../services/types";
import { useAuth } from "../contexts/AuthContext";
import { useAsync } from "../lib/useAsync";
import { toErrorMessage } from "../lib/format";
import Card from "../components/Card";
import MarkdownEditor from "../components/MarkdownEditor";
import { Loading } from "../components/Status";

function parseRelatedType(value: string | null): RelatedType | null {
  return value === "research" || value === "course" ? value : null;
}

export default function PostNew() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const relatedType = parseRelatedType(params.get("type"));
  const relatedId = relatedType ? params.get("id") : null;

  // 연결된 자료의 제목을 보여주기 위해 불러옵니다.
  const { data: related } = useAsync(async () => {
    if (!relatedType || !relatedId) return null;
    const item = relatedType === "research" ? await researchService.get(relatedId) : await courseService.get(relatedId);
    return item ? { title: item.title, path: `/${relatedType === "research" ? "research" : "courses"}/${item.id}` } : null;
  }, [relatedType, relatedId]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (authLoading) return <Loading />;
  if (!user) {
    const here = `/discussion/new${params.toString() ? `?${params}` : ""}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(here)}`} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!title.trim()) return setError("제목을 입력해 주세요.");
    if (!content.trim()) return setError("내용을 입력해 주세요.");
    setSaving(true);
    setError(null);
    try {
      const post = await postService.createPost(
        {
          title: title.trim(),
          content,
          relatedType: related ? relatedType : null,
          relatedId: related ? relatedId : null,
        },
        user
      );
      navigate(`/discussion/${post.id}`, { replace: true });
    } catch (err) {
      setError(toErrorMessage(err, "글을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요."));
      setSaving(false);
    }
  }

  return (
    <div>
      <Link to="/discussion" className="text-sm text-slate-500 hover:text-brand-700">← 토론 목록</Link>
      <h1 className="page-title mt-3 mb-6">새 글 쓰기</h1>
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {related && (
            <p className="rounded-md bg-brand-50 px-3 py-2 text-sm text-brand-800">
              연결된 자료: <Link to={related.path} className="font-medium underline">{related.title}</Link>
            </p>
          )}
          <div>
            <label className="label" htmlFor="post-title">제목</label>
            <input id="post-title" className="input" value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <MarkdownEditor id="post-content" label="내용 (마크다운·수식 지원)" value={content} onChange={setContent} rows={12} />
          {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? "등록 중…" : "등록"}</button>
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)} disabled={saving}>취소</button>
          </div>
        </form>
      </Card>
    </div>
  );
}
