// 토론 게시판 목록 + 새 글 작성 (로그인 사용자 전용)
import { getFirebase, onUser, formatDate, el, isConfigured } from "./firebase.js";

const list = document.getElementById("post-list");
const form = document.getElementById("post-form");
const notice = document.getElementById("login-notice");
let currentUser = null;

async function load() {
  const fb = await getFirebase();
  const q = fb.fs.query(fb.fs.collection(fb.db, "posts"), fb.fs.orderBy("createdAt", "desc"), fb.fs.limit(50));
  const snap = await fb.fs.getDocs(q);
  if (snap.empty) {
    list.replaceChildren(el("p", { className: "muted", textContent: "첫 번째 글을 남겨보세요." }));
    return;
  }
  list.replaceChildren(
    ...snap.docs.map((d) => {
      const p = d.data();
      return el(
        "a",
        { className: "card post-row", href: `post.html?id=${encodeURIComponent(d.id)}` },
        el("h3", { textContent: p.title }),
        el("div", { className: "meta", textContent: `${p.authorName || "익명"} · ${formatDate(p.createdAt)} · 댓글 ${p.commentCount || 0}` })
      );
    })
  );
}

if (!isConfigured) {
  notice.textContent = "Firebase 연동 후 사용할 수 있습니다.";
} else {
  onUser((user) => {
    currentUser = user;
    form.hidden = !user;
    notice.hidden = !!user;
    if (user) load().catch((e) => list.replaceChildren(el("p", { className: "error", textContent: e.message })));
    else list.replaceChildren();
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fb = await getFirebase();
  const { title, body } = Object.fromEntries(new FormData(form));
  await fb.fs.addDoc(fb.fs.collection(fb.db, "posts"), {
    title: title.trim(),
    body: body.trim(),
    authorUid: currentUser.uid,
    authorName: currentUser.displayName || currentUser.email,
    commentCount: 0,
    createdAt: fb.fs.serverTimestamp(),
  });
  form.reset();
  load();
});
