import 'dotenv/config';

console.log("Checking Environment Variables:");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URL:", process.env.MONGO_URL ? "SET" : "NOT SET");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "SET" : "NOT SET");
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "SET" : "NOT SET");
