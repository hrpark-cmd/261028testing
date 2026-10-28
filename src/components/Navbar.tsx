// 상단 내비게이션 바: 로고·연구실 이름, 메뉴 4개, 로그인 상태
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { SITE } from "../config/site";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "./Avatar";
import Icon, { type IconName } from "./Icon";
import LogoMark from "./LogoMark";

const MENU: { to: string; label: string; icon: IconName }[] = [
  { to: "/", label: "홈", icon: "home" },
  { to: "/research", label: "연구", icon: "book" },
  { to: "/courses", label: "수업자료", icon: "cap" },
  { to: "/discussion", label: "토론", icon: "message" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading, isDemo, signOut } = useAuth();
  const { pathname } = useLocation();

  // 다른 페이지로 이동하면 모바일 메뉴 닫기
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center gap-6">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <LogoMark className="h-9 w-9" />
          <span className="leading-tight">
            <span className="block font-serif text-[17px] font-bold text-slate-900">{SITE.labName}</span>
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 sm:block">{SITE.labNameEn}</span>
          </span>
        </Link>

        <nav className="hidden h-full flex-1 items-stretch gap-1 md:flex" aria-label="주 메뉴">
          {MENU.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              end={m.to === "/"}
              className={({ isActive }) =>
                `relative flex items-center px-3 text-sm font-semibold transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:transition-colors ${
                  isActive ? "text-brand-800 after:bg-brand-700" : "text-slate-500 after:bg-transparent hover:text-slate-900"
                }`
              }
            >
              {m.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {isDemo && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-2.5 py-1 text-xs font-semibold text-accent-600 ring-1 ring-inset ring-accent-100"
              title="Firebase 연동 전 데모 모드입니다. 데이터는 이 브라우저에만 저장됩니다."
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
              데모 모드
            </span>
          )}
          {loading ? null : user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Avatar name={user.displayName} photoURL={user.photoURL} size="sm" />
              <span className="max-w-[9rem] truncate text-sm font-medium text-slate-700">{user.displayName}</span>
              {user.isAdmin && (
                <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-1.5 py-0.5 text-[11px] font-semibold text-brand-700" title="관리자">
                  <Icon name="shield" className="h-3 w-3" />
                  관리자
                </span>
              )}
              <button type="button" className="btn-ghost px-2" onClick={() => signOut()} title="로그아웃" aria-label="로그아웃">
                <Icon name="logout" className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary hidden px-3.5 py-1.5 sm:inline-flex">
              로그인
            </Link>
          )}
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {open && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <nav className="container-page flex flex-col gap-1 py-3" aria-label="모바일 메뉴">
            {MENU.map((m) => (
              <NavLink
                key={m.to}
                to={m.to}
                end={m.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    isActive ? "bg-brand-50 text-brand-800" : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                <Icon name={m.icon} className="h-4 w-4" />
                {m.label}
              </NavLink>
            ))}
            <div className="mt-2 border-t border-slate-100 pt-3">
              {user ? (
                <div className="flex items-center gap-3 px-3">
                  <Avatar name={user.displayName} photoURL={user.photoURL} size="sm" />
                  <span className="flex-1 truncate text-sm font-medium text-slate-700">
                    {user.displayName}
                    {user.isAdmin && " (관리자)"}
                  </span>
                  <button type="button" className="btn-secondary px-3 py-1.5" onClick={() => signOut()}>
                    로그아웃
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn-primary w-full">
                  로그인
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
