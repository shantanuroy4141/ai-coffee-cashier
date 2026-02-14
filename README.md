# Aegean Brew — AI Coffee Cashier

AI-powered coffee ordering app with voice/chat ordering, barista queue, and owner dashboard.

## Quick start

1. Copy `.env.example` to `.env.local` and add your API keys (see [SETUP.md](./SETUP.md))
2. Run `npm install`
3. Run `npm run dev` and open http://localhost:3000

Or double-click **START-SERVER.command** for a production build on port 3001.

## Features

- **Customer**: Order by voice or chat (Gemini AI)
- **Order Online**: Visual menu with drink configurator and cart
- **Barista**: Order queue with status updates (pending → making → done)
- **Owner**: Dashboard with sales metrics
- **Voice**: ElevenLabs TTS for AI responses (optional)

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | For AI chat — [Google AI Studio](https://aistudio.google.com/apikey) |
| `ELEVEN_LABS_API_KEY` | For voice | For AI voice responses — [ElevenLabs](https://elevenlabs.io) |
| `ELEVEN_LABS_VOICE_ID` | No | Custom voice ID (optional) |

See [SETUP.md](./SETUP.md) for full setup and production deployment (Vercel, etc.).
