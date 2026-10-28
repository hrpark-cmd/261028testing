# 연구실 웹사이트 (MVP 틀)

기계공학과 연구실의 **연구 자료 · 수업 자료 · 대학원생 토론 게시판** 사이트입니다.

- 빌드 과정이 없는 순수 HTML/CSS/JS → GitHub에 올리면 Netlify가 그대로 배포
- Firebase **Spark(무료) 요금제** 기능만 사용: Firestore + Authentication(Google 로그인)
- Cloud Storage, Cloud Functions 등 유료(Blaze) 필요 기능은 사용하지 않습니다.
  파일은 Google Drive·DOI 등 **링크**로 등록합니다.

## 폴더 구조

```
index.html          홈
research.html       연구 자료 (누구나 열람, 관리자만 등록)
courses.html        수업 자료 (누구나 열람, 관리자만 등록)
discussion.html     토론 게시판 (로그인 사용자 전용)
post.html           게시글 상세 + 댓글
css/style.css       디자인 (다크 모드 자동 지원)
js/firebase-config.js   ← Firebase 설정값을 여기에 붙여넣기
js/firebase.js      Firebase 초기화, 로그인 헬퍼
js/layout.js        상단 메뉴/로그인 버튼
js/content.js       연구·수업 자료 목록
js/discussion.js    게시판 목록/글쓰기
js/post.js          게시글/댓글
firestore.rules     Firestore 보안 규칙
netlify.toml        Netlify 배포 설정
docs/PROMPTS.md     다음 단계용 Claude Code 프롬프트 모음
```

## 1단계: GitHub → Netlify 배포

1. 이 저장소를 GitHub에 push 합니다.
2. Netlify → **Add new site → Import an existing project → GitHub** → 저장소 선택
3. Build command: 비워두기, Publish directory: `.` (netlify.toml 에 이미 설정됨) → **Deploy**
4. 배포 주소(예: `https://xxxx.netlify.app`)를 메모해 둡니다.

Firebase 연동 전에도 사이트는 열리며, 연구/수업 페이지에는 예시 데이터가 보입니다.

## 2단계: Firebase 연동 (Spark 무료)

1. [Firebase 콘솔](https://console.firebase.google.com) → 프로젝트 추가 (Google 애널리틱스는 꺼도 됨)
2. **빌드 → Authentication → 시작하기 → 로그인 방법 → Google** 사용 설정
3. **Authentication → 설정 → 승인된 도메인**에 Netlify 주소(`xxxx.netlify.app`) 추가
4. **빌드 → Firestore Database → 데이터베이스 만들기** → 위치 `asia-northeast3 (서울)` → 프로덕션 모드
5. **Firestore → 규칙** 탭에 `firestore.rules` 내용을 붙여넣고 **게시**
6. **프로젝트 설정(톱니바퀴) → 내 앱 → 웹 앱 추가(</>)** → 표시되는 `firebaseConfig` 값을
   `js/firebase-config.js` 에 붙여넣고 GitHub에 push → Netlify 자동 재배포

### 교수님 계정을 관리자로 지정

1. 배포된 사이트에서 Google 로그인을 한 번 합니다.
2. Firebase 콘솔 → **Authentication → 사용자** 에서 본인 계정의 **사용자 UID** 복사
3. **Firestore → 컬렉션 시작** → 컬렉션 ID `admins`, 문서 ID = 복사한 UID,
   필드 아무거나 하나(예: `role` = `professor`) → 저장
4. 새로고침하면 연구/수업 페이지에 "자료 추가" 폼이 나타납니다.

## 데이터 구조 (Firestore)

| 컬렉션 | 필드 | 권한 |
|---|---|---|
| `admins/{uid}` | role | 콘솔에서만 추가 |
| `users/{uid}` | displayName, email, photoURL, lastLoginAt | 로그인 시 자동 생성 |
| `research/{id}` | title, meta(연도), summary, link, createdAt | 읽기: 모두 / 쓰기: 관리자 |
| `courses/{id}` | title, meta(학기), summary, link, createdAt | 읽기: 모두 / 쓰기: 관리자 |
| `posts/{id}` | title, body, authorUid, authorName, commentCount, createdAt | 로그인 사용자 |
| `posts/{id}/comments/{id}` | body, authorUid, authorName, createdAt | 로그인 사용자 |

## 로컬에서 확인

```bash
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000` 접속. (Google 로그인을 로컬에서 쓰려면 승인된 도메인에 `localhost`가 있어야 하며, 기본으로 포함되어 있습니다.)

## 무료 한도 참고 (Spark)

Firestore: 저장 1GiB, 하루 읽기 5만 / 쓰기 2만 / 삭제 2만 건. 연구실 규모에서는 충분합니다.
