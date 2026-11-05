import { Router } from "express";
import { get, post, put } from "../controlers/enrollements.controler.mjs";

export const enrollementsRouter = Router();

enrollementsRouter.get("/", get);
enrollementsRouter.post("/", post);
enrollementsRouter.put("/:id", put);
