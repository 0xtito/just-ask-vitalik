import { Fragment, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (q: string) => {
    console.log(q);
    console.log("Submitted");
  };
  return (
    <Fragment>
      <div className="flex justify-center h-screen">
        <div className="flex flex-col justify-center items-center">
          <label
            htmlFor="comment"
            className="block text-sm font-medium leading-6 text-white"
          >
            Ask Vitalik a question
          </label>
          <div className="my-2 justify-center">
            <textarea
              rows={4}
              name="comment"
              id="comment"
              className="block w-60 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
              defaultValue={""}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="mt-2 rounded-md bg-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
            onClick={() => handleSubmit(question)}
          >
            Ask
          </button>
        </div>
      </div>
    </Fragment>
  );
}
