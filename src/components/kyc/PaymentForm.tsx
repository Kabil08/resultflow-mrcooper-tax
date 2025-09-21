import { useState } from "react";
import { CreditCard, Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface PaymentFormProps {
  onSubmit: (data: {
    type: "bank" | "card";
    accountNumber?: string;
    routingNumber?: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    bankName?: string;
  }) => void;
  onClose: () => void;
  onCancel?: () => void;
}

interface BankFormData {
  bankName: string;
  routingNumber: string;
  accountNumber: string;
}

interface CardFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const PaymentForm = ({ onSubmit, onClose, onCancel }: PaymentFormProps) => {
  const [paymentType, setPaymentType] = useState<"bank" | "card">("bank");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    register: registerBank,
    handleSubmit: handleBankSubmit,
    formState: { errors: bankErrors },
  } = useForm<BankFormData>();
  const {
    register: registerCard,
    handleSubmit: handleCardSubmit,
    formState: { errors: cardErrors },
  } = useForm<CardFormData>();

  const triggerConfetti = () => {
    // Create a confetti animation that shoots from both sides
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ["#0066CC", "#004C99", "#60a5fa"],
      });

      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ["#0066CC", "#004C99", "#60a5fa"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const onBankSubmit = (data: BankFormData) => {
    setIsProcessing(true);
    triggerConfetti();
    setTimeout(() => {
      onSubmit({
        type: "bank",
        ...data,
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    }, 1000);
  };

  const onCardSubmit = (data: CardFormData) => {
    setIsProcessing(true);
    triggerConfetti();
    setTimeout(() => {
      onSubmit({
        type: "card",
        ...data,
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    }, 1000);
  };

  if (showSuccess) {
    return (
      <Dialog open onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-white text-center">
          <div className="py-8 space-y-4">
            <div className="text-5xl">🎉</div>
            <h2 className="text-2xl font-semibold text-mrcooper-blue">
              Payment Verified!
            </h2>
            <p className="text-gray-600">
              Your payment information has been successfully verified.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-gray-900">
              Payment Information
            </DialogTitle>
            <DialogClose
              className="h-6 w-6 text-gray-500 hover:text-gray-700"
              onClick={handleClose}
            />
          </div>
          <DialogDescription className="text-gray-600">
            Please provide your payment information for verification
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            type="button"
            variant={paymentType === "bank" ? "default" : "outline"}
            className={`w-full ${
              paymentType === "bank"
                ? "bg-mrcooper-blue hover:bg-mrcooper-blue-dark text-white"
                : "border-2 border-mrcooper-blue text-mrcooper-blue hover:bg-mrcooper-blue/10"
            }`}
            onClick={() => setPaymentType("bank")}
          >
            <Building2 className="mr-2 h-5 w-5" />
            Bank Account
          </Button>
          <Button
            type="button"
            variant={paymentType === "card" ? "default" : "outline"}
            className={`w-full ${
              paymentType === "card"
                ? "bg-mrcooper-blue hover:bg-mrcooper-blue-dark text-white"
                : "border-2 border-mrcooper-blue text-mrcooper-blue hover:bg-mrcooper-blue/10"
            }`}
            onClick={() => setPaymentType("card")}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Credit Card
          </Button>
        </div>

        {paymentType === "bank" ? (
          <form onSubmit={handleBankSubmit(onBankSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Bank Name
              </label>
              <Input
                {...registerBank("bankName", {
                  required: "Bank name is required",
                })}
                placeholder="Enter your bank name"
                className="border-gray-300 focus:border-mrcooper-blue focus:ring-mrcooper-blue"
              />
              {bankErrors.bankName && (
                <p className="text-sm text-red-500">
                  {bankErrors.bankName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Routing Number
              </label>
              <Input
                {...registerBank("routingNumber", {
                  required: "Routing number is required",
                  pattern: {
                    value: /^\d{9}$/,
                    message: "Routing number must be 9 digits",
                  },
                })}
                type="password"
                placeholder="Enter 9-digit routing number"
                className="border-gray-300 focus:border-mrcooper-blue focus:ring-mrcooper-blue"
              />
              {bankErrors.routingNumber && (
                <p className="text-sm text-red-500">
                  {bankErrors.routingNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Account Number
              </label>
              <Input
                {...registerBank("accountNumber", {
                  required: "Account number is required",
                  pattern: {
                    value: /^\d{8,17}$/,
                    message: "Account number must be between 8 and 17 digits",
                  },
                })}
                type="password"
                placeholder="Enter your account number"
                className="border-gray-300 focus:border-mrcooper-blue focus:ring-mrcooper-blue"
              />
              {bankErrors.accountNumber && (
                <p className="text-sm text-red-500">
                  {bankErrors.accountNumber.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-mrcooper-blue hover:bg-mrcooper-blue-dark text-white"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Submit"}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCardSubmit(onCardSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Card Number
              </label>
              <Input
                {...registerCard("cardNumber", {
                  required: "Card number is required",
                  pattern: {
                    value: /^\d{16}$/,
                    message: "Card number must be 16 digits",
                  },
                })}
                type="password"
                placeholder="Enter 16-digit card number"
                className="border-gray-300 focus:border-mrcooper-blue focus:ring-mrcooper-blue"
              />
              {cardErrors.cardNumber && (
                <p className="text-sm text-red-500">
                  {cardErrors.cardNumber.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Expiry Date
                </label>
                <Input
                  {...registerCard("expiryDate", {
                    required: "Expiry date is required",
                    pattern: {
                      value: /^(0[1-9]|1[0-2])\/([2-9][0-9])$/,
                      message: "Enter valid expiry date (MM/YY)",
                    },
                  })}
                  placeholder="MM/YY"
                  className="border-gray-300 focus:border-mrcooper-blue focus:ring-mrcooper-blue"
                />
                {cardErrors.expiryDate && (
                  <p className="text-sm text-red-500">
                    {cardErrors.expiryDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">CVV</label>
                <Input
                  {...registerCard("cvv", {
                    required: "CVV is required",
                    pattern: {
                      value: /^\d{3,4}$/,
                      message: "CVV must be 3 or 4 digits",
                    },
                  })}
                  type="password"
                  placeholder="Enter CVV"
                  className="border-gray-300 focus:border-mrcooper-blue focus:ring-mrcooper-blue"
                />
                {cardErrors.cvv && (
                  <p className="text-sm text-red-500">
                    {cardErrors.cvv.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-mrcooper-blue hover:bg-mrcooper-blue-dark text-white"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Submit"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentForm;
