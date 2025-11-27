import pineIndex from "../conf/pinecone.js";
import embeddings from "./embeddings.js";
import { PineconeStore } from "@langchain/pinecone";
import pdfChunking from "./pdfParser.js";

const documentIndexing = async () => {

  const pdfChunks = await pdfChunking();
  const pineconeIndex = await pineIndex();
  await PineconeStore.fromDocuments(pdfChunks, embeddings, {
    pineconeIndex: pineconeIndex,
    maxConcurrency: 5,
  });

  console.log("Indexing done!!!");
};

documentIndexing();
