// 제목 검색 입력창
export default function SearchBox({ value, onChange, placeholder = "제목으로 검색" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="search"
      className="input sm:max-w-xs"
      value={value}
      placeholder={placeholder}
      aria-label="제목 검색"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
