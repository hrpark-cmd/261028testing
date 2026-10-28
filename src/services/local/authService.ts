// 데모 로그인 (가짜 로그인). 실제 Google 계정을 사용하지 않습니다.
// Firebase 연동 후에는 services/firebase/authService.ts 의 Google 로그인으로 교체됩니다.
import type { AppUser, AuthService } from "../types";
import { isAdminEmail } from "../../config/site";
import { readJson, writeJson } from "./storage";

const DEMO_USER = { uid: "demo-user", displayName: "데모 사용자", email: "demo-user@example.com" };
const DEMO_ADMIN = { uid: "demo-admin", displayName: "데모 관리자", email: "demo-admin@example.com" };

const listeners = new Set<(user: AppUser | null) => void>();

function toAppUser(base: { uid: string; displayName: string; email: string }): AppUser {
  return { ...base, photoURL: null, isAdmin: isAdminEmail(base.email) };
}

function current(): AppUser | null {
  return readJson<AppUser | null>("auth", null);
}

function setCurrent(user: AppUser | null) {
  writeJson("auth", user);
  listeners.forEach((cb) => cb(user));
}

export const localAuthService: AuthService = {
  isDemo: true,

  async getCurrentUser() {
    return current();
  },

  async signIn(options) {
    const user = toAppUser(options?.asDemoAdmin ? DEMO_ADMIN : DEMO_USER);
    setCurrent(user);
    return user;
  },

  async signOut() {
    setCurrent(null);
  },

  onAuthChanged(callback) {
    listeners.add(callback);
    callback(current());
    return () => listeners.delete(callback);
  },
};
