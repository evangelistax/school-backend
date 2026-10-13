import { pool } from "./dbsettings.mjs";
import { teacherSchema } from "./validations.mjs";

/*CLASE PARA GESTIONAR OPERACIONES CRUD SOBRE PROFESORES */

export class TeachersModel {
  /*RECUPERAR TODOS LOS PROFESORES */
  static async getAllTeachers() {
    try {
      const [result] = await pool.query("SELECT * FROM professors");
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  /*RECUPERAR UN PROFESOR ESPECIFICO POR ID */
  static async getTeachersById(id) {
    const [result] = await pool.query(
      "SELECT * FROM professors WHERE ProfessorID = ?",
      [id],
    );
    if (result.length === 0) return null;
    return result;
  }

  /*CREAR UN NUEVO PROFESOR */
  static async createProfessor(teacher) {
    const validData = teacherSchema.parse(teacher);
    const {
      FirstName,
      LastName,
      Salary,
      Sex,
      Phone,
      Residence,
      Titulation,
      Age,
    } = validData;
    const [result] = await pool.query(
      "INSERT  INTO professors(FirstName, LastName, Age, Sex, Phone, Residence, Titulation, Salary ) VALUES (?,?,?,?,?,?,?,?)",
      [FirstName, LastName, Age, Sex, Phone, Residence, Titulation, Salary],
    );
    const data = { id: result.insertId, ...validData };
    return data;
  }

  /*ACTUALIZAR UN PROFESOR ESPECIFICO*/
  static async updateProfessor(id, input) {
    const body = input;
    const campos = Object.keys(input);
    const camposPermitidos = [
      "FirsTName",
      "LastName",
      "Age",
      "Sex",
      "Residence",
      "Phone",
      "Salary",
      "Titulation",
    ];

    const camposValidos = campos.filter((campo) =>
      camposPermitidos.includes(campo),
    );

    const valores = camposValidos.map((campo) => body[campo]);

    const sets = camposValidos.map((campo) => `${campo} = ?`).join(", ");
    const sql = `UPDATE professors set ${sets} WHERE ProfessorID = ?`;
    const [result] = await pool.query(sql, [...valores, id]);
    return result.affectedRows;
  }

  /*ELIMINAR UN PROFESOR  ESPECIFICO */
  static async deleteProfessor(id) {
    const [result] = await pool.query(
      "DELETE FROM professors WHERE ProfessorID = ?",
      [id],
    );
    return result.affectedRows;
  }
}
