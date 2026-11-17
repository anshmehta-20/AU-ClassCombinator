import { defineEventHandler, readBody, createError } from "h3";
import { getCoursesDTOByIds } from "../utils/coursesRepo";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!Array.isArray(body)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Body must be an array of course IDs",
    });
  }

  try {
    const courses = getCoursesDTOByIds(body);
    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
