import React from "react";
import { ChatPanel } from "./components/chat-panel";

const App: React.FC = () => {
  return (
    <div className="h-screen bg-[#1e1e1e]">
      <ChatPanel />
    </div>
  );
};

export default App;
