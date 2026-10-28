// Firebase 초기화 및 공통 헬퍼. 설정 전에는 Firebase 없이 정적 내용만 보여줍니다.
import { firebaseConfig } from "./firebase-config.js";

const SDK = "https://www.gstatic.com/firebasejs/11.0.2";

export const isConfigured = !firebaseConfig.apiKey.startsWith("YOUR_");

let ctx = null;

// Firebase 모듈을 한 번만 불러와 { app, auth, db, fs, au } 를 돌려줍니다.
export async function getFirebase() {
  if (!isConfigured) return null;
  if (ctx) return ctx;
  const [{ initializeApp }, au, fs] = await Promise.all([
    import(`${SDK}/firebase-app.js`),
    import(`${SDK}/firebase-auth.js`),
    import(`${SDK}/firebase-firestore.js`),
  ]);
  const app = initializeApp(firebaseConfig);
  ctx = { app, auth: au.getAuth(app), db: fs.getFirestore(app), au, fs };
  return ctx;
}

export async function signIn() {
  const fb = await getFirebase();
  if (!fb) return alert("Firebase 설정이 아직 완료되지 않았습니다. README를 참고하세요.");
  const provider = new fb.au.GoogleAuthProvider();
  const { user } = await fb.au.signInWithPopup(fb.auth, provider);
  // 사용자 프로필 저장(최초 로그인 시 생성, 이후 갱신)
  await fb.fs.setDoc(
    fb.fs.doc(fb.db, "users", user.uid),
    {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLoginAt: fb.fs.serverTimestamp(),
    },
    { merge: true }
  );
}

export async function signOut() {
  const fb = await getFirebase();
  if (fb) await fb.au.signOut(fb.auth);
}

// 로그인 상태 변화 구독. callback(user, isAdmin)
export async function onUser(callback) {
  const fb = await getFirebase();
  if (!fb) return callback(null, false);
  fb.au.onAuthStateChanged(fb.auth, async (user) => {
    let admin = false;
    if (user) {
      try {
        const snap = await fb.fs.getDoc(fb.fs.doc(fb.db, "admins", user.uid));
        admin = snap.exists();
      } catch {
        admin = false;
      }
    }
    callback(user, admin);
  });
}

export function formatDate(ts) {
  if (!ts?.toDate) return "";
  return ts.toDate().toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short" });
}

// 사용자 입력은 항상 textContent 로 넣어 XSS 를 막습니다.
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  Object.assign(node, props);
  for (const c of children) if (c != null) node.append(c);
  return node;
}
