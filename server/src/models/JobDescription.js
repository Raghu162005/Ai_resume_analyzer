const mongoose = require("mongoose");

const jobDescriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    trim: true,
    default: "",
  },
  company: {
    type: String,
    trim: true,
    default: "",
  },
  description: {
    type: String,
    required: [true, "Job description is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("JobDescription", jobDescriptionSchema);
