import pestService from "../services/pestService.js";

export const getPests = async (req, res, next) => {
  try {
    const pests = await pestService.getAll();
    return res.status(200).json(pests);
  } catch (error) {
    return next(error);
  }
};

