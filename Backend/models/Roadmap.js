const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: String,
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
  score: {
    type: Number,
    required: true,
  },
  roadmap: {
    type: [String], // array of steps
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Roadmap", roadmapSchema);