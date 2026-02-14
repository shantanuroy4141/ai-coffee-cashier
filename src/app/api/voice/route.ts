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

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_22050_32`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_LABS_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Eleven Labs API error:", response.status, errorText);
      let errDetail = "Failed to synthesize speech";
      try {
        const errJson = JSON.parse(errorText);
        errDetail = errJson.detail?.message || errJson.message || errorText.slice(0, 200);
      } catch {
        errDetail = errorText.slice(0, 200) || errDetail;
      }
      return NextResponse.json(
        { error: errDetail },
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
