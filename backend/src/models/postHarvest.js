import mongoose from "mongoose";

const postHarvestSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Guide ID is required"],
      unique: true,
      trim: true,
      index: true
    },
    titleEn: {
      type: String,
      required: [true, "English title is required"],
      trim: true
    },
    titleHi: {
      type: String,
      required: [true, "Hindi title is required"],
      trim: true
    },
    descriptionEn: {
      type: String,
      required: [true, "English description is required"]
    },
    descriptionHi: {
      type: String,
      required: [true, "Hindi description is required"]
    },
    icon: {
      type: String,
      required: [true, "Icon name is required"],
      trim: true
    },
    itemsEn: {
      type: [String],
      default: []
    },
    itemsHi: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const PostHarvest = mongoose.model("PostHarvest", postHarvestSchema);
export default PostHarvest;
