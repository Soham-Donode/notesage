import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Note from '@/models/Note';

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, role } = await request.json();

    if (!prompt || !role) {
      return NextResponse.json({ error: "Prompt and role are required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

   // ─────────────────────────────────────────────────────────────────────────────
//  Inside POST() – replace the existing `fullPrompt` construction
// ─────────────────────────────────────────────────────────────────────────────
const roleInstructions: Record<string, string> = {
  student: `
- **Focus on learning outcomes**: explain concepts with simple analogies, mnemonics, and step-by-step derivations.
- **Include practice problems** (at least 3) with **solutions** and **common pitfalls**.
- **Highlight exam-style questions** and key formulas in **bold**.
- *Action items*: create flashcards, schedule review sessions, try the practice set.
  `.trim(),

  teacher: `
- **Emphasise pedagogy**: provide lesson-plan structure, timing, and differentiation ideas for mixed-ability classes.
- **Supply ready-to-use teaching aids**: slide bullet points, discussion prompts, and assessment rubrics.
- **Add extension activities** for advanced students and remediation for struggling ones.
- *Action items*: prepare handouts, schedule a demo, adapt for online vs in-person delivery.
  `.trim(),

  researcher: `
- **Prioritise rigour**: cite seminal papers (title + year), outline open research questions, and include methodology checklists.
- **Add data-analysis snippets** (pseudocode or short Python/R) and reproducibility tips.
- **Include a “future work” section**.
- *Action items*: draft a literature-review table, set up a replication repo, write a grant proposal outline.
  `.trim(),

  developer: `
- **Focus on implementation**: provide **code skeletons** (language-agnostic + one concrete example in the most relevant stack).
- **Detail performance considerations**, edge-case handling, testing strategy (unit + integration), and CI/CD hooks.
- **Include architecture diagrams** (Mermaid syntax) and API contract examples.
- *Action items*: scaffold the repo, write the first failing test, benchmark the naive vs optimised version.
  `.trim(),
};

const basePrompt = `
Generate **comprehensive notes** tailored for a **${role.toLowerCase()}** on the topic: "${prompt}".
${roleInstructions[role] ?? ""}
`.trim();

const result = await model.generateContent(basePrompt);
    const markdown = await result.response.text();

    // Save to database
    await dbConnect();

    const user = await User.findOne({
      'authProvider.provider': 'clerk',
      'authProvider.providerUserId': clerkId,
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const note = await Note.create({
      userId: user._id,
      title: prompt,
      content: markdown,
      role,
      tags: [],
    });

    return NextResponse.json({ markdown, noteId: note._id });
  } catch (error) {
    console.error("Gemini generation error:", error);
    return NextResponse.json({ error: "Failed to generate notes" }, { status: 500 });
  }
}