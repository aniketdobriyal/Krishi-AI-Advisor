import { Router } from "express";
import { getHistory, saveHistory, deleteHistory } from "../controllers/historyController.js";

const router = Router();

router.get("/", getHistory);
router.post("/", saveHistory);
router.delete("/:id", deleteHistory);

export default router;
