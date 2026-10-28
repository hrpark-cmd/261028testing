// 404: 없는 주소로 들어왔을 때
import { Link } from "react-router-dom";
import Icon from "../components/Icon";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="font-serif text-8xl font-bold text-brand-100">404</p>
      <h1 className="mt-2 font-serif text-2xl font-bold text-slate-900">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-slate-600">주소가 바뀌었거나 삭제된 페이지입니다.</p>
      <Link to="/" className="btn-primary mt-8">
        <Icon name="home" className="h-4 w-4" />
        홈으로 가기
      </Link>
    </div>
  );
}
