import React from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';
import App from './App.tsx';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
