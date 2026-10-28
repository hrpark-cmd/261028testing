// localStorage 읽기/쓰기 도우미 (데모 모드 전용)
// 브라우저에만 저장되므로, 다른 사람과 공유되지 않습니다.

const PREFIX = "lab:v1:";

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // 저장 공간 부족·사생활 보호 모드 등: 화면은 계속 동작하도록 무시
  }
}

/** 저장된 데이터가 없으면 seed 데이터로 처음 채워 넣고 돌려줍니다. */
export function readOrSeed<T>(key: string, seed: T): T {
  const existing = readJson<T | null>(key, null);
  if (existing !== null) return existing;
  writeJson(key, seed);
  return seed;
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

export const byNewest = <T extends { createdAt: number }>(a: T, b: T) => b.createdAt - a.createdAt;
