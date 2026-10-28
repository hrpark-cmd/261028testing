// 연구 목록 페이지: 검색, 태그 필터, (관리자) 새 연구 추가
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { researchService } from "../services";
import { useAuth } from "../contexts/AuthContext";
import { useAsync } from "../lib/useAsync";
import { useContentFilter } from "../lib/useContentFilter";
import ContentCard from "../components/ContentCard";
import ContentForm from "../components/ContentForm";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import SearchBox from "../components/SearchBox";
import TagFilter from "../components/TagFilter";
import { Empty, ErrorMessage, Loading } from "../components/Status";

export default function Research() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync(() => researchService.list(), []);
  const { query, setQuery, tag, setTag, allTags, filtered } = useContentFilter(data);
  const [creating, setCreating] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="연구"
        description="연구 과제와 논문, 발표 자료를 모아 두었습니다."
        actions={
          user?.isAdmin &&
          !creating && (
            <button type="button" className="btn-primary" onClick={() => setCreating(true)}>
              <Icon name="plus" className="h-4 w-4" />
              새 연구 추가
            </button>
          )
        }
      />

      <div className="container-page py-10">
        {creating && (
          <div className="mb-10">
            <ContentForm
              heading="새 연구 추가"
              submitLabel="등록"
              onCancel={() => setCreating(false)}
              onSubmit={async ({ base }) => {
                const created = await researchService.create(base);
                navigate(`/research/${created.id}`);
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
        {data && filtered.length === 0 && <Empty>조건에 맞는 연구가 없습니다.</Empty>}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ContentCard key={r.id} to={`/research/${r.id}`} title={r.title} summary={r.summary} tags={r.tags} createdAt={r.createdAt} />
          ))}
        </div>
      </div>
    </>
  );
}
