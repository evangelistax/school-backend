import { Router } from "express";
import enrollementsController from "../controlers/enrollements.controler.mjs";

export const enrollementsRouter = Router();

enrollementsRouter.get("/", enrollementsController);
