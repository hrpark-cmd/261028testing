// 게시글 상세 + 댓글
import { getFirebase, onUser, formatDate, el } from "./firebase.js";

const id = new URLSearchParams(location.search).get("id");
const article = document.getElementById("post");
const commentList = document.getElementById("comment-list");
const form = document.getElementById("comment-form");
let currentUser = null;
let isAdmin = false;

async function load() {
  const fb = await getFirebase();
  const postRef = fb.fs.doc(fb.db, "posts", id);
  const snap = await fb.fs.getDoc(postRef);
  if (!snap.exists()) {
    article.replaceChildren(el("p", { textContent: "글을 찾을 수 없습니다." }));
    return;
  }
  const p = snap.data();
  const canEdit = isAdmin || p.authorUid === currentUser.uid;
  article.replaceChildren(
    el("h2", { textContent: p.title }),
    el("div", { className: "meta", textContent: `${p.authorName} · ${formatDate(p.createdAt)}` }),
    el("div", { className: "post-body", textContent: p.body })
  );
  if (canEdit) {
    const del = el("button", { className: "btn ghost small", textContent: "글 삭제" });
    del.onclick = async () => {
      if (!confirm("이 글을 삭제할까요?")) return;
      await fb.fs.deleteDoc(postRef);
      location.href = "discussion.html";
    };
    article.append(del);
  }

  const cq = fb.fs.query(fb.fs.collection(postRef, "comments"), fb.fs.orderBy("createdAt", "asc"));
  const cs = await fb.fs.getDocs(cq);
  commentList.replaceChildren(
    ...cs.docs.map((d) => {
      const c = d.data();
      const row = el(
        "div",
        { className: "comment" },
        el("div", { className: "meta", textContent: `${c.authorName} · ${formatDate(c.createdAt)}` }),
        el("p", { textContent: c.body })
      );
      if (isAdmin || c.authorUid === currentUser.uid) {
        const del = el("button", { className: "btn ghost small", textContent: "삭제" });
        del.onclick = async () => {
          await fb.fs.deleteDoc(d.ref);
          await fb.fs.updateDoc(postRef, { commentCount: fb.fs.increment(-1) }).catch(() => {});
          load();
        };
        row.append(del);
      }
      return row;
    })
  );
}

onUser((user, admin) => {
  currentUser = user;
  isAdmin = admin;
  if (!user) {
    article.replaceChildren(el("p", { className: "muted", textContent: "로그인 후 볼 수 있습니다." }));
    form.hidden = true;
    return;
  }
  form.hidden = false;
  load().catch((e) => article.replaceChildren(el("p", { className: "error", textContent: e.message })));
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fb = await getFirebase();
  const postRef = fb.fs.doc(fb.db, "posts", id);
  const body = new FormData(form).get("body").trim();
  if (!body) return;
  await fb.fs.addDoc(fb.fs.collection(postRef, "comments"), {
    body,
    authorUid: currentUser.uid,
    authorName: currentUser.displayName || currentUser.email,
    createdAt: fb.fs.serverTimestamp(),
  });
  await fb.fs.updateDoc(postRef, { commentCount: fb.fs.increment(1) }).catch(() => {});
  form.reset();
  load();
});
