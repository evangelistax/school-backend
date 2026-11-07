import { pool } from "./dbsettings.mjs";

// Student-to-classroom membership is stored separately because a student can
// belong to a classroom without changing their course enrollment.
async function ensureClassroomStudentsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS classroom_students (
      ClassroomName VARCHAR(255) NOT NULL,
      StudentID INT NOT NULL,
      PRIMARY KEY (ClassroomName, StudentID)
    )
  `);
}

export default async function getClassrooms() {
  try {
    await ensureClassroomStudentsTable();
    const [result] = await pool.query(
      `SELECT c.ClassroomName, c.CourseID, e.CourseName,
              p.FirstName, p.LastName,
              COUNT(DISTINCT CASE WHEN enrollment.CourseID = c.CourseID THEN s.StudentID END) AS Total
       FROM classrooms AS c
       INNER JOIN courses AS e ON c.CourseID = e.CourseID
       INNER JOIN professors AS p ON p.ProfessorID = c.ProfessorID
       LEFT JOIN classroom_students AS cs ON cs.ClassroomName = c.ClassroomName
       LEFT JOIN students AS s ON s.StudentID = cs.StudentID
       LEFT JOIN enrollements AS enrollment ON enrollment.StudentID = s.StudentID
       GROUP BY c.ClassroomName, c.CourseID, e.CourseName, p.FirstName, p.LastName`,
    );
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getClassroomByName(classroomName) {
  await ensureClassroomStudentsTable();
  const [classrooms] = await pool.query(
    `SELECT c.ClassroomName, c.CourseID, e.CourseName, p.ProfessorID,
            p.FirstName AS TutorFirstName, p.LastName AS TutorLastName
     FROM classrooms AS c
     INNER JOIN courses AS e ON e.CourseID = c.CourseID
     INNER JOIN professors AS p ON p.ProfessorID = c.ProfessorID
     WHERE c.ClassroomName = ?`,
    [classroomName],
  );
  if (!classrooms.length) return null;

  const classroom = classrooms[0];
  const [students] = await pool.query(
    `SELECT DISTINCT s.StudentID, s.FirstName, s.LastName, s.Age, s.Sex,
                    s.Phone, s.Residence, e.CourseName
     FROM classroom_students AS cs
     INNER JOIN students AS s ON s.StudentID = cs.StudentID
     INNER JOIN enrollements AS enrollment ON enrollment.StudentID = s.StudentID
     INNER JOIN courses AS e ON e.CourseID = enrollment.CourseID
     WHERE cs.ClassroomName = ? AND enrollment.CourseID = ?
     ORDER BY s.LastName, s.FirstName`,
    [classroomName, classroom.CourseID],
  );
  return { ...classroom, Students: students };
}

export async function getEligibleStudents(classroomName) {
  await ensureClassroomStudentsTable();
  const [classrooms] = await pool.query(
    "SELECT CourseID FROM classrooms WHERE ClassroomName = ?",
    [classroomName],
  );
  if (!classrooms.length) return null;

  const [students] = await pool.query(
    `SELECT DISTINCT s.StudentID, s.FirstName, s.LastName, s.Age
     FROM students AS s
     INNER JOIN enrollements AS enrollment ON enrollment.StudentID = s.StudentID
     WHERE enrollment.CourseID = ?
       AND NOT EXISTS (
         SELECT 1 FROM classroom_students AS cs
         WHERE cs.ClassroomName = ? AND cs.StudentID = s.StudentID
       )
     ORDER BY s.LastName, s.FirstName`,
    [classrooms[0].CourseID, classroomName],
  );
  return students;
}

export async function assignStudents(classroomName, studentIDs) {
  await ensureClassroomStudentsTable();
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [classrooms] = await connection.query(
      "SELECT CourseID FROM classrooms WHERE ClassroomName = ? FOR UPDATE",
      [classroomName],
    );
    if (!classrooms.length) {
      const error = new Error("No existe el aula indicada.");
      error.status = 404;
      throw error;
    }

    const courseID = classrooms[0].CourseID;
    const ids = [...new Set(studentIDs.map(Number))];
    for (const studentID of ids) {
      const [eligible] = await connection.query(
        `SELECT StudentID FROM enrollements
         WHERE StudentID = ? AND CourseID = ? LIMIT 1`,
        [studentID, courseID],
      );
      if (!Number.isInteger(studentID) || !eligible.length) {
        const error = new Error(
          `El estudiante ${studentID} no está matriculado en el curso de esta aula.`,
        );
        error.status = 400;
        throw error;
      }
      await connection.query(
        "INSERT IGNORE INTO classroom_students (ClassroomName, StudentID) VALUES (?, ?)",
        [classroomName, studentID],
      );
    }
    await connection.commit();
    return ids.length;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
