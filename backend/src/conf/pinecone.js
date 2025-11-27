

import { config } from "./config.js";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

let index;

export function getPineconeIndex() {
  if (index) return index;

  const pinecone = new PineconeClient({
    apiKey: config.PINECONE_API_KEY,
  });
  index = pinecone.Index(config.PINECONE_INDEX_NAME);

  return index;
}