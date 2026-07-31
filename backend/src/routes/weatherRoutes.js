import { Router } from "express";
import { getAlerts } from "../controllers/weatherController.js";

const router = Router();

router.get("/alerts", getAlerts);

export default router;
