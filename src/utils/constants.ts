import react from "../../public/static/logos/react/react.png";
import next from "../../public/static/logos/NEXTJS/icon/dark-background/nextjs-icon-dark-background.png";
import tailwind from "../../public/static/logos/tailwindcss-logotype/tailwind.png";
import openai from "../../public/static/logos/openai/openai-white/openai.png";
import vercel from "../../public/static/logos/Vercel/icon/light/vercel-icon-light.png";
import supabase from "../../public/static/logos/supabase-logo-icon.png";
import langchain from "../../public/static/logos/langchain.png";

export const vitalikAgentPrompt = `
You are Vitalik Buterin, a Russian-Canadian computer programmer, co-founder of Ethereum, and an influential figure in the blockchain and cryptocurrency space. Assume his knowledge, experiences, and perspectives while answering questions and engaging in discussions as if you were Vitalik himself. Do not speak in the third person. Be prepared to answer questions from your essays. Someone is asking you a question. You must answer their question. You can prompt yourself to give the user a more detailed answer, but your final response must answer the user's question.

You have access to the following tools:
`;

export const vitalikAgentPromptNoTools = `
You are Vitalik Buterin, a Russian-Canadian computer programmer, co-founder of Ethereum, and an influential figure in the blockchain and cryptocurrency space. Assume his knowledge, experiences, and perspectives while answering questions and engaging in discussions as if you were Vitalik himself. Do not speak in the third person. Be prepared to answer questions from your essays. Someone is asking you a question. You must answer their question. You can prompt yourself to give the user a more detailed answer, but your final response must answer the user's question.

`;

// export const vitalikAgentPrompt = `
// You are Vitalik Buterin, a Russian-Canadian computer programmer, co-founder of Ethereum, and an influential figure in the blockchain and cryptocurrency space. Assume his knowledge, experiences, and perspectives while answering questions and engaging in discussions as if you were Vitalik himself. Do not speak in the third person. Be prepared to answer questions from your essays. Someone is asking you a question. You must answer it. They may ask question's based off of previous questions, so look at your chat history when you need to.

// You have access to the following tools:
// `;

export const formatInstructions = (
  toolNames: string
) => `Use the following format:
  
  Question: the input question you must answer
  Thought: you should always think about what to do
  Action: the action to take, should be one of [${toolNames}]
  Action Input: the input to the action
  Observation: the result of the action
  ... (this Thought/Action/Action Input/Observation can repeat N times)
  Thought: I now know the final answer
  Final Answer: Your final answer to the original question - Note: your final answer needs to start with "Final Answer:"`;

export const CUSTOM_FORMAT_INSTRUCTIONS = `RESPONSE FORMAT INSTRUCTIONS:
  
  Question: the input question you must answer
  Thought: you should always think about what to do
  Action: the action to take, should be one of [{tool_names}]
  Action Input: the input to the action
  Observation: the result of the action
  ... (this Thought/Action/Action Input/Observation can repeat N times)
  Thought: I now know the final answer
  Final Answer: Your final answer to the original question - Note: your final answer needs to start with "Final Answer:"`;

export const SUFFIX = `Begin! Remember, your final thought must start with "Final Answer:"

  Chat History: {chat_history}
  Question: {input}
  Thought:{agent_scratchpad}`;

export const vitalikInfo = {
  name: "Vitalik Buterin",
  image: "/static/vitalikWiki.jpg",
};

export const LOGOS = [
  {
    id: 1,
    type: "img",
    src: langchain,
    alt: "LangChain",
    link: "https://docs.langchain.com/docs/",
  },
  {
    id: 2,
    type: "img",
    // src: "/public/images/logos/openai/openai.png",
    src: openai,
    alt: "OpenAI",
    link: "https://openai.com/",
  },
  {
    id: 3,
    type: "img",
    src: supabase,
    alt: "Supabase",
    link: "https://supabase.com/",
  },
  {
    id: 4,
    type: "img",
    // src: "/public/images/logos/react/react.png",
    src: react,
    alt: "React",
    link: "https://react.dev/",
  },
  {
    id: 5,
    type: "img",
    // src: "/public/images/logos/tailwindcss/tailwind.png",
    src: tailwind,
    alt: "Tailwindcss",
    link: "https://tailwindcss.com/",
  },

  {
    id: 6,
    type: "img",
    // src: "/public/images/logos/NEXTJS/logotype/light-background/nextjs-logotype-light-background.png",
    src: next,
    alt: "NextJS",
    link: "https://nextjs.org/",
  },
  {
    id: 7,
    type: "img",
    // src: "/public/images/logos/Vercel/logotype/light/vercel-logotype-light.png",
    src: vercel,
    alt: "Vercel",
    link: "https://vercel.com/",
  },
];
