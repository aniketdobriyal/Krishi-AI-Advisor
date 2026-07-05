import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Crop ID is required"],
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
    scientificName: {
      type: String,
      required: [true, "Scientific name is required"],
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
    image: {
      type: String,
      required: [true, "Image URL is required"]
    }
  },
  {
    timestamps: true
  }
);

const Crop = mongoose.model("Crop", cropSchema);
export default Crop;
