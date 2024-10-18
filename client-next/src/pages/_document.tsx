import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Авторизация Next + Nest" />
        <meta name="keywords" content="auth, next, nest, jwt" />
        <meta name="author" content="DefPavel" />
        <meta property="og:title" content="Авторизация Next + Nest" />
        <meta
          property="og:description"
          content="Описание страницы для соцсетей"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
