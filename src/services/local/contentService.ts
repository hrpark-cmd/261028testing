// 연구·수업자료 localStorage 구현 (데모 모드)
import type { ContentService, Course, CourseInput, Research, ResearchInput } from "../types";
import { seedCourses, seedResearch } from "../../data/seed";
import { byNewest, newId, readOrSeed, writeJson } from "./storage";

// 같은 코드로 연구/수업자료 두 가지를 만들기 위한 공통 함수
function createLocalContentService<T extends { id: string; createdAt: number }, TInput>(
  key: string,
  seed: T[]
): ContentService<T, TInput> {
  const load = () => readOrSeed<T[]>(key, seed);
  const save = (items: T[]) => writeJson(key, items);

  return {
    async list() {
      return [...load()].sort(byNewest);
    },
    async get(id) {
      return load().find((item) => item.id === id) ?? null;
    },
    async create(input) {
      const item = { ...input, id: newId(), createdAt: Date.now() } as unknown as T;
      save([item, ...load()]);
      return item;
    },
    async update(id, input) {
      const items = load();
      const idx = items.findIndex((item) => item.id === id);
      if (idx < 0) throw new Error("수정할 자료를 찾을 수 없습니다.");
      items[idx] = { ...items[idx], ...input };
      save(items);
    },
    async remove(id) {
      save(load().filter((item) => item.id !== id));
    },
  };
}

export const localResearchService = createLocalContentService<Research, ResearchInput>("research", seedResearch);
export const localCourseService = createLocalContentService<Course, CourseInput>("courses", seedCourses);
