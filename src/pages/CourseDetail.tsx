// 수업자료 상세 페이지: 과목·주차, 내용(마크다운·수식), 자료 링크, 관련 토론, (관리자) 수정·삭제
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { courseService } from "../services";
import { useAuth } from "../contexts/AuthContext";
import { useAsync } from "../lib/useAsync";
import { toErrorMessage } from "../lib/format";
import ContentDetail from "../components/ContentDetail";
import ContentForm from "../components/ContentForm";
import Icon from "../components/Icon";
import { Empty, ErrorMessage, Loading } from "../components/Status";

export default function CourseDetail() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: item, loading, error, reload } = useAsync(() => courseService.get(id), [id]);
  const [editing, setEditing] = useState(false);

  if (loading) return <Loading />;
  if (error) return <div className="container-page py-10"><ErrorMessage message={error} onRetry={reload} /></div>;
  if (!item)
    return (
      <div className="container-page py-16">
        <Empty>
          수업자료를 찾을 수 없습니다. <Link to="/courses" className="font-semibold text-brand-700 underline">목록으로</Link>
        </Empty>
      </div>
    );

  async function handleDelete() {
    if (!window.confirm("이 수업자료를 삭제할까요? 되돌릴 수 없습니다.")) return;
    try {
      await courseService.remove(id);
      navigate("/courses");
    } catch (err) {
      window.alert(toErrorMessage(err, "삭제하지 못했습니다."));
    }
  }

  if (editing)
    return (
      <div className="container-page py-10">
        <ContentForm
          heading="수업자료 수정"
          withCourseFields
          initial={item}
          onCancel={() => setEditing(false)}
          onSubmit={async ({ base, course, week }) => {
            await courseService.update(id, { ...base, course, week });
            setEditing(false);
            reload();
          }}
        />
      </div>
    );

  return (
    <ContentDetail
      item={item}
      type="course"
      eyebrow="Course Material"
      back={{ to: "/courses", label: "수업자료 목록" }}
      meta={
        <span className="inline-flex items-center gap-1.5 rounded-md bg-accent-50 px-2 py-0.5 font-semibold text-accent-600">
          <Icon name="cap" className="h-4 w-4" />
          {item.course} · {item.week}주차
        </span>
      }
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
