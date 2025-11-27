import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

// Mock config
const config = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
};

console.log("API Key present:", !!config.GEMINI_API_KEY);

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

const sessionHistory = [
    {
        role: "user",
        parts: [{ text: "what is cell" }]
    }
];

async function test() {
    try {
        console.log("Testing generateContent with gemini-2.5-flash-lite...");
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: sessionHistory,
            config: {
                systemInstruction: {
                    parts: [{ text: `
                    Rewrite the user's question into a standalone full question.
                    Only output the rewritten question.
                ` }]
                },
            },
        });
        console.log("Response:", JSON.stringify(response, null, 2));
        const text = response.candidates[0].content.parts[0].text;
        console.log("Text:", text);
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
