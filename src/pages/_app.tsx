import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="description" content="Sistema de tarefas para o Sr. Jubileu" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}