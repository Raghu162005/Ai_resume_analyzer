const Analysis = require("../models/Analysis");
const Resume = require("../models/Resume");

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalAnalyses = await Analysis.countDocuments({ user: userId });
    const totalResumes = await Resume.countDocuments({ user: userId });

    const scoreAgg = await Analysis.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          averageMatchScore: { $avg: "$matchScore" },
          averageAtsScore: { $avg: "$atsScore" },
        },
      },
    ]);

    const averages =
      scoreAgg.length > 0
        ? scoreAgg[0]
        : { averageMatchScore: 0, averageAtsScore: 0 };

    const recentAnalyses = await Analysis.find({ user: userId })
      .populate("resume", "originalName")
      .populate("jobDescription", "title company")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalAnalyses,
        totalResumes,
        averageMatchScore: Math.round(averages.averageMatchScore || 0),
        averageAtsScore: Math.round(averages.averageAtsScore || 0),
        recentAnalyses,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getScoreHistory = async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user.id })
      .select("matchScore atsScore createdAt")
      .sort({ createdAt: 1 });

    const scoreHistory = analyses.map((a) => ({
      date: a.createdAt,
      matchScore: a.matchScore,
      atsScore: a.atsScore,
    }));

    res.status(200).json({ success: true, scoreHistory });
  } catch (error) {
    console.error("Get score history error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
