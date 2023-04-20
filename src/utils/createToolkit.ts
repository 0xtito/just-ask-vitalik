import { PromptTemplate } from "langchain/prompts";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { CallbackManager } from "langchain/callbacks";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { VectorStoreQATool } from "langchain/tools";
import { SerpAPI } from "langchain/tools";

// import { authorPrefixPrompts } from "./constants";
import { openai } from "./clients/openai-client";
import { supabase } from "./clients/supabase-client";
import { OpenAI } from "langchain";

// import { LibraryTool } from "./tools/LibraryTool";
// import { ArticleExtractionTool } from "@/utils/tools/ArticalExtractionTool";

export async function createToolkit() {
  /**
   * I will be creating two tools:
   *  1. To search through the Vitalik's essays
   *  2. To search online to quickly get information about a topic not in his essays (experimental)
   */

  const vs = await SupabaseVectorStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    {
      client: supabase,
      tableName: `vitalik_essays`,
      queryName: "match_documents",
    }
  );

  // testing how langchain's vectorstoreqa tool works
  // will probably need to create a custom tool for this
  const libraryTool = new VectorStoreQATool(
    "My Essays",
    `Useful for when you need to answer questions about your essays. Whenever you need information about your essays you should ALWAYS use this. Input should be a fully formed question.`,
    {
      vectorStore: vs,
      llm: openai,
    }
  );

  const serpTool = new SerpAPI(process.env.SERPAPI_API_KEY, {
    location: "United States",
    hl: "en",
    gl: "us",
  });

  return [libraryTool, serpTool];
}
