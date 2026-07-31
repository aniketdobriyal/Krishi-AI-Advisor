import Activity from "../models/Activity.js";

// @desc    Get user's recent activity logs
// @route   GET /api/activities
// @access  Private
export const getActivities = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const logs = await Activity.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);
    
    return res.status(200).json({
      status: "success",
      results: logs.length,
      data: logs
    });
  } catch (err) {
    return next(err);
  }
};

// @desc    Create a new activity log
// @route   POST /api/activities
// @access  Private
export const createActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { action, descriptionEn, descriptionHi } = req.body;

    if (!action || !descriptionEn || !descriptionHi) {
      const error = new Error("Missing required activity parameters.");
      error.statusCode = 400;
      return next(error);
    }

    const activity = new Activity({
      user: userId,
      action,
      descriptionEn,
      descriptionHi
    });

    await activity.save();

    return res.status(201).json({
      status: "success",
      data: activity
    });
  } catch (err) {
    return next(err);
  }
};
