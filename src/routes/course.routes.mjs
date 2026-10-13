import { Router } from "express";
import coursesControler from "../controlers/courses.controler.mjs";

const coursesRourter = Router();

coursesRourter.get("/", coursesControler);

export default coursesRourter;
