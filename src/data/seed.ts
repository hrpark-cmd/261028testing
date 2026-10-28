// ─────────────────────────────────────────────────────────────
// 초기 샘플 데이터 (데모 모드에서 처음 실행할 때 localStorage 에 들어갑니다)
// 수식은 $...$ (문장 속) / $$...$$ (별도 줄) 로 씁니다.
// String.raw`...` 를 쓰면 수식의 역슬래시(\)를 그대로 적을 수 있습니다.
// ─────────────────────────────────────────────────────────────
import type { Comment, Course, Post, Research } from "../services/types";

const day = 24 * 60 * 60 * 1000;
const base = Date.UTC(2026, 8, 1); // 2026-09-01 기준

export const seedResearch: Research[] = [
  {
    id: "r-fatigue-composite",
    title: "복합재 적층판의 피로 수명 예측 모델",
    summary: String.raw`탄소섬유 복합재(CFRP) 적층판의 반복 하중 하 강성 저하를 측정하고, 이를 기반으로 피로 수명 예측 모델을 제안합니다.

## 주요 내용
- 강성 저하율 $D = 1 - E(N)/E_0$ 을 손상 변수로 정의
- 수정 Basquin 식으로 응력-수명 관계를 근사

$$
\sigma_a = \sigma_f' (2N_f)^{b}
$$

실험 결과 예측 오차는 평균 12% 이내였습니다.`,
    tags: ["피로", "복합재", "실험"],
    links: [
      { label: "논문 (DOI)", url: "https://doi.org/10.0000/example" },
      { label: "실험 데이터 (Google Drive)", url: "https://drive.google.com/" },
    ],
    createdAt: base + 20 * day,
  },
  {
    id: "r-fem-topology",
    title: "유한요소 기반 위상 최적화를 이용한 경량 브래킷 설계",
    summary: String.raw`SIMP 기법으로 항공기 브래킷의 질량을 줄이면서 강성을 유지하는 설계를 수행했습니다.

목적 함수는 컴플라이언스 최소화입니다.

$$
\min_{\rho}\; c(\rho) = \mathbf{U}^T \mathbf{K}(\rho)\,\mathbf{U}
\quad \text{s.t.}\quad \frac{V(\rho)}{V_0} \le f
$$

요소 강성은 $E_e = \rho_e^{\,p} E_0$ ($p = 3$) 로 벌점화했습니다.`,
    tags: ["유한요소해석", "최적설계"],
    links: [{ label: "코드 (GitHub)", url: "https://github.com/" }],
    createdAt: base + 12 * day,
  },
  {
    id: "r-heat-sink",
    title: "전자부품 방열판의 자연대류 열전달 해석",
    summary: String.raw`핀 간격에 따른 방열판의 자연대류 열전달 계수를 CFD로 계산하고 실험과 비교했습니다.

누셀트 수 상관식:

$$
\overline{Nu} = C \, Ra^{\,n}, \qquad Ra = \frac{g\beta \Delta T L^3}{\nu \alpha}
$$

최적 핀 간격은 약 $6\,\text{mm}$ 로 나타났습니다.`,
    tags: ["열전달", "CFD"],
    links: [{ label: "학회 발표 자료", url: "https://drive.google.com/" }],
    createdAt: base + 5 * day,
  },
  {
    id: "r-rotor-vibration",
    title: "회전체 시스템의 진동 특성 및 위험속도 분석",
    summary: String.raw`베어링 강성을 고려한 회전축의 고유진동수와 위험속도를 해석했습니다.

단순 회전체의 위험속도는 $\omega_{cr} = \sqrt{k/m}$ 로 근사됩니다. 캠벨 선도를 이용해 운전 영역과의 간섭을 검토했습니다.`,
    tags: ["기계진동", "회전체"],
    links: [{ label: "발표 영상 (YouTube)", url: "https://www.youtube.com/" }],
    createdAt: base,
  },
];

export const seedCourses: Course[] = [
  {
    id: "c-fem-01",
    course: "유한요소해석",
    week: 1,
    title: "유한요소해석 기초: 1차원 봉 요소",
    summary: String.raw`1차원 봉(bar) 요소의 강성 행렬을 유도합니다.

$$
\mathbf{k}^{(e)} = \frac{EA}{L}
\begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}
$$

전체 강성 방정식 $\mathbf{K}\mathbf{u} = \mathbf{F}$ 를 조립하고 경계조건을 적용하는 방법을 다룹니다.`,
    tags: ["유한요소해석", "강의노트"],
    links: [
      { label: "강의 슬라이드", url: "https://drive.google.com/" },
      { label: "강의 영상", url: "https://www.youtube.com/" },
    ],
    createdAt: base + 2 * day,
  },
  {
    id: "c-fem-02",
    course: "유한요소해석",
    week: 2,
    title: "2차원 삼각형 요소(CST)",
    summary: String.raw`상수 변형률 삼각형 요소의 형상함수와 $\mathbf{B}$ 행렬을 구합니다.

$$
\mathbf{k}^{(e)} = t A \, \mathbf{B}^T \mathbf{D} \, \mathbf{B}
$$

**과제:** 외팔보를 CST 요소로 나누어 끝단 처짐을 구하고 이론해와 비교하세요.`,
    tags: ["유한요소해석", "과제"],
    links: [{ label: "과제 안내문", url: "https://drive.google.com/" }],
    createdAt: base + 9 * day,
  },
  {
    id: "c-heat-01",
    course: "열전달",
    week: 1,
    title: "열전도와 푸리에 법칙",
    summary: String.raw`열전도의 기본 법칙과 1차원 정상상태 열전도를 다룹니다.

$$
q'' = -k \frac{dT}{dx}
$$

평판의 열저항은 $R = L/(kA)$ 입니다.`,
    tags: ["열전달", "강의노트"],
    links: [{ label: "강의 슬라이드", url: "https://drive.google.com/" }],
    createdAt: base + 3 * day,
  },
  {
    id: "c-vib-01",
    course: "기계진동",
    week: 1,
    title: "1자유도계 자유진동",
    summary: String.raw`스프링-질량-감쇠기 계의 운동방정식:

$$
m\ddot{x} + c\dot{x} + kx = 0
$$

고유진동수 $\omega_n = \sqrt{k/m}$, 감쇠비 $\zeta = \dfrac{c}{2\sqrt{mk}}$ 를 정의합니다.`,
    tags: ["기계진동", "강의노트"],
    links: [
      { label: "강의 슬라이드", url: "https://drive.google.com/" },
      { label: "MATLAB 예제 (GitHub)", url: "https://github.com/" },
    ],
    createdAt: base + 4 * day,
  },
];

export const seedPosts: Post[] = [
  {
    id: "p-welcome",
    title: "토론 게시판 이용 안내",
    content: String.raw`연구 결과와 수업 내용에 대해 자유롭게 질문하고 토론하는 공간입니다.

- 수식은 \`$E = mc^2$\` 처럼 쓰면 $E = mc^2$ 로 표시됩니다.
- 별도 줄 수식은 \`$$ ... $$\` 로 감싸 주세요.

$$
\sigma = E\varepsilon
$$`,
    authorId: "demo-admin",
    authorName: "데모 관리자",
    relatedType: null,
    relatedId: null,
    createdAt: base + 1 * day,
    commentCount: 1,
  },
  {
    id: "p-fatigue-q",
    title: "피로 수명 모델에서 평균응력 보정은 어떻게 했나요?",
    content: String.raw`Basquin 식에 평균응력 $\sigma_m$ 효과를 넣을 때 Goodman 보정과 SWT 중 어떤 것을 썼는지 궁금합니다.

$$
\frac{\sigma_a}{\sigma_{ar}} + \frac{\sigma_m}{\sigma_u} = 1
$$`,
    authorId: "demo-user",
    authorName: "데모 사용자",
    relatedType: "research",
    relatedId: "r-fatigue-composite",
    createdAt: base + 21 * day,
    commentCount: 1,
  },
  {
    id: "p-cst-q",
    title: "CST 과제: 요소 수를 늘려도 처짐이 수렴하지 않아요",
    content: "요소를 2배씩 늘려도 끝단 처짐이 이론값보다 계속 작게 나옵니다. 경계조건 문제일까요?",
    authorId: "demo-user",
    authorName: "데모 사용자",
    relatedType: "course",
    relatedId: "c-fem-02",
    createdAt: base + 10 * day,
    commentCount: 0,
  },
];

export const seedComments: Comment[] = [
  {
    id: "cm-1",
    postId: "p-welcome",
    content: "안내 감사합니다!",
    authorId: "demo-user",
    authorName: "데모 사용자",
    createdAt: base + 1 * day + 3600_000,
  },
  {
    id: "cm-2",
    postId: "p-fatigue-q",
    content: "복합재는 평균응력 민감도가 커서 SWT 파라미터 $\\sqrt{\\sigma_{max}\\sigma_a E}$ 를 사용했습니다.",
    authorId: "demo-admin",
    authorName: "데모 관리자",
    createdAt: base + 22 * day,
  },
];
