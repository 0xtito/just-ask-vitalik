import type { Dispatch, SetStateAction } from "react";
import type { StaticImageData } from "next/image";
import type { BufferMemory } from "langchain/memory";
import type { ChatOpenAI } from "langchain/chat_models/openai";
import type { OpenAIEmbeddings } from "langchain/embeddings";
import type { CallbackManager } from "langchain/callbacks";

export interface EssayProps {
  title: string;
  link: string;
  content: string;
  date: string;
}

export interface ChatMessage {
  userMsg: string;
  vitalikMsg: string;
}

export interface AgentThoughts {
  action: string;
  actionInput: string;
  observation: string;
  thought: string;
}

export interface ChatInterfaceProps {
  messages: ChatMessage[];
  // currentMessage: string;
  // handleSubmit: (q: string) => void;
  // question: string;
  // setQuestion: Dispatch<SetStateAction<string>>;
  thoughts: AgentThoughts[][];
  streaming: boolean;
  // openThought: [number, AgentThoughts[]];
  // setOpenThought: Dispatch<SetStateAction<[number, AgentThoughts[]]>>;
}

export interface Logo {
  id: number;
  type: string;
  src: StaticImageData;
  link: string;
  alt: string;
}

export interface CyclingLogosProps {
  logos: Logo[];
  interval?: number;
}

export interface HeaderProps {
  apiKey: string;
  setApiKey: Dispatch<SetStateAction<string>>;
  handleApiKey: (clear: boolean) => void;
}

export interface ChatHistoryToolArgs {
  memory: BufferMemory;
  openai: ChatOpenAI;
  verbose?: boolean;
}

export interface AgentLogProps {
  openThought: [number, AgentThoughts[]];
  setOpenThought: React.Dispatch<
    React.SetStateAction<[number, AgentThoughts[]]>
  >;
}

export interface LibraryToolArgs {
  model: ChatOpenAI;
  embeddings: OpenAIEmbeddings;
  verbose?: boolean;
  callbackManager?: CallbackManager;
}

export interface ErrorModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  errorMsg: string;
}
