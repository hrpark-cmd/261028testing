// 라우팅(주소 → 페이지) 정의. 새 페이지를 추가할 때 여기에 Route 를 추가합니다.
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Research from "./pages/Research";
import ResearchDetail from "./pages/ResearchDetail";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Discussion from "./pages/Discussion";
import PostNew from "./pages/PostNew";
import PostDetail from "./pages/PostDetail";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/research" element={<Research />} />
        <Route path="/research/:id" element={<ResearchDetail />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/discussion" element={<Discussion />} />
        <Route path="/discussion/new" element={<PostNew />} />
        <Route path="/discussion/:id" element={<PostDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
