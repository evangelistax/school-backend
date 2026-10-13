import { parse } from "node:path";
import { pool } from "./dbsettings.mjs";
import { studentSchema, partialStudent } from "./validations.mjs";

/*CLASE PARA GESTIONAR OPERACIONES CRUD SOBRE ESTUDIANTES */
export class StudentsModel {
  /*RECUPERAR TODOS LOS ESTUDIANTES */
  static async getAll() {
    try {
      const [result] = await pool.query("SELECT * FROM students");
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /*RECUPERAR UN ESTUDIANTE ESPECIFICO POR ID */
  static async getStudentById(id) {
    const [result] = await pool.query(
      "SELECT * FROM students WHERE StudentID = ?",
      [id],
    );
    if (result.length === 0) return null;
    return result[0];
  }

  /*CREAR UN NUEVO ESTUDIANTE */
  static async createStudent(student) {
    try {
      const validData = studentSchema.parse(student);
      const { FirstName, LastName, Age, Sex, Phone, Residence } = validData;
      const [result] = await pool.query(
        "INSERT  INTO students(FirstName, LastName, Age, Sex, Phone, Residence) VALUES (?,?,?,?,?,?)",
        [FirstName, LastName, Age, Sex, Phone, Residence],
      );
      const data = { id: result.insertId, ...student };
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /*ACTUALIZAR UN ESTUDIANTE ESPECIFICO*/
  static async updateStudent(id, input) {
    const validInput = partialStudent.parse(input);
    const body = input;
    const campos = Object.keys(validInput);
    const camposPermitidos = [
      "FirstName",
      "LastName",
      "Age",
      "Sex",
      "Residence",
      "Phone",
    ];

    const camposValidos = campos.filter((campo) =>
      camposPermitidos.includes(campo),
    );

    const valores = camposValidos.map((campo) => body[campo]);

    const sets = camposValidos.map((campo) => `${campo} = ?`).join(", ");
    const sql = `UPDATE students set ${sets} WHERE StudentID = ?`;
    const [result] = await pool.query(sql, [...valores, id]);
    return result.affectedRows;
  }

  /*ELIMINAR UN ESTUDIANTE ESPECIFICO */
  static async deleteStudent(id) {
    const [result] = await pool.query(
      "DELETE FROM students WHERE StudentID = ?",
      [id],
    );
    return result.affectedRows;
  }
}
