// 연구 목록 페이지: 검색, 태그 필터, (관리자) 새 연구 추가
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { researchService } from "../services";
import { useAuth } from "../contexts/AuthContext";
import { useAsync } from "../lib/useAsync";
import { useContentFilter } from "../lib/useContentFilter";
import ContentCard from "../components/ContentCard";
import ContentForm from "../components/ContentForm";
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
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">연구</h1>
          <p className="mt-1 text-slate-600">연구 과제와 논문, 발표 자료를 모아 두었습니다.</p>
        </div>
        {user?.isAdmin && !creating && (
          <button type="button" className="btn-primary" onClick={() => setCreating(true)}>
            + 새 연구 추가
          </button>
        )}
      </div>

      {creating && (
        <div className="mb-8">
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

      <div className="mb-6 flex flex-col gap-3">
        <SearchBox value={query} onChange={setQuery} />
        <TagFilter tags={allTags} selected={tag} onChange={setTag} />
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} onRetry={reload} />}
      {data && filtered.length === 0 && <Empty>조건에 맞는 연구가 없습니다.</Empty>}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((r) => (
          <ContentCard key={r.id} to={`/research/${r.id}`} title={r.title} summary={r.summary} tags={r.tags} createdAt={r.createdAt} />
        ))}
      </div>
    </div>
  );
}
