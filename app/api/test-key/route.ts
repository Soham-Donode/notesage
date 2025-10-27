import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not loaded (undefined or empty).");
    return NextResponse.json({ 
      status: "error", 
      message: "API key not found. Check .env.local and restart server." 
    }, { status: 500 });
  }

  console.log("GEMINI_API_KEY loaded successfully (length:", apiKey.length, "characters).");
  return NextResponse.json({ 
    status: "success", 
    message: "API key is properly loaded." 
  });
}