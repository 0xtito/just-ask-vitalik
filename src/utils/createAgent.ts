import { LLMChain } from "langchain/chains";
import { AgentExecutor, LLMSingleActionAgent } from "langchain/agents";

import { CallbackManager } from "langchain/callbacks";
import { LLMResult } from "langchain/schema";

import { PromptTemplate } from "langchain/prompts";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { supabase } from "./clients/supabase-client";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { createToolkit } from "./create-toolkit";
import { openai } from "./clients/openai-client";
import { ChatConversationalAgent } from "langchain/agents";

import {
  VitalikPromptTemplate,
  CustomOutputParser,
} from "./agents/vitalikAgent";
import { createToolkit } from "./createToolkit";
import { Tool } from "langchain/tools";

/**
 * The Agent is going to contain at least two tools:
 *  1. To search through the philosphers respective vectorstore
 *  2. To search through the context from the articles returned from apify (which is also stored in a vector store)
 *
 */

export async function createAgent() {
  console.log("retrieving vector stores...");

  console.log("retrieved vector stores");

  console.log("creating toolkit...");
  const tools = await createToolkit();

  if (!tools) {
    throw new Error("Could not create tools");
  }

  console.log("created toolkit");

  // may use this later
  const callbackManager = CallbackManager.fromHandlers({
    async handleLLMStart(_llm: { name: string }, prompts: string[]) {
      console.log(JSON.stringify(prompts, null, 2));
    },
    async handleLLMEnd(output: LLMResult) {
      for (const generation of output.generations) {
        for (const gen of generation) {
          console.log(gen.text);
        }
      }
    },
  });

  const llmChain = new LLMChain({
    prompt: new VitalikPromptTemplate({
      tools,
      inputVariables: ["input", "agent_scratchpad"],
    }),
    llm: openai,
    verbose: true,
  });

  console.log("created llm chain");
  console.log("-------------------");
  console.log("creating agent executor...");

  const agent = new LLMSingleActionAgent({
    llmChain,
    outputParser: new CustomOutputParser(),
    stop: [`\nObservation`],
  });

  //   const agent = new ChatConversationalAgent({
  //     llmChain,
  //     outputParser: new CustomOutputParser(),
  //     allowedTools: tools.map((tool) => tool.name),
  //   });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    maxIterations: 10,
    verbose: true,
  });

  console.log("created agent executor");
  return agentExecutor;
}
