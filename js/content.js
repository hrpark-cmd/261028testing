// 연구 자료(research) / 수업 자료(courses) 목록. 누구나 읽고, 관리자만 추가·삭제합니다.
// 페이지의 <main data-collection="research|courses"> 값으로 컬렉션을 정합니다.
import { getFirebase, onUser, el } from "./firebase.js";

const collectionName = document.querySelector("main").dataset.collection;
const list = document.getElementById("item-list");
const form = document.getElementById("item-form");

// Firebase 연동 전 화면 확인용 예시 데이터
const SAMPLES = {
  research: [
    { title: "예시) 복합재 구조물의 피로 수명 예측", meta: "2026", summary: "Firebase 연동 후 실제 연구 자료로 교체됩니다.", link: "" },
  ],
  courses: [
    { title: "예시) 고체역학 특론", meta: "2026-2학기", summary: "Firebase 연동 후 실제 수업 자료로 교체됩니다.", link: "" },
  ],
};

function render(items, admin, fb) {
  if (!items.length) {
    list.replaceChildren(el("p", { className: "muted", textContent: "아직 등록된 자료가 없습니다." }));
    return;
  }
  list.replaceChildren(
    ...items.map((it) => {
      const card = el(
        "article",
        { className: "card" },
        el("div", { className: "meta", textContent: it.meta || "" }),
        el("h3", { textContent: it.title }),
        el("p", { textContent: it.summary || "" })
      );
      if (it.link) {
        card.append(el("a", { href: it.link, target: "_blank", rel: "noopener", textContent: "자료 열기 →" }));
      }
      if (admin && it.id) {
        const del = el("button", { className: "btn ghost small", textContent: "삭제" });
        del.onclick = async () => {
          if (!confirm("삭제할까요?")) return;
          await fb.fs.deleteDoc(fb.fs.doc(fb.db, collectionName, it.id));
          load(admin);
        };
        card.append(del);
      }
      return card;
    })
  );
}

async function load(admin) {
  const fb = await getFirebase();
  if (!fb) return render(SAMPLES[collectionName], false);
  try {
    const q = fb.fs.query(fb.fs.collection(fb.db, collectionName), fb.fs.orderBy("createdAt", "desc"));
    const snap = await fb.fs.getDocs(q);
    render(snap.docs.map((d) => ({ id: d.id, ...d.data() })), admin, fb);
  } catch (e) {
    list.replaceChildren(el("p", { className: "error", textContent: "불러오기 실패: " + e.message }));
  }
}

onUser((user, admin) => {
  form.hidden = !admin;
  load(admin);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fb = await getFirebase();
  const data = Object.fromEntries(new FormData(form));
  await fb.fs.addDoc(fb.fs.collection(fb.db, collectionName), {
    ...data,
    createdAt: fb.fs.serverTimestamp(),
  });
  form.reset();
  load(true);
});
