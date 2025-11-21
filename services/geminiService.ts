import { GoogleGenAI } from "@google/genai";
import { AIRequestType } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the client only if the key is present (handled gracefully in UI if not)
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateBusinessContent = async (
  prompt: string,
  type: AIRequestType
): Promise<string> => {
  if (!ai) {
    return "API Key is missing. Please configure process.env.API_KEY to use AI features.";
  }

  try {
    // Tailor the system instruction based on the enterprise context
    const systemInstruction = `You are an elite enterprise consultant for a high-end SaaS platform. 
    Your tone is professional, concise, and data-driven. 
    Context: The user is performing a '${type}' task within a multi-tenant dashboard.
    Provide actionable, clear output formatted in Markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while generating content. Please try again later.";
  }
};
