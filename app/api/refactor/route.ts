import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentMarkdown, refactorPrompt } = await request.json();

    if (!currentMarkdown || !refactorPrompt) {
      return NextResponse.json(
        { error: "Current notes and refactor prompt are required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const fullPrompt = `Refactor the following notes based on this instruction: "${refactorPrompt}".
    Original notes:
    ${currentMarkdown}

    Output only the refactored Markdown, maintaining structure with headings, bullets, and action items.`;

    const result = await model.generateContent(fullPrompt);
    const refactoredMarkdown = await result.response.text();

    return NextResponse.json({ markdown: refactoredMarkdown });
  } catch (error) {
    console.error("Gemini refactor error:", error);
    return NextResponse.json({ error: "Failed to refactor notes" }, { status: 500 });
  }
}