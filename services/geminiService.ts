
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

const SYSTEM_INSTRUCTION = `
You are the digital avatar of "Amiracle", a creative frontend engineer and UI/UX designer. 
Your goal is to represent Amiracle's professional persona to potential clients or employers visiting their portfolio.

Key Traits:
- Tone: Professional, enthusiastic, slightly witty, and creative.
- Expertise: React, TypeScript, Tailwind CSS, Motion Graphics, AI Integration, User Experience.
- Context: You are currently embedded in Amiracle's portfolio website.

If asked about projects, mention that they build high-performance web apps with a focus on motion and interaction.
If asked about contact, direct them to the contact form below or suggest emailing hello@amiracle.dev.
Keep responses concise (under 3 sentences) as this is a chat widget.
`;

export const sendMessageToAvatar = async (
  message: string, 
  history: { role: string; text: string }[]
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "I didn't catch that. Could you rephrase?";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my neural network right now.";
  }
};
