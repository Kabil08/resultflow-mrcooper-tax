import { useState } from "react";
import { Calendar, CreditCard, Info, Check, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { UserData } from "@/types/chat";

interface AutoPaySetupProps {
  userData: UserData;
  onSetupAutoPay: (enabled: boolean) => void;
  onClose: () => void;
  onCancel?: () => void;
}

const AutoPaySetup = ({
  userData,
  onSetupAutoPay,
  onClose,
  onCancel,
}: AutoPaySetupProps) => {
  const [isEnabled, setIsEnabled] = useState(userData.autoPayEnabled);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    setIsConfirming(true);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#0066CC", "#004C99", "#60a5fa"],
    });
  };

  const handleConfirm = () => {
    setShowSuccess(true);
    triggerConfetti();
    setTimeout(() => {
      onSetupAutoPay(isEnabled);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  // Get payment details from either direct properties or propertyDetails
  const monthlyPayment =
    userData.monthlyPayment || userData.propertyDetails.monthlyPayment;
  const dueDate =
    userData.dueDate ||
    new Date(userData.propertyDetails.nextDueDate).getDate();
  const bankName =
    userData.bankName || userData.paymentMethod?.bankName || "Your Bank";
  const accountLast4 =
    userData.accountLast4 || userData.paymentMethod?.lastFourDigits || "****";

  if (showSuccess) {
    return (
      <Dialog open onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-white text-center">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-semibold text-mrcooper-blue text-center flex items-center justify-center gap-2">
                <ShieldCheck className="h-6 w-6 text-mrcooper-blue" />
                AutoPay {isEnabled ? "Enabled" : "Disabled"}
              </DialogTitle>
              <DialogClose
                className="h-6 w-6 text-gray-500 hover:text-mrcooper-blue"
                onClick={handleClose}
              />
            </div>
          </DialogHeader>
          <div className="py-8 space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-mrcooper-beige/20 flex items-center justify-center">
              <Check className="h-6 w-6 text-mrcooper-blue" />
            </div>
            <h2 className="text-2xl font-semibold text-mrcooper-blue">
              AutoPay {isEnabled ? "Enabled" : "Disabled"}
            </h2>
            <p className="text-gray-600">
              {isEnabled
                ? `Your monthly payment of $${monthlyPayment.toFixed(
                    2
                  )} will be automatically processed on the ${dueDate}${getOrdinalSuffix(
                    dueDate
                  )} of each month.`
                : "AutoPay has been disabled. You'll need to make manual payments going forward."}
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
            <DialogTitle className="text-xl font-semibold text-mrcooper-blue">
              AutoPay Setup
            </DialogTitle>
            <DialogClose
              className="h-6 w-6 text-gray-500 hover:text-mrcooper-blue"
              onClick={handleClose}
            />
          </div>
          <DialogDescription className="text-gray-600">
            Automatically pay your monthly mortgage and avoid late fees
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="space-y-1 flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Enable AutoPay
              </h3>
              <p className="text-sm text-gray-600">
                Your payment will be automatically processed on the due date
              </p>
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggle}
              className="flex-shrink-0 data-[state=checked]:bg-mrcooper-blue"
            />
          </div>

          <div className="rounded-lg border border-gray-200 p-4 space-y-4 bg-gray-50">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-mrcooper-blue mt-1" />
              <div>
                <p className="font-medium text-gray-900">Payment Schedule</p>
                <p className="text-sm text-gray-600">
                  Monthly payment of ${monthlyPayment.toFixed(2)}
                  <br />
                  Due on the {dueDate}
                  {getOrdinalSuffix(dueDate)} of each month
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-mrcooper-blue mt-1" />
              <div>
                <p className="font-medium text-gray-900">Payment Method</p>
                <p className="text-sm text-gray-600">
                  {bankName} (****{accountLast4})
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-mrcooper-beige/20 p-4 rounded-md">
              <Info className="h-5 w-5 text-mrcooper-blue mt-1 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-2">Important Information</p>
                <ul className="list-disc ml-4 space-y-2">
                  <li>Payments will be processed on the due date</li>
                  <li>You can cancel AutoPay at any time</li>
                  <li>Ensure sufficient funds are available</li>
                  <li>
                    You'll receive email notifications before each payment
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {isConfirming && (
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEnabled(!isEnabled);
                  setIsConfirming(false);
                }}
                className="w-full sm:w-auto border-mrcooper-blue text-mrcooper-blue hover:bg-mrcooper-beige/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="w-full sm:w-auto bg-mrcooper-blue hover:bg-mrcooper-blue-dark text-white font-medium"
              >
                {isEnabled ? "Enable" : "Disable"} AutoPay
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export default AutoPaySetup;
