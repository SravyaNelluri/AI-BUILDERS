import express from 'express';
import openai from '../configs/openai';

const router = express.Router();

const PRIMARY_MODEL = process.env.AI_MODEL || 'meta-llama/llama-3.1-8b-instruct';
const FALLBACK_MODEL = process.env.AI_FALLBACK_MODEL || 'meta-llama/llama-3.1-8b-instruct';
const MAX_TOKENS = Number(process.env.AI_MAX_TOKENS || '800');

async function runCompletion(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>) {
  try {
    return await openai.chat.completions.create({ model: PRIMARY_MODEL, max_tokens: MAX_TOKENS, messages });
  } catch (error: any) {
    const status = error?.status || error?.code;
    const message = error?.message || '';
    const isPaymentIssue = status === 402 || /requires more credits|Payment Required/i.test(message);
    if (isPaymentIssue) {
      return await openai.chat.completions.create({ model: FALLBACK_MODEL, max_tokens: Math.min(MAX_TOKENS, 800), messages });
    }
    throw error;
  }
}

// Public test endpoint to validate AI code generation without auth
router.post('/generate', async (req, res) => {
  try {
    const prompt: string = (req.body?.prompt || 'Portfolio landing page for Sravya Nelluri with hero, about, projects, contact') as string;
    const completion = await runCompletion([
      {
        role: 'system',
        content:
          'You are an expert web developer. Return ONLY a complete standalone HTML document using Tailwind CSS. Include JS in <script> before </body>. No markdown, no explanations.',
      },
      { role: 'user', content: prompt },
    ]);
    const code = completion.choices[0].message.content || '';
    const cleaned = code.replace(/```[a-z]*\n?/gi, '').replace(/```$/gi, '').trim();
    if (!cleaned) return res.status(500).json({ message: 'Empty response from model' });
    return res.json({ code: cleaned });
  } catch (error: any) {
    console.error('[test/generate] Error:', error?.message || error);
    return res.status(500).json({ message: error?.message || 'Unknown error' });
  }
});

module.exports = router;
