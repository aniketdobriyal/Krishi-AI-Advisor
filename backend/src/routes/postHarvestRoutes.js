import { Router } from "express";
import { getPostHarvest } from "../controllers/postHarvestController.js";

const router = Router();

router.get("/", getPostHarvest);

export default router;
