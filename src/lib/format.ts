// 날짜 표시, 요약문 만들기 등 화면 표시용 작은 도우미 함수

export function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

export function formatDateTime(ms: number): string {
  return new Date(ms).toLocaleString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** 마크다운에서 수식 블록·기호를 걷어내고 앞부분만 잘라 카드 요약으로 씁니다. */
export function excerpt(markdown: string, max = 110): string {
  const text = markdown
    .replace(/\$\$[\s\S]*?\$\$/g, " ") // 별도 줄 수식 제거
    .replace(/\$[^$\n]+\$/g, "(수식)") // 문장 속 수식은 "(수식)"으로 표시
    .replace(/[#>*_`\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max) + "…" : text;
}

export function isValidUrl(url: string): boolean {
  return /^https?:\/\/\S+$/i.test(url.trim());
}

/** 오류 객체를 사용자에게 보여줄 한국어 문장으로 바꿉니다. */
export function toErrorMessage(err: unknown, fallback = "문제가 발생했습니다. 잠시 후 다시 시도해 주세요."): string {
  if (err instanceof Error && /[가-힣]/.test(err.message)) return err.message;
  return fallback;
}
