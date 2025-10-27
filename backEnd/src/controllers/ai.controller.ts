import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const aiApi = async (req: Request, res: Response) => {
  const { link, type } = req.body;

  if (!link || !type) {
    return res.status(400).json({ message: 'Missing link or type' });
  }

  let prompt = '';
  switch (type.toLowerCase()) {
    case 'roast':
      prompt = `🔥😂 Roast this portfolio humorously: ${link}. Make it funny, sarcastic, full of emojis 😎🔥, engaging, around 1500-3000 characters. Keep sentences complete, do not cut mid-sentence.`;
      break;
    case 'rating':
      prompt = `⭐💻 Rate this portfolio: ${link}. Give a fun, human-readable evaluation with emojis 🎯💡. Include key points about design, UX, performance, and content. Around 2000-4000 characters. Keep sentences complete and readable.`;
      break;
    default:
      prompt = `👍💡 Give a thorough, helpful review for: ${link}. Engaging, emoji-rich 😄✨. Include strengths, weaknesses, and suggestions. Around 2500-5000 characters. Make sure sentences are complete and readable, no half-baked cuts.`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // Ensure we don't cut mid-sentence
    let text: string = typeof response.text === 'string' ? response.text : '';
    const maxLength = 5000; // maximum chars

    if (text.length > maxLength) {
      // Trim at last full stop before maxLength
      const truncated = text.slice(0, maxLength);
      const lastPeriod = truncated.lastIndexOf('.');
      text =
        lastPeriod > 0 ? truncated.slice(0, lastPeriod + 1) : truncated + '...';
    }

    res.json({ reply: text });
  } catch (err: any) {
    console.error('Gemini API error:', err);
    res.status(500).json({ message: 'AI request failed' });
  }
};
