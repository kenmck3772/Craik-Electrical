
import { GoogleGenAI, Type } from "@google/genai";
import { MessageRole, ChatMessage } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the AI Assistant for "Craik Electrical Ltd.", a professional NICEIC-approved electrical contractor based in Montrose, Scotland. 
Your goal is to provide helpful, safe, and preliminary electrical advice to potential customers.

IMPORTANT SAFETY RULES:
1. ALWAYS prioritize safety. If a situation sounds dangerous (smoke, sparks, wet electricity, exposed wires), tell the user to IMMEDIATELY turn off the power at the main switch and call a professional.
2. NEVER give instructions that would require an unqualified person to open electrical panels or handle live wires.
3. Remind users that for any permanent installation or repair, they should hire a qualified electrician like Stuart Craik.
4. Mention that Craik Electrical Ltd. provides free estimates and can be reached at 07748 317766.

Keep your tone professional, friendly, and local to Montrose.
`;

export async function getElectricalAdvice(history: ChatMessage[]): Promise<string> {
  try {
    const contents = history.map(msg => ({
      role: msg.role === MessageRole.USER ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Use ai.models.generateContent to query GenAI with both the model name and prompt.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    // The GenerateContentResponse object features a text property (not a method).
    return response.text || "I'm sorry, I'm having trouble connecting right now. Please call Stuart directly for immediate assistance.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I encountered an error. Please contact Craik Electrical Ltd. directly at 07748 317766 for advice.";
  }
}
