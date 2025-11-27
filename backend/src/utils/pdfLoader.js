import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";
import { fileURLToPath } from "url";

const loadPDFs = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const pdfFiles = [
      path.join(__dirname, "../uploads/class-9-science.pdf"),
      path.join(__dirname, "../uploads/NCERT-Class-10-Science.pdf"),
    ];

    let allDocs = [];

    for (const filePath of pdfFiles) {
      const loader = new PDFLoader(filePath);
      const docs = await loader.load();
      allDocs = allDocs.concat(docs);
    }

    console.log("PDF load done!");
    return allDocs;

  } catch (error) {
    console.error("Error while loading PDF files:", error.message);
    throw new Error("Failed to load PDFs");
  }
};

export default loadPDFs;
