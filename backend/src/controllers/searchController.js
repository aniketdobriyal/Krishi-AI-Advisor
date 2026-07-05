import searchService from "../services/searchService.js";

export const search = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (q === undefined) {
      const error = new Error("Query parameter 'q' is required");
      error.statusCode = 400;
      return next(error);
    }

    const results = await searchService.search(q);
    return res.status(200).json(results);
  } catch (error) {
    return next(error);
  }
};

