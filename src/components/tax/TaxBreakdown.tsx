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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { TaxBreakdown as TaxBreakdownType } from "@/types/chat";

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
  const [showPropertyInfo, setShowPropertyInfo] = useState(false);
  const [showAutoPaySetup, setShowAutoPaySetup] = useState(false);
  const [showAutoPaySuccess, setShowAutoPaySuccess] = useState(false);
  const [showAutoPayPrompt, setShowAutoPayPrompt] = useState(false);

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

  const handleSetupAutoPay = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowAutoPaySuccess(true);
    }, 1000);
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
                      ${data.unpaidMonths[0]?.amount.toFixed(2)} on the 15th of
                      each month
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
                      You'll receive email reminders 3 days before each payment
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
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-[#0066CC] mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Property Details
                    </p>
                    <p className="text-sm text-gray-600">{data.address}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#0066CC] hover:bg-blue-50 -mt-1"
                  onClick={() => setShowPropertyInfo(!showPropertyInfo)}
                >
                  {showPropertyInfo ? "Hide Details" : "View Details"}
                </Button>
              </div>

              {showPropertyInfo && (
                <div className="mt-4 space-y-3 border-t pt-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Annual Tax Rate
                      </p>
                      <p className="text-lg font-semibold text-[#0066CC]">
                        2.5%
                      </p>
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
              )}
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

            {/* Tax Information */}
            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-md">
              <Info className="h-5 w-5 text-[#0066CC] mt-1 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-2">Important Tax Information</p>
                <ul className="list-disc ml-4 space-y-2">
                  <li>
                    Property taxes are assessed annually and billed monthly
                  </li>
                  <li>Late payments may incur additional fees</li>
                  <li>Tax rates may change based on annual assessments</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex flex-col gap-2 pt-4 mt-4 border-t flex-shrink-0">
            {selectedMonths.length > 0 && (
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-[#0066CC] hover:bg-blue-700 text-white relative"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    Processing... 🎉
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Pay Selected ({selectedMonths.length}{" "}
                    {selectedMonths.length === 1 ? "month" : "months"})
                  </span>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleEnableAutoPay}
              className="w-full border-[#0066CC] text-[#0066CC] hover:bg-blue-50"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Enable AutoPay
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
                  Your first automatic payment will be processed on the 15th of
                  next month.
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
                    <li className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-[#0066CC] flex items-center justify-center text-white text-xs">
                        ✓
                      </div>
                      Email notifications before each payment
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
              </>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default TaxBreakdown;
