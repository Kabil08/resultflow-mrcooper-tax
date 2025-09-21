import { useState } from "react";
import {
  Calendar,
  TrendingUp,
  Info,
  AlertTriangle,
  DollarSign,
  Building2,
  ArrowUpRight,
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
  onSetupAutoPay: () => void;
  onClose: () => void;
  onCancel?: () => void;
}

const TaxBreakdown = ({
  data,
  onMakePayment,
  onSetupAutoPay,
  onClose,
  onCancel,
}: TaxBreakdownProps) => {
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPropertyInfo, setShowPropertyInfo] = useState(false);

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

  const handlePayment = async () => {
    if (selectedMonths.length === 0) return;

    setIsProcessing(true);
    triggerConfetti();

    const selectedMonthNames = selectedMonths.map((monthYear) => {
      const [month, year] = monthYear.split("-");
      return `${month} ${year}`;
    });

    // Add a slight delay to show the animation
    setTimeout(() => {
      onMakePayment(selectedMonthNames);
      setIsProcessing(false);
    }, 2000);
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

  return (
    <Dialog open onOpenChange={handleClose}>
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
                  <p className="font-medium text-gray-900">Property Details</p>
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
            )}
          </div>

          {/* Unpaid Months */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-900">Unpaid Tax Payments</h3>
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
              <span>${(data.totalAmount - data.totalLateFees).toFixed(2)}</span>
            </div>
            {data.totalLateFees > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Late Fees:</span>
                <span>+${data.totalLateFees.toFixed(2)}</span>
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
                <li>Property taxes are assessed annually and billed monthly</li>
                <li>Late payments may incur additional fees</li>
                <li>Tax rates may change based on annual assessments</li>
                <li>Set up AutoPay to avoid missing payments</li>
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
          {!data.autoPayEnabled && (
            <Button
              variant="outline"
              onClick={onSetupAutoPay}
              disabled={isProcessing}
              className="w-full border-[#0066CC] text-[#0066CC] hover:bg-blue-50"
            >
              Set Up AutoPay
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaxBreakdown;
