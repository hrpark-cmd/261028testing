// Firebase 오류 코드를 사용자에게 보여줄 한국어 문장으로 바꿉니다.
import { FirebaseError } from "firebase/app";

const MESSAGES: Record<string, string> = {
  // 로그인
  "auth/popup-closed-by-user": "로그인 창이 닫혔습니다. 다시 시도해 주세요.",
  "auth/cancelled-popup-request": "로그인 창이 닫혔습니다. 다시 시도해 주세요.",
  "auth/popup-blocked": "브라우저가 로그인 팝업을 막았습니다. 팝업을 허용한 뒤 다시 시도해 주세요.",
  "auth/unauthorized-domain":
    "이 사이트 주소가 Firebase 승인된 도메인에 없습니다. Firebase 콘솔 > Authentication > 설정 > 승인된 도메인에 추가해 주세요.",
  "auth/operation-not-allowed": "Firebase 콘솔에서 Google 로그인이 사용 설정되어 있지 않습니다.",
  "auth/network-request-failed": "네트워크 연결을 확인해 주세요.",
  "auth/invalid-api-key": "Firebase API 키가 올바르지 않습니다. Netlify 환경변수 VITE_FIREBASE_API_KEY 를 확인해 주세요.",
  "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
    "Firebase API 키가 올바르지 않습니다. Netlify 환경변수 VITE_FIREBASE_API_KEY 를 확인해 주세요.",
  // Firestore
  "permission-denied": "권한이 없습니다. 로그인 상태나 관리자 권한을 확인해 주세요.",
  unauthenticated: "로그인이 필요합니다.",
  unavailable: "서버에 연결할 수 없습니다. 네트워크를 확인해 주세요.",
  "resource-exhausted": "오늘 사용할 수 있는 무료 사용량을 초과했습니다. 내일 다시 시도해 주세요.",
  "failed-precondition": "데이터베이스 설정(색인 등)이 필요합니다. 관리자에게 알려 주세요.",
  "not-found": "데이터베이스를 찾을 수 없습니다. Firebase 콘솔에서 Firestore 데이터베이스를 만들었는지 확인해 주세요.",
};

export function toKoreanError(err: unknown): Error {
  if (err instanceof FirebaseError) {
    console.error(err); // 개발자 도구 콘솔에서 원래 오류 확인용
    return new Error(MESSAGES[err.code] ?? `요청을 처리하지 못했습니다. (${err.code})`);
  }
  return err instanceof Error ? err : new Error("알 수 없는 오류가 발생했습니다.");
}

/** 비동기 함수를 실행하고, 실패하면 한국어 오류로 바꿔서 던집니다. */
export async function run<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    throw toKoreanError(err);
  }
}
