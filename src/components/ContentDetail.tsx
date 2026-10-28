// 연구·수업자료 상세 화면의 공통 틀
// 왼쪽: 본문(마크다운·수식) + 관련 토론 / 오른쪽: 자료 링크, 정보, 토론 버튼
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Research, RelatedType } from "../services/types";
import { formatDate } from "../lib/format";
import Icon from "./Icon";
import LinkList from "./LinkList";
import MarkdownView from "./MarkdownView";
import PageHeader from "./PageHeader";
import RelatedDiscussion from "./RelatedDiscussion";
import TagList from "./TagList";

interface Props {
  item: Research;
  type: RelatedType;
  eyebrow: string;
  back: { to: string; label: string };
  meta?: ReactNode; // 예: 과목명·주차
  adminActions?: ReactNode;
}

export default function ContentDetail({ item, type, eyebrow, back, meta, adminActions }: Props) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={item.title} back={back} actions={adminActions}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
          {meta}
          <span className="inline-flex items-center gap-1.5">
            <Icon name="calendar" className="h-4 w-4" />
            {formatDate(item.createdAt)}
          </span>
          <TagList tags={item.tags} basePath={back.to} />
        </div>
      </PageHeader>

      <div className="container-page grid gap-6 py-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <article className="card p-6 sm:p-8">
            {item.summary.trim() ? <MarkdownView content={item.summary} /> : <p className="text-slate-400">내용이 없습니다.</p>}
          </article>
          <RelatedDiscussion type={type} id={item.id} />
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <section className="card p-5">
            <h2 className="mb-3 text-sm font-bold text-slate-900">자료 링크</h2>
            {item.links.length > 0 ? <LinkList links={item.links} /> : <p className="text-sm text-slate-400">등록된 링크가 없습니다.</p>}
          </section>
          <section className="relative overflow-hidden rounded-2xl bg-brand-900 p-5 text-white">
            <h2 className="font-serif text-lg font-bold">궁금한 점이 있나요?</h2>
            <p className="mt-1 text-sm text-brand-100">이 자료에 대한 질문이나 의견을 토론 게시판에 남겨 주세요.</p>
            <Link to={`/discussion/new?type=${type}&id=${encodeURIComponent(item.id)}`} className="btn-light mt-4 w-full">
              토론 글 쓰기
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}
