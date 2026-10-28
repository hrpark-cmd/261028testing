// ─────────────────────────────────────────────────────────────
// Firebase 초기화
// - .env.local(또는 Netlify 환경변수)에 VITE_FIREBASE_* 값이 있을 때만 초기화합니다.
// - Spark(무료) 요금제에서 쓸 Firestore 와 Authentication 만 사용합니다.
//   Cloud Functions / Cloud Storage 는 사용하지 않습니다.
// ─────────────────────────────────────────────────────────────
import { initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);

// 흔한 실수: 화면에 가려진 값(•••)이나 따옴표·공백을 그대로 복사해 넣은 경우 개발자 도구에 알려 줍니다.
if (firebaseConfig.apiKey && !/^[A-Za-z0-9_-]{30,}$/.test(firebaseConfig.apiKey)) {
  console.error("VITE_FIREBASE_API_KEY 값 형식이 이상합니다. 가려진 글자(•)·따옴표·공백 없이 실제 키를 넣었는지 확인하세요.");
}

export const firebaseApp: FirebaseApp | null = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export const db: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;

// 개발 테스트용: VITE_FIREBASE_EMULATOR=true 이면 실제 Firebase 대신 내 컴퓨터의 에뮬레이터에 연결합니다.
// 실제 배포(Netlify)에서는 이 값을 넣지 마세요.
if (auth && db && import.meta.env.VITE_FIREBASE_EMULATOR === "true") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

/** Firebase 구현에서 사용. 설정이 없으면 한국어 오류를 냅니다. */
export function requireFirebase(): { auth: Auth; db: Firestore } {
  if (!auth || !db) throw new Error("Firebase 설정값이 없습니다. 환경변수(VITE_FIREBASE_*)를 확인해 주세요.");
  return { auth, db };
}
