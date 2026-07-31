import { Router } from "express";
import { askChat, getChatStatus } from "../controllers/chatController.js";

const router = Router();

router.post("/", askChat);
router.get("/status", getChatStatus);

export default router;
