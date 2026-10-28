// ─────────────────────────────────────────────────────────────
// 서비스 선택 스위치
// 화면에서는 항상 이 파일에서 서비스를 가져다 씁니다:
//   import { researchService } from "../services";
// 환경변수 VITE_USE_FIREBASE=true 이면 Firebase 구현을, 아니면 localStorage(데모) 구현을 씁니다.
// ─────────────────────────────────────────────────────────────
import type { AuthService, CourseService, PostService, ResearchService } from "./types";
import { localResearchService, localCourseService } from "./local/contentService";
import { localPostService } from "./local/postService";
import { localAuthService } from "./local/authService";

const wantsFirebase = import.meta.env.VITE_USE_FIREBASE === "true";

// TODO(Firebase 연동 단계): services/firebase/ 구현체를 만든 뒤 아래처럼 교체합니다.
//   export const researchService = wantsFirebase ? firebaseResearchService : localResearchService;
if (wantsFirebase) {
  console.warn("VITE_USE_FIREBASE=true 이지만 아직 Firebase 구현이 없어 데모 모드로 동작합니다.");
}

export const researchService: ResearchService = localResearchService;
export const courseService: CourseService = localCourseService;
export const postService: PostService = localPostService;
export const authService: AuthService = localAuthService;

export type * from "./types";
