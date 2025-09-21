import { useState } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
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
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold text-mrcooper-blue">
              Payment Breakdown
            </DialogTitle>
            <DialogClose
              className="h-6 w-6 text-gray-500 hover:text-mrcooper-blue"
              onClick={handleClose}
            />
          </div>
          <DialogDescription className="text-gray-600">
            Review your tax payments and select months to pay
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-mrcooper-blue hover:bg-mrcooper-beige/10 transition-colors cursor-pointer"
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
                      className="h-4 w-4 rounded border-gray-300 text-mrcooper-blue focus:ring-mrcooper-blue cursor-pointer"
                    />
                    <label
                      htmlFor={`${month.month}-${month.year}`}
                      className="text-sm font-medium leading-none text-gray-900 cursor-pointer select-none"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {month.month} {month.year}
                    </label>
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
                    {previousMonth && (
                      <p className="text-xs text-gray-500">
                        Previous: ${previousMonth.amount.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg bg-gray-50 p-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Amount Due:</span>
              <span>${data.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-amber-600">
              <span>Average Tax Increase:</span>
              <span>
                +
                {calculateIncrease(
                  data.unpaidMonths[0]?.amount || 0,
                  data.unpaidMonths[data.unpaidMonths.length - 1]?.amount || 0
                )}
                %
              </span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t border-gray-200 text-gray-900">
              <span>Selected Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {selectedMonths.length > 0 && (
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-mrcooper-blue hover:bg-mrcooper-blue-dark text-white relative"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    Processing... 🎉
                  </span>
                ) : (
                  <span>
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
                className="w-full border-mrcooper-blue text-mrcooper-blue hover:bg-mrcooper-beige/10"
              >
                Set Up AutoPay
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaxBreakdown;
