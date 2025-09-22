import { useState } from "react";
import { X, Send, User } from "lucide-react";
import Markdown from "markdown-to-jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Message } from "@/types/chat";
import { mockChatResponses, mockTaxBreakdown } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";
import TaxBreakdown from "./tax/TaxBreakdown";
import AutoPaySetup from "./tax/AutoPaySetup";
import Logo from "@/components/ui/logo";

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatDialog = ({ isOpen, onClose }: ChatDialogProps) => {
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: mockChatResponses.initial.content,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(false);
  const [showOptions, setShowOptions] = useState<boolean>(true);
  const [showAutoPaySetup, setShowAutoPaySetup] = useState(false);

  const showOptionsWithMessage = () => {
    setShowOptions(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "assistant",
        content: mockChatResponses.initial.content,
        timestamp: new Date(),
      },
    ]);
  };

  const handleOptionSelect = (option: string) => {
    setShowOptions(false);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "user",
        content: option,
        timestamp: new Date(),
      },
    ]);

    if (option === "View Details") {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: mockChatResponses.taxBreakdown.content,
          timestamp: new Date(),
        },
      ]);
      setShowTaxBreakdown(true);
    }
  };

  const handleEnableAutoPay = () => {
    setShowAutoPaySetup(true);
  };

  const handleAutoPaySetup = (enabled: boolean) => {
    setShowAutoPaySetup(false);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "assistant",
        content: enabled
          ? `Great! I've set up AutoPay for your monthly escrow payment of $${mockTaxBreakdown.monthlyEscrowPayment.toLocaleString()}. This will help you avoid any future overdue charges.\n\nIs there anything else I can help you with?`
          : "I understand. You can always enable AutoPay later if you change your mind. Is there anything else I can help you with?",
        timestamp: new Date(),
      },
    ]);
    showOptionsWithMessage();
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const lowerMessage = inputValue.toLowerCase();
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "user",
        content: inputValue,
        timestamp: new Date(),
      },
    ]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      if (
        lowerMessage.includes("tax") ||
        lowerMessage.includes("installment") ||
        lowerMessage.includes("payment")
      ) {
        setShowTaxBreakdown(true);
      } else {
        showOptionsWithMessage();
      }
      setIsTyping(false);
    }, 1000);
  };

  const handlePayment = (selectedMonths: string[]) => {
    setShowTaxBreakdown(false);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "assistant",
        content: `Payment successful! You've paid for ${selectedMonths.join(
          ", "
        )}.\n\nIs there anything else I can help you with?`,
        timestamp: new Date(),
      },
    ]);
    showOptionsWithMessage();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={`w-full sm:max-w-md p-0 flex flex-col ${
          isMobile ? "h-[90vh] rounded-t-lg" : "h-full"
        }`}
      >
        <div className="bg-[#0066CC] text-white p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg p-1 w-10 h-10 flex items-center justify-center">
                <Logo size="sm" variant="logo" className="rounded-sm" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Assistant</h1>
                <p className="text-sm opacity-90">Powered by ResultFlow.ai</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-blue-700"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Logo size="sm" variant="chat" className="text-[#0066CC]" />
                </div>
              )}
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.type === "user"
                    ? "bg-[#0066CC] text-white"
                    : "bg-gray-100"
                }`}
              >
                <Markdown
                  options={{
                    overrides: {
                      h1: {
                        component: "h1",
                        props: {
                          className: "text-2xl font-bold mb-6",
                        },
                      },
                      h2: {
                        component: "h2",
                        props: {
                          className: "text-xl font-semibold mb-5",
                        },
                      },
                      h3: {
                        component: "h3",
                        props: {
                          className: "text-lg font-semibold mb-4",
                        },
                      },
                      h4: {
                        component: "h4",
                        props: {
                          className: "text-base font-semibold mb-4",
                        },
                      },
                      p: {
                        component: "p",
                        props: {
                          className: "mb-4 leading-relaxed",
                        },
                      },
                      ul: {
                        component: "ul",
                        props: {
                          className: "list-none space-y-3 mb-6",
                        },
                      },
                      li: {
                        component: "li",
                        props: {
                          className: "flex items-start gap-3",
                        },
                      },
                      strong: {
                        component: "strong",
                        props: {
                          className: "font-semibold",
                        },
                      },
                      em: {
                        component: "em",
                        props: {
                          className: "italic text-opacity-90",
                        },
                      },
                      a: {
                        component: "button",
                        props: {
                          className:
                            "text-[#0066CC] hover:underline font-medium",
                          onClick: (e: React.MouseEvent) => {
                            e.preventDefault();
                            handleEnableAutoPay();
                          },
                        },
                      },
                    },
                  }}
                >
                  {message.content}
                </Markdown>
              </div>
              {message.type === "user" && (
                <div className="h-8 w-8 rounded-full bg-[#0066CC] flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Logo size="sm" variant="chat" className="text-[#0066CC]" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <span className="animate-pulse">Typing...</span>
              </div>
            </div>
          )}
        </div>

        {showOptions && (
          <div className="px-4 space-y-2 mb-4">
            <button
              onClick={() => handleOptionSelect("View Details")}
              className="w-full text-center px-4 py-2.5 rounded-lg bg-[#0066CC] hover:bg-blue-700 text-white font-medium transition-colors"
            >
              View Details
            </button>
          </div>
        )}

        <div className="p-4 border-t mt-auto">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white border-gray-200"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-[#0066CC] hover:bg-blue-700 rounded-full h-10 w-10"
              onClick={handleSendMessage}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {showTaxBreakdown && (
          <TaxBreakdown
            data={mockChatResponses.taxBreakdown.taxBreakdown}
            onMakePayment={handlePayment}
            onClose={() => {
              setShowTaxBreakdown(false);
              showOptionsWithMessage();
            }}
            onCancel={() => {
              setShowTaxBreakdown(false);
              showOptionsWithMessage();
            }}
          />
        )}

        {showAutoPaySetup && (
          <AutoPaySetup
            userData={{
              autoPayEnabled: false,
              monthlyPayment: mockTaxBreakdown.monthlyEscrowPayment,
              dueDate: 15,
              bankName: "Chase Bank",
              accountLast4: "4567",
            }}
            onSetupAutoPay={handleAutoPaySetup}
            onClose={() => setShowAutoPaySetup(false)}
            onCancel={() => setShowAutoPaySetup(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ChatDialog;
