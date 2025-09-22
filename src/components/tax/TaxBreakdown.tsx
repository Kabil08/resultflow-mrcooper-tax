import { useState } from "react";
import {
  Calendar,
  TrendingUp,
  Info,
  AlertTriangle,
  Building2,
  ArrowUpRight,
  CreditCard,
  Check,
  Bell,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { TaxBreakdown as TaxBreakdownType } from "@/types/chat";

interface BankDetails {
  accountNumber: string;
  routingNumber: string;
  accountType: "checking" | "savings" | "money_market";
  accountHolderName: string;
}

interface TaxBreakdownProps {
  data: TaxBreakdownType;
  onMakePayment: (selectedMonths: string[]) => void;
  onClose: () => void;
  onCancel?: () => void;
}

const TaxBreakdown = ({
  data,
  onMakePayment,
  onClose,
  onCancel,
}: TaxBreakdownProps) => {
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAutoPaySetup, setShowAutoPaySetup] = useState(false);
  const [showAutoPaySuccess, setShowAutoPaySuccess] = useState(false);
  const [showAutoPayPrompt, setShowAutoPayPrompt] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountNumber: "",
    routingNumber: "",
    accountType: "checking",
    accountHolderName: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<BankDetails>>({});

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const triggerPaymentConfetti = () => {
    // First burst - center spread
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { x: 0.5, y: 0.55 },
      colors: ["#0066CC", "#60a5fa", "#93c5fd"],
      ticks: 200,
    });

    // After a small delay, add two side bursts
    setTimeout(() => {
      // Left burst
      confetti({
        particleCount: 25,
        angle: 60,
        spread: 40,
        origin: { x: 0, y: 0.65 },
        colors: ["#0066CC", "#60a5fa"],
      });

      // Right burst
      confetti({
        particleCount: 25,
        angle: 120,
        spread: 40,
        origin: { x: 1, y: 0.65 },
        colors: ["#0066CC", "#60a5fa"],
      });
    }, 100);
  };

  const handlePayment = async () => {
    if (selectedMonths.length === 0) return;

    // Show autopay prompt if not already set up
    // In a real app, you would check this from your backend/state management
    const isAutoPayEnabled = false; // This would come from your backend
    if (!isAutoPayEnabled) {
      setShowAutoPayPrompt(true);
      return;
    }

    setIsProcessing(true);

    // Add a slight delay to show the animation
    setTimeout(() => {
      triggerPaymentConfetti();
      const selectedMonthNames = selectedMonths.map((monthYear) => {
        const [month, year] = monthYear.split("-");
        return `${month} ${year}`;
      });
      onMakePayment(selectedMonthNames);
      setIsProcessing(false);
    }, 1000);
  };

  const handlePaymentWithoutAutoPay = () => {
    setShowAutoPayPrompt(false);
    setIsProcessing(true);

    setTimeout(() => {
      triggerPaymentConfetti();
      const selectedMonthNames = selectedMonths.map((monthYear) => {
        const [month, year] = monthYear.split("-");
        return `${month} ${year}`;
      });
      onMakePayment(selectedMonthNames);
      setIsProcessing(false);
    }, 1000);
  };

  const handleEnableAutoPay = () => {
    setShowAutoPaySetup(true);
  };

  const validateBankDetails = (): boolean => {
    const errors: Partial<BankDetails> = {};

    if (!bankDetails.accountNumber.trim()) {
      errors.accountNumber = "Account number is required";
    } else if (
      !/^\d{4,17}$/.test(bankDetails.accountNumber.replace(/\s/g, ""))
    ) {
      errors.accountNumber = "Invalid account number";
    }

    if (!bankDetails.routingNumber.trim()) {
      errors.routingNumber = "Routing number is required";
    } else if (!/^\d{9}$/.test(bankDetails.routingNumber)) {
      errors.routingNumber = "Invalid routing number (must be 9 digits)";
    }

    if (!bankDetails.accountHolderName.trim()) {
      errors.accountHolderName = "Account holder name is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSetupAutoPay = () => {
    if (!validateBankDetails()) {
      return;
    }

    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowAutoPaySuccess(true);
    }, 1000);
  };

  const formatAccountNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,17}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formatted = formatAccountNumber(e.target.value);
    setBankDetails((prev) => ({ ...prev, accountNumber: formatted }));
  };

  const calculateTotal = () => {
    return selectedMonths.reduce((total, monthYear) => {
      const month = data.unpaidMonths.find(
        (m) => `${m.month}-${m.year}` === monthYear
      );
      return total + (month ? month.amount : 0);
    }, 0);
  };

  // Calculate percentage increase from previous month
  const calculateIncrease = (currentAmount: number, previousAmount: number) => {
    const increase = ((currentAmount - previousAmount) / previousAmount) * 100;
    return increase.toFixed(1);
  };

  if (showAutoPayPrompt) {
    return (
      <Dialog
        open
        onOpenChange={() => {
          setShowAutoPayPrompt(false);
        }}
      >
        <DialogContent className="sm:max-w-md bg-white">
          <div className="text-center py-4">
            <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
              Enable AutoPay?
            </DialogTitle>
            <DialogDescription className="text-gray-600 mb-6">
              You haven't enabled AutoPay yet. Would you like to set it up now
              to avoid future late fees?
            </DialogDescription>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-[#0066CC] mt-1" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      Benefits of AutoPay
                    </p>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• Never miss a payment deadline</li>
                      <li>• Avoid late fees completely</li>
                      <li>• Hassle-free monthly payments</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full bg-[#0066CC] hover:bg-blue-700 text-white"
                onClick={() => {
                  setShowAutoPayPrompt(false);
                  setShowAutoPaySetup(true);
                }}
              >
                Set Up AutoPay
              </Button>
              <Button
                variant="outline"
                className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
                onClick={handlePaymentWithoutAutoPay}
              >
                Continue Without AutoPay
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showAutoPaySuccess) {
    return (
      <Dialog
        open
        onOpenChange={() => {
          setShowAutoPaySuccess(false);
          setShowAutoPaySetup(false);
          onClose();
        }}
      >
        <DialogContent className="sm:max-w-md bg-white">
          <div className="text-center py-4">
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
                      ${data.unpaidMonths[0]?.amount.toFixed(2)}
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
                setShowAutoPaySuccess(false);
                setShowAutoPaySetup(false);
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

  if (showAutoPaySetup && !showAutoPaySuccess) {
    return (
      <Dialog open onOpenChange={() => setShowAutoPaySetup(false)}>
        <DialogContent className="sm:max-w-lg bg-white max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-semibold text-[#0066CC]">
                Set Up AutoPay
              </DialogTitle>
              <DialogClose
                className="h-6 w-6 text-gray-500 hover:text-[#0066CC]"
                onClick={() => setShowAutoPaySetup(false)}
              />
            </div>
            <DialogDescription className="text-gray-600">
              Enter your bank account details to set up automatic monthly
              payments
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto pr-2">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-[#0066CC] mb-2">
                AutoPay Benefits
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-[#0066CC] flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                  Never miss a payment deadline
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-[#0066CC] flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                  Avoid late fees completely
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-[#0066CC] flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                  Automatic monthly payments
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["checking", "savings", "money_market"].map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        setBankDetails((prev) => ({
                          ...prev,
                          accountType: type as BankDetails["accountType"],
                        }))
                      }
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        bankDetails.accountType === type
                          ? "bg-[#0066CC] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {type
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  placeholder="123456789"
                  value={bankDetails.routingNumber}
                  onChange={(e) =>
                    setBankDetails((prev) => ({
                      ...prev,
                      routingNumber: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  maxLength={9}
                  className={formErrors.routingNumber ? "border-red-500" : ""}
                />
                {formErrors.routingNumber && (
                  <p className="text-sm text-red-500">
                    {formErrors.routingNumber}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="Enter your account number"
                  value={bankDetails.accountNumber}
                  onChange={handleAccountNumberChange}
                  maxLength={17}
                  className={formErrors.accountNumber ? "border-red-500" : ""}
                />
                {formErrors.accountNumber && (
                  <p className="text-sm text-red-500">
                    {formErrors.accountNumber}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                <Input
                  id="accountHolderName"
                  placeholder="John Doe"
                  value={bankDetails.accountHolderName}
                  onChange={(e) =>
                    setBankDetails((prev) => ({
                      ...prev,
                      accountHolderName: e.target.value,
                    }))
                  }
                  className={
                    formErrors.accountHolderName ? "border-red-500" : ""
                  }
                />
                {formErrors.accountHolderName && (
                  <p className="text-sm text-red-500">
                    {formErrors.accountHolderName}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Important Note</p>
                  <p>
                    By enabling AutoPay, you authorize automatic monthly
                    payments from your bank account on the specified date.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-4 mt-4 border-t flex-shrink-0">
            <Button
              onClick={handleSetupAutoPay}
              disabled={isProcessing}
              className="w-full bg-[#0066CC] hover:bg-blue-700 text-white"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  Setting up AutoPay...
                </span>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Enable AutoPay
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAutoPaySetup(false)}
              className="w-full"
              disabled={isProcessing}
            >
              Back to Payment Breakdown
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={handleClose}>
      {!showAutoPaySetup ? (
        <DialogContent className="sm:max-w-lg bg-white max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-semibold text-[#0066CC]">
                Payment Breakdown
              </DialogTitle>
              <DialogClose
                className="h-6 w-6 text-gray-500 hover:text-[#0066CC]"
                onClick={handleClose}
              />
            </div>
            <DialogDescription className="text-gray-600">
              Review your tax payments and property details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto pr-2">
            {/* Property Overview */}
            <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
              <div className="flex items-start">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-[#0066CC] mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Property Details
                    </p>
                    <p className="text-sm text-gray-600">{data.address}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3 border-t pt-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Annual Tax Rate
                    </p>
                    <p className="text-lg font-semibold text-[#0066CC]">2.5%</p>
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3" />
                      +0.3% from last year
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Property Value
                    </p>
                    <p className="text-lg font-semibold text-[#0066CC]">
                      $520,000
                    </p>
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3" />
                      +5.2% appreciation
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 p-3 rounded-md flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">Tax Assessment Notice</p>
                    <p>
                      Your property has been reassessed. The new tax rate will
                      be effective from October 2025.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Unpaid Months */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">
                  Unpaid Tax Payments
                </h3>
                <p className="text-sm text-amber-600 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due Monthly
                </p>
              </div>
              <div className="grid gap-2">
                {data.unpaidMonths.map((month, index) => {
                  const previousMonth = data.unpaidMonths[index + 1];
                  const hasIncrease =
                    previousMonth && month.amount > previousMonth.amount;
                  const increasePercentage = previousMonth
                    ? calculateIncrease(month.amount, previousMonth.amount)
                    : 0;

                  return (
                    <div
                      key={`${month.month}-${month.year}`}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        selectedMonths.includes(`${month.month}-${month.year}`)
                          ? "border-[#0066CC] bg-blue-50"
                          : "border-gray-200 hover:border-[#0066CC] hover:bg-blue-50"
                      } transition-colors cursor-pointer`}
                      onClick={() => {
                        const monthKey = `${month.month}-${month.year}`;
                        setSelectedMonths((prev) =>
                          prev.includes(monthKey)
                            ? prev.filter((m) => m !== monthKey)
                            : [...prev, monthKey]
                        );
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`${month.month}-${month.year}`}
                          checked={selectedMonths.includes(
                            `${month.month}-${month.year}`
                          )}
                          onChange={(e) => {
                            e.stopPropagation();
                            const monthKey = `${month.month}-${month.year}`;
                            if (e.target.checked) {
                              setSelectedMonths((prev) => [...prev, monthKey]);
                            } else {
                              setSelectedMonths((prev) =>
                                prev.filter((m) => m !== monthKey)
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-[#0066CC] focus:ring-[#0066CC] cursor-pointer"
                        />
                        <div>
                          <label
                            htmlFor={`${month.month}-${month.year}`}
                            className="text-sm font-medium leading-none text-gray-900 cursor-pointer select-none"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {month.month} {month.year}
                          </label>
                          {month.status === "overdue" && (
                            <p className="text-xs text-red-600 mt-0.5">
                              Overdue by{" "}
                              {month.lateFees ? `($${month.lateFees} fee)` : ""}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ${month.amount.toFixed(2)}
                        </p>
                        {hasIncrease && (
                          <div className="flex items-center gap-1 justify-end text-xs text-amber-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>+{increasePercentage}% from last month</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="rounded-lg bg-gray-50 p-4 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Base Amount:</span>
                <span>
                  ${(data.totalAmount - data.totalLateFees).toFixed(2)}
                </span>
              </div>
              {data.totalLateFees > 0 ? (
                <>
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Late Fees:</span>
                    <span>+${data.totalLateFees.toFixed(2)}</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-[#0066CC] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-[#0066CC]">
                          Save ${data.totalLateFees.toFixed(2)} with AutoPay
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Enable AutoPay to avoid late fees and save $
                          {data.totalLateFees.toFixed(2)} on your next payments.
                          Never miss a payment again!
                        </p>
                        <Button
                          variant="link"
                          className="text-[#0066CC] hover:text-blue-700 p-0 h-auto mt-2 text-sm font-medium"
                          onClick={handleEnableAutoPay}
                        >
                          Enable AutoPay →
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-[#0066CC] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#0066CC]">
                        Simplify Your Tax Payments with AutoPay
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Set up AutoPay to ensure you never miss a payment. Enjoy
                        hassle-free, automatic monthly payments and avoid any
                        potential late fees.
                      </p>
                      <Button
                        variant="link"
                        className="text-[#0066CC] hover:text-blue-700 p-0 h-auto mt-2 text-sm font-medium"
                        onClick={handleEnableAutoPay}
                      >
                        Enable AutoPay →
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-between text-sm text-amber-600">
                <span>Average Monthly Increase:</span>
                <span>
                  +
                  {calculateIncrease(
                    data.unpaidMonths[0]?.amount || 0,
                    data.unpaidMonths[data.unpaidMonths.length - 1]?.amount || 0
                  )}
                  %
                </span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total Due:</span>
                <span className="text-[#0066CC] text-lg">
                  ${data.totalAmount.toFixed(2)}
                </span>
              </div>

              {selectedMonths.length > 0 && (
                <div className="flex justify-between font-medium pt-2 border-t border-gray-200 text-gray-900">
                  <span>Selected Total:</span>
                  <span className="text-[#0066CC]">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex flex-col gap-2 pt-4 mt-4 border-t flex-shrink-0">
            <Button
              onClick={handlePayment}
              disabled={isProcessing || selectedMonths.length === 0}
              className={`w-full text-white relative ${
                selectedMonths.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0066CC] hover:bg-blue-700"
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  Processing... 🎉
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Pay Selected ({selectedMonths.length || "0"}{" "}
                  {selectedMonths.length === 1 ? "month" : "months"})
                </span>
              )}
            </Button>
          </div>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-lg bg-white max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-semibold text-[#0066CC]">
                {showAutoPaySuccess ? "AutoPay Enabled! 🎉" : "Set Up AutoPay"}
              </DialogTitle>
              {!showAutoPaySuccess && (
                <DialogClose
                  className="h-6 w-6 text-gray-500 hover:text-[#0066CC]"
                  onClick={() => setShowAutoPaySetup(false)}
                />
              )}
            </div>
            <DialogDescription className="text-gray-600">
              {showAutoPaySuccess
                ? "Your automatic payments have been successfully set up"
                : "Set up automatic monthly payments for your property tax"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto pr-2">
            {showAutoPaySuccess ? (
              <div className="py-8 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  AutoPay Successfully Enabled!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your automatic payments have been set up successfully.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg inline-block">
                  <p className="text-sm text-[#0066CC]">
                    Monthly Amount:{" "}
                    <span className="font-semibold">
                      ${data.unpaidMonths[0]?.amount.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-[#0066CC] mb-2">
                    AutoPay Benefits
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-[#0066CC] flex items-center justify-center text-white text-xs">
                        ✓
                      </div>
                      Never miss a payment deadline
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-[#0066CC] flex items-center justify-center text-white text-xs">
                        ✓
                      </div>
                      Avoid late fees completely
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-[#0066CC] flex items-center justify-center text-white text-xs">
                        ✓
                      </div>
                      Automatic monthly payments
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Payment Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Monthly Amount:</span>
                      <span className="font-medium">
                        ${data.unpaidMonths[0]?.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Date:</span>
                      <span className="font-medium">15th of each month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">First Payment:</span>
                      <span className="font-medium">Next due date</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium">Important Note</p>
                      <p>
                        By enabling AutoPay, you authorize automatic monthly
                        payments from your selected payment method on the
                        specified date.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-4 mt-4 border-t flex-shrink-0">
            {!showAutoPaySuccess && (
              <>
                <Button
                  onClick={handleEnableAutoPay}
                  disabled={isProcessing}
                  className="w-full bg-[#0066CC] hover:bg-blue-700 text-white"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      Setting up AutoPay...
                    </span>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Enable AutoPay
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAutoPaySetup(false)}
                  className="w-full"
                  disabled={isProcessing}
                >
                  Back to Payment Breakdown
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default TaxBreakdown;
