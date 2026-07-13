import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Cover Letter Generator | SaaS Platform",
  description:
    "Generate professional, tailored cover letters using AI. Upload your resume and job details for highly contextualized outputs.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
