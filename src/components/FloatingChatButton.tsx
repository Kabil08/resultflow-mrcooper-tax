import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface FloatingChatButtonProps {
  onClick: () => void;
}

const FloatingChatButton = ({ onClick }: FloatingChatButtonProps) => {
  const isMobile = useIsMobile();

  return (
    <Button
      className={`fixed ${
        isMobile ? "bottom-4 right-4 w-12 h-12" : "bottom-6 right-6 w-14 h-14"
      } rounded-full bg-hims-brown hover:bg-hims-brown-dark shadow-lg z-[9999] touch-none`}
      onClick={onClick}
    >
      <MessageCircle
        className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-white`}
      />
    </Button>
  );
};

export default FloatingChatButton;
