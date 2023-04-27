import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Fragment } from "react";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Component {...pageProps} />
      <Analytics />
    </Fragment>
  );
}
