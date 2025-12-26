
import { GoogleGenAI } from "@google/genai";

const LOCAL_REFLECTIONS: Record<string, string[]> = {
  love: [
    "Shreya, nine months isn't just a count of days; it's a collection of every heartbeat I've shared with you. You are my home.",
    "Being with you feels like finding a star that was meant for me all along. I love you, Jaana.",
    "Nine months of you. Nine months of us. It's the most beautiful story I've ever been a part of."
  ],
  future: [
    "I see a thousand years in your eyes, and every single one of them belongs to us. Our future is bright, Shreya.",
    "Wherever we go next, as long as your hand is in mine, I'm exactly where I need to be.",
    "The dreams we're building today are the constellations of our tomorrow. I'm so excited for everything next."
  ],
  home: [
    "Home isn't a place, it's the way you say my name. Thank you for being my peace for nine beautiful months.",
    "With you, the world is quiet and everything makes sense. You are my sanctuary, Jaana.",
    "I've traveled the stars in my head, but I always find my way back to your laugh. That's my home."
  ],
  default: [
    "Nine months together, and my heart still skips a beat when you smile. You are my everything.",
    "Every day with you is a gift I never expected but always needed. Happy 9 months, Shreya.",
    "You are the best thing that ever happened to my universe. I love you more than words can trace."
  ]
};

const LOCAL_ADVICE = [
  "Take a deep breath and remember the first time we laughed together. The warmth is still there.",
  "Look at the stars. See how they stay together? We are just like them. Quiet and constant.",
  "Sometimes the silence between us is just love resting. Lean into it.",
  "Speak with kindness; your voice is the melody that calms my world.",
  "Whatever is heavy right now, let's carry it together. That's what we do."
];

export const getHeartReflection = async (theme: string, cache: any[] = []): Promise<{ content: string; source: 'api' | 'cache' | 'local' }> => {
  const apiKey = process.env.API_KEY;
  const normalizedTheme = theme.toLowerCase().trim();

  // 1. Try Live API if Key exists
  if (apiKey && apiKey !== "undefined") {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `You are Sarib, writing a deeply intimate, warm paragraph for Shreya on their 9-month anniversary. Theme: "${theme}". Speak to her as "Jaana". Max 100 words.`,
      });
      if (response.text) return { content: response.text, source: 'api' };
    } catch (e) {
      console.warn("API Failed, falling back to cache/local");
    }
  }

  // 2. Try Local Cache (Training data from previous sessions)
  const cached = cache.find(w => normalizedTheme.includes(w.theme) || w.theme.includes(normalizedTheme));
  if (cached) return { content: cached.content, source: 'cache' };

  // 3. Fallback to Local Soul
  const keys = Object.keys(LOCAL_REFLECTIONS);
  const matchedKey = keys.find(k => normalizedTheme.includes(k));
  const pool = matchedKey ? LOCAL_REFLECTIONS[matchedKey] : LOCAL_REFLECTIONS.default;
  const random = pool[Math.floor(Math.random() * pool.length)];
  
  return { content: random, source: 'local' };
};

export const getConflictGuidance = async (description: string): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (apiKey && apiKey !== "undefined") {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Relationship advice for Sarib and Shreya. They are feeling: "${description}". One sentence of warmth. Max 15 words.`,
      });
      if (response.text) return response.text;
    } catch (e) {}
  }

  return LOCAL_ADVICE[Math.floor(Math.random() * LOCAL_ADVICE.length)];
};
