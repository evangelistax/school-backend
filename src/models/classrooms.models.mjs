import { pool } from "./dbsettings.mjs";

export default async function getClassrooms() {
  try {
    const [result] = await pool.query(
      "SELECT c.ClassroomName, e.CourseName, p.FirstName FROM classrooms as c INNER JOIN courses as e on c.CourseID = e.CourseID INNER JOIN professors as p ON p.ProfessorID = c.ProfessorID",
    );

    return result;
  } catch (error) {
    throw new error(error.message);
  }
}
