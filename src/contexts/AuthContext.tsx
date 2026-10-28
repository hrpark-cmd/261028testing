// 로그인 상태를 앱 전체에 공유합니다.
// 사용법: const { user, signIn, signOut } = useAuth();
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "../services";
import type { AppUser } from "../services/types";

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean; // 처음 로그인 상태를 확인하는 중
  isDemo: boolean;
  signIn: (options?: { asDemoAdmin?: boolean }) => Promise<AppUser>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return authService.onAuthChanged((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    isDemo: authService.isDemo,
    signIn: (options) => authService.signIn(options),
    signOut: () => authService.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth 는 AuthProvider 안에서만 사용할 수 있습니다.");
  return ctx;
}

/** 글/댓글 삭제 권한: 본인 또는 관리자 */
export function canDelete(user: AppUser | null, authorId: string): boolean {
  return !!user && (user.isAdmin || user.uid === authorId);
}
