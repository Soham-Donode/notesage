import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, role } = await request.json();

    if (!prompt || !role) {
      return NextResponse.json({ error: "Prompt and role are required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const fullPrompt = `Generate comprehensive notes tailored for a ${role.toLowerCase()} on the topic: "${prompt}". 
    Structure the response in Markdown format with:
    - Headings for key concepts.
    - Bullet points for summaries and details.
    - Italicized sections for action items.
    Keep it concise yet informative (under 1000 words).`;

    const result = await model.generateContent(fullPrompt);
    const markdown = await result.response.text();

    return NextResponse.json({ markdown });
  } catch (error) {
    console.error("Gemini generation error:", error);
    return NextResponse.json({ error: "Failed to generate notes" }, { status: 500 });
  }
}