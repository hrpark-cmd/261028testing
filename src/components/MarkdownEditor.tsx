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
    `px-3 py-1 text-sm rounded-md ${tab === t ? "bg-brand-50 font-medium text-brand-700" : "text-slate-500"}`;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label htmlFor={id} className="label mb-0">
          {label}
        </label>
        <div className="flex gap-1 md:hidden">
          <button type="button" className={tabClass("write")} onClick={() => setTab("write")}>
            작성
          </button>
          <button type="button" className={tabClass("preview")} onClick={() => setTab("preview")}>
            미리보기
          </button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <textarea
          id={id}
          className={`input font-mono ${tab === "preview" ? "hidden md:block" : ""}`}
          rows={rows}
          value={value}
          placeholder={placeholder ?? "마크다운으로 작성하세요. 수식: $E = mc^2$, 별도 줄 수식: $$\\sigma = E\\varepsilon$$"}
          onChange={(e) => onChange(e.target.value)}
        />
        <div
          className={`min-h-[8rem] overflow-auto rounded-md border border-dashed border-slate-300 bg-slate-50 p-3 ${
            tab === "write" ? "hidden md:block" : ""
          }`}
          aria-label="미리보기"
        >
          {value.trim() ? (
            <MarkdownView content={value} />
          ) : (
            <p className="text-sm text-slate-400">미리보기가 여기에 표시됩니다.</p>
          )}
        </div>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        팁: 문장 속 수식은 <code>$...$</code>, 별도 줄 수식은 <code>$$...$$</code> 로 감싸세요.
      </p>
    </div>
  );
}
