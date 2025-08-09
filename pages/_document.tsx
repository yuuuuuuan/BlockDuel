import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
      <body className="min-h-screen bg-background">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}