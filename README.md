# 연구실 웹사이트 (MVP)

기계공학과 연구실의 **연구 자료 · 수업 자료 · 대학원생 토론 게시판** 웹사이트입니다.

- 지금은 **데모 모드**로 동작합니다. Firebase 없이 브라우저 저장소(localStorage)를 쓰고, 로그인도 가짜 "데모 사용자"로 합니다.
- 다음 단계에서 Firebase(Firestore + Google 로그인, **Spark 무료 요금제**)로 바꿉니다. → [`docs/FIRESTORE_PLAN.md`](docs/FIRESTORE_PLAN.md)
- 기술: React 18 + Vite + TypeScript, React Router, Tailwind CSS, react-markdown + KaTeX(수식)

---

## 1. 내 컴퓨터에서 실행하기

[Node.js](https://nodejs.org) LTS 버전(20 이상)을 먼저 설치하세요. 그다음 이 폴더에서 터미널을 열고:

```bash
npm install
```

```bash
npm run dev
```

화면에 나오는 주소(보통 `http://localhost:5173`)를 브라우저에서 엽니다.
배포용 빌드가 되는지 확인하려면 `npm run build`를 실행합니다.

## 2. GitHub에 올리기 (처음 하는 경우)

1. [github.com](https://github.com)에 가입하고 로그인합니다.
2. 오른쪽 위 **+** → **New repository** → 이름(예: `lab-website`) 입력 → **Private** 또는 Public 선택 → **Create repository**
3. 컴퓨터에 [Git](https://git-scm.com)을 설치합니다.
4. 이 프로젝트 폴더에서 터미널을 열고 차례로 실행합니다. `내아이디`는 본인 GitHub 아이디로 바꿉니다.

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "연구실 웹사이트 첫 버전"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/내아이디/lab-website.git
```

```bash
git push -u origin main
```

5. 이후 수정할 때는 `git add .` → `git commit -m "수정 내용"` → `git push` 세 줄이면 됩니다.

> `.env`, `.env.local` 파일은 `.gitignore`에 들어 있어 GitHub에 올라가지 않습니다(비밀값 보호).

## 3. Netlify에 배포하기

1. [netlify.com](https://www.netlify.com)에 **GitHub 계정으로** 가입합니다.
2. **Add new site → Import an existing project → GitHub** → 방금 만든 저장소 선택
3. 빌드 설정은 `netlify.toml`에 이미 들어 있어 자동으로 채워집니다.
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Deploy** 클릭 → 1~2분 후 `https://임의이름.netlify.app` 주소가 생깁니다.
5. **Site configuration → Change site name**에서 주소 앞부분을 바꿀 수 있습니다.
6. 이후 GitHub에 push할 때마다 자동으로 다시 배포됩니다.

> 어떤 주소로 새로고침해도 404가 나지 않도록 `public/_redirects`와 `netlify.toml`에 설정이 들어 있습니다.

## 4. 연구실 이름·교수명 바꾸기

**`src/config/site.ts`** 한 파일만 수정하면 됩니다.

| 항목 | 설명 |
|---|---|
| `labName`, `labNameEn` | 연구실 이름 (예: "구조역학 연구실") |
| `professorName`, `affiliation` | 교수명, 소속 |
| `intro`, `keywords` | 홈 화면 소개 문구, 연구 분야 키워드 |
| `email`, `location` | 푸터 연락처 |
| `ADMIN_EMAILS` | 관리자(자료 작성 가능) Google 이메일 목록 |

포인트 색상은 `tailwind.config.js`의 `brand` 값에서 바꿉니다.
샘플 데이터는 `src/data/seed.ts`에 있습니다. 데모 모드에서 처음 상태로 되돌리려면 브라우저 개발자 도구 → Application → Local Storage에서 `lab:v1:`로 시작하는 항목을 지웁니다.

## 5. 다음 단계: Firebase 연동

[`docs/FIRESTORE_PLAN.md`](docs/FIRESTORE_PLAN.md)에 다음 내용을 정리해 두었습니다.

- 컬렉션 구조
- 보안 규칙 초안
- 무료 한도 관리 원칙
- Firebase 콘솔 설정 체크리스트
- 코드 작업 순서

화면 코드는 바꾸지 않고 `src/services/firebase/` 구현만 추가하면 되도록 만들어 두었습니다.

---

## 폴더 구조

```
src/
  components/   공통 화면 조각 (Navbar, Footer, MarkdownView, MarkdownEditor, TagFilter, ContentForm 등)
  pages/        페이지 (Home, Research, ResearchDetail, Courses, CourseDetail,
                Discussion, PostNew, PostDetail, Login, NotFound)
  services/     데이터 접근 계층
    types.ts      데이터 모델과 서비스 인터페이스
    index.ts      데모(local) / Firebase 구현 선택 스위치
    local/        localStorage 구현 (데모 모드)
  contexts/     AuthContext (로그인 상태)
  config/       site.ts (사이트 정보, 관리자 이메일)
  data/         seed.ts (샘플 데이터)
  lib/          firebase.ts (초기화 틀), 날짜·요약 도우미, useAsync 훅
docs/FIRESTORE_PLAN.md
public/_redirects
netlify.toml
.env.example
```

**설계 원칙:** 화면은 `src/services`의 함수로만 데이터를 다룹니다. 그래서 localStorage를 Firebase로 바꿔도 화면 코드는 그대로입니다.

---

## 수동 점검 체크리스트

배포 전이나 큰 수정 후에 확인하세요.

- [ ] 상단 메뉴(홈·연구·수업자료·토론) 이동이 잘 되고, 각 페이지에서 **새로고침(F5)** 해도 정상 표시
- [ ] 없는 주소(예: `/abc`)로 들어가면 404 안내와 홈 링크 표시
- [ ] **데모 로그인**(로그인 → "Google로 로그인") → 토론 글 작성 → 댓글 작성 → 댓글 삭제 → 글 삭제
- [ ] 비로그인 상태에서는 글·댓글을 읽을 수만 있고 작성 버튼 대신 로그인 안내가 보임
- [ ] 일반 사용자는 다른 사람의 글·댓글 삭제 버튼이 보이지 않음
- [ ] **데모 관리자로 로그인** → 연구 추가·수정·삭제, 수업자료(과목·주차) 추가·수정·삭제
- [ ] 자료 상세 → "이 자료에 대해 토론하기" → 연결된 글 작성 → 상세 페이지 "관련 토론"에 표시
- [ ] 태그 클릭 시 필터링, 제목 검색 동작
- [ ] 수식 `$E = mc^2$`, `$$\sigma = E\varepsilon$$` 가 정상 렌더링되고, 작성 폼에서 미리보기 표시
- [ ] 글이 20개를 넘으면 토론 목록에 "더 보기" 버튼 표시
- [ ] 모바일 화면(너비 375px, 브라우저 개발자 도구의 기기 모드)에서 가로 스크롤·레이아웃 깨짐 없음
