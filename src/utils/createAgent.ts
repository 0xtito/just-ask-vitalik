import { LLMChain, ConversationChain } from "langchain/chains";
import { AgentExecutor, LLMSingleActionAgent } from "langchain/agents";

import { BufferMemory } from "langchain/memory";

import {
  VitalikPromptTemplate,
  VitalikOutputParser,
} from "./agents/vitalikAgent";
import { createToolkit } from "./createToolkit";
import { ChatOpenAI } from "langchain/chat_models/openai";

export async function createAgent(
  openai: ChatOpenAI,
  key: string,
  chatHistory: BufferMemory,
  callbackManager?: (token: string) => void
) {
  console.log("creating toolkit...");
  const tools = await createToolkit(openai, key, chatHistory);

  if (!tools) {
    throw new Error("Could not create tools");
  }

  console.log("created toolkit");

  console.log("Creating conversational chain");
  const conversationChain = new ConversationChain({
    prompt: new VitalikPromptTemplate({
      tools,
      inputVariables: ["input", "agent_scratchpad", "chat_history"],
    }),
    llm: openai,
    memory: chatHistory,
  });

  //   const llmChain = new LLMChain({
  //     prompt: new VitalikPromptTemplate({
  //       tools,
  //       inputVariables: ["input", "agent_scratchpad", "chat_history"],
  //     }),
  //     llm: openai,
  //     verbose: true,
  //     memory: chatHistory,
  //   });

  console.log("created conversational chain");
  console.log("\n-------------------\n");
  console.log("creating agent executor...");

  const agent = new LLMSingleActionAgent({
    llmChain: conversationChain,
    outputParser: new VitalikOutputParser(tools),
    stop: [`\nObservation`],
  });

  const agentExecutor = AgentExecutor.fromAgentAndTools({
    agent,
    tools,
    memory: chatHistory,
    verbose: true,
  });

  return agentExecutor;
}
