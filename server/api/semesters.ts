import { defineEventHandler } from "h3";
import { getUniqueSemesters } from "../utils/coursesRepo";

export default defineEventHandler(async (event) => {
  return getUniqueSemesters();
});
