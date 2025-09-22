import { useState } from "react";
import { Check, CreditCard, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AutoPaySetupProps {
  userData?: {
    autoPayEnabled: boolean;
    monthlyPayment: number;
    dueDate: number;
    bankName: string;
    accountLast4: string;
  };
  onSetupAutoPay: (enabled: boolean) => void;
  onClose: () => void;
  onCancel?: () => void;
}

interface FormErrors {
  routingNumber?: string;
  accountNumber?: string;
  accountHolderName?: string;
}

const AutoPaySetup = ({
  userData,
  onSetupAutoPay,
  onClose,
  onCancel,
}: AutoPaySetupProps) => {
  const [accountType, setAccountType] = useState<"checking" | "savings">(
    "checking"
  );
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!routingNumber.trim()) {
      errors.routingNumber = "Routing number is required";
    } else if (!/^\d{9}$/.test(routingNumber)) {
      errors.routingNumber = "Invalid routing number (must be 9 digits)";
    }

    if (!accountNumber.trim()) {
      errors.accountNumber = "Account number is required";
    } else if (!/^\d{4,17}$/.test(accountNumber)) {
      errors.accountNumber = "Invalid account number";
    }

    if (!accountHolderName.trim()) {
      errors.accountHolderName = "Account holder name is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 1000);
  };

  if (showSuccess) {
    return (
      <Dialog open onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg bg-white">
          <div className="text-center py-6">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
              AutoPay Successfully Enabled
            </DialogTitle>
            <DialogDescription className="text-gray-600 mb-6">
              Your automatic payments have been set up successfully
            </DialogDescription>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-[#0066CC] mt-1" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Monthly Payment</p>
                    <p className="text-sm text-gray-600">
                      ${userData?.monthlyPayment.toLocaleString() || "1,402.76"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-[#0066CC] mt-1" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      Payment Notifications
                    </p>
                    <p className="text-sm text-gray-600">
                      You'll receive email reminders before each payment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-[#0066CC] hover:bg-blue-700 text-white"
              onClick={() => {
                onSetupAutoPay(true);
                onClose();
              }}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-white max-h-[90vh] flex flex-col mb-4">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-semibold text-[#0066CC]">
            Set Up AutoPay
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Enter your bank account details to set up automatic monthly payments
          </p>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto flex-1 pr-2">
          {/* Benefits Section */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-[#0066CC] font-semibold text-lg mb-4">
              AutoPay Benefits
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-[#0066CC] p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-700">
                  Never miss a payment deadline
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-[#0066CC] p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-700">
                  Avoid late fees completely
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-[#0066CC] p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-700">
                  Automatic monthly payments
                </span>
              </div>
            </div>
          </div>

          {/* Account Type Selection */}
          <div className="space-y-2">
            <label className="text-gray-900 font-medium">Account Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`p-4 rounded-lg text-center font-medium transition-colors ${
                  accountType === "checking"
                    ? "bg-[#0066CC] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setAccountType("checking")}
              >
                Checking
              </button>
              <button
                className={`p-4 rounded-lg text-center font-medium transition-colors ${
                  accountType === "savings"
                    ? "bg-[#0066CC] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setAccountType("savings")}
              >
                Savings
              </button>
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-gray-900 font-medium">
                Routing Number
              </label>
              <Input
                value={routingNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setRoutingNumber(value);
                  setFormErrors((prev) => ({
                    ...prev,
                    routingNumber: undefined,
                  }));
                }}
                placeholder="123456789"
                maxLength={9}
                className={`bg-white ${
                  formErrors.routingNumber ? "border-red-500" : ""
                }`}
              />
              {formErrors.routingNumber && (
                <p className="text-sm text-red-500">
                  {formErrors.routingNumber}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-gray-900 font-medium">
                Account Number
              </label>
              <Input
                value={accountNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setAccountNumber(value);
                  setFormErrors((prev) => ({
                    ...prev,
                    accountNumber: undefined,
                  }));
                }}
                placeholder="Enter your account number"
                maxLength={17}
                className={`bg-white ${
                  formErrors.accountNumber ? "border-red-500" : ""
                }`}
              />
              {formErrors.accountNumber && (
                <p className="text-sm text-red-500">
                  {formErrors.accountNumber}
                </p>
              )}
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-gray-900 font-medium">
                Account Holder Name
              </label>
              <Input
                value={accountHolderName}
                onChange={(e) => {
                  setAccountHolderName(e.target.value);
                  setFormErrors((prev) => ({
                    ...prev,
                    accountHolderName: undefined,
                  }));
                }}
                placeholder="John Doe"
                className={`bg-white ${
                  formErrors.accountHolderName ? "border-red-500" : ""
                }`}
              />
              {formErrors.accountHolderName && (
                <p className="text-sm text-red-500">
                  {formErrors.accountHolderName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex flex-col gap-2 pt-4 mt-4 border-t flex-shrink-0">
          <Button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full bg-[#0066CC] hover:bg-blue-700 text-white font-medium h-12"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                Setting up AutoPay...
              </span>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" /> Enable AutoPay
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
            className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 font-medium h-12"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AutoPaySetup;
