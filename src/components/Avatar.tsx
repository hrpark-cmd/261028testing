// 사용자 동그라미 아이콘. 사진이 없으면 이름 첫 글자와 이름별 고정 색상으로 표시합니다.
const COLORS = [
  "bg-brand-100 text-brand-800",
  "bg-emerald-100 text-emerald-800",
  "bg-amber-100 text-amber-800",
  "bg-violet-100 text-violet-800",
  "bg-rose-100 text-rose-800",
  "bg-sky-100 text-sky-800",
];

export function colorIndex(text: string, size: number): number {
  let hash = 0;
  for (const ch of text) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return hash % size;
}

interface Props {
  name: string;
  photoURL?: string | null;
  size?: "sm" | "md" | "lg";
}

const SIZES = { sm: "h-7 w-7 text-xs", md: "h-9 w-9 text-sm", lg: "h-11 w-11 text-base" };

export default function Avatar({ name, photoURL, size = "md" }: Props) {
  const cls = `inline-flex shrink-0 items-center justify-center rounded-full font-semibold ring-2 ring-white ${SIZES[size]}`;
  if (photoURL) return <img src={photoURL} alt="" className={`${cls} object-cover`} referrerPolicy="no-referrer" />;
  return (
    <span className={`${cls} ${COLORS[colorIndex(name, COLORS.length)]}`} aria-hidden="true">
      {name.trim().charAt(0) || "?"}
    </span>
  );
}
