import postHarvestService from "../services/postHarvestService.js";

export const getPostHarvest = async (req, res, next) => {
  try {
    const guides = await postHarvestService.getAll();
    return res.status(200).json(guides);
  } catch (error) {
    return next(error);
  }
};

