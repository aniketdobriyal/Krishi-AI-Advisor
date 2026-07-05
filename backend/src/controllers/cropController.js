import cropService from "../services/cropService.js";

export const getCrops = async (req, res, next) => {
  try {
    const crops = await cropService.getAll();
    return res.status(200).json(crops);
  } catch (error) {
    return next(error);
  }
};

