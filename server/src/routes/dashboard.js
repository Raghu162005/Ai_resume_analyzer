const express = require("express");
const { getStats, getScoreHistory } = require("../controllers/dashboardController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/stats", protect, getStats);
router.get("/scores", protect, getScoreHistory);

module.exports = router;
