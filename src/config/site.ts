// ─────────────────────────────────────────────────────────────
// 사이트 기본 정보: 연구실 이름, 교수명, 소개 문구 등은 이 파일 한 곳에서만 수정하세요.
// ─────────────────────────────────────────────────────────────

export const SITE = {
  labName: "OO 연구실",
  labNameEn: "OO Lab",
  professorName: "OOO 교수",
  affiliation: "OO대학교 기계공학과",
  intro:
    "기계 구조물의 해석과 설계를 연구합니다. 연구 결과와 수업 자료를 공유하고, 대학원생들과 함께 토론하는 공간입니다.",
  keywords: ["유한요소해석", "열전달", "기계진동", "구조역학", "전산역학"],
  email: "professor@example.com",
  location: "공학관 000호",
};

// 관리자(연구·수업자료 작성/수정/삭제 가능) 이메일 목록.
// Firebase 연동 후에는 Google 로그인한 계정의 이메일을 이 목록과 비교합니다.
// 교수님의 실제 Google 계정 이메일을 추가하세요.
export const ADMIN_EMAILS: string[] = [
  "professor@example.com",
  "demo-admin@example.com", // 데모 모드 테스트용 관리자 (Firebase 연동 후 삭제해도 됩니다)
];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
}

// 목록 한 번에 불러올 게시글 수 (Firestore 무료 읽기 한도 절약용)
export const POSTS_PAGE_SIZE = 20;
