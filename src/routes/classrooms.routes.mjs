import { Router } from "express";
import { addStudents, get, getByName, getEligible } from "../controlers/classrooms.controler.mjs";

const classroomRouter = Router();

classroomRouter.get("/", get);
classroomRouter.get("/:classroomName/students/eligible", getEligible);
classroomRouter.post("/:classroomName/students", addStudents);
classroomRouter.get("/:classroomName", getByName);

export default classroomRouter;
