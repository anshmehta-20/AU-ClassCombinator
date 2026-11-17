import { defineEventHandler, getQuery } from "h3";
import { searchCourses } from "../utils/coursesRepo";

const MAX_RESULTS_DEFAULT = 5;

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const searchTerm = query.q as string;
  const selectedSemester = query.semester as string;
  const page = parseInt(query.page as string) || 1;
  const maxResults =
    parseInt(query.maxResults as string) || MAX_RESULTS_DEFAULT;

  if (!searchTerm || !selectedSemester) {
    event.node.res.statusCode = 400;
    return { error: "Missing search term or semester" };
  }
  const [semester, yearStr] = selectedSemester.split(" ");
  const year = parseInt(yearStr, 10);
  if (!semester || isNaN(year)) {
    event.node.res.statusCode = 400;
    return {
      error: "Invalid semester format, it must be in 'Semester Year' format",
    };
  }

  const results = searchCourses({
    searchQuery: searchTerm,
    year,
    semester,
    page,
    maxResults,
  });

  return results;
});
