import { CallbackManager } from "langchain/callbacks";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMResult } from "langchain/schema";

export function initChatOpenAI(
  temperature: number,
  key: string,
  callbackManager?: (token: string) => void,
  callbackManagerError?: (error: Error) => void,
  callbackManagerEnd?: (output: LLMResult) => void
) {
  if (!key.includes("sk-")) throw new Error("Invalid API Key");

  const openai = new ChatOpenAI({
    openAIApiKey: key,
    temperature,
    streaming: Boolean(callbackManager) && Boolean(callbackManagerError), // testing - may have to delete
    callbackManager:
      callbackManager && callbackManagerError && callbackManagerEnd
        ? CallbackManager.fromHandlers({
            async handleLLMNewToken(token: string) {
              callbackManager(token);
            },
            async handleLLMError(error: Error) {
              callbackManagerError(error);
            },
            async handleLLMEnd(output: LLMResult) {
              callbackManagerEnd(output);
            },
            async handleToolStart(
              tool: { name: string },
              input: string,
              verbose: boolean
            ) {
              console.log(`inside handletext callback `, {
                tool,
                input,
                verbose,
              });
            },
          })
        : undefined,
  });

  return openai;
}
