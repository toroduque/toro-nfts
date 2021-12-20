import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "./config/web3";
import App from "./App";

const colors = {
  dark: "#11052C",
  light_dark: "#3D087B",
  pink: "#F43B86",
  yellow: "#FFE459",
};

const theme = extendTheme({ colors });

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <ChakraProvider theme={theme}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <App />
        </Web3ReactProvider>
      </ChakraProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
