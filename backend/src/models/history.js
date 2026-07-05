import mongoose from "mongoose";

const advisorySchema = new mongoose.Schema({
  problem: { type: String },
  causes: { type: String },
  actions: { type: String },
  precautions: { type: String },
  disclaimer: { type: String }
}, { _id: false });

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "ai"],
    required: [true, "Sender is required"]
  },
  text: {
    type: String
  },
  isAdvisory: {
    type: Boolean,
    default: false
  },
  advisory: {
    type: advisorySchema,
    default: null
  }
}, { _id: false });

const historySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "History Session ID is required"],
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
    date: {
      type: Date,
      default: Date.now
    },
    messages: {
      type: [messageSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const History = mongoose.model("History", historySchema);
export default History;
