import { Router } from "express";
import * as MetaController from "../controllers/MetaController";

const metaRoutes = Router();

metaRoutes.get("/meta/webhook", MetaController.verification);
metaRoutes.post("/meta/webhook", MetaController.index);

export default metaRoutes;
