const { GoogleGenerativeAI } = require("@google/generative-ai");
const Resume = require("../models/Resume");
const JobDescription = require("../models/JobDescription");
const Analysis = require("../models/Analysis");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ANALYSIS_PROMPT = `You are an expert resume analyst and career coach. Analyze the following resume against the provided job description and return a detailed JSON analysis.

RESUME TEXT:
{resumeText}

JOB DESCRIPTION:
{jobDescription}

Return ONLY a valid JSON object with the following structure (no markdown, no code fences, just raw JSON):
{
  "matchScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "skillsMatched": [<array of skills from the job description found in the resume>],
  "missingSkills": [<array of skills from the job description NOT found in the resume>],
  "matchedKeywords": [<array of important keywords found in the resume>],
  "missingKeywords": [<array of important keywords missing from the resume>],
  "summary": "<detailed paragraph summarizing the match quality and overall assessment>",
  "suggestions": [<array of at least 5 specific actionable suggestions to improve the resume>],
  "grammarIssues": [<array of any grammar or spelling issues found>],
  "formattingSuggestions": [<array of formatting improvements>],
  "coverLetter": "<a tailored cover letter for this specific job application based on the resume>",
  "interviewQuestions": [<array of at least 5 likely interview questions based on the job description and resume>]
}

Be thorough, specific, and actionable in your analysis. Scores should be realistic based on the actual match between the resume and job description.`;

exports.analyze = async (req, res) => {
  try {
    const { resumeId, jobDescriptionId } = req.body;

    if (!resumeId || !jobDescriptionId) {
      return res.status(400).json({
        success: false,
        message: "resumeId and jobDescriptionId are required",
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user.id,
    });

    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });
    }

    const jobDescription = await JobDescription.findOne({
      _id: jobDescriptionId,
      user: req.user.id,
    });

    if (!jobDescription) {
      return res
        .status(404)
        .json({ success: false, message: "Job description not found" });
    }

    if (!resume.extractedText) {
      return res.status(400).json({
        success: false,
        message: "Resume has no extracted text to analyze",
      });
    }

    const prompt = ANALYSIS_PROMPT
      .replace("{resumeText}", resume.extractedText)
      .replace(
        "{jobDescription}",
        `${jobDescription.title ? jobDescription.title + " at " : ""}${jobDescription.company ? jobDescription.company + "\n" : ""}${jobDescription.description}`
      );

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let analysisData;
    try {
      const cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      analysisData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError.message);
      console.error("Raw Gemini response:", text);
      return res.status(500).json({
        success: false,
        message:
          "Failed to parse AI analysis response. Please try again.",
      });
    }

    const analysis = await Analysis.create({
      user: req.user.id,
      resume: resumeId,
      jobDescription: jobDescriptionId,
      matchScore: analysisData.matchScore || 0,
      atsScore: analysisData.atsScore || 0,
      skillsMatched: analysisData.skillsMatched || [],
      missingSkills: analysisData.missingSkills || [],
      matchedKeywords: analysisData.matchedKeywords || [],
      missingKeywords: analysisData.missingKeywords || [],
      summary: analysisData.summary || "",
      suggestions: analysisData.suggestions || [],
      grammarIssues: analysisData.grammarIssues || [],
      formattingSuggestions: analysisData.formattingSuggestions || [],
      coverLetter: analysisData.coverLetter || "",
      interviewQuestions: analysisData.interviewQuestions || [],
    });

    const populated = await Analysis.findById(analysis._id)
      .populate("resume", "originalName")
      .populate("jobDescription", "title company");

    res.status(201).json({ success: true, analysis: populated });
  } catch (error) {
    console.error("Analysis error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.user.id,
    })
      .populate("resume", "originalName")
      .populate("jobDescription", "title company");

    if (!analysis) {
      return res
        .status(404)
        .json({ success: false, message: "Analysis not found" });
    }

    res.status(200).json({ success: true, analysis });
  } catch (error) {
    console.error("Get analysis error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user.id })
      .populate("resume", "originalName")
      .populate("jobDescription", "title company")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, count: analyses.length, analyses });
  } catch (error) {
    console.error("Get history error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
