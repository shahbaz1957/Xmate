import { config } from '../conf/config.js';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';


  const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey:config.GEMINI_API_KEY,
      model: 'text-embedding-004',
    });

    export default embeddings