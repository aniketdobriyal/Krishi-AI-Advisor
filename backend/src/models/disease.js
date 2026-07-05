import mongoose from "mongoose";

const diseaseSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Disease ID is required"],
      unique: true,
      trim: true,
      index: true
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
    pathogen: {
      type: String,
      required: [true, "Pathogen name is required"],
      trim: true
    },
    cropIds: {
      type: [String],
      default: []
    },
    symptomsEn: {
      type: String,
      required: [true, "English symptoms are required"]
    },
    symptomsHi: {
      type: String,
      required: [true, "Hindi symptoms are required"]
    },
    preventionEn: {
      type: String,
      required: [true, "English prevention details are required"]
    },
    preventionHi: {
      type: String,
      required: [true, "Hindi prevention details are required"]
    },
    treatmentEn: {
      type: String,
      required: [true, "English treatment details are required"]
    },
    treatmentHi: {
      type: String,
      required: [true, "Hindi treatment details are required"]
    },
    image: {
      type: String,
      required: [true, "Image URL is required"]
    }
  },
  {
    timestamps: true
  }
);

const Disease = mongoose.model("Disease", diseaseSchema);
export default Disease;
