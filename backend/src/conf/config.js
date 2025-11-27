import { config as conf } from "dotenv";

conf({
  path:"../../.env",
});

const _config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  MONGO_URL: process.env.MONGO_URL,
  PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME,
  PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY,
  PINECONE_CONTROLLER_URL:process.env.PINECONE_CONTROLLER_URL,
};

export const config = Object.freeze(_config);
