// 하단 푸터: 연구실 정보, 바로가기, 연락처
import { Link } from "react-router-dom";
import { SITE } from "../config/site";
import Icon from "./Icon";
import LogoMark from "./LogoMark";

export default function Footer() {
  return (
    <footer className="mt-20 bg-brand-950 text-slate-400">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.5fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-9 w-9" />
            <span className="font-serif text-lg font-bold text-white">{SITE.labName}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{SITE.intro}</p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">바로가기</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/research" className="hover:text-white">연구</Link></li>
            <li><Link to="/courses" className="hover:text-white">수업자료</Link></li>
            <li><Link to="/discussion" className="hover:text-white">토론</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">연락처</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li className="text-slate-300">
              {SITE.professorName} · {SITE.affiliation}
            </li>
            <li className="flex items-center gap-2">
              <Icon name="pin" className="h-4 w-4 shrink-0" />
              {SITE.location}
            </li>
            <li className="flex items-center gap-2">
              <Icon name="mail" className="h-4 w-4 shrink-0" />
              <a className="hover:text-white" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-5 text-xs text-slate-500">
          © {new Date().getFullYear()} {SITE.labNameEn}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
