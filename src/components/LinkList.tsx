// 외부 자료 링크 목록 (Google Drive, YouTube, GitHub, 논문 등). 항상 새 탭에서 엽니다.
import type { ResourceLink } from "../services/types";
import Icon, { type IconName } from "./Icon";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** 주소에 따라 아이콘 선택 */
function iconFor(host: string): IconName {
  if (host.includes("youtube") || host.includes("youtu.be")) return "play";
  if (host.includes("github")) return "code";
  if (host.includes("drive.google") || host.includes("docs.google")) return "file";
  return "link";
}

export default function LinkList({ links }: { links: ResourceLink[] }) {
  if (links.length === 0) return null;
  return (
    <ul className="flex flex-col gap-2">
      {links.map((l, i) => {
        const host = hostOf(l.url);
        return (
          <li key={i}>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 transition hover:border-brand-300 hover:shadow-soft"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition group-hover:bg-brand-800 group-hover:text-white">
                <Icon name={iconFor(host)} className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-slate-800">{l.label}</span>
                <span className="block truncate text-xs text-slate-500">{host}</span>
              </span>
              <Icon name="external" className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-brand-700" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
