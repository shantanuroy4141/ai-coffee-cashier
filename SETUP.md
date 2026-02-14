# Aegean Brew — Setup Guide

## Quick start

**Option A (dev):** Run `npm run dev` → open **http://localhost:3000**

**Option B (production build):** Double-click **START-SERVER.command** → open **http://localhost:3001**

## If chat shows "having trouble" or errors

The AI needs a **Gemini API key**. Make sure:

1. **Get a free key** from [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a file named **.env.local** in this folder (same folder as package.json)
3. Add this line (use your actual key):
   ```
   GEMINI_API_KEY=your_key_here
   ```
4. **Stop the server** (close the terminal or Ctrl+C)
5. **Double-click START-SERVER.command** again to restart

## Staff access codes

- **Barista** (Customer + Barista tabs): `1234`
- **Owner** (all 3 tabs): `9999`

On the home page, click Barista or Owner to enter a code. Access is stored for the session.

## Voice mode

- **Speaking your order**: Uses your browser's microphone (Chrome works best)
- **AI responses**: Uses Eleven Labs if you add `ELEVEN_LABS_API_KEY` to .env.local, otherwise uses your browser's built-in voice

## Your .env.local should look like:

```
GEMINI_API_KEY=your_gemini_key_here
ELEVEN_LABS_API_KEY=your_elevenlabs_key_here
```

(Use your real keys. **Never commit .env.local** — it's in .gitignore. Copy from .env.example if needed.)

## Production deployment

`.env.local` is only used for local development (it's gitignored and not deployed). For production:

1. **Set environment variables** in your hosting platform:
   - **Vercel:** Project → Settings → Environment Variables
   - **Railway / Render / Netlify:** Project → Variables

2. **Required variables:**
   - `GEMINI_API_KEY` — for AI chat (get from [Google AI Studio](https://aistudio.google.com/apikey))
   - `ELEVEN_LABS_API_KEY` — for AI voice (get from [ElevenLabs](https://elevenlabs.io)); omit if you're fine with browser TTS only

3. **Optional:**
   - `ELEVEN_LABS_VOICE_ID` — defaults to a built-in voice if not set

Without these set in production, the chat will fail with "API key not configured" and voice will fall back to browser TTS (or fail if ElevenLabs is required).

**Important:** After adding variables, you must **Redeploy** — Vercel only injects env vars at build time.

## Vercel limitation: orders

Orders are stored in memory. On Vercel's serverless platform, each request can hit a different instance, so orders may not persist between customer/barista requests. For a real production deployment, add a database (Vercel KV, Supabase, etc.).
