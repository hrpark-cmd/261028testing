// 수업자료 목록 페이지: 과목별로 묶어서 주차 순으로 표시, 검색·태그 필터, (관리자) 새 자료 추가
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { courseService } from "../services";
import type { Course } from "../services/types";
import { useAuth } from "../contexts/AuthContext";
import { useAsync } from "../lib/useAsync";
import { useContentFilter } from "../lib/useContentFilter";
import { excerpt } from "../lib/format";
import ContentForm from "../components/ContentForm";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import SearchBox from "../components/SearchBox";
import TagFilter from "../components/TagFilter";
import TagList from "../components/TagList";
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
    <>
      <PageHeader
        eyebrow="Courses"
        title="수업자료"
        description="과목별 강의 자료와 과제를 주차 순서로 정리했습니다."
        actions={
          user?.isAdmin &&
          !creating && (
            <button type="button" className="btn-primary" onClick={() => setCreating(true)}>
              <Icon name="plus" className="h-4 w-4" />
              새 수업자료 추가
            </button>
          )
        }
      />

      <div className="container-page py-10">
        {creating && (
          <div className="mb-10">
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

        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchBox value={query} onChange={setQuery} />
            {data && <p className="text-sm text-slate-500">총 <strong className="text-slate-900">{filtered.length}</strong>건</p>}
          </div>
          <TagFilter tags={allTags} selected={tag} onChange={setTag} />
        </div>

        {loading && <Loading />}
        {error && <ErrorMessage message={error} onRetry={reload} />}
        {data && groups.length === 0 && <Empty>조건에 맞는 수업자료가 없습니다.</Empty>}

        <div className="flex flex-col gap-8">
          {groups.map(([course, items]) => (
            <section key={course} className="card overflow-hidden">
              <header className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-800 text-white">
                  <Icon name="cap" className="h-4 w-4" />
                </span>
                <h2 className="flex-1 font-serif text-lg font-bold text-slate-900">{course}</h2>
                <span className="text-sm text-slate-500">{items.length}개 자료</span>
              </header>
              <ol className="divide-y divide-slate-100">
                {items.map((c) => (
                  <li key={c.id}>
                    <Link to={`/courses/${c.id}`} className="group flex gap-4 px-5 py-5 transition hover:bg-slate-50/80 sm:px-6">
                      <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-accent-50 text-accent-600 ring-1 ring-inset ring-accent-100">
                        <span className="text-[10px] font-semibold leading-none">WEEK</span>
                        <span className="font-serif text-lg font-bold leading-tight">{c.week}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-slate-900 group-hover:text-brand-700">{c.title}</span>
                        <span className="mt-1 line-clamp-2 block text-sm text-slate-600">{excerpt(c.summary, 140)}</span>
                        <span className="mt-2 block">
                          <TagList tags={c.tags} />
                        </span>
                      </span>
                      <Icon name="arrowRight" className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-700" />
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
