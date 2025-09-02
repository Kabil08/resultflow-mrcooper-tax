import { X, Minus, Plus, Sparkles, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { CartItem } from "@/types/chat";
import { mockUserData } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiOptions {
  spread?: number;
  startVelocity?: number;
  decay?: number;
  scalar?: number;
}

interface SmartCartForHimsProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
}

const SmartCartForHims = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
}: SmartCartForHimsProps) => {
  const isMobile = useIsMobile();
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);

  // Reset checkout state when dialog is opened
  useEffect(() => {
    if (isOpen) {
      setIsCheckoutComplete(false);
    }
  }, [isOpen]);

  const triggerConfetti = () => {
    // Fire multiple confetti bursts
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      spread: 360,
      ticks: 100,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
    };

    function fire(particleRatio: number, opts: ConfettiOptions) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const handleCheckout = () => {
    setIsCheckoutComplete(true);
    setTimeout(triggerConfetti, 100); // Slight delay to ensure animation runs after state update
  };

  const renderSuccessContent = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="animate-bounce-slow">
        <PartyPopper className="h-16 w-16 text-hims-brown" />
      </div>
      <h2 className="text-2xl font-semibold text-hims-brown">
        Thank you for your purchase! 🎉
      </h2>
      <p className="text-hims-brown/60 max-w-sm">
        Your order has been successfully placed. We'll send you an email with
        your order details and tracking information.
      </p>
      <Button
        className="mt-4 bg-hims-brown hover:bg-hims-brown-dark text-white"
        onClick={() => {
          setIsCheckoutComplete(false);
          onClose();
        }}
      >
        Close
      </Button>
    </div>
  );

  const renderHeader = () => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-hims-brown rounded-full flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-hims-brown">
              Your smart cart
            </h2>
            <div className="bg-hims-brown text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> AI
            </div>
          </div>
          <p className="text-sm text-hims-brown/60">Powered by ResultFlow AI</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="text-hims-brown hover:text-hims-brown/80"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderContent = () => (
    <>
      <div className="overflow-y-auto flex-1">
        {isCheckoutComplete ? (
          renderSuccessContent()
        ) : (
          <div className="p-4 space-y-4">
            {/* Cart Items */}
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-hims-beige rounded-lg border border-hims-beige-dark"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-hims-brown">{item.name}</h3>
                    <p className="text-sm text-hims-brown/60">
                      ${item.price.toFixed(2)}/mo
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-hims-beige text-hims-brown"
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-6 text-center text-hims-brown">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-hims-beige text-hims-brown"
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Payment Method */}
            <div className="p-4 bg-white rounded-lg border border-hims-brown/20">
              <h3 className="text-hims-brown mb-2">Payment Method</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-hims-brown">
                    {mockUserData.paymentMethod.cardType} ••••{" "}
                    {mockUserData.paymentMethod.lastFourDigits}
                  </span>
                  {mockUserData.paymentMethod.discount && (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                      {mockUserData.paymentMethod.discount}% off
                    </span>
                  )}
                </div>
                <Button variant="outline" size="sm" className="text-hims-brown">
                  Change
                </Button>
              </div>
              <p className="text-sm text-hims-brown/60 mt-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Powered by ResultFlow AI: Using your Bank of America credit card
                to checkout gets you the most discount
              </p>
            </div>

            {/* Delivery Address */}
            <div className="p-4 bg-white rounded-lg border border-hims-brown/20">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-hims-brown">Delivery Address</h3>
              </div>
              <p className="text-sm text-hims-brown/60 mb-3">
                📍 Based on your recent purchases, this is your preferred
                delivery address
              </p>
              <div className="text-sm text-hims-brown">
                <p>{mockUserData.address.street}</p>
                <p>
                  {mockUserData.address.city}, {mockUserData.address.state}{" "}
                  {mockUserData.address.zipCode}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3 text-hims-brown"
              >
                Change
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-12 border-hims-brown text-hims-brown hover:bg-hims-beige"
              >
                Move to Cart
              </Button>
              <Button
                size="lg"
                className="flex-1 h-12 bg-hims-brown hover:bg-hims-brown-dark text-white"
                onClick={handleCheckout}
              >
                Proceed to checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="h-[85vh] bg-white">
          <DrawerHeader className="border-b border-hims-beige bg-hims-beige">
            {renderHeader()}
          </DrawerHeader>
          {renderContent()}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-4 border-b bg-hims-beige">
          {renderHeader()}
        </DialogHeader>
        <div className="flex flex-col max-h-[80vh]">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default SmartCartForHims;
