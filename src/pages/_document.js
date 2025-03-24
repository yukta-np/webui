import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        {/* <link rel="manifest" href="/site.webmanifest" /> */}
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
