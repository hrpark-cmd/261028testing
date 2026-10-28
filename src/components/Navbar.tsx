// 상단 내비게이션 바: 연구실 이름, 메뉴 4개, 로그인 상태
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { SITE } from "../config/site";
import { useAuth } from "../contexts/AuthContext";

const MENU = [
  { to: "/", label: "홈" },
  { to: "/research", label: "연구" },
  { to: "/courses", label: "수업자료" },
  { to: "/discussion", label: "토론" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading, isDemo, signOut } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium ${
      isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
        <Link to="/" className="shrink-0 text-lg font-bold text-slate-900" onClick={() => setOpen(false)}>
          {SITE.labName}
        </Link>

        <nav className="hidden flex-1 gap-1 md:flex">
          {MENU.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.to === "/"} className={linkClass}>
              {m.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {isDemo && (
            <span
              className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800"
              title="Firebase 연동 전 데모 모드입니다. 데이터는 이 브라우저에만 저장됩니다."
            >
              데모 모드
            </span>
          )}
          {loading ? null : user ? (
            <>
              <span className="hidden max-w-[10rem] truncate text-sm text-slate-700 sm:inline">
                {user.displayName}
                {user.isAdmin && <span className="ml-1 text-xs font-semibold text-brand-700">(관리자)</span>}
              </span>
              <button type="button" className="btn-secondary px-3 py-1.5" onClick={() => signOut()}>
                로그아웃
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary px-3 py-1.5">
              로그인
            </Link>
          )}
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="메뉴 열기"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-slate-100 px-4 py-2 md:hidden">
          {MENU.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.to === "/"} className={linkClass} onClick={() => setOpen(false)}>
              {m.label}
            </NavLink>
          ))}
          {user && (
            <p className="px-3 py-2 text-sm text-slate-500">
              {user.displayName}
              {user.isAdmin && " (관리자)"}
            </p>
          )}
        </nav>
      )}
    </header>
  );
}
