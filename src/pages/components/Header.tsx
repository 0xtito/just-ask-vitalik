import { useState, Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { LOGOS } from "@/utils/constants";
import CyclingLogos from "./CycleLogos";
import { Logo, HeaderProps } from "@/types";

export default function Header({
  apiKey,
  setApiKey,
  handleApiKey,
}: HeaderProps) {
  const [showAgent, setShowAgent] = useState(false);

  return (
    <header className="bg-gray-900">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <div className="flex items-center">
            <h1 className="text-lg text-white mr-2 ">Built With: </h1>
            <div className="relative h-10 w-10 overflow-hidden">
              <CyclingLogos logos={LOGOS as Logo[]} />
            </div>
          </div>
        </div>
        {/* Title */}
        <div className="hidden lg:flex lg:gap-x-12">
          <h1
            className="text-2xl inline-block hover:cursor-default"
            onMouseEnter={() => setShowAgent(true)}
            onMouseLeave={() => setShowAgent(false)}
          >
            <span className="inline-block ">Just Ask </span>{" "}
            <Transition
              show={showAgent}
              enter="relative transition-all ease-out duration-200"
              enterFrom="inline-block opacity-0 transform translate-x-2"
              enterTo="inline-block opacity-100 transform translate-x-0"
              leave="relative transition-all ease-in duration-200"
              leaveFrom="inline-block opacity-100 transform translate-x-0"
              leaveTo="inline-block opacity-0 transform translate-x-2"
            >
              <Fragment>
                <span className="inline-block text-gray-400">Agent</span>
              </Fragment>
            </Transition>{" "}
            <span className="inline-block ">Vitalik</span>
          </h1>
        </div>
        <div className="lg:flex lg:flex-1 lg:justify-end">
          <Popover className="relative">
            {({ open, close }) => (
              <Fragment>
                <Popover.Button className="text-white text-lg hover:text-gray-200">
                  Settings
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute -right-1 top-full z-10 mt-3 overflow-x-hidden w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                    <div className="bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                      <div className="px-4 py-3">
                        <h2 className="flex text-base font-medium justify-center text-gray-900 mb-2">
                          Add OpenAI Key
                        </h2>
                        <label htmlFor="api-key" className="sr-only">
                          API Key
                        </label>
                        <input
                          type="password"
                          name="api-key"
                          id="api-key"
                          className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="sk-12345..."
                          onChange={(e) => {
                            setApiKey(e.target.value);
                          }}
                          value={apiKey}
                        />
                      </div>
                      <div className="flex justify-center px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                          type="button"
                          className="inline-flex justify-center mr-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => {
                            handleApiKey(false);
                            close();
                          }}
                        >
                          Save
                        </button>

                        <button
                          type="button"
                          className="inline-flex justify-center ml-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => {
                            handleApiKey(true);
                            // close();
                          }}
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Fragment>
            )}
          </Popover>
        </div>
      </nav>
    </header>
  );
}
