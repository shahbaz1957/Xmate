import pdfLoader from "./pdfLoader.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const pdfChunking = async () => {

  const allRawDocs = await pdfLoader();
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  const chunkedDocs = await textSplitter.splitDocuments(allRawDocs);
    console.log("pdf chukking done!!!")
  // console.log("Total chunks created:", chunkedDocs.length);
  return chunkedDocs;
};
export default pdfChunking;