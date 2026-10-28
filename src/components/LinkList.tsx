// 외부 자료 링크 목록 (Google Drive, YouTube, GitHub, 논문 등). 항상 새 탭에서 엽니다.
import type { ResourceLink } from "../services/types";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default function LinkList({ links }: { links: ResourceLink[] }) {
  if (links.length === 0) return null;
  return (
    <ul className="flex flex-col gap-2">
      {links.map((l, i) => (
        <li key={i}>
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-4 py-2.5 text-sm hover:border-brand-600 hover:bg-brand-50"
          >
            <span className="font-medium text-slate-800">{l.label}</span>
            <span className="shrink-0 text-xs text-slate-500">{hostOf(l.url)} ↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
