
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getHeartReflection = async (theme: string): Promise<string> => {
  if (!process.env.API_KEY) return "The stars are quiet today. (Add API Key)";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are Sarib, writing a deeply intimate, warm, and cozy heart-to-heart paragraph for Shreya on their 9-month anniversary. The theme is: "${theme}". Speak directly to her. Use "Jaana" or "Shreya". Mention how much she means to you and how these 9 months have changed you. Keep it to one beautiful, flowing paragraph (max 120 words).`,
      config: { temperature: 1, topP: 0.95 }
    });
    return response.text || "Every moment with you is a gift I cherish beyond words.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Even when the words fail, my heart knows exactly how much it loves you. Happy 9 months, Jaana.";
  }
};

export const getConflictGuidance = async (sketchDescription: string): Promise<string> => {
  if (!process.env.API_KEY) return "The stars are quiet today.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a warm, wise relationship guide. Shreya/Sarib is feeling: "${sketchDescription}". Suggest 1 kind, cozy piece of advice to bring them back to warmth. Max 15 words. Speak like a friend who loves them.`,
      config: { temperature: 1 }
    });
    return response.text || "Take a deep breath together. You are each other's home.";
  } catch (error) {
    return "Let's find peace in each other's presence and reconnect through shared love.";
  }
};
