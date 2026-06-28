import chatService from "../services/chatService.js";

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
    return res.status(200).json(advisory);
  } catch (error) {
    return next(error);
  }
};
