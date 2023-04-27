import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";

import { CyclingLogosProps } from "@/types";

export default function CyclingLogos({
  logos = [],
  interval = 2000,
}: CyclingLogosProps) {
  const [activeLogoIndex, setActiveLogoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLogoIndex((prevIndex) => (prevIndex + 1) % logos.length);
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [interval, logos.length]);

  function imageSize(alt: string) {
    switch (alt) {
      case "LangChain":
        return 50;
      case "React":
        return 100;
      case "NextJS":
        return 30;
      case "TailwindCSS":
        return 40;
      case "Vercel":
        return 30;
      case "Supabase":
        return 30;
      case "OpenAI":
        return 30;
      default:
        return 40;
    }
  }

  return (
    <div className="grid w-10 h-10 place-content-center">
      {logos.map((logo, index) => (
        <Transition
          key={logo.id}
          show={index === activeLogoIndex}
          enter="absolute place-self-center transform transition-all duration-300 ease-in-out"
          enterFrom="translate-x-full opacity-0"
          enterTo=" absolute translate-x-0 opacity-100"
          leave="absolute place-self-center transform transition-all duration-200 ease-in-out"
          leaveFrom="absolute translate-x-0 opacity-100"
          leaveTo="-translate-x-full opacity-0"
        >
          {logo.type === "img" && (
            <Image
              src={logo.src}
              alt={logo.alt}
              width={imageSize(logo.alt)}
              height={imageSize(logo.alt)}
              onClick={() => {
                window.open(logo.link, "_blank");
              }}
              className="relative inline-block"
            />
          )}
        </Transition>
      ))}
    </div>
  );
}
