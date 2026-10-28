// ─────────────────────────────────────────────────────────────
// 서비스 선택 스위치
// 화면에서는 항상 이 파일에서 서비스를 가져다 씁니다:
//   import { researchService } from "../services";
// - VITE_USE_FIREBASE=true 이고 Firebase 설정값이 있으면 → Firebase (Firestore + Google 로그인)
// - 그 외 → 데모 모드 (localStorage + 가짜 로그인)
// ─────────────────────────────────────────────────────────────
import type { AuthService, CourseService, PostService, ResearchService } from "./types";
import { isFirebaseConfigured } from "../lib/firebase";
import { localResearchService, localCourseService } from "./local/contentService";
import { localPostService } from "./local/postService";
import { localAuthService } from "./local/authService";
import { firebaseResearchService, firebaseCourseService } from "./firebase/contentService";
import { firebasePostService } from "./firebase/postService";
import { firebaseAuthService } from "./firebase/authService";

const wantsFirebase = import.meta.env.VITE_USE_FIREBASE === "true";
export const usingFirebase = wantsFirebase && isFirebaseConfigured;

if (wantsFirebase && !isFirebaseConfigured) {
  console.warn("VITE_USE_FIREBASE=true 이지만 VITE_FIREBASE_* 설정값이 없어 데모 모드로 동작합니다.");
}

export const researchService: ResearchService = usingFirebase ? firebaseResearchService : localResearchService;
export const courseService: CourseService = usingFirebase ? firebaseCourseService : localCourseService;
export const postService: PostService = usingFirebase ? firebasePostService : localPostService;
export const authService: AuthService = usingFirebase ? firebaseAuthService : localAuthService;

export type * from "./types";
