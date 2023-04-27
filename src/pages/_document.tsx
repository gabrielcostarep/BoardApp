import Document, { Html, Head, Main, NextScript} from "next/document";

export default class MyDocument extends Document{
  render(): JSX.Element {
      return (
        <Html lang="pt-BR">
          <Head>
            <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          </Head>
          <body>
            <Main />
            <NextScript/>
          </body>
        </Html>
      )
  }
}