import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";

export async function POST(request: NextRequest) {
  try {
    const apiKey = (process.env.GEMINI_API_KEY ?? "").trim();
    if (!apiKey) {
      const hint = process.env.VERCEL
        ? "Set GEMINI_API_KEY in your Vercel project's Environment Variables."
        : "Add GEMINI_API_KEY to .env.local and restart the server.";
      return NextResponse.json(
        { error: `GEMINI_API_KEY is not configured. ${hint}` },
        { status: 500 }
      );
    }

    let body: { messages?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }
    const { messages } = body ?? {};

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Convert messages to Gemini format: array of { role, parts }
    // Filter empty messages; Gemini expects role + parts
    const contents = messages
      .filter((msg: { role?: string; content?: string }) => msg?.content?.trim())
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: String(msg.content).trim() }],
      }));

    if (contents.length === 0) {
      return NextResponse.json(
        { error: "No valid messages to send" },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    const text = response.text ?? "";
    // Handle blocked/empty responses
    if (!text.trim()) {
      return NextResponse.json(
        { error: "No response from the model. The content may have been filtered." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: text });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    let message = err.message;
    if (message.includes("403") || message.includes("API key")) {
      message = "Invalid or expired API key. Get a new one at aistudio.google.com/apikey";
    } else if (message.includes("429")) {
      message = "Rate limit hit. Try again in a minute.";
    }
    // Otherwise pass through the actual error so you can see what's really wrong
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
