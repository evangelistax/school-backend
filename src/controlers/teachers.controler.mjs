import { TeachersModel } from "../models/teachers.model.mjs";
import { teacherSchema } from "../models/validations.mjs";

export class TeachersController {
  static async getAllTeachers(req, res) {
    try {
      const result = await TeachersModel.getAllTeachers();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: `se produjo un error al leer los datos`,
      });
    }
  }

  static async getTeacherById(req, res) {
    try {
      const id = Number(req.params.id);
      const teacher = await TeachersModel.getTeachersById(id);
      if (!teacher) {
        res.status(400).json({ err: `no existe un profesor con el id ${id}` });
        return;
      }
      res.status(200).json(teacher[0]);
    } catch (error) {
      res.status(400).json({
        error: `${error.message}`,
      });
    }
  }

  static async createTeacher(req, res) {
    try {
      const teacher = teacherSchema.parse(req.body);
      const result = await TeachersModel.createProfessor(teacher);
      res
        .status(201)
        .json({ message: "profesor creado correctamente", ...result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateTeacher(req, res) {
    try {
      const id = Number(req.params.id);
      const body = teacherSchema.partial().parse(req.body);
      const result = await TeachersModel.updateProfessor(id, body);
      if (!result) {
        res.status(404).json({ err: `no existe un profesor con el id ${id}` });
        return;
      }
      res.status(201).json({ message: "profesor actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteTeacher(req, res) {
    try {
      const id = Number(req.params.id);
      const result = await TeachersModel.deleteProfessor(id);
      if (!result) {
        res.status(404).json({ err: `no hay un profesor con el id ${id}` });
        return;
      }
      res.status(200).json({ message: "profesor eliminado correctamente" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
