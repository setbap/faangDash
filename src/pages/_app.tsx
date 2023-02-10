import {
  ChakraProvider,
  localStorageManager,
  cookieStorageManagerSSR,
} from "@chakra-ui/react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { DefaultSeo } from "next-seo";
import Head from "next/head";
import defaultSEOConfig from "../../next-seo.config";
import Layout from "lib/components/layout";
import customTheme from "lib/styles/customTheme";
import "lib/styles/globals.css";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import PageLoading from "lib/components/basic/PageLoading";

const MyApp = ({ Component, pageProps, cookies }: any) => {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();
  const AnyComponent = Component as any;

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider
          theme={customTheme}
          colorModeManager={
            typeof cookies === "string"
              ? cookieStorageManagerSSR(cookies)
              : localStorageManager
          }
        >
          <Head>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
            />
          </Head>
          <DefaultSeo {...defaultSEOConfig} />

          <PageLoading />

          <AnimatePresence
            initial={false}
            onExitComplete={() => setTimeout(() => window.scrollTo(0, 10), 100)}
          >
            <Layout key={router.route}>
              <AnyComponent {...pageProps} />
            </Layout>
          </AnimatePresence>
        </ChakraProvider>
      </Hydrate>
    </QueryClientProvider>
  );
};

export default MyApp;
