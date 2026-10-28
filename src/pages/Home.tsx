// 홈: 연구실 소개(히어로), 연구 분야, 최근 연구·수업자료·토론, 참여 안내
import { Link } from "react-router-dom";
import { courseService, postService, researchService } from "../services";
import { SITE } from "../config/site";
import { useAuth } from "../contexts/AuthContext";
import { useAsync } from "../lib/useAsync";
import { formatDate } from "../lib/format";
import Avatar from "../components/Avatar";
import ContentCard from "../components/ContentCard";
import Icon from "../components/Icon";
import MeshPattern from "../components/MeshPattern";
import { ErrorMessage, Loading } from "../components/Status";

function SectionHeading({ eyebrow, title, moreTo }: { eyebrow: string; title: string; moreTo: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      <Link to={moreTo} className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-900">
        전체 보기
        <Icon name="arrowRight" className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const research = useAsync(() => researchService.list(), []);
  const courses = useAsync(() => courseService.list(), []);
  const posts = useAsync(async () => (await postService.listPosts(4)).items, []);

  const courseNames = new Set(courses.data?.map((c) => c.course));
  const stats = [
    { label: "연구 과제", value: research.data?.length },
    { label: "개설 과목", value: courses.data ? courseNames.size : undefined },
    { label: "수업자료", value: courses.data?.length },
  ];

  return (
    <>
      {/* ── 히어로 ───────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <MeshPattern className="text-white/[0.09]" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-accent-500/10 blur-3xl" aria-hidden="true" />

        <div className="container-page relative grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-brand-100">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
              {SITE.affiliation}
            </p>
            <h1 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{SITE.labName}</h1>
            <p className="mt-3 text-lg font-medium text-brand-200">{SITE.professorName}</p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">{SITE.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/research" className="btn-light px-5 py-2.5">
                연구 둘러보기
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <Link to="/discussion" className="btn-outline-light px-5 py-2.5">
                토론 참여하기
              </Link>
            </div>
          </div>

          {/* 연구 분야 패널 */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-300">Research Areas</p>
            <ol className="mt-4 divide-y divide-white/10">
              {SITE.keywords.map((k, i) => (
                <li key={k} className="flex items-center gap-4 py-3">
                  <span className="font-serif text-sm text-brand-300">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-medium text-white">{k}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* 숫자 요약 */}
        <div className="relative border-t border-white/10">
          <dl className="container-page grid grid-cols-3 divide-x divide-white/10">
            {stats.map((s) => (
              <div key={s.label} className="px-2 py-6 text-center sm:px-6">
                <dd className="font-serif text-2xl font-bold text-white sm:text-3xl">{s.value ?? "–"}</dd>
                <dt className="mt-1 text-xs text-slate-400 sm:text-sm">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 최근 연구 ─────────────────────────── */}
      <section className="container-page pt-16 sm:pt-20">
        <SectionHeading eyebrow="Latest Research" title="최근 연구" moreTo="/research" />
        {research.loading && <Loading />}
        {research.error && <ErrorMessage message={research.error} onRetry={research.reload} />}
        <div className="grid gap-5 md:grid-cols-3">
          {research.data?.slice(0, 3).map((r) => (
            <ContentCard key={r.id} to={`/research/${r.id}`} title={r.title} summary={r.summary} tags={r.tags} createdAt={r.createdAt} />
          ))}
        </div>
      </section>

      {/* ── 수업자료 + 토론 ───────────────────── */}
      <section className="container-page grid gap-12 pt-16 sm:pt-20 lg:grid-cols-2 lg:gap-8">
        <div className="min-w-0">
          <SectionHeading eyebrow="Courses" title="최근 수업자료" moreTo="/courses" />
          {courses.loading && <Loading />}
          {courses.error && <ErrorMessage message={courses.error} onRetry={courses.reload} />}
          <ul className="card divide-y divide-slate-100">
            {courses.data?.slice(0, 4).map((c) => (
              <li key={c.id}>
                <Link to={`/courses/${c.id}`} className="group flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50/80">
                  <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                    <span className="text-[10px] font-semibold leading-none">WEEK</span>
                    <span className="font-serif text-base font-bold leading-tight">{c.week}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-medium text-slate-500">{c.course}</span>
                    <span className="block truncate font-semibold text-slate-900 group-hover:text-brand-700">{c.title}</span>
                  </span>
                  <Icon name="arrowRight" className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-700" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <SectionHeading eyebrow="Discussion" title="최근 토론" moreTo="/discussion" />
          {posts.loading && <Loading />}
          {posts.error && <ErrorMessage message={posts.error} onRetry={posts.reload} />}
          <ul className="card divide-y divide-slate-100">
            {posts.data?.map((p) => (
              <li key={p.id}>
                <Link to={`/discussion/${p.id}`} className="group flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50/80">
                  <Avatar name={p.authorName} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-slate-900 group-hover:text-brand-700">{p.title}</span>
                    <span className="block text-xs text-slate-500">
                      {p.authorName} · {formatDate(p.createdAt)}
                    </span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    <Icon name="message" className="h-3.5 w-3.5" />
                    {p.commentCount}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 참여 안내 ─────────────────────────── */}
      <section className="container-page pt-16 sm:pt-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 to-brand-950 px-6 py-10 text-white sm:px-12 sm:py-12">
          <MeshPattern className="text-white/[0.07]" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold sm:text-3xl">연구에 대해 함께 이야기해요</h2>
              <p className="mt-2 max-w-xl text-brand-100">
                연구 결과와 수업 내용에 대한 질문, 아이디어, 참고자료를 토론 게시판에서 나눠 주세요. 수식도 바로 쓸 수 있습니다.
              </p>
            </div>
            <Link to={user ? "/discussion/new" : "/login?redirect=/discussion/new"} className="btn-light shrink-0 px-5 py-2.5">
              {user ? "새 글 쓰기" : "로그인하고 참여하기"}
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
