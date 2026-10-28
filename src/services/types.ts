// ─────────────────────────────────────────────────────────────
// 데이터 모델과 서비스 인터페이스 정의
// - 화면(페이지/컴포넌트)은 반드시 여기 정의된 서비스 함수로만 데이터에 접근합니다.
// - 지금은 localStorage 구현(services/local), 다음 단계에서 Firebase 구현(services/firebase)을 추가합니다.
// - 날짜(createdAt)는 밀리초 숫자(Date.now())로 통일합니다.
// ─────────────────────────────────────────────────────────────

export interface ResourceLink {
  label: string;
  url: string;
}

/** 연구 과제 / 논문 */
export interface Research {
  id: string;
  title: string;
  summary: string; // 마크다운 + 수식
  tags: string[];
  links: ResourceLink[];
  createdAt: number;
}

/** 수업자료 (연구 항목 + 과목명, 주차) */
export interface Course extends Research {
  course: string;
  week: number;
}

/** 작성/수정 폼에서 넘기는 값 (id, createdAt 은 서비스가 정함) */
export type ResearchInput = Omit<Research, "id" | "createdAt">;
export type CourseInput = Omit<Course, "id" | "createdAt">;

export type RelatedType = "research" | "course";

/** 토론 게시글 */
export interface Post {
  id: string;
  title: string;
  content: string; // 마크다운 + 수식
  authorId: string;
  authorName: string;
  relatedType: RelatedType | null; // 연결된 자료 종류 (없으면 null)
  relatedId: string | null;
  createdAt: number;
  commentCount: number;
}

export interface PostInput {
  title: string;
  content: string;
  relatedType: RelatedType | null;
  relatedId: string | null;
}

/** 댓글 (Firestore 에서는 posts/{postId}/comments 하위 컬렉션) */
export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: number;
}

/** 로그인한 사용자 */
export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  isAdmin: boolean;
}

/** 페이지 단위로 불러온 결과. nextCursor 가 null 이면 더 불러올 것이 없음 */
export interface PageResult<T> {
  items: T[];
  nextCursor: string | null;
}

// ── 서비스 인터페이스 ─────────────────────────────────────────

/** 연구·수업자료 공통 형태 (목록/조회/작성/수정/삭제) */
export interface ContentService<T, TInput> {
  list(): Promise<T[]>; // 최신순
  get(id: string): Promise<T | null>;
  create(input: TInput): Promise<T>;
  update(id: string, input: TInput): Promise<void>;
  remove(id: string): Promise<void>;
}

export type ResearchService = ContentService<Research, ResearchInput>;
export type CourseService = ContentService<Course, CourseInput>;

export interface PostService {
  /** 최신순으로 pageSize 개씩. 다음 페이지는 이전 결과의 nextCursor 를 넘깁니다. */
  listPosts(pageSize: number, cursor?: string | null): Promise<PageResult<Post>>;
  /** 특정 연구/수업자료에 연결된 글 (최신순, 최대 limit 개) */
  listPostsByRelated(type: RelatedType, relatedId: string, limit: number): Promise<Post[]>;
  getPost(id: string): Promise<Post | null>;
  createPost(input: PostInput, author: AppUser): Promise<Post>;
  deletePost(id: string): Promise<void>;

  listComments(postId: string): Promise<Comment[]>; // 오래된 순
  addComment(postId: string, content: string, author: AppUser): Promise<Comment>;
  deleteComment(postId: string, commentId: string): Promise<void>;
}

export interface AuthService {
  /** true 이면 데모(가짜) 로그인 */
  readonly isDemo: boolean;
  getCurrentUser(): Promise<AppUser | null>;
  /** Google 로그인. 데모 모드에서는 asDemoAdmin 으로 관리자 로그인 테스트 가능 */
  signIn(options?: { asDemoAdmin?: boolean }): Promise<AppUser>;
  signOut(): Promise<void>;
  /** 로그인 상태가 바뀔 때마다 호출. 반환값을 호출하면 구독 해제 */
  onAuthChanged(callback: (user: AppUser | null) => void): () => void;
}
