// 연구 상세 페이지: 요약(마크다운·수식), 자료 링크, 관련 토론, (관리자) 수정·삭제
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { researchService } from "../services";
import { useAuth } from "../contexts/AuthContext";
import { useAsync } from "../lib/useAsync";
import { toErrorMessage } from "../lib/format";
import ContentForm from "../components/ContentForm";
import DetailHeader from "../components/DetailHeader";
import LinkList from "../components/LinkList";
import MarkdownView from "../components/MarkdownView";
import RelatedDiscussion from "../components/RelatedDiscussion";
import { Empty, ErrorMessage, Loading } from "../components/Status";

export default function ResearchDetail() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: item, loading, error, reload } = useAsync(() => researchService.get(id), [id]);
  const [editing, setEditing] = useState(false);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  if (!item)
    return (
      <Empty>
        연구를 찾을 수 없습니다. <Link to="/research" className="text-brand-700 underline">목록으로</Link>
      </Empty>
    );

  async function handleDelete() {
    if (!window.confirm("이 연구를 삭제할까요? 되돌릴 수 없습니다.")) return;
    try {
      await researchService.remove(id);
      navigate("/research");
    } catch (err) {
      window.alert(toErrorMessage(err, "삭제하지 못했습니다."));
    }
  }

  if (editing)
    return (
      <ContentForm
        heading="연구 수정"
        initial={item}
        onCancel={() => setEditing(false)}
        onSubmit={async ({ base }) => {
          await researchService.update(id, base);
          setEditing(false);
          reload();
        }}
      />
    );

  return (
    <article>
      <DetailHeader
        backTo="/research"
        backLabel="연구 목록"
        title={item.title}
        createdAt={item.createdAt}
        tags={item.tags}
        adminActions={
          user?.isAdmin && (
            <>
              <button type="button" className="btn-secondary" onClick={() => setEditing(true)}>수정</button>
              <button type="button" className="btn-danger" onClick={handleDelete}>삭제</button>
            </>
          )
        }
      />
      <MarkdownView content={item.summary} />
      {item.links.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">자료 링크</h2>
          <LinkList links={item.links} />
        </section>
      )}
      <RelatedDiscussion type="research" id={item.id} />
    </article>
  );
}
