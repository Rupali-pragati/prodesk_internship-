import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

/* 
   PDF parsing helper (runs server-side)
   */
async function extractTextFromPdf(
  buffer: Buffer,
): Promise<string> {
  try {
    // pdf-parse v2 exports a PDFParse class
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText();
    await parser.destroy();
    // result.text is the concatenated document string
    return result.text;
  } catch {
    return "";
  }
}

/* ──────────────────────────────────────────────────────────────
   POST /api/generate-cover-letter
   ────────────────────────────────────────────────────────────── */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string | null;
    const role = formData.get("role") as string | null;
    const company = formData.get("company") as string | null;
    const skills = formData.get("skills") as string | null;
    const resumeFile = formData.get("resume") as File | null;

    // Validate required fields
    if (!name || !role || !company || !skills) {
      return NextResponse.json(
        { error: "Missing required fields: name, role, company, skills" },
        { status: 400 },
      );
    }

    // Extract resume text if a PDF was uploaded
    let resumeText = "";
    if (resumeFile && resumeFile.type === "application/pdf") {
      const arrayBuffer = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      resumeText = await extractTextFromPdf(buffer);
    }

    // ── Build the prompt ────────────────────────────────────
    const systemPrompt = `You are an expert career coach and professional cover letter writer. 
Your task is to write a compelling, professional cover letter tailored to the following details.

**Candidate Name:** ${name}
**Job Role:** ${role}
**Target Company:** ${company}
**Key Skills:** ${skills}

${
  resumeText
    ? `**Resume / Experience Context:**\n${resumeText.slice(0, 4000)}\n`
    : ""
}

**Guidelines:**
- Write in a professional, confident, and enthusiastic tone.
- Address the hiring manager directly.
- Mention the candidate's relevant skills and how they map to the role.
- Reference the target company's reputation or industry to show genuine interest.
- Keep the letter to 3–4 concise paragraphs.
- Output the letter in **Markdown** format (use headers, bold, paragraphs as appropriate).
- Do NOT include a placeholder for date or contact info at the top — just the body of the letter.
- Sign off with the candidate's name.`;

    // ── Call Gemini API ─────────────────────────────────────
    console.log("API KEY:", process.env.GEMINI_API_KEY);
    const apiKey = process.env.GEMINI_API_KEY;

    console.log("========== ENV CHECK ==========");
    console.log("GEMINI_API_KEY:", apiKey);
    console.log("All GEMINI vars:", Object.keys(process.env).filter(k => k.includes("GEMINI")));
    console.log("===============================");

    if (!apiKey || apiKey === "AQ.Ab8RN6K73Ks7iVSa4rMsZ8DW0QvSrLJd-RXn25fw3hspJwNCiQE") {
      return NextResponse.json(
        {
          error:
            "API key not configured. Set a valid GEMINI_API_KEY in your .env file.",
        },
        { status: 500 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    const coverLetter = response.text();

    return NextResponse.json({ coverLetter });
  } catch (error: unknown) {
  console.error("========== FULL GOOGLE ERROR ==========");
  console.dir(error, { depth: null });
  console.error("=======================================");

  const message =
    error instanceof Error
      ? error.message
      : JSON.stringify(error, null, 2);

  return NextResponse.json(
    {
      error: message,
    },
    { status: 500 }
  );
}
}
