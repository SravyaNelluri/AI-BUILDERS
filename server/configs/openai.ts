import OpenAI from 'openai';

if (!process.env.AI_API_KEY) {
  console.error('[openai] WARNING: AI_API_KEY not set');
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.AI_API_KEY || 'dummy-key',
  maxRetries: 0,
  defaultHeaders: {
    "HTTP-Referer": process.env.BETTER_AUTH_URL || "http://localhost:3000",
    "X-Title": "AI Portfolio Generator"
  }
});
module.exports = openai;