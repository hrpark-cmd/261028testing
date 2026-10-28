// 연구·수업자료 Firestore 구현 (컬렉션: research, courses)
// 문서 수가 적으므로 목록은 한 번에 읽고, 검색·태그 필터는 화면에서 처리합니다.
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { requireFirebase } from "../../lib/firebase";
import type { ContentService, Course, CourseInput, Research, ResearchInput } from "../types";
import { fromDoc } from "./convert";
import { run } from "./errors";

function createFirebaseContentService<T extends { id: string; createdAt: number }, TInput extends object>(
  collectionName: string
): ContentService<T, TInput> {
  const col = () => collection(requireFirebase().db, collectionName);

  return {
    list: () =>
      run(async () => {
        const snap = await getDocs(query(col(), orderBy("createdAt", "desc")));
        return snap.docs.map((d) => fromDoc<T>(d));
      }),
    get: (id) =>
      run(async () => {
        const snap = await getDoc(doc(col(), id));
        return snap.exists() ? fromDoc<T>(snap) : null;
      }),
    create: (input) =>
      run(async () => {
        const ref = await addDoc(col(), { ...input, createdAt: serverTimestamp() });
        return { ...input, id: ref.id, createdAt: Date.now() } as unknown as T;
      }),
    update: (id, input) => run(() => updateDoc(doc(col(), id), { ...input })),
    remove: (id) => run(() => deleteDoc(doc(col(), id))),
  };
}

export const firebaseResearchService = createFirebaseContentService<Research, ResearchInput>("research");
export const firebaseCourseService = createFirebaseContentService<Course, CourseInput>("courses");
