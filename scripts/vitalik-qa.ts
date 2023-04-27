import { createAgent } from "@/utils/createAgent";
import { initChatOpenAI } from "@/utils/clients/openai-client";
import { BufferMemory } from "langchain/memory";

async function qa() {
  const openai = initChatOpenAI(0.1, process.env.OPENAI_API_KEY!);
  const agent = await createAgent(
    openai,
    process.env.OPENAI_API_KEY!,
    new BufferMemory()
  );

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
