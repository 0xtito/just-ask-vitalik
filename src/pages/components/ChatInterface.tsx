import React, { Fragment, useState, Dispatch, SetStateAction } from "react";
import Image from "next/image";

import { vitalikInfo } from "@/utils/constants";
import { AgentThoughts, ChatInterfaceProps } from "@/types";
import AgentLog from "@/pages/components/AgentLog";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

const DEFAULT_USER_IMG = "/static/user.jpg";

export default function ChatInterface({
  messages = [],
  thoughts = [[]],
  streaming,
}: ChatInterfaceProps) {
  const [openThought, setOpenThought] = useState<[number, AgentThoughts[]]>([
    -1,
    [
      {
        thought: "",
        action: "",
        actionInput: "",
        observation: "",
      },
    ],
  ]);
  // const [thoughtOpen, setThoughtOpen] = useState(false);

  return (
    <Fragment>
      {/* <Transition as={Fragment}> */}
      <AgentLog openThought={openThought} setOpenThought={setOpenThought} />

      {/* </Transition> */}
      <div className="md:w-1/2 md:h-1/2 md:mx-auto mx-2 w-full h-3/4 bg-gray-800 rounded-lg">
        <div className="h-full overflow-y-auto p-4">
          {messages.map(({ vitalikMsg, userMsg }, index) => (
            <Fragment key={index}>
              <div key={`User-${index}`} className={`flex justify-end mb-4`}>
                <Fragment>
                  <div className={`relative flex flex-col items-end`}>
                    <span className="text-xs text-gray-300 mb-1">{"fren"}</span>
                    <div
                      className={`bg-gray-700 rounded-lg p-2 rounded-br-none max-w-lg`}
                    >
                      <p className="text-white">{userMsg}</p>
                    </div>
                  </div>
                  <Image
                    src={DEFAULT_USER_IMG}
                    alt={`user`}
                    width={100}
                    height={100}
                    className="w-10 h-10 rounded-full ml-2 self-end"
                  />
                </Fragment>
              </div>
              <div
                key={`Vitalik-${index}`}
                className={`flex justify-start mb-4`}
              >
                <Fragment>
                  <Image
                    src={vitalikInfo.image}
                    alt={vitalikInfo.name}
                    width={100}
                    height={100}
                    className="w-10 h-10 rounded-full mr-2 self-end"
                  />
                  <div className={`relative flex flex-col items-start`}>
                    <span className="text-xs text-gray-300 mb-1">
                      {vitalikInfo.name}
                    </span>
                    <div
                      className={`bg-gray-700 rounded-lg p-2 rounded-bl-none max-w-lg`}
                    >
                      <div className="text-white">
                        {vitalikMsg === "" ? "Thinking..." : vitalikMsg}
                        <div className="inline-block">
                          {(!streaming || index !== messages.length - 1) && (
                            <ArrowTopRightOnSquareIcon
                              onClick={() => {
                                // if (streaming && index)
                                openThought[0] === index
                                  ? setOpenThought([
                                      -1,
                                      [
                                        {
                                          thought: "",
                                          action: "",
                                          actionInput: "",
                                          observation: "",
                                        },
                                      ],
                                    ])
                                  : setOpenThought([index, thoughts[index]]);
                              }}
                              className="ml-1 w-4 h-4 place-content-center hover:cursor-pointer"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Fragment>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </Fragment>
  );
}
