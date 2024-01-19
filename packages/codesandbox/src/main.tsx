import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material';
import { WagmiConfig } from 'wagmi';
import { wagmiConfig } from './utils/wagmiConfig.ts';
import './main.css';
import App from './App.tsx';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

// material ui theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#FCD15A',
      contrastText: '#1D1D24',
    },
  },
});

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <WagmiConfig config={wagmiConfig}>
        <App />
      </WagmiConfig>
    </ThemeProvider>
  </React.StrictMode>
);
