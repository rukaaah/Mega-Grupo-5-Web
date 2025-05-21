import { Html, Head, Main, NextScript } from "next/document";
// coisas global, como o html, head e body
// o _document é aonde as coisas que são globais ficam
// header, footer, etc

export default function Document() {
  return (
    <Html lang="pt-br">
      <Head />
      <body className="antialiased">
        <div>header</div>
        <Main /> {/* Aqui fica o conteúdo da página */}
        <NextScript />
      </body>
    </Html>
  );
}
