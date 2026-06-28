import { Router } from "express";
import { getPests } from "../controllers/pestController.js";

const router = Router();

router.get("/", getPests);

export default router;
