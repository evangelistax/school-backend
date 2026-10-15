import { Router } from "express";
import { get, post } from "../controlers/enrollements.controler.mjs";

export const enrollementsRouter = Router();

enrollementsRouter.get("/", get);
enrollementsRouter.post("/", post);
