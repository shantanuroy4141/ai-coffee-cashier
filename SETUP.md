# Aegean Brew — Setup Guide

## Quick start

1. Double-click **START-SERVER.command**
2. Wait until you see "Ready"
3. Open **http://localhost:3001** in your browser

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

## Voice mode

- **Speaking your order**: Uses your browser's microphone (Chrome works best)
- **AI responses**: Uses Eleven Labs if you add `ELEVEN_LABS_API_KEY` to .env.local, otherwise uses your browser's built-in voice

## Your .env.local should look like:

```
GEMINI_API_KEY=AIzaSy...
ELEVEN_LABS_API_KEY=sk_...
```

(Use your real keys. This file is ignored by git and won't be uploaded.)
