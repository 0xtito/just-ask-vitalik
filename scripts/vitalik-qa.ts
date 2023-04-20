import { createAgent } from "@/utils/createAgent";

async function qa() {
  const agent = await createAgent();

  if (!agent) {
    throw new Error("Could not create agent");
  }

  const result = await agent.call({
    input: "What are your thoughts on Polkadot?",
  });

  // const result = await agent.execute({
  //     input: "What is Ethereum?",
  //     agent_scratchpad: "",
  // });

  console.log(result);
}

(async () => {
  await qa();
  console.log("done");
})();
