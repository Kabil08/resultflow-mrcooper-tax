import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FloatingChatButton from "@/components/FloatingChatButton";
import ChatDialog from "@/components/ChatDialog";
import "./App.css";

function HimsIframe() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      <div className="relative w-full h-full z-0">
        <iframe
          src="https://www.hims.com"
          className="w-full h-full border-0"
          title="Hims Website"
        />
      </div>
      <div className="relative z-50">
        <FloatingChatButton onClick={() => setIsChatOpen(true)} />
        <ChatDialog isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HimsIframe />} />
      </Routes>
    </Router>
  );
}

export default App;
