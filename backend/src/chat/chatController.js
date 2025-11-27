import { config } from "../conf/config.js";
import { getPineconeIndex } from "../conf/pinecone.js";
import { Session } from "./chatModel.js";
import embeddings from "../utils/embeddings.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Helper function for retry logic


// ===================================================================================
//                                   CHAT CONTROLLER
// ===================================================================================

export const chat = async (req, res) => {
  const { sessionId, message } = req.body;
  const userId = req.user.sub; // From auth middleware

  if (!sessionId || !message) {
    return res.status(400).json({ error: "Session ID and message are required" });
  }

  try {
    // 1. Retrieve or Initialize Session History
    let session = await Session.findOne({ sessionId, userId });

    if (!session) {
      session = new Session({ sessionId, userId, messages: [] });
    }

    // Add User Message to History
    session.messages.push({ role: "user", content: message });
    
    // Update title if it's the first message
    if (session.messages.length === 1) {
      session.title = message.substring(0, 30) + (message.length > 30 ? "..." : "");
    }

    // 2. Generate Embedding for User Query
    const queryEmbedding = await embeddings.embedQuery(message);

    // 3. Query Pinecone for Context
    const index = await getPineconeIndex();
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: 3,
      includeMetadata: true,
    });

    const context = queryResponse.matches
      .map((match) => match.metadata.text)
      .join("\n\n");

    // 4. Construct Prompt with Context and History
    // Map history to Gemini format
    const historyForGemini = session.messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const systemInstruction = `You are a friendly, expert, and patient science tutor specifically for Class 9 & 10 students (ages 14-16).
    **Your Domain:** You ONLY answer questions related to Science (Physics, Chemistry, Biology) at the Class 9 & 10 level.
    **Tone & Method:** Maintain an encouraging and approachable tone. Use clear, simple language. If the student asks for a solution, provide hints and guide them conceptually first, rather than giving the final answer immediately. Use analogies from daily life to explain concepts.

    **Context Usage:**
    You have access to the following reference material (Context):
    ${context}

    **Instructions:**
    1.  **Check Domain Relevance:** Before answering, check if the user's question is related to Science.
        - If the question is about programming (e.g., Python code), history, or other non-science topics, politely reply: "I am a Science tutor for Class 9 & 10. I can only help you with Science topics. Please ask me something about Physics, Chemistry, or Biology."
        - Exception: General greetings (Hi, Hello) are allowed.
    2.  **Understand User Intent:** Use the **Conversation History** to understand follow-up questions (e.g., "explain more", "give details", "go deep dive") even if they contain typos. The user might be referring to the previous topic.
    3.  **Prioritize the Context:** If the question is relevant and the answer is in the Context, use it.
    4.  **Fallback to General Knowledge:** If the Context is missing the answer but the question is a valid Science question, use your own knowledge. Do NOT say "The Context information does not have any details". Just answer the question directly.

    **Response Structure (CRITICAL):**
    You MUST format your answers in a clear, structured way using Markdown:
    - **Headings:** Use bold headings for steps (e.g., **Step 1: Identify Reactants**, **Step 2: Balance Equation**).
    - **Bullet Points:** Use bullet points for lists.
    - **Bold Text:** Bold key terms and important concepts.
    - **Final Summary:** Always provide a **Final Answer** or **Conclusion** at the end.
    - **Example Format:**
      **Step 1: [Step Name]**
      [Explanation]
      
      **Step 2: [Step Name]**
      [Explanation]
      
      **Final Answer:**
      [Concise Answer]`;

    // 5. Generate Response using Gemini
    // We use the model directly but pass history in a way that respects the SDK's chat mode if possible,
    // or we can just use generateContent with the full history + system instruction.
    // The previous code used model.startChat which is cleaner for history management.
    
    const chatSession = model.startChat({
      history: historyForGemini.slice(0, -1), // Exclude the current user message from history for startChat
      generationConfig: {
        temperature: 0.7,
        topK: 0,
        topP: 0.95,
      },
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      }
    });

    const result = await chatSession.sendMessage(message); 
    const reply = result.response.text();

    // 6. Add Bot Reply to History
    session.messages.push({ role: "assistant", content: reply });
    session.updatedAt = Date.now();
    await session.save();

    // 7. Store Embeddings (Optional - for future retrieval)
    const userVector = await embeddings.embedQuery(message);
    const botVector = await embeddings.embedQuery(reply);

    await index.upsert([
      {
        id: `${sessionId}-${Date.now()}-user`,
        values: userVector,
        metadata: {
          sessionId,
          userId,
          role: "user",
          text: message,
        },
      },
      {
        id: `${sessionId}-${Date.now()}-assistant`,
        values: botVector,
        metadata: {
          sessionId,
          userId,
          role: "assistant",
          text: reply,
        },
      },
    ]);

    res.json({ reply });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ===================================================================================
//                                   GET CHAT HISTORY
// ===================================================================================

export const getHistory = async (req, res) => {
  const { sessionId } = req.query;
  const userId = req.user.sub;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  try {
    const session = await Session.findOne({ sessionId, userId });
    if (!session) {
      return res.json([]);
    }
    res.json(session.messages);
  } catch (error) {
    console.error("Get History Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ===================================================================================
//                                   GET ALL SESSIONS
// ===================================================================================

export const getAllSessions = async (req, res) => {
  const userId = req.user.sub;
  try {
    const sessions = await Session.find({ userId }).sort({ updatedAt: -1 });
    
    const formattedSessions = sessions.map(session => ({
      sessionId: session.sessionId,
      title: session.title || "New Chat",
      lastMessage: session.messages.length > 0 ? session.messages[session.messages.length - 1].content : ""
    }));

    res.json(formattedSessions);
  } catch (error) {
    console.error("Get All Sessions Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
