const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume",
    required: true,
  },
  jobDescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobDescription",
    required: true,
  },
  matchScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  atsScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  skillsMatched: [String],
  missingSkills: [String],
  matchedKeywords: [String],
  missingKeywords: [String],
  summary: {
    type: String,
    default: "",
  },
  suggestions: [String],
  grammarIssues: [String],
  formattingSuggestions: [String],
  coverLetter: {
    type: String,
    default: "",
  },
  interviewQuestions: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Analysis", analysisSchema);
