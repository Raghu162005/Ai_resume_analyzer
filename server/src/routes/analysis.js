const express = require("express");
const {
  analyze,
  getAnalysis,
  getHistory,
} = require("../controllers/analysisController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, analyze);
router.get("/history/all", protect, getHistory);
router.get("/:id", protect, getAnalysis);

module.exports = router;
