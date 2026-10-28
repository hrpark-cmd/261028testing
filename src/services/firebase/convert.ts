// Firestore 문서 ↔ 앱 데이터 변환 도우미
import { Timestamp, type DocumentSnapshot } from "firebase/firestore";

/** Firestore Timestamp → 밀리초. 방금 쓴 문서는 서버 시각이 아직 없을 수 있어 현재 시각으로 대신합니다. */
export function toMillis(value: unknown): number {
  return value instanceof Timestamp ? value.toMillis() : Date.now();
}

/** 문서 → { id, ...필드, createdAt(밀리초) } */
export function fromDoc<T>(snap: DocumentSnapshot): T {
  const data = snap.data() ?? {};
  return { ...data, id: snap.id, createdAt: toMillis(data.createdAt) } as T;
}
