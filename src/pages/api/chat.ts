import type { NextApiRequest, NextApiResponse } from "next";
import { initChatOpenAI } from "@/utils/clients/openai-client";
import { createAgent } from "@/utils/createAgent";
import { LLMResult } from "langchain/schema";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";
import { vitalikAgentPromptNoTools } from "@/utils/constants";

import { ChatMessage } from "@/types";

export const config = {
  runtime: "edge",
};

/**
 * Vitalik's Agent
 * @param req
 * @param res
 * @returns
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reader = req.body?.getReader();
  const text = await reader?.read();
  const decoder = new TextDecoder();
  const decodedQuestion = decoder.decode(text?.value);
  let { question, key, chatHistory } = JSON.parse(decodedQuestion) as {
    question: string;
    chatHistory: ChatMessage[];
    key: string;
  };

  if (!question) {
    throw new Error("No question in the request");
  }

  if (key == "hireme!") {
    key = process.env.OPENAI_API_KEY!;
  }

  try {
    let sanitizedChatHistory =
      chatHistory.length > 0
        ? chatHistory.flatMap(({ vitalikMsg, userMsg }) => {
            const user = new HumanChatMessage(userMsg);
            user.name = "Human";

            const ai = new AIChatMessage(vitalikMsg);
            ai.name = "AI";

            return [user, ai];
          })
        : [];

    // test

    const sysMsg = new SystemChatMessage(vitalikAgentPromptNoTools);
    sysMsg.name = "Admin";
    sanitizedChatHistory.unshift(sysMsg);

    const memory = new BufferMemory({
      chatHistory: new ChatMessageHistory(sanitizedChatHistory),
      returnMessages: true,
      memoryKey: "chat_history", // testing may delete
      inputKey: "input",
    });
    const encoder = new TextEncoder();

    console.log(`\n--- STARTING CHAT ---\n`);
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const openai = initChatOpenAI(
            0.1,
            key,
            (token: string) => {
              controller.enqueue(encoder.encode(token));
            },
            (error: Error) => {
              console.log(error);
              controller.enqueue(encoder.encode("Error: Something went wrong"));
            },
            (output: LLMResult) => {
              controller.enqueue(
                encoder.encode(
                  `Final Answer: ${
                    output.generations[0][0].text.split("Final Answer: ")[1]
                  }`
                )
              );
              controller.close();
            }
          );

          const agentExecutor = await createAgent(openai, key, memory);

          await agentExecutor.call({
            input: question,
          });
        } catch (error: any) {
          controller.enqueue(encoder.encode(`ERROR: ${error.message}`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.log("error: ", error);
  } finally {
    console.log("done");
  }
}
