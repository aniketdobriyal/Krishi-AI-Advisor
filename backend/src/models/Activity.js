import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    action: {
      type: String,
      required: true
    },
    descriptionEn: {
      type: String,
      required: true
    },
    descriptionHi: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
