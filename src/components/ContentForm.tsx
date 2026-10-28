// 관리자용 연구·수업자료 작성/수정 폼
// withCourseFields 가 true 이면 "과목명, 주차" 입력칸이 추가됩니다(수업자료).
import { useState, type FormEvent } from "react";
import type { ResearchInput, ResourceLink } from "../services/types";
import { isValidUrl, toErrorMessage } from "../lib/format";
import MarkdownEditor from "./MarkdownEditor";
import Card from "./Card";

export interface ContentFormValues {
  base: ResearchInput; // 공통 필드: title, summary, tags, links
  course: string;
  week: number;
}

interface Props {
  heading: string;
  withCourseFields?: boolean;
  initial?: Partial<ResearchInput> & { course?: string; week?: number };
  submitLabel?: string;
  onSubmit: (values: ContentFormValues) => Promise<void>;
  onCancel: () => void;
}

export default function ContentForm({ heading, withCourseFields, initial, submitLabel = "저장", onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(", "));
  const [links, setLinks] = useState<ResourceLink[]>(initial?.links?.length ? initial.links : [{ label: "", url: "" }]);
  const [course, setCourse] = useState(initial?.course ?? "");
  const [week, setWeek] = useState(initial?.week ?? 1);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const updateLink = (index: number, patch: Partial<ResourceLink>) =>
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // 입력값 검사
    const cleanLinks = links
      .map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
      .filter((l) => l.label || l.url);
    if (!title.trim()) return setError("제목을 입력해 주세요.");
    if (withCourseFields && !course.trim()) return setError("과목명을 입력해 주세요.");
    const badLink = cleanLinks.find((l) => !isValidUrl(l.url));
    if (badLink) return setError(`링크 주소는 http:// 또는 https:// 로 시작해야 합니다: ${badLink.url || badLink.label}`);

    const tags = [...new Set(tagsText.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean))];

    setSaving(true);
    try {
      await onSubmit({
        base: {
          title: title.trim(),
          summary,
          tags,
          links: cleanLinks.map((l) => ({ label: l.label || l.url, url: l.url })),
        },
        course: course.trim(),
        week: Number(week) || 1,
      });
    } catch (err) {
      setError(toErrorMessage(err, "저장하지 못했습니다. 잠시 후 다시 시도해 주세요."));
      setSaving(false);
    }
  }

  return (
    <Card className="border-brand-100 bg-brand-50/30">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900">{heading}</h2>

        {withCourseFields && (
          <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
            <div>
              <label className="label" htmlFor="cf-course">과목명</label>
              <input id="cf-course" className="input" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="예: 유한요소해석" />
            </div>
            <div>
              <label className="label" htmlFor="cf-week">주차</label>
              <input id="cf-week" className="input" type="number" min={1} max={30} value={week} onChange={(e) => setWeek(Number(e.target.value))} />
            </div>
          </div>
        )}

        <div>
          <label className="label" htmlFor="cf-title">제목</label>
          <input id="cf-title" className="input" value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <MarkdownEditor id="cf-summary" label="요약 (마크다운·수식 지원)" value={summary} onChange={setSummary} />

        <div>
          <label className="label" htmlFor="cf-tags">태그 (쉼표로 구분)</label>
          <input id="cf-tags" className="input" value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="예: 유한요소해석, 강의노트" />
        </div>

        <fieldset>
          <legend className="label">자료 링크 (Google Drive, YouTube, GitHub, 논문 URL 등)</legend>
          <div className="flex flex-col gap-2">
            {links.map((l, i) => (
              <div key={i} className="flex flex-col gap-2 sm:flex-row">
                <input className="input sm:w-48" placeholder="이름 (예: 강의 슬라이드)" value={l.label} onChange={(e) => updateLink(i, { label: e.target.value })} aria-label={`링크 ${i + 1} 이름`} />
                <input className="input" placeholder="https://..." value={l.url} onChange={(e) => updateLink(i, { url: e.target.value })} aria-label={`링크 ${i + 1} 주소`} />
                <button type="button" className="btn-secondary shrink-0" onClick={() => setLinks((prev) => prev.filter((_, j) => j !== i))}>
                  삭제
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="btn-secondary mt-2" onClick={() => setLinks((prev) => [...prev, { label: "", url: "" }])}>
            + 링크 추가
          </button>
        </fieldset>

        {error && <p className="text-sm text-red-700" role="alert">{error}</p>}

        <div className="flex gap-2">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "저장 중…" : submitLabel}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>
            취소
          </button>
        </div>
      </form>
    </Card>
  );
}
