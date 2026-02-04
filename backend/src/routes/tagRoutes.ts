import express from "express";
import isAuth from "../middleware/isAuth";

import * as TagController from "../controllers/TagController";

const tagRoutes = express.Router();

tagRoutes.get("/tags", isAuth, TagController.index);
tagRoutes.post("/tags", isAuth, TagController.store);
tagRoutes.put("/tags/:tagId", isAuth, TagController.update);
tagRoutes.delete("/tags/:tagId", isAuth, TagController.remove);
tagRoutes.post("/tags/sync/:ticketId", isAuth, TagController.syncTags);

export default tagRoutes;
