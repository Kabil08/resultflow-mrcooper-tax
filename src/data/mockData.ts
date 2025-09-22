import { TaxBreakdown } from "@/types/chat";

export const taxBreakdownData: TaxBreakdown = {
  propertyId: "PROP123",
  address: "123 Main St, San Francisco, CA 94105",
  propertyValue: 519013.2,
  annualTaxRate: 2.5,
  previousTaxRate: 2.2,
  lastAssessmentDate: "2024-09-15",
  nextAssessmentDate: "2025-09-15",
  escrowBalance: 11034.76,
  monthlyEscrowPayment: 1402.76,
  propertyAppreciation: 5.2,
  totalAmount: 4208.28,
  totalLateFees: 100.0,
  unpaidMonths: [
    {
      month: "October",
      year: 2025,
      amount: 1402.76,
      dueDate: "2025-10-15",
      status: "overdue",
      lateFees: 100,
    },
    {
      month: "September",
      year: 2025,
      amount: 1402.76,
      dueDate: "2025-09-15",
      status: "unpaid",
      lateFees: 0,
    },
    {
      month: "August",
      year: 2025,
      amount: 1402.76,
      dueDate: "2025-08-15",
      status: "unpaid",
      lateFees: 0,
    },
  ],
};

// Export the same data under the name mockTaxBreakdown for compatibility
export const mockTaxBreakdown = taxBreakdownData;

export const mockChatResponses = {
  initial: {
    content: `## Welcome to Mr. Cooper! 👋

I'm your dedicated financial assistant, ready to help you manage your payments effortlessly.

### Your Loan Overview

Your loan balance is **$${taxBreakdownData.propertyValue.toLocaleString()}**
Loan Duration: **Feb 2024 - Mar 2054**

### Taxes and Insurance

**Escrow Balance**
$${taxBreakdownData.escrowBalance.toLocaleString()}

**Monthly Escrow Payment**
$${taxBreakdownData.monthlyEscrowPayment.toLocaleString()}

### Important Notice ⚠️

Your property tax has increased by ${(
      taxBreakdownData.annualTaxRate - taxBreakdownData.previousTaxRate
    ).toFixed(1)}% starting October 2025. You currently have **$${
      taxBreakdownData.totalLateFees
    }** in overdue charges.

💡 **Tip:** [Enable AutoPay](#) to avoid future overdue charges and manage your payments effortlessly.

*Your financial security is our top priority.*
*All transactions are encrypted and secure.*`,
  },
  taxBreakdown: {
    content: `## Tax Installment Breakdown 📊

Let's review your tax installment details and options.

### Payment Summary

#### 💰 Total Amount Due

• Principal: $${taxBreakdownData.totalAmount.toFixed(2)}

• Late Fees: $${taxBreakdownData.totalLateFees.toFixed(2)}

• Total Due: $${(
      taxBreakdownData.totalAmount + taxBreakdownData.totalLateFees
    ).toFixed(2)}

#### 📈 Tax Rate Information

• Current Rate: ${taxBreakdownData.annualTaxRate}%

• Previous Rate: ${taxBreakdownData.previousTaxRate}%

• Property Value: $${taxBreakdownData.propertyValue.toLocaleString()}

### Payment Options

#### 💳 Pay Multiple Months

• Select months below

• Pay in bulk

• Clear overdue amounts

*Select the months you'd like to pay for hassle-free payments.*`,
    taxBreakdown: taxBreakdownData,
  },
};
