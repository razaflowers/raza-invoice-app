
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is set in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function suggestCardMessage(language: string): Promise<string> {
    if (!apiKey) {
        return language === 'ar' 
            ? "مع خالص الحب وأجمل الأمنيات." 
            : "With heartfelt condolences and deepest sympathy.";
    }
    
    try {
        const prompt = language === 'ar'
            ? "اقترح رسالة تهنئة قصيرة وأنيقة ومناسبة لبطاقة إهداء مع باقة ورد. يجب أن تكون الرسالة من جملة أو جملتين. لا تقم بتضمين اقتباسات أو مقدمات."
            : "Generate a short, elegant, and heartfelt greeting message suitable for a card accompanying a bouquet of flowers. The message should be one or two sentences long. Do not include quotes or any preamble.";

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.8,
            }
        });
        
        const text = response.text;

        if (!text) {
            console.error("Gemini API returned an empty response.");
            throw new Error("Failed to generate message from AI: Empty response.");
        }

        // Basic cleanup for the model's response
        return text.trim().replace(/\"/g, '');

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate message from AI.");
    }
}