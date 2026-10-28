// 토론 게시판 Firestore 구현
// - posts/{postId}, 댓글은 posts/{postId}/comments/{commentId}
// - 무료 읽기 한도 절약: 페이지 단위(limit) 조회, 실시간 리스너 미사용, 댓글 수는 글 문서에 저장
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  where,
  writeBatch,
} from "firebase/firestore";
import { requireFirebase } from "../../lib/firebase";
import type { Comment, Post, PostService } from "../types";
import { fromDoc } from "./convert";
import { run } from "./errors";

const postsCol = () => collection(requireFirebase().db, "posts");
const postDoc = (id: string) => doc(postsCol(), id);
const commentsCol = (postId: string) => collection(postDoc(postId), "comments");

export const firebasePostService: PostService = {
  listPosts: (pageSize, cursor) =>
    run(async () => {
      // cursor = 이전 페이지 마지막 글의 id. 그 문서 다음부터 불러옵니다.
      // 다음 페이지가 있는지 알기 위해 1개를 더 읽습니다.
      const last = cursor ? await getDoc(postDoc(cursor)) : null;
      const q = last?.exists()
        ? query(postsCol(), orderBy("createdAt", "desc"), startAfter(last), limit(pageSize + 1))
        : query(postsCol(), orderBy("createdAt", "desc"), limit(pageSize + 1));
      const snap = await getDocs(q);
      const docs = snap.docs.slice(0, pageSize);
      return {
        items: docs.map((d) => fromDoc<Post>(d)),
        nextCursor: snap.docs.length > pageSize ? docs[docs.length - 1].id : null,
      };
    }),

  listPostsByRelated: (type, relatedId, max) =>
    run(async () => {
      // 같음(==) 조건만 쓰면 Firestore 복합 색인 없이 동작합니다. 정렬은 화면에서 합니다.
      const snap = await getDocs(query(postsCol(), where("relatedType", "==", type), where("relatedId", "==", relatedId)));
      return snap.docs
        .map((d) => fromDoc<Post>(d))
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, max);
    }),

  getPost: (id) =>
    run(async () => {
      const snap = await getDoc(postDoc(id));
      return snap.exists() ? fromDoc<Post>(snap) : null;
    }),

  createPost: (input, author) =>
    run(async () => {
      const data = {
        ...input,
        authorId: author.uid,
        authorName: author.displayName,
        commentCount: 0,
      };
      const ref = await addDoc(postsCol(), { ...data, createdAt: serverTimestamp() });
      return { ...data, id: ref.id, createdAt: Date.now() };
    }),

  deletePost: (id) =>
    run(async () => {
      // Cloud Functions 가 없으므로 하위 댓글을 직접 지운 뒤 글을 지웁니다. (한 번에 최대 500개)
      const comments = await getDocs(commentsCol(id));
      const batch = writeBatch(requireFirebase().db);
      comments.docs.slice(0, 499).forEach((c) => batch.delete(c.ref));
      batch.delete(postDoc(id));
      await batch.commit();
    }),

  listComments: (postId) =>
    run(async () => {
      const snap = await getDocs(query(commentsCol(postId), orderBy("createdAt", "asc")));
      return snap.docs.map((d) => fromDoc<Comment>(d));
    }),

  addComment: (postId, content, author) =>
    run(async () => {
      const ref = doc(commentsCol(postId));
      const data = { postId, content, authorId: author.uid, authorName: author.displayName };
      // 댓글 추가와 댓글 수 +1 을 함께 처리
      const batch = writeBatch(requireFirebase().db);
      batch.set(ref, { ...data, createdAt: serverTimestamp() });
      batch.update(postDoc(postId), { commentCount: increment(1) });
      await batch.commit();
      return { ...data, id: ref.id, createdAt: Date.now() };
    }),

  deleteComment: (postId, commentId) =>
    run(async () => {
      const batch = writeBatch(requireFirebase().db);
      batch.delete(doc(commentsCol(postId), commentId));
      batch.update(postDoc(postId), { commentCount: increment(-1) });
      await batch.commit();
    }),
};
