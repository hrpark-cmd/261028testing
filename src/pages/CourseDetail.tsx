// 수업자료 상세 페이지: 과목·주차, 내용(마크다운·수식), 자료 링크, 관련 토론, (관리자) 수정·삭제
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { courseService } from "../services";
import { useAuth } from "../contexts/AuthContext";
import { useAsync } from "../lib/useAsync";
import { toErrorMessage } from "../lib/format";
import ContentForm from "../components/ContentForm";
import DetailHeader from "../components/DetailHeader";
import LinkList from "../components/LinkList";
import MarkdownView from "../components/MarkdownView";
import RelatedDiscussion from "../components/RelatedDiscussion";
import { Empty, ErrorMessage, Loading } from "../components/Status";

export default function CourseDetail() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: item, loading, error, reload } = useAsync(() => courseService.get(id), [id]);
  const [editing, setEditing] = useState(false);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  if (!item)
    return (
      <Empty>
        수업자료를 찾을 수 없습니다. <Link to="/courses" className="text-brand-700 underline">목록으로</Link>
      </Empty>
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
    );

  return (
    <article>
      <DetailHeader
        backTo="/courses"
        backLabel="수업자료 목록"
        title={item.title}
        createdAt={item.createdAt}
        tags={item.tags}
        meta={
          <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
            {item.course} · {item.week}주차
          </span>
        }
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
      <RelatedDiscussion type="course" id={item.id} />
    </article>
  );
}
