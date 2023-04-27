import { useState, useRef, Fragment } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import Head from "next/head";

import ChatInterface from "./components/ChatInterface";
import ErrorModal from "./components/ErrorModal";
import Header from "./components/Header";
import { ChatMessage, AgentThoughts } from "@/types";
import Footer from "./components/Footer";

export default function Home() {
  const [question, setQuestion] = useState("");
  const text = useRef("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [agentThoughts, setAgentThoughts] = useState<AgentThoughts[][]>([]);

  const handleApiKey = (clear: boolean) => {
    if (clear) {
      console.log("clearing api key and text");
      setStreaming(false);
      setApiKey("");
      setMessages([]);
    } else {
      console.log("setting api key");
    }
  };

  const sendQuestion = async (question: string) => {
    const q = question.trim();
    if (!q) return;
    setStreaming(true);
    setQuestion("");
    try {
      setMessages((curMsgs) => [...curMsgs, { userMsg: q, vitalikMsg: "" }]);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          chatHistory: messages,
          key: apiKey,
        }),
      });

      if (res.body) {
        setStreaming(true);
        for await (const chunk of readStream(res.body)) {
          const chunkText = new TextDecoder().decode(chunk);

          if (chunkText.includes("ERROR: ")) {
            const error = chunkText.split("ERROR: ")[1];
            setErrorMsg(error);
            setOpenModal(true);
            setStreaming(false);
            break;
          }

          text.current += chunkText;
          const q = question.trim();
          if (text.current.includes("Final Answer:")) {
            const ans = text.current.split("Final Answer: ")[1];

            setMessages((curMessages) => {
              const pastMessages = curMessages.slice(0, curMessages.length - 1);

              return [
                ...pastMessages,
                {
                  userMsg: q,
                  vitalikMsg: ans,
                },
              ];
            });
          }
        }
      } else {
        throw new Error("No response body");
      }
    } catch (error: unknown) {
      console.log("inside catch");
      if (error instanceof Error) {
        console.log("inside catch - inside if");

        console.error("Error:", error);
        setOpenModal(true);
        setErrorMsg(error.message);
      }
    } finally {
      console.log("fetch complete");
      const agentThoughtProcess: string =
        text.current.split("Final Answer: ")[0];

      const lastThoughts = separateString(agentThoughtProcess);
      console.log(`--- Agent Thought Process ---\n${agentThoughtProcess}`);
      setAgentThoughts((curAgentThoughts) => [
        ...curAgentThoughts,
        lastThoughts,
      ]);
      text.current = "";
      setStreaming(false);
    }
  };

  async function* readStream(
    stream: ReadableStream<Uint8Array>
  ): AsyncGenerator<Uint8Array> {
    const reader = stream.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        if (value) yield value;
      }
    } finally {
      reader.releaseLock();
    }
  }

  const separateString = (input: string): AgentThoughts[] => {
    const results: AgentThoughts[] = [];
    const lines = input.split("\n");

    let thoughts: string[] = [];
    let actions: string[] = [];
    let actionInputs: string[] = [];
    let observations: string[] = [];

    let continueObservation = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (continueObservation) {
        observations[observations.length - 1] += " " + line;
        if (!lines[i + 1].trim().startsWith("Thought: ")) {
          continueObservation = false;
          i++;
        }
      }
      i === 0 ? thoughts.push(line.split("Action")[0]) : "";
      if (line.startsWith("Action:")) {
        actions.push(line.split("Action: ")[1]);
      } else if (line.startsWith("Action Input: ")) {
        actionInputs.push(line.split("Action Input: ")[1]);
      } else if (line.startsWith("Observation")) {
        observations.push(line.split("Observation: ")[1]);
      } else if (line.startsWith("Thought")) {
        thoughts.push(line.split("Thought: ")[1]);
      }
    }

    thoughts.forEach((_, i) => {
      results.push({
        thought: thoughts[i] ?? "",
        action: actions[i] ?? "",
        actionInput: actionInputs[i] ?? "",
        observation: observations[i] ?? "",
      });
    });
    console.log(`results -->`, results);
    return results;
  };

  return (
    <Fragment>
      <Head>
        <title>Just Ask Vitalik</title>
        <meta name="description" content="Just Ask Vitalik" />
      </Head>
      <div className="max-h-screen overflow-y-hidden">
        <ErrorModal
          open={openModal}
          setOpen={setOpenModal}
          errorMsg={errorMsg}
        />
        <Header
          apiKey={apiKey}
          setApiKey={setApiKey}
          handleApiKey={handleApiKey}
        />
        <div className="flex flex-col h-screen justify-evenly items-center">
          <ChatInterface
            messages={messages}
            thoughts={agentThoughts}
            streaming={streaming}
          ></ChatInterface>

          <div className="flex h-16 w-7/12 justify-center rounded-full bg-gray-700">
            <div className="flex items-center justify-between w-full h-full px-1.5 py-1.5 rounded-full shadow-sm">
              <div className="relative w-full h-full">
                <input
                  type="input"
                  name="comment"
                  id="comment"
                  className="w-full h-full pl-5 pr-12 text-black text-xl rounded-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                  placeholder="Ask Vitalik about his essays here"
                  value={question}
                  onSubmit={() => sendQuestion(question)}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                  }}
                />
                <button
                  type="button"
                  disabled={streaming}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-slate-100 rounded-full p-1.5"
                  onClick={() => sendQuestion(question)}
                >
                  <PaperAirplaneIcon className="w-6 h-6 text-gray-300" />
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </Fragment>
  );
}
