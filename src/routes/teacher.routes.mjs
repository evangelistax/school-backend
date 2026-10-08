import { Router } from "express";
import { TeachersController } from "../controlers/teachers.controler.mjs";

export const teachersRouter = Router();

teachersRouter.get("/", TeachersController.getAllTeachers);
teachersRouter.get("/:id", TeachersController.getTeacherById);
teachersRouter.post("/", TeachersController.createTeacher);
teachersRouter.patch("/:id", TeachersController.updateTeacher);
teachersRouter.delete("/:id", TeachersController.deleteTeacher);
