import { Router } from "express";
import cropRoutes from "./cropRoutes.js";
import diseaseRoutes from "./diseaseRoutes.js";
import pestRoutes from "./pestRoutes.js";
import postHarvestRoutes from "./postHarvestRoutes.js";
import chatRoutes from "./chatRoutes.js";
import historyRoutes from "./historyRoutes.js";
import searchRoutes from "./searchRoutes.js";
import authRoutes from "./authRoutes.js";
import weatherRoutes from "./weatherRoutes.js";
import activityRoutes from "./activityRoutes.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/crops", cropRoutes);
router.use("/diseases", diseaseRoutes);
router.use("/pests", pestRoutes);
router.use("/post-harvest", postHarvestRoutes);
router.use("/chat", verifyToken, chatRoutes);
router.use("/history", verifyToken, historyRoutes);
router.use("/search", searchRoutes);
router.use("/weather", weatherRoutes);
router.use("/activities", verifyToken, activityRoutes);

router.get("/config", (req, res) => {
  res.status(200).json({
    hasGeminiKey: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "")
  });
});

export default router;
