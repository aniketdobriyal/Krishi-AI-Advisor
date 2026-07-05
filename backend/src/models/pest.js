import mongoose from "mongoose";

const pestSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Pest ID is required"],
      unique: true,
      trim: true,
      index: true
    },
    cropIds: {
      type: [String],
      default: []
    },
    nameEn: {
      type: String,
      required: [true, "English name is required"],
      trim: true
    },
    nameHi: {
      type: String,
      required: [true, "Hindi name is required"],
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
    preventionEn: {
      type: String,
      required: [true, "English prevention details are required"]
    },
    preventionHi: {
      type: String,
      required: [true, "Hindi prevention details are required"]
    },
    controlEn: {
      type: String,
      required: [true, "English control details are required"]
    },
    controlHi: {
      type: String,
      required: [true, "Hindi control details are required"]
    }
  },
  {
    timestamps: true
  }
);

const Pest = mongoose.model("Pest", pestSchema);
export default Pest;
