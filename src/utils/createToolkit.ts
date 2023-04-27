import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { VectorStoreQATool } from "langchain/tools";
import { SerpAPI } from "langchain/tools";

import { supabase } from "./clients/supabase-client";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatHistoryTool } from "./tools/ChatHistoryTool";
import { BufferMemory } from "langchain/memory";

export async function createToolkit(
  openai: ChatOpenAI,
  key: string,
  memory: BufferMemory
) {
  /**
   * I will be creating two tools:
   *  1. To search through the Vitalik's essays
   *  2. To search online to quickly get information about a topic not in his essays (experimental)
   */

  const vs = await SupabaseVectorStore.fromExistingIndex(
    new OpenAIEmbeddings({
      openAIApiKey: key,
    }),
    {
      client: supabase,
      tableName: `vitalik_essays`,
      queryName: "match_documents",
    }
  );

  const libraryTool = new VectorStoreQATool(
    "My Essays Tool",
    `Useful for when you need to answer questions about your essays. Whenever you need information about your essays you should ALWAYS use this. Input should be a fully formed question.`,
    {
      vectorStore: vs,
      llm: openai,
    }
  );

  // const libraryTool = new VectorDBQAChain({
  //   vectorstore: vs,
  //   returnSourceDocuments: true,

  //   llm: openai,
  // });

  const chatHistoryTool = new ChatHistoryTool({
    memory,
    openai: openai,
  });

  const serpTool = new SerpAPI(process.env.SERPAPI_API_KEY, {
    location: "United States",
    hl: "en",
    gl: "us",
  });

  //   return [libraryTool, serpTool];
  // return [libraryTool, serpTool, chatHistoryTool];
  return [libraryTool, chatHistoryTool];
}
