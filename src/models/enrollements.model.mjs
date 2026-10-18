import { pool } from "./dbsettings.mjs";
import { enrollementSchrema } from "./validations.mjs";

// 1. Corregido el nombre de la función a 'getEnrollments'
export async function getEnrollments(params) {
  const { course, type, name } = params;
  const p = [];
  const s = [];

  let sql =
    "SELECT e.Amount, e.Debit, e.Paid, e.DateOf, e.Observations, e.TypeOf, e.StudentID, s.FirstName, s.LastName, c.CourseName FROM enrollements AS e INNER JOIN students AS s ON e.StudentID = s.StudentID INNER JOIN courses as c ON e.CourseID = c.CourseID ";
  if (course) {
    p.push(course);
    s.push(` CourseName = ? `);
  }
  if (type) {
    p.push(type);
    s.push(` TypeOf = ?`);
  }

  if (name) {
    const newName = `%${name}%`;
    p.push(newName);
    s.push(" FirstName LIKE ?");
  }

  if (p.length > 0) {
    sql += "WHERE " + s.join("AND");
  }

  try {
    const [result] = await pool.query(sql, [...p]);
    return result;
  } catch (error) {
    // Mantener el stack trace original es mejor para depuración
    throw new Error(`Error al obtener inscripciones: ${error.message}`);
  }
}

export async function createEnrollment(data) {
  const connection = await pool.getConnection();
  try {
    // Validación de datos con Zod (u otro schema validator)
    const validData = enrollementSchrema.parse(data);
    const {
      FirstName,
      LastName,
      Age,
      Sex,
      Phone,
      Residence,
      Amount,
      Paid,
      CourseID,
      Observations,
      DateOf,
      TypeOf,
    } = validData;

    const Debit = Amount - Paid;

    // Iniciar transacción usando la conexión activa
    await connection.beginTransaction();

    // Corregida la sintaxis del INSERT y paso de parámetros
    const [studentResult] = await connection.query(
      `INSERT INTO students (FirstName, LastName, Age, Sex, Phone, Residence) VALUES (?, ?, ?, ?, ?, ?)`,
      [FirstName, LastName, Age, Sex, Phone, Residence],
    );

    // En mysql2, el ID autoincremental se obtiene de 'insertId'
    const StudentID = studentResult.insertId;

    // IMPORTANTE: Usar la misma 'connection' de la transacción, NO el 'pool'
    await connection.query(
      `INSERT INTO enrollements (StudentID, CourseID, Amount, Paid, Observations, DateOf, TypeOf, Debit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [StudentID, CourseID, Amount, Paid, Observations, DateOf, TypeOf, Debit],
    );

    // Confirmar cambios
    await connection.commit();
    return { success: true, studentId: StudentID };
  } catch (error) {
    // Si algo falla, revertir los cambios de la transacción
    await connection.rollback();
    throw new Error(`Error al crear la inscripción: ${error.message}`);
  } finally {
    // Liberar la conexión al pool siempre
    connection.release();
  }
}
