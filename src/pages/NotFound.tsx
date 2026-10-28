// 404: 없는 주소로 들어왔을 때
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-5xl font-bold text-brand-700">404</p>
      <h1 className="mt-4 text-xl font-semibold text-slate-900">페이지를 찾을 수 없습니다</h1>
      <p className="mt-2 text-slate-600">주소가 바뀌었거나 삭제된 페이지입니다.</p>
      <Link to="/" className="btn-primary mt-6">홈으로 가기</Link>
    </div>
  );
}
