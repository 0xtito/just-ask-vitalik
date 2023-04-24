import { createAgent } from "@/utils/createAgent";
import { initChatOpenAI } from "@/utils/clients/openai-client";
import { BufferMemory } from "langchain/memory";

async function qa() {
  const openai = initChatOpenAI(0.1);
  const agent = await createAgent(openai, new BufferMemory());

  if (!agent) {
    throw new Error("Could not create agent");
  }

  const result = await agent.call({
    input: "What are your thoughts on Polkadot?",
  });

  console.log(result);
}

(async () => {
  await qa();
  console.log("done");
})();
