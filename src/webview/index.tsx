import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./globals.css";

// 获取VS Code Webview API
declare global {
  function acquireVsCodeApi(): {
    postMessage: (message: any) => void;
    setState: (state: any) => void;
    getState: () => any;
  };
}

export const VsCodeContext = React.createContext<ReturnType<
  typeof acquireVsCodeApi
> | null>(null);

const vscode = acquireVsCodeApi();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <VsCodeContext.Provider value={vscode}>
      <App />
    </VsCodeContext.Provider>
  </React.StrictMode>
);
