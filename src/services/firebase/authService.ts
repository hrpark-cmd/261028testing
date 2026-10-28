// Google 로그인 (Firebase Authentication)
// 관리자 여부는 로그인한 이메일을 src/config/site.ts 의 ADMIN_EMAILS 와 비교해 정합니다.
// (실제 쓰기 권한은 Firestore 보안 규칙이 서버에서 한 번 더 확인합니다)
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { requireFirebase } from "../../lib/firebase";
import { isAdminEmail } from "../../config/site";
import type { AppUser, AuthService } from "../types";
import { run } from "./errors";

function toAppUser(user: User): AppUser {
  const email = user.email ?? "";
  return {
    uid: user.uid,
    displayName: user.displayName || email.split("@")[0] || "사용자",
    email,
    photoURL: user.photoURL,
    isAdmin: isAdminEmail(email),
  };
}

/** users/{uid} 에 프로필 저장 (로그인할 때마다 갱신). 실패해도 로그인은 계속됩니다. */
async function saveProfile(user: AppUser) {
  try {
    await setDoc(
      doc(requireFirebase().db, "users", user.uid),
      { displayName: user.displayName, email: user.email, photoURL: user.photoURL, lastLoginAt: serverTimestamp() },
      { merge: true }
    );
  } catch (err) {
    console.warn("프로필 저장 실패", err);
  }
}

export const firebaseAuthService: AuthService = {
  isDemo: false,

  getCurrentUser: () =>
    run(async () => {
      const { auth } = requireFirebase();
      await auth.authStateReady();
      return auth.currentUser ? toAppUser(auth.currentUser) : null;
    }),

  signIn: () =>
    run(async () => {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" }); // 매번 계정 선택 창 표시
      const result = await signInWithPopup(requireFirebase().auth, provider);
      const user = toAppUser(result.user);
      await saveProfile(user);
      return user;
    }),

  signOut: () => run(() => signOut(requireFirebase().auth)),

  onAuthChanged(callback) {
    return onAuthStateChanged(requireFirebase().auth, (u) => callback(u ? toAppUser(u) : null));
  },
};
