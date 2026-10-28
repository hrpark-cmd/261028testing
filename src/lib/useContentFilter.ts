// 연구·수업자료 목록의 "제목 검색 + 태그 필터" 상태를 관리하는 훅
// 선택한 태그는 주소(?tag=...)에 남겨, 상세 페이지의 태그를 눌러도 필터가 적용되게 합니다.
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface Filterable {
  title: string;
  tags: string[];
}

export function useContentFilter<T extends Filterable>(items: T[] | null) {
  const [query, setQuery] = useState("");
  const [params, setParams] = useSearchParams();
  const tag = params.get("tag");

  const setTag = (next: string | null) => {
    setParams(next ? { tag: next } : {}, { replace: true });
  };

  const allTags = useMemo(
    () => [...new Set((items ?? []).flatMap((i) => i.tags))].sort((a, b) => a.localeCompare(b, "ko")),
    [items]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (items ?? []).filter(
      (i) => (!tag || i.tags.includes(tag)) && (!q || i.title.toLowerCase().includes(q))
    );
  }, [items, query, tag]);

  return { query, setQuery, tag, setTag, allTags, filtered };
}
