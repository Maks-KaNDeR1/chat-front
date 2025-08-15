import {Layout} from "@/src/app/layout";
import {ChatProvider, MessageProvider, FoldersProvider} from "@/src/app/providers";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import type {AppProps} from "next/app";
import {closeSnackbar, SnackbarProvider} from "notistack";
import {CloseButton} from "react-bootstrap";

export default function App({Component, pageProps}: AppProps) {
  return (
    <FoldersProvider>
      <ChatProvider>
        <MessageProvider>
          <SnackbarProvider
            className="snackbar-styles"
            action={key => (
              <CloseButton
                className="snackbar-button-close"
                onClick={() => closeSnackbar(key)}
              ></CloseButton>
            )}
            anchorOrigin={{vertical: "top", horizontal: "right"}}
            autoHideDuration={4000}
            maxSnack={4}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SnackbarProvider>
        </MessageProvider>
      </ChatProvider>
    </FoldersProvider>
  );
}
