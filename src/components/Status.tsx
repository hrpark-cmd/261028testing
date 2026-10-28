// 로딩 중 / 오류 / 빈 목록 안내 문구
import type { ReactNode } from "react";

export function Loading({ text = "불러오는 중…" }: { text?: string }) {
  return <p className="py-8 text-center text-sm text-slate-500">{text}</p>;
}

export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="mt-2 underline" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-md bg-slate-50 py-8 text-center text-sm text-slate-500">{children}</p>;
}
