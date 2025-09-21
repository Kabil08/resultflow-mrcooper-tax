import { MessageSquare } from "lucide-react";
import Logo from "@/components/ui/logo";

interface FloatingChatButtonProps {
  onClick: () => void;
}

const FloatingChatButton = ({ onClick }: FloatingChatButtonProps) => {
  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <button
        onClick={onClick}
        className="h-14 w-14 rounded-full bg-mrcooper-blue hover:bg-mrcooper-blue-dark shadow-lg flex items-center justify-center transition-all duration-200 relative group"
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Logo size="sm" className="rounded-sm" />
        </div>
        <MessageSquare
          className="h-7 w-7 group-hover:opacity-0 transition-opacity duration-200"
          color="white"
          strokeWidth={2.5}
          aria-hidden="true"
        />
        <span className="sr-only">Open chat</span>
      </button>
    </div>
  );
};

export default FloatingChatButton;
