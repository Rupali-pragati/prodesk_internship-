"use client";

import { useState, useCallback, useRef, FormEvent, ChangeEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* 
   Types */
type GenerationState =
  | { status: "idle" }
  | { status: "simulating" }
  | { status: "generating" }
  | { status: "done"; content: string }
  | { status: "error"; message: string };

interface CoverLetterFormData {
  name: string;
  role: string;
  company: string;
  skills: string;
}

/* 
   Phase 1 – Simulated template generator */
function simulateCoverLetter(data: CoverLetterFormData): string {
  const { name, role, company, skills } = data;
  const skillList = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return `Dear Hiring Manager at **${company}**,

I am writing to express my enthusiastic interest in the **${role}** position at ${company}. With a strong foundation in ${skillList.slice(0, 2).join(" and ")}${skillList.length > 2 ? `, as well as ${skillList.slice(2).join(", ")}` : ""}, I am confident that my expertise aligns perfectly with the requirements of this role.

Throughout my career, I have demonstrated the ability to deliver high-impact results by leveraging my technical and interpersonal skills. My experience in ${skillList[0] || "relevant technologies"} has enabled me to drive efficiency and innovation in every project I undertake.

I am particularly drawn to ${company} because of its reputation for excellence and commitment to pushing boundaries in the industry. I am eager to contribute my skills to a team that values creativity, collaboration, and continuous improvement.

Thank you for considering my application. I look forward to the opportunity to discuss how my background and skills would make me a valuable addition to the ${company} team.

Best regards,
**${name}**`;
}

/*Phase 2 & 3 – API call to /api/generate-cover-letter*/
async function callGenerateApi(
  data: CoverLetterFormData,
  resumeFile: File | null,
): Promise<string> {
  const body = new FormData();
  body.append("name", data.name);
  body.append("role", data.role);
  body.append("company", data.company);
  body.append("skills", data.skills);
  if (resumeFile) {
    body.append("resume", resumeFile);
  }

  const res = await fetch("/api/generate-cover-letter", {
    method: "POST",
    body,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `Server error (${res.status})`);
  }

  const json = await res.json();
  return json.coverLetter;
}

/*Main Page Component*/
export default function HomePage() {
  const [formData, setFormData] = useState<CoverLetterFormData>({
    name: "",
    role: "",
    company: "",
    skills: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [useAI, setUseAI] = useState(true);
  const [state, setState] = useState<GenerationState>({ status: "idle" });
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type === "application/pdf") {
        setResumeFile(file);
      }
    },
    [],
  );

  const removeFile = useCallback(() => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Validate
      if (
        !formData.name.trim() ||
        !formData.role.trim() ||
        !formData.company.trim() ||
        !formData.skills.trim()
      ) {
        setState({
          status: "error",
          message: "Please fill in all required fields.",
        });
        return;
      }

      if (useAI) {
        // Phase 2 / 3 – API call
        setState({ status: "generating" });
        try {
          const content = await callGenerateApi(formData, resumeFile);
          setState({ status: "done", content });
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Failed to generate cover letter.";
          setState({ status: "error", message });
        }
      } else {
        // Phase 1 – simulated template
        setState({ status: "simulating" });
        // Small delay to show the generating state
        await new Promise((r) => setTimeout(r, 800));
        const content = simulateCoverLetter(formData);
        setState({ status: "done", content });
      }

      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [formData, resumeFile, useAI],
  );

  const handleCopy = useCallback(async () => {
    if (state.status !== "done") return;
    try {
      await navigator.clipboard.writeText(state.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = state.content;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
      } catch {
        // Ignore fallback copy failures
      }
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [state]);

  const isGenerating =
    state.status === "simulating" || state.status === "generating";

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          AI Cover Letter Generator
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Generate professional, tailored cover letters in seconds.
          Powered by AI with optional resume parsing.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-5">
        {/* ── Form Column ── */}
        <section className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-5 text-xl font-semibold text-slate-800">
              Your Details
            </h2>

            {/* Candidate Name */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Candidate Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Job Role */}
            <div className="mb-4">
              <label
                htmlFor="role"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Job Role <span className="text-red-500">*</span>
              </label>
              <input
                id="role"
                name="role"
                type="text"
                required
                placeholder="e.g. Senior Frontend Engineer"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Target Company */}
            <div className="mb-4">
              <label
                htmlFor="company"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Target Company <span className="text-red-500">*</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                required
                placeholder="e.g. Acme Corp"
                value={formData.company}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Key Skills */}
            <div className="mb-5">
              <label
                htmlFor="skills"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Key Skills <span className="text-red-500">*</span>
              </label>
              <textarea
                id="skills"
                name="skills"
                required
                rows={3}
                placeholder="e.g. React, TypeScript, Node.js, PostgreSQL"
                value={formData.skills}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <p className="mt-1 text-xs text-slate-500">
                Separate skills with commas.
              </p>
            </div>

            {/* ── Phase 3 – Resume Upload ── */}
            <div className="mb-5">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Upload Resume <span className="text-xs font-normal text-slate-400">(PDF)</span>
              </label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-5 text-center transition ${
                  resumeFile
                    ? "border-green-400 bg-green-50"
                    : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                {resumeFile ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-green-700">
                      {resumeFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <svg
                      className="mb-2 h-8 w-8 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm text-slate-500">
                      Drag & drop your resume here, or click to browse
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </div>

            {/* ── Toggle: AI vs Simulation ── */}
            <div className="mb-5 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2">
              <span className="text-sm text-slate-700">
                Use AI Generation
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={useAI}
                onClick={() => setUseAI((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  useAI ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    useAI ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  {state.status === "generating"
                    ? "Generating with AI..."
                    : "Simulating..."}
                </>
              ) : (
                "Generate Cover Letter"
              )}
            </button>
          </form>
        </section>

        {/* ── Result Column ── */}
        <section ref={resultRef} className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">
                Generated Cover Letter
              </h2>

              {state.status === "done" && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
                >
                  {copied ? (
                    <>
                      <svg
                        className="h-4 w-4 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy to Clipboard
                    </>
                  )}
                </button>
              )}
            </div>

            {/* ── Content area ── */}
            <div className="min-h-[320px]">
              {/* Idle */}
              {state.status === "idle" && (
                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
                  <svg
                    className="mb-4 h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <p className="text-sm">
                    Fill in the form and click generate to see your cover letter here.
                  </p>
                </div>
              )}

              {/* Generating / Simulating */}
              {isGenerating && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <svg
                    className="mb-4 h-10 w-10 animate-spin text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <p className="text-sm font-medium text-slate-600">
                    {state.status === "generating"
                      ? "Generating your cover letter with AI..."
                      : "Simulating cover letter..."}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    This may take 2–5 seconds.
                  </p>
                </div>
              )}

              {/* Error */}
              {state.status === "error" && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h3 className="text-sm font-semibold text-red-800">
                        Generation Failed
                      </h3>
                      <p className="mt-1 text-sm text-red-700">
                        {state.message}
                      </p>
                      {state.message.includes("API key") && (
                        <p className="mt-2 text-xs text-red-600">
                          Tip: Set a valid <code className="rounded bg-red-100 px-1">GEMINI_API_KEY</code> in your{" "}
                          <code className="rounded bg-red-100 px-1">.env</code> file.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Done – render markdown */}
              {state.status === "done" && (
                <div className="prose prose-slate max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {state.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ── Footer ── */}
      <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} AI Cover Letter Generator. All rights reserved.
      </footer>
    </main>
  );
}