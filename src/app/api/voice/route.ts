import { NextRequest, NextResponse } from "next/server";

const ELEVEN_LABS_API_KEY = (process.env.ELEVEN_LABS_API_KEY ?? "").trim();
const VOICE_ID = process.env.ELEVEN_LABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (!ELEVEN_LABS_API_KEY) {
      return NextResponse.json(
        { error: "Eleven Labs API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVEN_LABS_API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Eleven Labs API error:", errorText);
      return NextResponse.json(
        { error: "Failed to synthesize speech" },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error: unknown) {
    console.error("Voice API error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to synthesize speech";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
