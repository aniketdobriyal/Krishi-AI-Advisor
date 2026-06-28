import { Router } from "express";
import { getCrops } from "../controllers/cropController.js";

const router = Router();

router.get("/", getCrops);

export default router;
