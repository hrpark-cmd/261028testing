// 수업자료 목록 페이지: 과목별로 묶어서 주차 순으로 표시, 검색·태그 필터, (관리자) 새 자료 추가
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../services";
import type { Course } from "../services/types";
import { useAuth } from "../contexts/AuthContext";
import { useAsync } from "../lib/useAsync";
import { useContentFilter } from "../lib/useContentFilter";
import ContentCard from "../components/ContentCard";
import ContentForm from "../components/ContentForm";
import SearchBox from "../components/SearchBox";
import TagFilter from "../components/TagFilter";
import { Empty, ErrorMessage, Loading } from "../components/Status";

/** 과목명 → 주차 순 자료 목록 */
function groupByCourse(items: Course[]): [string, Course[]][] {
  const groups = new Map<string, Course[]>();
  for (const item of items) {
    groups.set(item.course, [...(groups.get(item.course) ?? []), item]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "ko"))
    .map(([course, list]) => [course, list.sort((a, b) => a.week - b.week)]);
}

export default function Courses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync(() => courseService.list(), []);
  const { query, setQuery, tag, setTag, allTags, filtered } = useContentFilter(data);
  const groups = useMemo(() => groupByCourse(filtered), [filtered]);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">수업자료</h1>
          <p className="mt-1 text-slate-600">과목별 강의 자료와 과제입니다.</p>
        </div>
        {user?.isAdmin && !creating && (
          <button type="button" className="btn-primary" onClick={() => setCreating(true)}>
            + 새 수업자료 추가
          </button>
        )}
      </div>

      {creating && (
        <div className="mb-8">
          <ContentForm
            heading="새 수업자료 추가"
            submitLabel="등록"
            withCourseFields
            onCancel={() => setCreating(false)}
            onSubmit={async ({ base, course, week }) => {
              const created = await courseService.create({ ...base, course, week });
              navigate(`/courses/${created.id}`);
            }}
          />
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3">
        <SearchBox value={query} onChange={setQuery} />
        <TagFilter tags={allTags} selected={tag} onChange={setTag} />
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} onRetry={reload} />}
      {data && groups.length === 0 && <Empty>조건에 맞는 수업자료가 없습니다.</Empty>}

      <div className="flex flex-col gap-8">
        {groups.map(([course, items]) => (
          <section key={course}>
            <h2 className="mb-3 border-l-4 border-brand-700 pl-3 text-lg font-semibold text-slate-900">{course}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((c) => (
                <ContentCard key={c.id} to={`/courses/${c.id}`} title={c.title} summary={c.summary} tags={c.tags} createdAt={c.createdAt} badge={`${c.week}주차`} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
