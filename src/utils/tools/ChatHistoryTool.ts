import { Tool } from "langchain/tools";
import type { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain";
import { BufferMemory } from "langchain/memory";

import { ChatHistoryToolArgs } from "@/types";

/**
 * A Tool for the agent to retrieve and review the chat history.
 *      - still needs to be improved on
 */
export class ChatHistoryTool extends Tool {
  memory: BufferMemory;
  private openai: ChatOpenAI;

  constructor({ verbose, memory, openai }: ChatHistoryToolArgs) {
    super(verbose);
    this.memory = memory;
    this.openai = openai;
  }

  name = "Chat History Tool";

  description = `Use this tool when you need to better understand the Human's question. Use this tool first if you are unsure about what their question means. Your input should be the EXACT question the human just asked you, word for word. An assumption about what the human is talking about will be returned.`;

  async _call(text: string) {
    // the chat history is based in, you will then give a summary of the chat history
    console.log("text: ", text);

    const template = `Your job is to return what you think the human is referring to in their question. You will be given the chat history and the human's question. You will return an assumption about what the human is talking about.
    
    Chat history: {chat_history}

    Human's Most Recent Question: {text}

    Your answer: `;

    const q = text.trim();
    const chatHistory = await this.memory.chatHistory.getMessages();

    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      HumanMessagePromptTemplate.fromTemplate(template),
    ]);

    const chain = new LLMChain({
      llm: this.openai,
      prompt: chatPrompt,
      memory: this.memory,
      verbose: true,
    });

    const result = await chain.call({
      text: q,
      chat_history: chatHistory
        .map((message) => `${message.name}: ${message.text}`)
        .join("\n\n"),
    });
    console.log(`result: `, result.text);
    return result.text as string;
  }
}
