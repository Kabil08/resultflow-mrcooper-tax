import { useState } from "react";
import { X, Send, Bot, User, Sparkles, Check } from "lucide-react";
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
  ProductRecommendation,
  CartItem,
  Product,
} from "@/types/chat";
import { mockRecommendations } from "@/data/mockData";
import SmartCartForHims from "./SmartCartForHims";
import { useIsMobile } from "@/hooks/use-mobile";

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
      content:
        "Hi! I'm your personal care assistant. Based on your profile and preferences, here's what we have analyzed:\n\n" +
        "**🔍 Your Self-Described Conditions:**\n" +
        "• Early-stage hair thinning\n" +
        "• Occasional stress and anxiety\n\n" +
        "**📋 Your Medical History:**\n" +
        "• No contraindications\n\n" +
        "**🍽️ Food Allergies Analysis:**\n" +
        "• **Dairy sensitivity** - may contribute to hormonal imbalance\n" +
        "• **Gluten intolerance** - linked to nutrient absorption issues\n" +
        "• **Soy allergy** - can affect hormone regulation\n\n" +
        "Addressing these food sensitivities alongside treatment can improve overall results.\n\n" +
        "Based on this, we recommend our Complete Hair Loss Treatment (AI) package:",
      timestamp: new Date(),
      recommendations: [mockRecommendations.hair],
    },
    {
      id: "2",
      type: "assistant",
      content:
        "Based on our analysis of your skin type and concerns, we've found some skin care products that may work well for you:\n\n" +
        "**🔍 Your Skin Analysis:**\n" +
        "• Combination skin type\n" +
        "• Mild sensitivity\n" +
        "• Early signs of aging\n\n" +
        "**✨ Personalized Recommendations:**\n" +
        "Here are some products specifically chosen for your skin profile:",
      timestamp: new Date(),
      recommendations: [mockRecommendations.skin],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSmartCart, setShowSmartCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: string]: boolean;
  }>({});

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = getAIResponse(inputValue.trim());
      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: response.content,
        timestamp: new Date(),
        recommendations: response.recommendations,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const getAIResponse = (
    userMessage: string
  ): { content: string; recommendations?: ProductRecommendation[] } => {
    const lowerMessage = userMessage.toLowerCase();

    // Hair Loss
    if (
      lowerMessage.includes("hair loss") ||
      lowerMessage.includes("hair regrowth") ||
      lowerMessage.includes("balding") ||
      lowerMessage.includes("hair growth") ||
      lowerMessage.includes("thinning hair")
    ) {
      return {
        content:
          "We offer a comprehensive hair loss treatment plan that includes:\n\n" +
          "• Finasteride (1mg) - blocks DHT to prevent further hair loss\n" +
          "• Minoxidil 5% Solution - stimulates hair regrowth\n" +
          "• Biotin Gummies - supports healthy hair growth\n" +
          "• Thickening Shampoo - improves hair appearance\n\n" +
          "Would you like to learn more about how these treatments work together for maximum effectiveness?",
        recommendations: [mockRecommendations.hair],
      };
    }

    // Weight Loss
    if (
      lowerMessage.includes("weight") ||
      lowerMessage.includes("lose weight") ||
      lowerMessage.includes("diet") ||
      lowerMessage.includes("appetite") ||
      lowerMessage.includes("metabolism")
    ) {
      return {
        content:
          "Our weight management program includes FDA-approved medications and comprehensive support:\n\n" +
          "• Semaglutide (GLP-1) - clinically proven for significant weight loss\n" +
          "• Appetite Management medication - helps control food cravings\n" +
          "• Personalized Weight Loss Program - includes nutrition guidance\n" +
          "• Metabolism Support - supplements to support your journey\n\n" +
          "Would you like to explore these options and find the right combination for your goals?",
        recommendations: [mockRecommendations.weightLoss],
      };
    }

    // Skin Care
    if (
      lowerMessage.includes("skin") ||
      lowerMessage.includes("acne") ||
      lowerMessage.includes("aging") ||
      lowerMessage.includes("wrinkles") ||
      lowerMessage.includes("dark spots")
    ) {
      return {
        content:
          "Based on your profile and preferences, here's what we have analyzed for your skin care needs:\n\n" +
          "**🔍 Your Self-Described Skin Conditions:**\n" +
          "• Uneven skin tone\n" +
          "• Occasional breakouts\n" +
          "• Early signs of aging\n\n" +
          "**📋 Your Medical History:**\n" +
          "• No active skin conditions\n" +
          "• No adverse reactions to retinoids\n\n" +
          "**🍽️ Food Allergies Analysis:**\n" +
          "• **Peanut allergy** - may cause skin inflammation and rashes\n" +
          "• **Shellfish sensitivity** - linked to skin reactions and breakouts\n" +
          "• **Egg allergy** - can affect skin barrier function\n\n" +
          "Based on this comprehensive analysis, here are our recommended treatments:\n\n" +
          "• Tretinoin Cream 0.025% - prescription-strength retinoid for acne and anti-aging\n" +
          "• Advanced Anti-Aging Serum - with peptides and antioxidants\n" +
          "• Gentle Cleanser - suitable for all skin types\n" +
          "• Dark Spot Treatment - targets hyperpigmentation\n\n" +
          "What specific skin concerns would you like to address?",
        recommendations: [mockRecommendations.skin],
      };
    }

    // Mental Health
    if (
      lowerMessage.includes("anxiety") ||
      lowerMessage.includes("stress") ||
      lowerMessage.includes("depression") ||
      lowerMessage.includes("mental health") ||
      lowerMessage.includes("sleep") ||
      lowerMessage.includes("therapy")
    ) {
      return {
        content:
          "We provide comprehensive mental health support including:\n\n" +
          "• Escitalopram 10mg - FDA-approved medication for anxiety and depression\n" +
          "• Online Therapy - convenient sessions with licensed professionals\n" +
          "• Stress Management Kit - tools and techniques for daily anxiety relief\n" +
          "• Sleep Support - natural supplement for better rest\n\n" +
          "Would you like to learn more about any of these options?",
        recommendations: [mockRecommendations.mental],
      };
    }

    // Delivery Process
    if (
      lowerMessage.includes("delivery") ||
      lowerMessage.includes("shipping") ||
      lowerMessage.includes("track") ||
      lowerMessage.includes("order status") ||
      lowerMessage.includes("when will") ||
      lowerMessage.includes("how long") ||
      lowerMessage.includes("receive")
    ) {
      return {
        content:
          "🚚 **AI Smart Delivery!**\n\n" +
          "✅ **Free express delivery** within 24 hours for orders over $500\n\n" +
          "✅ **Same-day delivery** available in select cities\n\n" +
          "✅ **Smart packaging** with eco-friendly materials\n\n" +
          "✅ **Real-time tracking** with AI-powered updates\n\n" +
          "✅ **Contactless delivery** options\n\n" +
          "📦 Your orders will be delivered faster with our AI logistics optimization!",
      };
    }

    // Bank Offers and EMI
    if (
      lowerMessage.includes("emi") ||
      lowerMessage.includes("bank offer") ||
      lowerMessage.includes("payment option") ||
      lowerMessage.includes("installment") ||
      lowerMessage.includes("credit card") ||
      lowerMessage.includes("debit card") ||
      lowerMessage.includes("discount")
    ) {
      return {
        content:
          "💳 **AI Payment Optimizer!**\n\n" +
          "✅ **No-cost EMI** available on orders above $99\n\n" +
          "✅ **Flexible EMI options** with 3, 6, and 12-month plans\n\n" +
          "✅ **10% instant discount** up to $30 with HIMS Credit Card\n\n" +
          "✅ **Additional 5% off** with HIMS Debit Card\n\n" +
          "✅ **Special discounts** on subscription plans\n\n" +
          "💰 Save more with our exclusive banking partners!",
      };
    }

    // Subscription and Refills
    if (
      lowerMessage.includes("subscription") ||
      lowerMessage.includes("refill") ||
      lowerMessage.includes("cancel") ||
      lowerMessage.includes("pause") ||
      lowerMessage.includes("monthly") ||
      lowerMessage.includes("automatic")
    ) {
      return {
        content:
          "🔄 **Smart Subscription Benefits!**\n\n" +
          "✅ **Save 20%** on monthly subscriptions\n\n" +
          "✅ **Free shipping** on all refills\n\n" +
          "✅ **Flexible schedule** for deliveries\n\n" +
          "✅ **Easy management** - pause or cancel anytime\n\n" +
          "✅ **Auto refills** before you run out\n\n" +
          "🎁 Join our subscription program for the best value!",
      };
    }

    // Default response with overview of all services
    return {
      content:
        "I can help you with several health concerns including:\n\n" +
        "• Hair Loss Treatment - Finasteride, Minoxidil, and more\n" +
        "• Weight Management - GLP-1 medications and support programs\n" +
        "• Skincare Solutions - Tretinoin and anti-aging treatments\n" +
        "• Mental Health Support - Medication and therapy services\n\n" +
        "What specific health concern would you like to discuss?",
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleSelectAllProducts = (products: Product[]) => {
    const allSelected = products.every(
      (product) => selectedProducts[product.id]
    );
    const newSelectedProducts = { ...selectedProducts };

    products.forEach((product) => {
      newSelectedProducts[product.id] = !allSelected;
    });

    setSelectedProducts(newSelectedProducts);
  };

  const handleAddSelectedToCart = (products: Product[]) => {
    const selectedProductIds = Object.entries(selectedProducts)
      .filter((entry) => entry[1])
      .map((entry) => entry[0]);

    const productsToAdd = products.filter((product) =>
      selectedProductIds.includes(product.id)
    );

    if (productsToAdd.length === 0) {
      return;
    }

    setCartItems((prev) => {
      const newItems = [...prev];
      productsToAdd.forEach((product) => {
        const existingItem = newItems.find((item) => item.id === product.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          newItems.push({ ...product, quantity: 1 });
        }
      });
      return newItems;
    });

    setShowSmartCart(true);
    setSelectedProducts({});
  };

  const renderRecommendation = (recommendation: ProductRecommendation) => {
    const allSelected = recommendation.products.every(
      (product) => selectedProducts[product.id]
    );

    return (
      <div className="mt-2 p-4 bg-white rounded-lg border border-hims-brown/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-hims-brown flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {recommendation.title}
          </h3>
          <Button
            variant="outline"
            size="sm"
            className="text-sm"
            onClick={() => handleSelectAllProducts(recommendation.products)}
          >
            {allSelected ? "Deselect All" : "Select All"}
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {recommendation.description}
        </p>
        <div className="mt-2 space-y-4">
          {recommendation.products.map((product) => (
            <div key={product.id} className="flex items-center gap-4">
              <div
                className="w-6 h-6 rounded border border-hims-brown/20 flex items-center justify-center cursor-pointer hover:bg-hims-beige"
                onClick={() => handleSelectProduct(product.id)}
              >
                {selectedProducts[product.id] && (
                  <Check className="h-4 w-4 text-hims-brown" />
                )}
              </div>
              <div className="w-20 h-20 bg-hims-beige rounded-lg overflow-hidden shrink-0">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">
                  ${product.price.toFixed(2)}/mo
                </p>
              </div>
            </div>
          ))}
        </div>
        {recommendation.discount && (
          <p className="mt-4 text-sm text-green-600 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Save {recommendation.discount}% ($
            {recommendation.savings?.toFixed(2)})
          </p>
        )}
        <Button
          size="sm"
          className="mt-4 w-full bg-hims-brown hover:bg-hims-brown-dark text-white"
          onClick={() => handleAddSelectedToCart(recommendation.products)}
          disabled={
            !recommendation.products.some(
              (product) => selectedProducts[product.id]
            )
          }
        >
          Add Selected to Cart
        </Button>
      </div>
    );
  };

  // Handle direct button close
  const handleButtonClose = () => {
    onClose();
  };

  // Handle sheet close
  const handleSheetClose = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleSheetClose}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={`${
            isMobile
              ? "h-[85vh] border-t rounded-t-[10px] p-0 flex flex-col"
              : "w-full md:w-[50vw] lg:w-[45vw] p-0 border-l-0 sm:border-l bg-hims-beige flex flex-col"
          }`}
        >
          <SheetHeader className="p-4 border-b bg-hims-brown sticky top-0 z-50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <SheetTitle className="text-xl font-semibold text-white">
                    Care Assistant
                  </SheetTitle>
                  <SheetDescription className="text-sm text-hims-beige/80 flex items-center gap-1">
                    Powered by ResultFlow.ai
                  </SheetDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleButtonClose}
                className="h-10 w-10 text-white hover:text-white/80"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={`flex items-start gap-3 ${
                      message.type === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.type === "user"
                          ? "bg-hims-brown"
                          : "bg-hims-beige border border-hims-brown"
                      }`}
                    >
                      {message.type === "user" ? (
                        <User className="h-5 w-5 text-white" />
                      ) : (
                        <Bot className="h-5 w-5 text-hims-brown" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.type === "user"
                          ? "bg-hims-brown text-white"
                          : "bg-white border border-hims-brown/20"
                      }`}
                    >
                      <Markdown
                        options={{
                          forceBlock: true,
                          overrides: {
                            p: {
                              component: "p",
                              props: {
                                className: "whitespace-pre-wrap",
                              },
                            },
                            strong: {
                              component: "strong",
                              props: {
                                className: "font-semibold",
                              },
                            },
                          },
                        }}
                      >
                        {message.content}
                      </Markdown>
                    </div>
                  </div>
                  {message.recommendations?.map((recommendation, index) => (
                    <div key={index} className="ml-11 mt-2">
                      {renderRecommendation(recommendation)}
                    </div>
                  ))}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-hims-brown/60">
                  <Bot className="h-5 w-5" />
                  <span>Typing...</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t bg-white sticky bottom-0 flex-shrink-0 mt-auto">
            <div className="flex items-center justify-center mb-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-hims-brown hover:bg-hims-beige flex items-center gap-2"
              >
                📞 Talk to expert
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
                className="bg-hims-brown hover:bg-hims-brown-dark"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <SmartCartForHims
        isOpen={showSmartCart}
        onClose={() => setShowSmartCart(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </>
  );
};

export default ChatDialog;
