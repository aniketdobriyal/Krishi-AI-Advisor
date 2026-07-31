import historyService from "../services/historyService.js";
import Activity from "../models/Activity.js";

export const getHistory = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const list = await historyService.getAll(userId);
    return res.status(200).json(list);
  } catch (error) {
    return next(error);
  }
};

export const saveHistory = async (req, res, next) => {
  try {
    const sessionData = req.body;
    const userId = req.user?._id;
    
    if (!sessionData.messages || !Array.isArray(sessionData.messages)) {
      const error = new Error("Messages array is required");
      error.statusCode = 400;
      return next(error);
    }

    const allHistory = await historyService.getAll(userId);
    const isExisting = sessionData.id && allHistory.some(h => h.id === sessionData.id);
    const saved = await historyService.save(sessionData, userId);

    // Save activity log (non-blocking)
    const title = sessionData.title || "New Diagnostic Chat";
    const descEn = `Saved chat session: "${title.length > 35 ? title.substring(0, 35) + "..." : title}"`;
    const descHi = `चैट सत्र सहेजा गया: "${title.length > 35 ? title.substring(0, 35) + "..." : title}"`;
    const activity = new Activity({
      user: userId,
      action: "History Saved",
      descriptionEn: descEn,
      descriptionHi: descHi
    });
    activity.save().catch(err => console.error("Failed to log history activity:", err));

    return res.status(isExisting ? 200 : 201).json(saved);
  } catch (error) {
    return next(error);
  }
};

export const deleteHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const deleted = await historyService.delete(id, userId);

    if (!deleted) {
      const error = new Error(`History session with ID '${id}' not found`);
      error.statusCode = 404;
      return next(error);
    }

    return res.status(204).send(); // 204 No Content
  } catch (error) {
    return next(error);
  }
};

