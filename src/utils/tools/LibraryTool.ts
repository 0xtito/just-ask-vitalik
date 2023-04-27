import { OpenAIEmbeddings } from "langchain/embeddings";
import { Tool } from "langchain/tools";
import { SupabaseVectorStore } from "langchain/vectorstores";
import { supabase } from "../clients/supabase-client";
import { StringPromptValue } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";

import { LibraryToolArgs } from "@/types";

/**
 * A Tool for the Agent to Search through their ow library
 *    - currently not being used
 *    - using the VectorStoreQATool from Langchain instead
 */
export class LibraryTool extends Tool {
  private model: ChatOpenAI;
  private embeddings: OpenAIEmbeddings;

  constructor({
    model,
    embeddings,
    verbose,
    callbackManager,
  }: LibraryToolArgs) {
    super(verbose, callbackManager);
    this.model = model;
    this.embeddings = embeddings;
  }

  name = "Library Tool";

  description = `Search through your Library to remember your theories, stances, and beliefs. Your library is in the form of vectorstores. The vectorstore contains your writings. `;

  async _call(text: string) {
    const vs = await SupabaseVectorStore.fromExistingIndex(this.embeddings, {
      client: supabase,
      tableName: `vitalik_essays`,
      queryName: "match_documents",
    });

    const rawResults = await vs.similaritySearch(text, 5);

    const results = rawResults.map((doc) => doc.pageContent).join("\n");
    const input = `You are Vitalik Buterin and this is your work. Write a descriptive summary of the following context:\n\n
        ${results}
        \n\nConcise Summary: 
        `;

    const ans = await this.model.generatePrompt([new StringPromptValue(input)]);
    console.log(ans.generations[0][0].text);
    return ans.generations[0][0].text;
    return `Final answer: ${ans.generations[0][0].text}`;
  }
}
