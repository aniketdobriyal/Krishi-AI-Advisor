import { getWeatherAlerts } from "../services/weatherService.js";

// @desc    Get live crop risk weather alerts and agromet advisory
// @route   GET /api/weather/alerts
// @access  Public
export const getAlerts = async (req, res, next) => {
  try {
    const data = await getWeatherAlerts();
    return res.status(200).json({
      status: "success",
      data
    });
  } catch (err) {
    return next(err);
  }
};
