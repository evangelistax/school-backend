import { StudentsModel } from "../models/students.model.mjs";

export class SudentsController {
  static async getAllStudents(req, res) {
    try {
      const result = await StudentsModel.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: `se produjo un error al lerr los datos: ${error.message}`,
      });
    }
  }

  static async getStudentById(req, res) {
    try {
      const id = Number(req.params.id);
      const student = await StudentsModel.getStudentById(id);
      if (!student) {
        res
          .status(404)
          .json({ err: `no existe un estudiante con el id ${id}` });
        return;
      }
      res.status(200).json(student);
    } catch (error) {
      res.status(400).json({
        error: `${error.message}`,
      });
    }
  }

  static async createStudent(req, res) {
    try {
      const student = req.body;
      const result = await StudentsModel.createStudent(student);
      res.status(201).json({ message: "usuario creado con exito" });
    } catch (error) {
      res.status(400).json({
        message: `Hubo un error al procesar los datos ${error.message}`,
      });
    }
  }

  static async modfStudent(req, res) {
    try {
      const id = Number(req.params.id);
      const body = req.body;
      const result = await StudentsModel.modfStudent(id, body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateStudent(req, res) {
    try {
      const id = Number(req.params.id);
      const body = req.body;
      const result = await StudentsModel.updateStudent(id, body);
      if (!result) {
        res
          .status(404)
          .json({ err: `no existe un estudiante con el id ${id}` });
        return;
      }
      res.status(201).json({ message: "usuario actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteStudent(req, res) {
    try {
      const id = Number(req.params.id);
      const result = await StudentsModel.deleteStudent(id);
      if (!result) {
        res.status(404).json({ err: `no hay un estudiante con el id ${id}` });
        return;
      }
      res.status(200).json({ message: "estudiante eliminado correctamente" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
