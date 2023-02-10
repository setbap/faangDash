import names from "lib/utility/names";

/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: "FaangDash",
  titleTemplate: "%s | Review Faang Companies stock change until 2020",
  defaultTitle: "FaangDash | Review Faang Companies stock change until 2020",
  canonical: "https://FaangDash.vercel.app/",
  openGraph: {
    url: "https://FaangDash.vercel.app/",
    title: "FaangDash",
    description: "FaangDash | Review Faang Companies stock change until 2020 ",
    images: [
      {
        url: `https://${names.SITE_URL}/og.png`,
        alt: `${names.APP_NAME} by MetricsDao and elSina`,
      },
    ],
    site_name: "FaangDash",
  },
  twitter: {
    handle: "@elSinaCrypto",
    cardType: "summary_large_image",
  },
};

export default defaultSEOConfig;
