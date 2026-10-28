// ─────────────────────────────────────────────────────────────
// Firebase 초기화 (틀만 작성)
// - .env.local(또는 Netlify 환경변수)에 VITE_FIREBASE_* 값이 있을 때만 초기화합니다.
// - Spark(무료) 요금제에서 쓸 Firestore 와 Authentication 만 사용합니다.
//   Cloud Functions / Cloud Storage 는 사용하지 않습니다.
// - 아직 아무 곳에서도 이 파일을 쓰지 않습니다. services/firebase/ 를 만들 때 사용합니다.
// ─────────────────────────────────────────────────────────────
import { initializeApp, type FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

export const firebaseApp: FirebaseApp | null = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

// TODO(Firebase 연동 단계): 아래 두 줄을 추가해 Auth / Firestore 인스턴스를 내보냅니다.
//   import { getAuth } from "firebase/auth";            export const auth = firebaseApp ? getAuth(firebaseApp) : null;
//   import { getFirestore } from "firebase/firestore";  export const db = firebaseApp ? getFirestore(firebaseApp) : null;
