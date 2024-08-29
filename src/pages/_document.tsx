import { Html, Head, Main, NextScript } from "next/document"

export const siteTitle = "CryptoFund"
const siteDomain = ""
const siteDescription = "A crowdFunding transparent platform"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/public/Logo.svg" />

        <meta name="theme-color" content="#fefae0" />
        <meta name="description" content={siteDescription} />
        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content={siteDomain} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={``} />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="" />
        <meta property="twitter:url" content={siteDomain} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={``} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
