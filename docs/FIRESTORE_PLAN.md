# Firestore 연동 설계 (다음 단계용)

이 문서는 데모 모드(localStorage)를 Firebase(Firestore + Google 로그인)로 교체할 때 쓰는 설계서입니다.
**Spark(무료) 요금제**만 사용합니다. Cloud Functions, Cloud Storage는 쓰지 않습니다.

---

## 1. 컬렉션 구조

```
research/{researchId}
courses/{courseId}
posts/{postId}
posts/{postId}/comments/{commentId}
users/{uid}
```

## 2. 문서 필드

`src/services/types.ts` 의 타입과 같습니다. 앱에서는 날짜를 밀리초 숫자로 쓰지만, Firestore에는 `Timestamp`(serverTimestamp)로 저장하고 읽을 때 `toMillis()`로 바꿉니다.

### research
| 필드 | 타입 | 설명 |
|---|---|---|
| title | string | 제목 (최대 200자) |
| summary | string | 마크다운 + 수식 |
| tags | string[] | 태그 |
| links | `{label: string, url: string}[]` | 외부 자료 링크 |
| createdAt | timestamp | 작성 시각 |

### courses
research 필드 전부 + 아래 필드
| 필드 | 타입 | 설명 |
|---|---|---|
| course | string | 과목명 |
| week | number | 주차 |

### posts
| 필드 | 타입 | 설명 |
|---|---|---|
| title | string | 제목 (최대 200자) |
| content | string | 마크다운 + 수식 (최대 20,000자) |
| authorId | string | 작성자 uid |
| authorName | string | 작성자 표시 이름 |
| relatedType | `"research"` \| `"course"` \| null | 연결된 자료 종류 |
| relatedId | string \| null | 연결된 자료 id |
| createdAt | timestamp | 작성 시각 |
| commentCount | number | 댓글 수 (목록에서 댓글을 따로 읽지 않기 위해 저장) |

### posts/{postId}/comments
| 필드 | 타입 | 설명 |
|---|---|---|
| postId | string | 상위 게시글 id |
| content | string | 마크다운 + 수식 (최대 5,000자) |
| authorId | string | 작성자 uid |
| authorName | string | 작성자 표시 이름 |
| createdAt | timestamp | 작성 시각 |

### users
| 필드 | 타입 | 설명 |
|---|---|---|
| displayName | string | Google 계정 이름 |
| email | string | Google 이메일 |
| photoURL | string \| null | 프로필 사진 |
| lastLoginAt | timestamp | 마지막 로그인 |

> 관리자 여부(`isAdmin`)는 문서에 저장하지 않습니다. 화면에서는 `src/config/site.ts` 의 `ADMIN_EMAILS`, 서버에서는 아래 보안 규칙의 이메일 목록으로 판단합니다.

## 3. 필요한 색인(Index)

| 컬렉션 | 필드 | 용도 |
|---|---|---|
| posts | `relatedType` 오름차순, `relatedId` 오름차순, `createdAt` 내림차순 | 자료 상세 페이지의 "관련 토론" |

처음 해당 쿼리를 실행하면 브라우저 콘솔에 색인 생성 링크가 나옵니다. 그 링크를 누르면 바로 만들어집니다. 단일 필드 정렬(`createdAt`)은 자동으로 만들어집니다.

## 4. 보안 규칙 초안

Firebase 콘솔 → Firestore Database → **규칙** 탭에 붙여넣고 **게시**합니다.

- `ADMIN_EMAILS` 목록은 `src/config/site.ts` 와 **똑같이** 맞춰 주세요. 데모용 `demo-admin@example.com` 은 빼도 됩니다.
- 읽기 공개 범위는 `PUBLIC_READ` 함수 한 줄로 고릅니다. `true`면 누구나, `signedIn()`이면 로그인한 사람만 읽을 수 있습니다.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ── 설정 ─────────────────────────────────────
    function ADMIN_EMAILS() {
      return ['professor@example.com'];
    }
    // 읽기 공개 범위: true(누구나) 또는 signedIn()(로그인 사용자만)
    function PUBLIC_READ() {
      return true;
    }

    // ── 공통 함수 ────────────────────────────────
    function signedIn() {
      return request.auth != null;
    }
    function isAdmin() {
      return signedIn()
        && request.auth.token.email_verified == true
        && request.auth.token.email in ADMIN_EMAILS();
    }
    function isOwner(data) {
      return signedIn() && data.authorId == request.auth.uid;
    }
    function validContent(d) {
      return d.title is string && d.title.size() > 0 && d.title.size() <= 200
        && d.summary is string && d.summary.size() <= 20000
        && d.tags is list && d.links is list;
    }

    // ── 연구 / 수업자료: 읽기 공개, 쓰기는 관리자만 ──
    match /research/{id} {
      allow read: if PUBLIC_READ();
      allow create, update: if isAdmin() && validContent(request.resource.data);
      allow delete: if isAdmin();
    }
    match /courses/{id} {
      allow read: if PUBLIC_READ();
      allow create, update: if isAdmin() && validContent(request.resource.data)
        && request.resource.data.course is string
        && request.resource.data.week is int;
      allow delete: if isAdmin();
    }

    // ── 토론 게시글 ─────────────────────────────
    match /posts/{postId} {
      allow read: if PUBLIC_READ();
      allow create: if signedIn()
        && request.resource.data.authorId == request.auth.uid
        && request.resource.data.title is string
        && request.resource.data.title.size() > 0
        && request.resource.data.title.size() <= 200
        && request.resource.data.content is string
        && request.resource.data.content.size() <= 20000
        && request.resource.data.commentCount == 0;
      // 작성자·관리자: 수정/삭제
      allow update: if (isOwner(resource.data) || isAdmin())
        && request.resource.data.authorId == resource.data.authorId;
      allow delete: if isOwner(resource.data) || isAdmin();
      // 로그인 사용자: 댓글 수(commentCount)만 ±1 변경 가능
      allow update: if signedIn()
        && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['commentCount'])
        && (request.resource.data.commentCount == resource.data.commentCount + 1
            || request.resource.data.commentCount == resource.data.commentCount - 1);

      // ── 댓글 ──────────────────────────────────
      match /comments/{commentId} {
        allow read: if PUBLIC_READ();
        allow create: if signedIn()
          && request.resource.data.authorId == request.auth.uid
          && request.resource.data.postId == postId
          && request.resource.data.content is string
          && request.resource.data.content.size() > 0
          && request.resource.data.content.size() <= 5000;
        allow delete: if isOwner(resource.data) || isAdmin();
        allow update: if false;
      }
    }

    // ── 사용자 프로필 ───────────────────────────
    match /users/{uid} {
      allow read: if signedIn();
      allow write: if signedIn() && request.auth.uid == uid;
    }
  }
}
```

> 참고: Cloud Functions가 없으므로, 게시글을 삭제해도 하위 댓글이 자동으로 지워지지 않습니다. `deletePost` 구현에서 댓글을 먼저 `writeBatch`로 지운 뒤 게시글을 지우세요(관리자 또는 글 작성자만 가능하도록 위 규칙의 comments `delete`에 `|| isOwner(get(/databases/$(database)/documents/posts/$(postId)).data)` 조건을 추가).

## 5. Spark 무료 한도 지키기

| 항목 | 무료 한도 |
|---|---|
| 저장 용량 | 1 GiB |
| 문서 읽기 | 하루 50,000회 |
| 문서 쓰기 | 하루 20,000회 |
| 문서 삭제 | 하루 20,000회 |

설계 원칙:

1. **페이지네이션**: 게시글은 `orderBy('createdAt','desc')` + `limit(20)`, 다음 페이지는 `startAfter(마지막 문서)`로 불러옵니다. 서비스 함수의 `cursor`에는 마지막 문서 id를 담고, 다음 호출에서 그 문서를 `getDoc`해 `startAfter`에 넘깁니다.
2. **실시간 리스너(onSnapshot) 사용 안 함**: 필요할 때 `getDocs`/`getDoc`으로 한 번만 읽습니다. 리스너는 화면을 띄워 둔 동안 변경마다 읽기가 생깁니다.
3. **댓글 수는 게시글에 저장**(`commentCount`, `increment(±1)`): 목록에서 댓글 컬렉션을 읽지 않습니다.
4. **댓글은 글 상세 화면에서만** 불러옵니다.
5. **파일은 링크로만**: Cloud Storage를 쓰지 않으므로 저장 용량 걱정이 거의 없습니다.
6. **연구·수업자료 목록**은 문서 수가 적어(수십 개) 한 번에 읽고, 검색·태그 필터는 브라우저에서 처리합니다. 수백 개가 넘으면 `limit` + "더 보기"를 적용합니다.
7. **홈 화면**은 최근 항목만 `limit(3~5)`로 읽습니다.
8. Firebase 콘솔 → Firestore → **사용량** 탭에서 가끔 확인합니다.

예상 사용량 예시: 하루 방문 100명 × 페이지 10개 × 평균 20문서 = 20,000회 읽기로, 한도 안에 들어옵니다.

## 6. Firebase 콘솔 설정 체크리스트

- [ ] [Firebase 콘솔](https://console.firebase.google.com)에서 **프로젝트 추가** (Google 애널리틱스는 꺼도 됨). 요금제가 **Spark**인지 확인
- [ ] 프로젝트 설정(톱니바퀴) → **내 앱** → 웹 앱(`</>`) 등록 → `firebaseConfig` 값 확인
- [ ] 그 값을 `.env.local`과 **Netlify 환경변수**(Site configuration → Environment variables)에 입력
  - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`, `VITE_USE_FIREBASE=true`
- [ ] 빌드 → **Authentication** → 시작하기 → 로그인 방법 → **Google** 사용 설정 (지원 이메일 선택)
- [ ] Authentication → 설정 → **승인된 도메인**에 Netlify 주소(`xxxx.netlify.app`)와 사용자 지정 도메인 추가
- [ ] 빌드 → **Firestore Database** → 데이터베이스 만들기 → 위치 `asia-northeast3 (서울)` → **프로덕션 모드**
- [ ] Firestore → **규칙** 탭에 4번 규칙을 붙여넣고 게시 (`ADMIN_EMAILS` 수정)
- [ ] `src/config/site.ts`의 `ADMIN_EMAILS`에 교수님 Google 이메일 추가
- [ ] (선택) 데모 데이터(`src/data/seed.ts`)를 Firestore에 옮길지 결정

## 7. 코드 작업 순서 (연동 단계)

1. `src/lib/firebase.ts`에 `auth`, `db` 내보내기 추가
2. `src/services/firebase/` 폴더에 `contentService.ts`, `postService.ts`, `authService.ts` 작성 (`types.ts` 인터페이스 그대로 구현)
   - 로그인: `signInWithPopup(auth, new GoogleAuthProvider())`, 로그인 시 `users/{uid}` 저장
   - `isAdmin`: `isAdminEmail(user.email)`
3. `src/services/index.ts`에서 `VITE_USE_FIREBASE`에 따라 구현체 선택 (TODO 주석 위치)
4. 화면 코드는 바꿀 필요 없음 (모든 화면이 `services`만 사용)
