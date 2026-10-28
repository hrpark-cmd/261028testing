// 마크다운 입력창 + 미리보기. 수식을 입력하면서 결과를 바로 확인할 수 있습니다.
// 넓은 화면: 좌우 나란히 / 좁은 화면(모바일): "작성 | 미리보기" 탭 전환
import { useState } from "react";
import MarkdownView from "./MarkdownView";

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}

export default function MarkdownEditor({ id, label, value, onChange, rows = 10, placeholder }: Props) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  const tabClass = (t: typeof tab) =>
    `rounded-md px-3 py-1 text-xs font-semibold transition ${tab === t ? "bg-white text-brand-800 shadow-sm" : "text-slate-500"}`;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="label mb-0">
          {label}
        </label>
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5 md:hidden">
          <button type="button" className={tabClass("write")} onClick={() => setTab("write")}>작성</button>
          <button type="button" className={tabClass("preview")} onClick={() => setTab("preview")}>미리보기</button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className={tab === "preview" ? "hidden md:block" : ""}>
          <p className="mb-1 hidden text-xs font-medium text-slate-400 md:block">작성</p>
          <textarea
            id={id}
            className="input min-h-[12rem] font-mono text-[13px] leading-relaxed"
            rows={rows}
            value={value}
            placeholder={placeholder ?? "마크다운으로 작성하세요. 수식: $E = mc^2$, 별도 줄 수식: $$\\sigma = E\\varepsilon$$"}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <div className={tab === "write" ? "hidden md:block" : ""}>
          <p className="mb-1 hidden text-xs font-medium text-slate-400 md:block">미리보기</p>
          <div className="min-h-[12rem] overflow-auto rounded-lg border border-slate-200 bg-slate-50/60 p-4" aria-label="미리보기">
            {value.trim() ? (
              <MarkdownView content={value} />
            ) : (
              <p className="text-sm text-slate-400">입력한 내용이 여기에 표시됩니다.</p>
            )}
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        팁: 문장 속 수식은 <code className="rounded bg-slate-100 px-1">$...$</code>, 별도 줄 수식은{" "}
        <code className="rounded bg-slate-100 px-1">$$...$$</code> 로 감싸세요.
      </p>
    </div>
  );
}
