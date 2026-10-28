// 태그 버튼 목록. 누르면 해당 태그로 필터링, 다시 누르거나 "전체"를 누르면 해제.
interface Props {
  tags: string[];
  selected: string | null;
  onChange: (tag: string | null) => void;
}

export default function TagFilter({ tags, selected, onChange }: Props) {
  if (tags.length === 0) return null;
  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm transition-colors ${
      active ? "border-brand-700 bg-brand-700 text-white" : "border-slate-300 text-slate-600 hover:border-brand-600"
    }`;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="태그 필터">
      <button type="button" className={chip(selected === null)} onClick={() => onChange(null)}>
        전체
      </button>
      {tags.map((t) => (
        <button key={t} type="button" className={chip(selected === t)} onClick={() => onChange(selected === t ? null : t)}>
          #{t}
        </button>
      ))}
    </div>
  );
}
