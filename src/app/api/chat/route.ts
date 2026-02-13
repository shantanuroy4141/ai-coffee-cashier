import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured. Add it to .env.local" },
        { status: 500 }
      );
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Convert messages to Gemini format: array of { role, parts }
    const contents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    const text = response.text ?? "";

    return NextResponse.json({ message: text });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to process chat";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
