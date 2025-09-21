import { useState } from "react";
import { X, Send, Bot, User } from "lucide-react";
import Markdown from "markdown-to-jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Message,
  KYCVerification,
  TaxBreakdown as TaxBreakdownType,
} from "@/types/chat";
import { mockChatResponses, mockUserData } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";
import ImageVerification from "./kyc/ImageVerification";
import AddressForm from "./kyc/AddressForm";
import PaymentForm from "./kyc/PaymentForm";
import TaxBreakdown from "./tax/TaxBreakdown";
import AutoPaySetup from "./tax/AutoPaySetup";
import Logo from "@/components/ui/logo";

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentVerificationData {
  type: "bank" | "card";
  accountNumber?: string;
  routingNumber?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  bankName?: string;
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
  const [showImageVerification, setShowImageVerification] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(false);
  const [showAutoPaySetup, setShowAutoPaySetup] = useState(false);
  const [showOptions, setShowOptions] = useState<boolean>(true);
  const [kycStatus, setKycStatus] = useState<KYCVerification>(
    mockChatResponses.kycIntro.kycVerification
  );

  const showOptionsWithMessage = () => {
    setShowOptions(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "assistant",
        content:
          "Is there anything else I can help you with?\n\nYou can:\n1. Complete KYC Verification\n2. Check Tax/EMI Payments",
        timestamp: new Date(),
      },
    ]);
  };

  const handleOptionSelect = (option: string) => {
    setShowOptions(false);

    if (option === "Complete KYC Verification") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "user",
          content: option,
          timestamp: new Date(),
        },
        {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: mockChatResponses.kycIntro.content,
          timestamp: new Date(),
          kycVerification: mockChatResponses.kycIntro.kycVerification,
        },
      ]);
      setShowImageVerification(true);
    } else if (option === "Check Tax/EMI Payments") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "user",
          content: option,
          timestamp: new Date(),
        },
        {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: mockChatResponses.taxReminder.content,
          timestamp: new Date(),
          taxBreakdown: mockChatResponses.taxReminder.taxBreakdown,
        },
      ]);
      setShowTaxBreakdown(true);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setIsTyping(true);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);

    setTimeout(() => {
      const response = getAIResponse(userMessage);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "assistant",
          content: response.content,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      showOptionsWithMessage();
    }, 1000 + Math.random() * 1000);
  };

  const getAIResponse = (
    userMessage: string
  ): {
    content: string;
    kycVerification?: KYCVerification;
    taxBreakdown?: TaxBreakdownType;
    showImageVerification?: boolean;
    showAddressForm?: boolean;
    showPaymentForm?: boolean;
    showTaxBreakdown?: boolean;
    showAutoPaySetup?: boolean;
  } => {
    const lowerMessage = userMessage.toLowerCase();

    // KYC Flow
    if (
      lowerMessage.includes("start verification") ||
      lowerMessage.includes("verify") ||
      lowerMessage.includes("kyc") ||
      lowerMessage.includes("yes") ||
      lowerMessage.includes("ready")
    ) {
      if (kycStatus.steps.imageVerification.status === "pending") {
        return {
          content: mockChatResponses.kycImageVerification.content,
          showImageVerification: true,
        };
      } else if (kycStatus.steps.addressVerification.status === "pending") {
        return {
          content: mockChatResponses.kycAddressVerification.content,
          showAddressForm: true,
        };
      } else if (kycStatus.steps.paymentVerification.status === "pending") {
        return {
          content: mockChatResponses.kycPaymentVerification.content,
          showPaymentForm: true,
        };
      }
    }

    // Tax/EMI Flow
    if (
      lowerMessage.includes("payment") ||
      lowerMessage.includes("tax") ||
      lowerMessage.includes("emi") ||
      lowerMessage.includes("due") ||
      lowerMessage.includes("late fee")
    ) {
      return {
        content: mockChatResponses.taxReminder.content,
        taxBreakdown: mockChatResponses.taxReminder.taxBreakdown,
        showTaxBreakdown: true,
      };
    }

    // AutoPay Flow
    if (
      lowerMessage.includes("autopay") ||
      lowerMessage.includes("auto pay") ||
      lowerMessage.includes("automatic payment")
    ) {
      return {
        content: mockChatResponses.autopaySetup.content,
        showAutoPaySetup: true,
      };
    }

    // Default response
    return {
      content:
        "I can help you with:\n\n" +
        "1. KYC Verification\n" +
        "2. Tax/EMI Payments\n" +
        "3. AutoPay Setup\n\n" +
        "What would you like to do?",
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleImageCapture = (type: "selfie" | "idProof", image: string) => {
    const updatedKycStatus = { ...kycStatus };
    updatedKycStatus.documents[type] = image;
    if (type === "selfie" && !updatedKycStatus.documents.idProof) {
      updatedKycStatus.steps.imageVerification.status = "in_progress";
    } else if (type === "idProof") {
      updatedKycStatus.steps.imageVerification.status = "completed";
      setKycStatus(updatedKycStatus);

      // Add success message and prompt for address verification
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "assistant",
          content:
            "Great! Your ID has been verified successfully. Now, let's verify your address.",
          timestamp: new Date(),
        },
      ]);
    }
    setKycStatus(updatedKycStatus);
  };

  const handleAddressSubmit = (data: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    proofDocument?: string;
  }) => {
    const updatedKycStatus = { ...kycStatus };
    updatedKycStatus.steps.addressVerification.status = "completed";
    updatedKycStatus.documents.addressProof = data.proofDocument;
    setKycStatus(updatedKycStatus);

    // Add success message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "assistant",
        content:
          "Great! Your address has been verified. Let's proceed with payment verification.",
        timestamp: new Date(),
      },
    ]);

    // Smooth transition to payment form
    setShowAddressForm(false);
    setTimeout(() => {
      setShowPaymentForm(true);
    }, 100);
  };

  const handlePaymentVerification = (data: PaymentVerificationData) => {
    const updatedKycStatus = { ...kycStatus };
    updatedKycStatus.steps.paymentVerification.status = "completed";
    setKycStatus(updatedKycStatus);
    setShowPaymentForm(false);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "assistant",
        content: `Payment information verified successfully using ${
          data.type === "bank" ? "bank account" : "credit card"
        }.\n\nIs there anything else I can help you with?`,
        timestamp: new Date(),
      },
    ]);
    showOptionsWithMessage();
  };

  const handleAutoPaySetup = (enabled: boolean) => {
    setShowAutoPaySetup(false);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "assistant",
        content: `AutoPay has been ${
          enabled ? "enabled" : "disabled"
        } successfully.`,
        timestamp: new Date(),
      },
    ]);
    showOptionsWithMessage();
  };

  const handleVerificationCancel = () => {
    setShowImageVerification(false);
    showOptionsWithMessage();
  };

  const handleAddressCancel = () => {
    setShowAddressForm(false);
    showOptionsWithMessage();
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    showOptionsWithMessage();
  };

  const handleTaxBreakdownCancel = () => {
    setShowTaxBreakdown(false);
    showOptionsWithMessage();
  };

  const handleAutoPayCancel = () => {
    setShowAutoPaySetup(false);
    showOptionsWithMessage();
  };

  const handleTaxBreakdownClose = () => {
    setShowTaxBreakdown(false);
    showOptionsWithMessage();
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
    <>
      <Sheet open={isOpen} onOpenChange={() => onClose()}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={`${
            isMobile
              ? "h-[85vh] border-t rounded-t-[10px] p-0 flex flex-col bg-white"
              : "w-full md:w-[50vw] lg:w-[45vw] p-0 border-l-0 sm:border-l bg-white flex flex-col"
          }`}
        >
          <SheetHeader className="p-4 border-b bg-mrcooper-blue sticky top-0 z-50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Logo size="md" className="rounded-md" />
                <div>
                  <SheetTitle className="text-xl font-semibold text-white">
                    Mr. Cooper Assistant
                  </SheetTitle>
                  <SheetDescription className="text-sm text-mrcooper-beige/80">
                    Powered by ResultFlow.ai
                  </SheetDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10 text-white hover:text-white/80"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto bg-mrcooper-beige-light">
            <div className="flex flex-col gap-4 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.type === "assistant"
                      ? "bg-white rounded-lg shadow-sm p-4"
                      : "bg-mrcooper-blue/5 rounded-lg p-4 ml-4"
                  }`}
                >
                  {message.type === "assistant" ? (
                    <div className="w-8 h-8 rounded-full bg-mrcooper-blue flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-medium text-gray-900">
                      {message.type === "assistant"
                        ? "Mr. Cooper Assistant"
                        : "You"}
                    </div>
                    <div className="text-gray-700 whitespace-pre-wrap">
                      <Markdown
                        options={{
                          overrides: {
                            p: {
                              component: "p",
                              props: {
                                className: "mb-2",
                              },
                            },
                            strong: {
                              component: "strong",
                              props: {
                                className: "font-semibold text-gray-900",
                              },
                            },
                            ul: {
                              component: "ul",
                              props: {
                                className: "list-disc pl-4 mb-2",
                              },
                            },
                            ol: {
                              component: "ol",
                              props: {
                                className: "list-decimal pl-4 mb-2",
                              },
                            },
                            li: {
                              component: "li",
                              props: {
                                className: "mb-1",
                              },
                            },
                          },
                        }}
                      >
                        {message.content}
                      </Markdown>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-gray-500 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-current" />
                  <div className="w-2 h-2 rounded-full bg-current" />
                  <div className="w-2 h-2 rounded-full bg-current" />
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t bg-white">
            {showOptions && (
              <div className="grid gap-2 mb-4">
                <Button
                  variant="default"
                  className="w-full bg-mrcooper-blue hover:bg-mrcooper-blue-dark text-white"
                  onClick={() =>
                    handleOptionSelect("Complete KYC Verification")
                  }
                >
                  Complete KYC Verification
                </Button>
                <Button
                  variant="default"
                  className="w-full bg-mrcooper-blue hover:bg-mrcooper-blue-dark text-white"
                  onClick={() => handleOptionSelect("Check Tax/EMI Payments")}
                >
                  Check Tax/EMI Payments
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-mrcooper-blue hover:bg-mrcooper-blue-dark text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {showImageVerification && (
        <ImageVerification
          onCapture={handleImageCapture}
          onClose={() => setShowImageVerification(false)}
          onNavigateToAddress={() => {
            setShowImageVerification(false);
            setShowAddressForm(true);
          }}
          onCancel={handleVerificationCancel}
        />
      )}

      {showAddressForm && (
        <AddressForm
          onSubmit={handleAddressSubmit}
          onClose={() => setShowAddressForm(false)}
          onCancel={handleAddressCancel}
        />
      )}

      {showPaymentForm && (
        <PaymentForm
          onSubmit={handlePaymentVerification}
          onClose={() => setShowPaymentForm(false)}
          onCancel={handlePaymentCancel}
        />
      )}

      {showTaxBreakdown && (
        <TaxBreakdown
          data={mockChatResponses.taxReminder.taxBreakdown}
          onMakePayment={handlePayment}
          onSetupAutoPay={() => {
            setShowTaxBreakdown(false);
            setShowAutoPaySetup(true);
          }}
          onClose={handleTaxBreakdownClose}
          onCancel={handleTaxBreakdownCancel}
        />
      )}

      {showAutoPaySetup && (
        <AutoPaySetup
          userData={mockUserData}
          onSetupAutoPay={handleAutoPaySetup}
          onClose={() => {
            setShowAutoPaySetup(false);
            showOptionsWithMessage();
          }}
          onCancel={handleAutoPayCancel}
        />
      )}
    </>
  );
};

export default ChatDialog;
