// 서비스 함수(Promise)를 불러와 로딩/오류/결과 상태를 관리하는 훅
// 사용법: const { data, loading, error, reload } = useAsync(() => researchService.list(), []);
import { useCallback, useEffect, useState, type DependencyList } from "react";
import { toErrorMessage } from "./format";

export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false; // 화면을 떠난 뒤 늦게 도착한 결과는 무시
    setLoading(true);
    setError(null);
    fn()
      .then((result) => !cancelled && setData(result))
      .catch((err: unknown) => !cancelled && setError(toErrorMessage(err, "데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.")))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // deps 가 바뀌거나 reload() 를 부르면 다시 불러옵니다.
  }, [...deps, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { data, loading, error, reload };
}
