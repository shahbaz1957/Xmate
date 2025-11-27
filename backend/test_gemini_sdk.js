import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testChat() {
  try {
    console.log("Starting chat test...");
    console.log("ai object keys:", Object.keys(ai));
    // const chatSession = ai.languageModel.startChat({ // This failed
    //    model: "gemini-2.0-flash",
    // });

    console.log("Chat session started.");
    console.log("Sending message...");
    
    // Test sendMessage
    const result = await chatSession.sendMessage("Hello, how are you?");
    console.log("Response:", result.response.text());
    
  } catch (error) {
    console.error("Error testing chat:", error);
  }
}

testChat();
