import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { AgentLogProps } from "@/types";

export default function AgentLog({
  openThought = [
    -1,
    [{ thought: "", action: "", actionInput: "", observation: "" }],
  ],
  setOpenThought,
}: AgentLogProps) {
  return (
    <Transition.Root show={openThought[0] !== -1} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() =>
          setOpenThought([
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
        }
      >
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full w-3/12 pr-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 "
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300 "
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          {"Agent's Thought Process"}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() =>
                              setOpenThought([
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
                            }
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {openThought[1].map((loop, index) => (
                        <div
                          key={index}
                          className="relative text-black border border-gray-400 p-2 mb-2 rounded-lg border-opacity-30"
                        >
                          <h1 className="text-center text-lg">
                            Thought #{index + 1}
                          </h1>
                          <p className="mb-2">{loop.thought}</p>
                          {loop.action !== "" && (
                            <Fragment>
                              <h1 className="text-center text-md">
                                Action #{index + 1}
                              </h1>
                              <p className="mb-2">{loop.action}</p>
                              <h1 className="text-center text-md">
                                Action Input #{index + 1}
                              </h1>
                              <p className="mb-2">{loop.actionInput}</p>

                              <h1 className="text-center text-md">
                                Observation #{index + 1}
                              </h1>
                              <p className="mb-2">{loop.observation}</p>
                            </Fragment>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
