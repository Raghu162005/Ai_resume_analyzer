"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { Brain, Target, Lightbulb, ArrowRight, FileText, BarChart3, Zap } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-white/90">Powered by Google Gemini AI</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Optimize Your Resume with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                AI Analysis
              </span>
            </h1>

            <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Get instant feedback on your resume. Compare it against job descriptions,
              identify missing skills, and receive personalized improvement suggestions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  href="/analyze"
                  className="group flex items-center gap-2 bg-white text-primary-700 font-semibold py-3 px-8 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg"
                >
                  Start Analyzing
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="group flex items-center gap-2 bg-white text-primary-700 font-semibold py-3 px-8 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 border-2 border-white/30 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 transition-all duration-200"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-950 to-transparent" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Land Your Dream Job
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our AI-powered platform analyzes every aspect of your resume and provides actionable insights.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: "Smart AI Analysis",
              description:
                "Advanced AI evaluates your resume against job descriptions, providing an accurate match score and detailed feedback.",
              color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
            },
            {
              icon: Target,
              title: "Skill Gap Detection",
              description:
                "Identify exactly which skills you're missing for a role and get recommendations on how to acquire them.",
              color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
            },
            {
              icon: Lightbulb,
              title: "Improvement Suggestions",
              description:
                "Receive personalized tips on formatting, keywords, and content to make your resume stand out.",
              color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
            },
            {
              icon: BarChart3,
              title: "Track Progress",
              description:
                "Monitor your resume scores over time with a beautiful dashboard and historical charts.",
              color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
            },
            {
              icon: FileText,
              title: "Cover Letter Generation",
              description:
                "AI generates a tailored cover letter based on your resume and the target job description.",
              color: "text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400",
            },
            {
              icon: Zap,
              title: "Interview Prep",
              description:
                "Get AI-generated interview questions specific to the job you're applying for.",
              color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400",
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="card hover:shadow-lg transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Boost Your Resume?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who improved their resumes with AI-powered analysis.
          </p>
          {!user && (
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold py-3 px-8 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg"
            >
              Start for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© 2026 AI Resume Analyzer. Built with Next.js, Express, and Gemini AI.</p>
      </footer>
    </div>
  );
}
