// 태그 버튼 목록. 누르면 해당 태그로 필터링, 다시 누르거나 "전체"를 누르면 해제.
interface Props {
  tags: string[];
  selected: string | null;
  onChange: (tag: string | null) => void;
}

export default function TagFilter({ tags, selected, onChange }: Props) {
  if (tags.length === 0) return null;
  const chip = (active: boolean) =>
    `rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
      active
        ? "bg-brand-800 text-white shadow-sm"
        : "bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:text-brand-800 hover:ring-brand-300"
    }`;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="태그 필터">
      <button type="button" className={chip(selected === null)} aria-pressed={selected === null} onClick={() => onChange(null)}>
        전체
      </button>
      {tags.map((t) => (
        <button key={t} type="button" className={chip(selected === t)} aria-pressed={selected === t} onClick={() => onChange(selected === t ? null : t)}>
          #{t}
        </button>
      ))}
    </div>
  );
}
