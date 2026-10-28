// 로딩 중 / 오류 / 빈 목록 안내
import type { ReactNode } from "react";
import Icon from "./Icon";

export function Loading({ text = "불러오는 중…" }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700" />
      {text}
    </div>
  );
}

export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="mt-2 font-semibold underline" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center text-sm text-slate-500">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon name="inbox" className="h-5 w-5" />
      </span>
      <div>{children}</div>
    </div>
  );
}
