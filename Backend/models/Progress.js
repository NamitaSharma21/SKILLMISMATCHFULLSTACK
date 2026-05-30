import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: String,
      required: true,
    },

    domain: {
      type: String,
      required: true,
    },

    roadmapSteps: {
      type: [String],
      default: [],
    },

    completedSteps: {
      type: [String],
      default: [],
    },

    unlockedSteps: {
      type: [String],
      default: [],
    },

    scores: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Progress = mongoose.model(
  "Progress",
  progressSchema
);

export default Progress;