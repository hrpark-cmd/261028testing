// 제목 검색 입력창 (돋보기 아이콘 포함)
import Icon from "./Icon";

export default function SearchBox({ value, onChange, placeholder = "제목으로 검색" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative w-full sm:max-w-sm">
      <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        className="input pl-10"
        value={value}
        placeholder={placeholder}
        aria-label="제목 검색"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
