import rawCourses from "../../courses.json";
import type { ICourseDTO, ISectionDTO } from "../../types/course";

function bitmaskStringToBinary(bitmask: string): { buffer: Buffer } {
  const byteLength = Math.ceil(bitmask.length / 8);
  const buf = Buffer.alloc(byteLength);
  for (let i = 0; i < bitmask.length; i++) {
    if (bitmask[i] === "1") {
      const byteIndex = Math.floor(i / 8);
      const bitOffset = 7 - (i % 8);
      buf[byteIndex] |= 1 << bitOffset;
    }
  }
  return { buffer: buf };
}

// Convert raw courses to ICourseDTO[] (client-safe, without bitmasks)
export const courseDTOs: ICourseDTO[] = (rawCourses as any[]).map((course) => {
  return {
    _id: course.code,
    code: course.code,
    name: course.name,
    level: course.level,
    credits: course.credits,
    faculties: course.faculties,
    semester: course.semester,
    year: course.year,
    prerequisite: course.prerequisite,
    antirequisite: course.antirequisite,
    description: course.description,
    gerCategory: course.gerCategory ?? null,
    sections: course.sections.map((section: any): ISectionDTO => ({
      sectionId: section.sectionId,
      quarter: section.quarter ?? null,
      dateRange: {
        start: new Date(section.dateRange.start),
        end: new Date(section.dateRange.end),
      },
      slots: section.slots,
    })),
  };
});

const courseDTOMap = new Map<string, ICourseDTO>();
for (const c of courseDTOs) {
  courseDTOMap.set(c._id, c);
}

// Full courses with binary bitmasks for combinator algorithm
export const coursesWithBitmasks: any[] = (rawCourses as any[]).map((course) => {
  return {
    _id: course.code,
    code: course.code,
    name: course.name,
    level: course.level,
    credits: course.credits,
    faculties: course.faculties,
    semester: course.semester,
    year: course.year,
    prerequisite: course.prerequisite,
    antirequisite: course.antirequisite,
    description: course.description,
    gerCategory: course.gerCategory ?? null,
    sections: course.sections.map((section: any) => ({
      sectionId: section.sectionId,
      quarter: section.quarter ?? null,
      fiveMinuteBitMask: bitmaskStringToBinary(section.fiveMinuteBitMask),
      dateRange: {
        start: new Date(section.dateRange.start),
        end: new Date(section.dateRange.end),
        oneDayBitMask: bitmaskStringToBinary(section.dateRange.oneDayBitMask),
      },
      slots: section.slots,
    })),
  };
});

const coursesWithBitmasksMap = new Map<string, any>();
for (const c of coursesWithBitmasks) {
  coursesWithBitmasksMap.set(c._id, c);
}

export function getCoursesDTOByIds(ids: string[]): ICourseDTO[] {
  const result: ICourseDTO[] = [];
  for (const id of ids) {
    const found = courseDTOMap.get(id);
    if (found) {
      result.push(found);
    }
  }
  return result;
}

export function getCoursesByIdsWithBitmasks(ids: string[]): any[] {
  const result: any[] = [];
  for (const id of ids) {
    const found = coursesWithBitmasksMap.get(id);
    if (found) {
      result.push(found);
    }
  }
  return result;
}

export function getUniqueSemesters(): string[] {
  const set = new Set<string>();
  for (const c of courseDTOs) {
    set.add(`${c.semester} ${c.year}`);
  }
  return Array.from(set).sort().reverse();
}

interface ISearchParams {
  searchQuery?: string;
  year?: number;
  semester?: string;
  page?: number;
  maxResults?: number;
}

export function searchCourses({
  searchQuery,
  year,
  semester,
  page = 1,
  maxResults = 5,
}: ISearchParams): ICourseDTO[] {
  let filtered = courseDTOs;

  if (year && semester) {
    filtered = filtered.filter(
      (c) =>
        c.year === year &&
        c.semester.toLowerCase() === semester.toLowerCase()
    );
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filtered = filtered.filter((c) => {
      const matchCode = c.code.toLowerCase().includes(q);
      const matchName = c.name.toLowerCase().includes(q);
      const matchFaculty = c.faculties.some((f) =>
        f.toLowerCase().includes(q)
      );
      return matchCode || matchName || matchFaculty;
    });
  }

  const startIndex = (page - 1) * maxResults;
  return filtered.slice(startIndex, startIndex + maxResults);
}
