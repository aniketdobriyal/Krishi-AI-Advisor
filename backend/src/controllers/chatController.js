import chatService, { lastChatStatus } from "../services/chatService.js";
import Activity from "../models/Activity.js";

export const askChat = async (req, res, next) => {
  try {
    const { query, message, isHindi, temp } = req.body;
    const queryString = query || message;

    if (!queryString || queryString.trim() === "") {
      const error = new Error("Query text is required");
      error.statusCode = 400;
      return next(error);
    }

    const advisory = await chatService.ask(queryString, !!isHindi, temp);

    // Save activity log (non-blocking)
    const descEn = `Asked AI: "${queryString.length > 35 ? queryString.substring(0, 35) + "..." : queryString}"`;
    const descHi = `एआई से पूछा: "${queryString.length > 35 ? queryString.substring(0, 35) + "..." : queryString}"`;
    const activity = new Activity({
      user: req.user._id,
      action: "AI Chat",
      descriptionEn: descEn,
      descriptionHi: descHi
    });
    activity.save().catch(err => console.error("Failed to log chat activity:", err));

    return res.status(200).json(advisory);
  } catch (error) {
    return next(error);
  }
};

export const getChatStatus = async (req, res, next) => {
  try {
    return res.status(200).json({
      status: "success",
      data: lastChatStatus
    });
  } catch (err) {
    return next(err);
  }
};
