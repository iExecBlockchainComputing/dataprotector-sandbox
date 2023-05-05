import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material";
import {
  EthereumClient,
  w3mProvider,
  w3mConnectors,
} from "@web3modal/ethereum";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { Web3Modal } from "@web3modal/react";
import { bellecour } from "./utils/walletConnection";
import { store } from "./app/store";
import { Provider } from "react-redux";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

// material ui theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#FCD15A",
      contrastText: "#1D1D24",
    },
  },
});

// Wagmi Client
if (!import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID) {
  throw new Error(
    "You need to provide a WALLET_CONNECT_PROJECT_ID env variable"
  );
}
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID!;
const chains = [bellecour];
const { provider } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ version: 1, chains, projectId }),
  provider,
});

// Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiClient, chains);

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <WagmiConfig client={wagmiClient}>
            <App />
          </WagmiConfig>
          <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
