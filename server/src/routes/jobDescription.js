const express = require("express");
const auth = require("../middleware/auth");
const JobDescription = require("../models/JobDescription");

const router = express.Router();

router.post("/", auth.protect, async (req, res) => {
  try {
    const { title, company, description } = req.body;

    if (!description) {
      return res
        .status(400)
        .json({ success: false, message: "Description is required" });
    }

    const jobDescription = await JobDescription.create({
      user: req.user.id,
      title,
      company,
      description,
    });

    res.status(201).json({ success: true, jobDescription });
  } catch (error) {
    console.error("Create JD error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
