// 모든 페이지 공통 틀: 상단 메뉴 + 본문 + 하단 푸터
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { SITE } from "../config/site";

export default function Layout() {
  const { pathname } = useLocation();

  // 페이지가 바뀌면 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.title = SITE.labName;
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
