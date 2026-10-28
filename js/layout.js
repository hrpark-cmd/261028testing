// 모든 페이지 공통: 상단 로그인 영역과 현재 메뉴 표시
import { isConfigured, onUser, signIn, signOut, el } from "./firebase.js";

const path = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav a").forEach((a) => {
  if (a.getAttribute("href") === path) a.classList.add("active");
});

const box = document.getElementById("auth-box");

if (!isConfigured) {
  box.replaceChildren(el("span", { className: "muted small", textContent: "Firebase 미설정" }));
} else {
  onUser((user) => {
    if (!user) {
      const btn = el("button", { className: "btn", textContent: "Google 로그인" });
      btn.onclick = () => signIn().catch((e) => alert("로그인 실패: " + e.message));
      box.replaceChildren(btn);
    } else {
      const out = el("button", { className: "btn ghost", textContent: "로그아웃" });
      out.onclick = signOut;
      box.replaceChildren(el("span", { className: "small", textContent: user.displayName || user.email }), out);
    }
  });
}
