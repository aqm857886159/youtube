import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        <meta charSet="utf-8" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="YouTube, AI, 翻译, 视频处理, 字幕, 人工智能" />
        <meta name="author" content="YouTube AI Service" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}