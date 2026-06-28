import historyService from "../services/historyService.js";

export const getHistory = async (req, res, next) => {
  try {
    const list = historyService.getAll();
    return res.status(200).json(list);
  } catch (error) {
    return next(error);
  }
};

export const saveHistory = async (req, res, next) => {
  try {
    const sessionData = req.body;
    
    if (!sessionData.messages || !Array.isArray(sessionData.messages)) {
      const error = new Error("Messages array is required");
      error.statusCode = 400;
      return next(error);
    }

    const isExisting = sessionData.id && historyService.getAll().some(h => h.id === sessionData.id);
    const saved = historyService.save(sessionData);

    return res.status(isExisting ? 200 : 201).json(saved);
  } catch (error) {
    return next(error);
  }
};

export const deleteHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = historyService.delete(id);

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
