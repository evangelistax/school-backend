import { pool } from "./dbsettings.mjs";
import { enrollementSchrema } from "./validations.mjs";

// 1. Corregido el nombre de la función a 'getEnrollments'
export async function getEnrollments() {
  try {
    const [result] = await pool.query(`
      SELECT 
        e.Amount, e.Debit, e.Paid, e.DateOf, e.Observations, e.TypeOf, e.StudentID, 
        s.FirstName, s.LastName 
      FROM enrollements AS e 
      INNER JOIN students AS s ON e.StudentID = s.StudentID
    `);
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
      `INSERT INTO enrollements (StudentID, Amount, Paid, Observations, DateOf, TypeOf, Debit) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [StudentID, Amount, Paid, Observations, DateOf, TypeOf, Debit],
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
