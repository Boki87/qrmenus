import { GetServerSideProps } from "next";
import type { AppProps } from "next/app";
import NProgress from "nprogress";
import {
  ChakraProvider,
  cookieStorageManagerSSR,
  localStorageManager,
} from "@chakra-ui/react";
import Router from "next/router";
import theme from "../style/theme";
import { Provider } from "react-redux";
import { store } from "../app/store";
import AuthWrapper from "../components/AuthWrapper";
import AppConfirmDialog from "../components/AppConfirmDialog";
import "nprogress/nprogress.css";
import PreviewDrawer from "../components/PreviewDrawer";

NProgress.configure({ showSpinner: false });

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

interface AppPropsExtended {
  pageProps: {
    cookies: any;
  };
}

function MyApp({ Component, pageProps }: AppProps & AppPropsExtended) {
  const { cookies } = pageProps;

  const colorModeManager =
    typeof cookies === "string"
      ? cookieStorageManagerSSR(cookies)
      : localStorageManager;

  return (
    <Provider store={store}>
      <AuthWrapper>
        <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
          <Component {...pageProps} />
          <AppConfirmDialog />
          <PreviewDrawer />
        </ChakraProvider>
      </AuthWrapper>
    </Provider>
  );
}

interface ReqProp {
  req: any;
}

export async function getServerSideProps(
  context: GetServerSideProps & ReqProp
) {
  let { req } = context;

  return {
    props: {
      cookies: req.headers.cookie ?? "",
    },
  };
}

export default MyApp;
