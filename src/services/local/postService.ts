// 토론 게시판 localStorage 구현 (데모 모드)
// 게시글은 "posts", 댓글은 "comments" 키에 저장합니다.
// (Firestore 에서는 댓글이 posts/{postId}/comments 하위 컬렉션이 됩니다)
import type { Comment, Post, PostService } from "../types";
import { seedComments, seedPosts } from "../../data/seed";
import { byNewest, newId, readOrSeed, writeJson } from "./storage";

const loadPosts = () => readOrSeed<Post[]>("posts", seedPosts);
const savePosts = (posts: Post[]) => writeJson("posts", posts);
const loadComments = () => readOrSeed<Comment[]>("comments", seedComments);
const saveComments = (comments: Comment[]) => writeJson("comments", comments);

function changeCommentCount(postId: string, delta: number) {
  savePosts(
    loadPosts().map((p) => (p.id === postId ? { ...p, commentCount: Math.max(0, p.commentCount + delta) } : p))
  );
}

export const localPostService: PostService = {
  async listPosts(pageSize, cursor) {
    // cursor = 이미 불러온 개수 (Firebase 구현에서는 마지막 문서 기준으로 바뀝니다)
    const start = cursor ? Number(cursor) : 0;
    const sorted = [...loadPosts()].sort(byNewest);
    const items = sorted.slice(start, start + pageSize);
    const next = start + pageSize;
    return { items, nextCursor: next < sorted.length ? String(next) : null };
  },

  async listPostsByRelated(type, relatedId, limit) {
    return loadPosts()
      .filter((p) => p.relatedType === type && p.relatedId === relatedId)
      .sort(byNewest)
      .slice(0, limit);
  },

  async getPost(id) {
    return loadPosts().find((p) => p.id === id) ?? null;
  },

  async createPost(input, author) {
    const post: Post = {
      ...input,
      id: newId(),
      authorId: author.uid,
      authorName: author.displayName,
      createdAt: Date.now(),
      commentCount: 0,
    };
    savePosts([post, ...loadPosts()]);
    return post;
  },

  async deletePost(id) {
    savePosts(loadPosts().filter((p) => p.id !== id));
    saveComments(loadComments().filter((c) => c.postId !== id));
  },

  async listComments(postId) {
    return loadComments()
      .filter((c) => c.postId === postId)
      .sort((a, b) => a.createdAt - b.createdAt);
  },

  async addComment(postId, content, author) {
    const comment: Comment = {
      id: newId(),
      postId,
      content,
      authorId: author.uid,
      authorName: author.displayName,
      createdAt: Date.now(),
    };
    saveComments([...loadComments(), comment]);
    changeCommentCount(postId, 1);
    return comment;
  },

  async deleteComment(postId, commentId) {
    saveComments(loadComments().filter((c) => c.id !== commentId));
    changeCommentCount(postId, -1);
  },
};
