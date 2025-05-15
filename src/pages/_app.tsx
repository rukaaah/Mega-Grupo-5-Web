import "../styles/globals.css";
import type { AppProps } from "next/app";
// esqueleto base do HTML, n tem pq mudar

export default function App({ Component, pageProps }: AppProps) {
  return (
  <Component {...pageProps} />
  );
}
