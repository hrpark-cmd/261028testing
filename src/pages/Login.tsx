// 로그인 페이지
// - 데모 모드: "Google로 로그인"은 가짜 데모 사용자로, "데모 관리자로 로그인"은 관리자로 로그인합니다.
// - Firebase 연동 후: "Google로 로그인"이 실제 Google 계정 로그인 창을 엽니다.
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toErrorMessage } from "../lib/format";
import { SITE } from "../config/site";
import Card from "../components/Card";

/** 로그인 후 돌아갈 주소. 외부 사이트로 튕기지 않도록 "/" 로 시작하는 내부 주소만 허용 */
function safeRedirect(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export default function Login() {
  const { user, isDemo, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = safeRedirect(params.get("redirect"));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSignIn(asDemoAdmin = false) {
    setBusy(true);
    setError(null);
    try {
      await signIn({ asDemoAdmin });
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(toErrorMessage(err, "로그인하지 못했습니다. 잠시 후 다시 시도해 주세요."));
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <Card className="text-center">
        <h1 className="text-xl font-bold text-slate-900">로그인</h1>
        <p className="mt-2 text-sm text-slate-600">{SITE.labName} 토론 게시판에 글과 댓글을 남기려면 로그인하세요.</p>

        {user ? (
          <div className="mt-6 flex flex-col gap-3">
            <p className="text-sm text-slate-700">
              <span className="font-medium">{user.displayName}</span> 님으로 로그인되어 있습니다.
            </p>
            <Link to="/" className="btn-primary">홈으로</Link>
            <button type="button" className="btn-secondary" onClick={() => signOut()}>로그아웃</button>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            <button type="button" className="btn-secondary py-2.5" disabled={busy} onClick={() => handleSignIn(false)}>
              <GoogleIcon /> Google로 로그인
            </button>
            {isDemo && (
              <button type="button" className="btn-secondary py-2.5" disabled={busy} onClick={() => handleSignIn(true)}>
                🛠 데모 관리자로 로그인
              </button>
            )}
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}

        {isDemo && !user && (
          <p className="mt-6 rounded-md bg-amber-50 p-3 text-left text-xs leading-relaxed text-amber-800">
            <strong>데모 모드</strong>입니다. 실제 Google 계정을 사용하지 않으며, 작성한 내용은 이 브라우저에만 저장됩니다.
            "데모 관리자"로 로그인하면 연구·수업자료 작성/수정/삭제를 시험해 볼 수 있습니다.
          </p>
        )}
      </Card>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
