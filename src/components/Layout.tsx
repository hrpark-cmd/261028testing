// 모든 페이지 공통 틀: 상단 메뉴 + 본문 + 하단 푸터
// 본문 폭(container-page)은 각 페이지에서 정합니다. (머리말 띠를 화면 끝까지 넓게 쓰기 위해)
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
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
