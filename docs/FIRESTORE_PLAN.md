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

**추가로 만들 색인이 없습니다.** 정렬은 단일 필드(`createdAt`)만 쓰고, "관련 토론"은 같음(==) 조건 두 개로만 조회한 뒤 화면에서 정렬하기 때문에 Firestore가 자동으로 만든 색인으로 충분합니다.

## 4. 보안 규칙

규칙 전체는 저장소의 **[`firestore.rules`](../firestore.rules)** 파일에 있습니다. Firebase 콘솔 → Firestore Database → **규칙** 탭에 붙여넣고 **게시**합니다.

- **관리자 이메일:** `ADMIN_EMAILS` 목록을 `src/config/site.ts`와 **똑같이** 맞춰 주세요. 데모용 `demo-admin@example.com`은 빼도 됩니다.
- **읽기 범위:** `PUBLIC_READ` 함수 한 줄로 고릅니다. `true`면 누구나, `signedIn()`이면 로그인한 사람만 읽습니다.
- **쓰기 권한:**
  - 연구·수업자료: 관리자만
  - 글·댓글 작성: 로그인 사용자
  - 삭제: 작성자 또는 관리자. 글 작성자는 자기 글에 달린 댓글도 지울 수 있습니다. 글을 지울 때 댓글을 함께 지우기 위해서입니다.
- **입력값 검사:** 작성 시각은 서버 시각만 허용하고, 글자 수에 제한을 둡니다.

> Cloud Functions가 없으므로 글을 지울 때 앱이 댓글을 먼저 지운 뒤 글을 지웁니다(`writeBatch`). 한 번에 지울 수 있는 댓글은 최대 499개입니다.

## 5. Spark 무료 한도 지키기

| 항목 | 무료 한도 |
|---|---|
| 저장 용량 | 1 GiB |
| 문서 읽기 | 하루 50,000회 |
| 문서 쓰기 | 하루 20,000회 |
| 문서 삭제 | 하루 20,000회 |

설계 원칙:

1. **페이지네이션**: 게시글은 `orderBy('createdAt','desc')` + `limit(21)`(다음 페이지 유무 확인용 1개 포함), 다음 페이지는 `startAfter(마지막 문서)`로 불러옵니다.
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
- [ ] Firestore → **규칙** 탭에 `firestore.rules` 내용을 붙여넣고 게시 (`ADMIN_EMAILS` 수정)
- [ ] `src/config/site.ts`의 `ADMIN_EMAILS`에 교수님 Google 이메일 추가
- [ ] (선택) 데모 데이터(`src/data/seed.ts`)를 Firestore에 옮길지 결정

## 7. 코드 구현 상태

- [x] `src/lib/firebase.ts`: 설정값이 있을 때만 `auth`, `db` 초기화
- [x] `src/services/firebase/`: `contentService.ts`, `postService.ts`, `authService.ts`, 오류 메시지 한국어 변환(`errors.ts`)
- [x] `src/services/index.ts`: `VITE_USE_FIREBASE=true`이고 설정값이 있으면 Firebase, 아니면 데모 모드
- 화면 코드는 바꾸지 않았습니다. 모든 화면이 `services`만 사용합니다.
