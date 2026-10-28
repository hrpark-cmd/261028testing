// 하단 푸터: 연구실 정보와 연락처
import { SITE } from "../config/site";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-500">
        <p className="font-medium text-slate-700">
          {SITE.labName} · {SITE.affiliation}
        </p>
        <p className="mt-1">
          {SITE.professorName} · {SITE.location} ·{" "}
          <a className="hover:text-brand-700" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
        </p>
        <p className="mt-2 text-xs">© {new Date().getFullYear()} {SITE.labNameEn}</p>
      </div>
    </footer>
  );
}
