import get from "../controlers/classrooms.controler.mjs";
import { Router } from "express";

const classroomRouter = Router();

classroomRouter.get("/", get);

export default classroomRouter;
