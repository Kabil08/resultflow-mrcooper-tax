import { useState } from "react";
import ChatDialog from "./components/ChatDialog";
import FloatingChatButton from "./components/FloatingChatButton";
import "./App.css";

function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Iframe container */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          src="https://www.mrcooper.com"
          className="w-full h-full border-0"
          title="Mr. Cooper Website"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>

      {/* Chat UI layer */}
      <div className="relative z-50">
        <FloatingChatButton onClick={() => setShowChat(true)} />
        <ChatDialog isOpen={showChat} onClose={() => setShowChat(false)} />
      </div>
    </div>
  );
}

export default App;
