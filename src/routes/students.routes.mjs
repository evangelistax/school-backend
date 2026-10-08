import { Router } from "express";
import { SudentsController } from "../controlers/students.controler.mjs";
export const studentsRrouter = Router();

studentsRrouter.get("/", SudentsController.getAllStudents);
studentsRrouter.get("/:id", SudentsController.getStudentById);
studentsRrouter.post("/", SudentsController.createStudent);
studentsRrouter.patch("/:id", SudentsController.updateStudent);
studentsRrouter.delete("/:id", SudentsController.deleteStudent);
