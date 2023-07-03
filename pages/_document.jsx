import { Html, Head, Main, NextScript } from "next/document";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../src/theme";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="white" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Raleway:400,700|Roboto:300,400,700&amp;display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <body>
        <ThemeProvider theme={theme}>
          <Main />
        </ThemeProvider>
        <NextScript />
      </body>
    </Html>
  );
}
