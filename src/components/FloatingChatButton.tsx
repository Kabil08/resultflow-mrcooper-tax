import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";

interface FloatingChatButtonProps {
  onClick: () => void;
}

const FloatingChatButton = ({ onClick }: FloatingChatButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-[#0066CC] hover:bg-blue-700 shadow-lg"
    >
      <Logo size="lg" variant="chat" className="text-white" />
    </Button>
  );
};

export default FloatingChatButton;
