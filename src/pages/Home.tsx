// 홈: 연구실 소개, 연구 분야 키워드, 최근 연구·수업자료·토론 글
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { courseService, postService, researchService } from "../services";
import { SITE } from "../config/site";
import { useAsync } from "../lib/useAsync";
import { formatDate } from "../lib/format";
import { ErrorMessage, Loading } from "../components/Status";

interface Item {
  id: string;
  to: string;
  title: string;
  sub: string;
}

function RecentSection({ title, moreTo, items, loading, error }: { title: string; moreTo: string; items: Item[] | null; loading: boolean; error: string | null }) {
  return (
    <section className="flex flex-col rounded-lg border border-slate-200 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        <Link to={moreTo} className="text-sm text-brand-700 hover:underline">전체 보기 →</Link>
      </div>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {items && items.length === 0 && <p className="text-sm text-slate-500">아직 없습니다.</p>}
      <ul className="flex flex-col divide-y divide-slate-100">
        {items?.map((i) => (
          <li key={i.id} className="py-2">
            <Link to={i.to} className="line-clamp-2 text-sm font-medium text-slate-800 hover:text-brand-700">{i.title}</Link>
            <p className="mt-0.5 text-xs text-slate-500">{i.sub}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Hero({ children }: { children: ReactNode }) {
  return <section className="-mx-4 mb-10 sm:mx-0 border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white px-4 pb-10 pt-6 sm:rounded-xl sm:border sm:px-8 sm:pt-10">{children}</section>;
}

export default function Home() {
  const research = useAsync(async () => (await researchService.list()).slice(0, 3), []);
  const courses = useAsync(async () => (await courseService.list()).slice(0, 3), []);
  const posts = useAsync(async () => (await postService.listPosts(5)).items, []);

  return (
    <div>
      <Hero>
        <p className="text-sm font-medium text-brand-700">{SITE.affiliation}</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">{SITE.labName}</h1>
        <p className="mt-1 text-slate-600">{SITE.professorName}</p>
        <p className="mt-4 max-w-2xl leading-relaxed text-slate-700">{SITE.intro}</p>
        <div className="mt-5 flex flex-wrap gap-2" aria-label="연구 분야">
          {SITE.keywords.map((k) => (
            <span key={k} className="rounded-full border border-brand-100 bg-white px-3 py-1 text-sm text-brand-800">{k}</span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link to="/research" className="btn-primary">연구 보기</Link>
          <Link to="/discussion" className="btn-secondary">토론 참여하기</Link>
        </div>
      </Hero>

      <div className="grid gap-4 md:grid-cols-3">
        <RecentSection
          title="최근 연구"
          moreTo="/research"
          loading={research.loading}
          error={research.error}
          items={research.data?.map((r) => ({ id: r.id, to: `/research/${r.id}`, title: r.title, sub: formatDate(r.createdAt) })) ?? null}
        />
        <RecentSection
          title="최근 수업자료"
          moreTo="/courses"
          loading={courses.loading}
          error={courses.error}
          items={courses.data?.map((c) => ({ id: c.id, to: `/courses/${c.id}`, title: c.title, sub: `${c.course} · ${c.week}주차` })) ?? null}
        />
        <RecentSection
          title="최근 토론"
          moreTo="/discussion"
          loading={posts.loading}
          error={posts.error}
          items={posts.data?.map((p) => ({ id: p.id, to: `/discussion/${p.id}`, title: p.title, sub: `${p.authorName} · 댓글 ${p.commentCount}` })) ?? null}
        />
      </div>
    </div>
  );
}
