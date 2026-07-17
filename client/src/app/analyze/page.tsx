"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import FileDropzone from "@/components/FileDropzone";
import ScoreRing from "@/components/ScoreRing";
import SkillTag from "@/components/SkillTag";
import LoadingSpinner from "@/components/LoadingSpinner";
import { resume, analysis } from "@/lib/api";
import toast from "react-hot-toast";
import {
  Upload,
  FileText,
  Send,
  ChevronDown,
  ChevronUp,
  Download,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  PenTool,
  Briefcase,
  ArrowRight,
  X,
  Loader2,
} from "lucide-react";

interface Resume {
  _id: string;
  filename: string;
  originalName: string;
  uploadDate: string;
}

interface AnalysisResult {
  _id: string;
  matchScore: number;
  atsScore: number;
  skillsMatched: string[];
  missingSkills: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  summary: string;
  suggestions: string[];
  grammarIssues: string[];
  formattingSuggestions: string[];
  coverLetter: string;
  interviewQuestions: string[];
  createdAt: string;
}

export default function AnalyzePage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jdTitle, setJdTitle] = useState("");
  const [jdCompany, setJdCompany] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [showInterviewQ, setShowInterviewQ] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);

  useEffect(() => {
    const resultId = searchParams.get("result");
    if (resultId) {
      setLoadingExisting(true);
      analysis
        .getOne(resultId)
        .then((res) => {
          setResult(res.data.analysis);
          setStep(3);
        })
        .catch(() => toast.error("Failed to load analysis"))
        .finally(() => setLoadingExisting(false));
      return;
    }

    resume.getAll().then((res) => setResumes(res.data.resumes)).catch(() => {});
  }, [searchParams]);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setSelectedResumeId("");
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const handleAnalyze = async () => {
    if (!selectedResumeId && !uploadedFile) {
      toast.error("Please upload or select a resume");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    setAnalyzing(true);

    try {
      let resumeId = selectedResumeId;

      if (uploadedFile) {
        const uploadRes = await resume.upload(uploadedFile);
        resumeId = uploadRes.data.resume._id;
      }

      const jdRes = await fetch("/api/job-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: jdTitle,
          company: jdCompany,
          description: jobDescription,
        }),
      });

      if (!jdRes.ok) throw new Error("Failed to save job description");
      const jdData = await jdRes.json();

      const analysisRes = await analysis.create({
        resumeId,
        jobDescriptionId: jdData.jobDescription._id,
      });

      setResult(analysisRes.data.analysis);
      setStep(3);
      toast.success("Analysis complete!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const downloadReport = () => {
    if (!result) return;

    let report = `AI RESUME ANALYSIS REPORT\n`;
    report += `${"=".repeat(50)}\n`;
    report += `Date: ${new Date(result.createdAt).toLocaleDateString()}\n\n`;
    report += `SCORES\n${"-".repeat(30)}\n`;
    report += `Match Score: ${result.matchScore}%\n`;
    report += `ATS Score: ${result.atsScore}%\n\n`;
    report += `SUMMARY\n${"-".repeat(30)}\n${result.summary}\n\n`;
    report += `MATCHED SKILLS\n${"-".repeat(30)}\n`;
    result.skillsMatched.forEach((s) => (report += `  ✓ ${s}\n`));
    report += `\nMISSING SKILLS\n${"-".repeat(30)}\n`;
    result.missingSkills.forEach((s) => (report += `  ✗ ${s}\n`));
    report += `\nSUGGESTIONS\n${"-".repeat(30)}\n`;
    result.suggestions.forEach((s, i) => (report += `  ${i + 1}. ${s}\n`));
    if (result.grammarIssues.length) {
      report += `\nGRAMMAR ISSUES\n${"-".repeat(30)}\n`;
      result.grammarIssues.forEach((s) => (report += `  - ${s}\n`));
    }
    if (result.formattingSuggestions.length) {
      report += `\nFORMATTING SUGGESTIONS\n${"-".repeat(30)}\n`;
      result.formattingSuggestions.forEach((s) => (report += `  - ${s}\n`));
    }
    if (result.coverLetter) {
      report += `\nCOVER LETTER\n${"-".repeat(30)}\n${result.coverLetter}\n`;
    }
    if (result.interviewQuestions.length) {
      report += `\nINTERVIEW QUESTIONS\n${"-".repeat(30)}\n`;
      result.interviewQuestions.forEach((q, i) => (report += `  ${i + 1}. ${q}\n`));
    }

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-analysis-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loadingExisting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analyze Resume
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Upload your resume and paste a job description to get AI-powered feedback
          </p>
        </div>

        {!result && (
          <div className="flex items-center gap-2 mb-8">
            {[
              { num: 1, label: "Resume" },
              { num: 2, label: "Job Description" },
              { num: 3, label: "Results" },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    step >= s.num
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }`}
                >
                  {s.num}
                </div>
                <span
                  className={`text-sm font-medium ${
                    step >= s.num
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
                {i < 2 && (
                  <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 mx-1" />
                )}
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary-600" />
                Upload New Resume
              </h2>
              {uploadedFile ? (
                <div className="flex items-center justify-between bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <FileDropzone onFile={handleFileUpload} />
              )}
            </div>

            {resumes.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  Or Select Previous Resume
                </h2>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {resumes.map((r) => (
                    <label
                      key={r._id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedResumeId === r._id
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="resume"
                        value={r._id}
                        checked={selectedResumeId === r._id}
                        onChange={(e) => {
                          setSelectedResumeId(e.target.value);
                          setUploadedFile(null);
                        }}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <FileText className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {r.originalName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(r.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedResumeId && !uploadedFile}
                className="btn-primary flex items-center gap-2"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary-600" />
                Job Description
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Job Title (optional)
                    </label>
                    <input
                      type="text"
                      value={jdTitle}
                      onChange={(e) => setJdTitle(e.target.value)}
                      className="input-field"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Company (optional)
                    </label>
                    <input
                      type="text"
                      value={jdCompany}
                      onChange={(e) => setJdCompany(e.target.value)}
                      className="input-field"
                      placeholder="e.g. Google"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Job Description *
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="input-field min-h-[200px] resize-y"
                    placeholder="Paste the full job description here..."
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="btn-secondary">
                Back
              </button>
              <button
                onClick={handleAnalyze}
                disabled={!jobDescription.trim() || analyzing}
                className="btn-primary flex items-center gap-2"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 3 && result && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setResult(null);
                  setStep(1);
                  setUploadedFile(null);
                  setSelectedResumeId("");
                  setJobDescription("");
                  router.push("/analyze");
                }}
                className="btn-secondary"
              >
                New Analysis
              </button>
              <button
                onClick={downloadReport}
                className="btn-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>

            <div className="card">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
                <ScoreRing score={result.matchScore} label="Match Score" />
                <ScoreRing score={result.atsScore} label="ATS Score" size={100} strokeWidth={6} />
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Summary
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {result.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Matched Skills ({result.skillsMatched.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                  {result.skillsMatched.map((skill, i) => (
                    <SkillTag key={i} skill={skill} type="matched" />
                  ))}
                  {result.skillsMatched.length === 0 && (
                    <p className="text-sm text-gray-400">No matched skills found</p>
                  )}
                </div>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Missing Skills ({result.missingSkills.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map((skill, i) => (
                    <SkillTag key={i} skill={skill} type="missing" />
                  ))}
                  {result.missingSkills.length === 0 && (
                    <p className="text-sm text-gray-400">No missing skills</p>
                  )}
                </div>
              </div>
            </div>

            {result.matchedKeywords.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Keyword Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Matched Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.matchedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded text-xs"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Missing Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.missingKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded text-xs"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Improvement Suggestions
              </h2>
              <ul className="space-y-3">
                {result.suggestions.map((suggestion, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-gray-600 dark:text-gray-400"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {result.grammarIssues.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-orange-500" />
                  Grammar Issues
                </h2>
                <ul className="space-y-2">
                  {result.grammarIssues.map((issue, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <span className="text-orange-500">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.formattingSuggestions.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-blue-500" />
                  Formatting Suggestions
                </h2>
                <ul className="space-y-2">
                  {result.formattingSuggestions.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <span className="text-blue-500">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.coverLetter && (
              <div className="card">
                <button
                  onClick={() => setShowCoverLetter(!showCoverLetter)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-500" />
                    Generated Cover Letter
                  </h2>
                  {showCoverLetter ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {showCoverLetter && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                      {result.coverLetter}
                    </p>
                  </div>
                )}
              </div>
            )}

            {result.interviewQuestions.length > 0 && (
              <div className="card">
                <button
                  onClick={() => setShowInterviewQ(!showInterviewQ)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                    Interview Questions ({result.interviewQuestions.length})
                  </h2>
                  {showInterviewQ ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {showInterviewQ && (
                  <ul className="mt-4 space-y-3">
                    {result.interviewQuestions.map((q, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{q}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
