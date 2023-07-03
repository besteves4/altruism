import { SessionProvider } from "@inrupt/solid-ui-react";
import { SessionBar } from "../components/SessionBar";

import "../styles/app.css";

function App({ Component, pageProps }) {
  return (
    <SessionProvider
      sessionId="session-provider-example"
      onError={console.log}
      restorePreviousSession
    >
      <SessionBar />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default App;
