// 연구 상세 페이지: 요약(마크다운·수식), 자료 링크, 관련 토론, (관리자) 수정·삭제
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { researchService } from "../services";
import { useAuth } from "../contexts/AuthContext";
import { useAsync } from "../lib/useAsync";
import { toErrorMessage } from "../lib/format";
import ContentDetail from "../components/ContentDetail";
import ContentForm from "../components/ContentForm";
import Icon from "../components/Icon";
import { Empty, ErrorMessage, Loading } from "../components/Status";

export default function ResearchDetail() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: item, loading, error, reload } = useAsync(() => researchService.get(id), [id]);
  const [editing, setEditing] = useState(false);

  if (loading) return <Loading />;
  if (error) return <div className="container-page py-10"><ErrorMessage message={error} onRetry={reload} /></div>;
  if (!item)
    return (
      <div className="container-page py-16">
        <Empty>
          연구를 찾을 수 없습니다. <Link to="/research" className="font-semibold text-brand-700 underline">목록으로</Link>
        </Empty>
      </div>
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
      <div className="container-page py-10">
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
      </div>
    );

  return (
    <ContentDetail
      item={item}
      type="research"
      eyebrow="Research"
      back={{ to: "/research", label: "연구 목록" }}
      adminActions={
        user?.isAdmin && (
          <>
            <button type="button" className="btn-secondary" onClick={() => setEditing(true)}>
              <Icon name="pencil" className="h-4 w-4" />
              수정
            </button>
            <button type="button" className="btn-danger" onClick={handleDelete}>
              <Icon name="trash" className="h-4 w-4" />
              삭제
            </button>
          </>
        )
      }
    />
  );
}
