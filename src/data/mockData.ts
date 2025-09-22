import { TaxBreakdown } from "@/types/chat";

export const mockUserData = {
  monthlyPayment: 1299.99,
  dueDate: 15,
};

export const mockTaxBreakdown: TaxBreakdown = {
  propertyId: "PROP123",
  address: "123 Main Street, San Francisco, CA 94105",
  propertyValue: 520000,
  annualTaxRate: 2.5,
  previousTaxRate: 2.2,
  lastAssessmentDate: "2024-09-15",
  nextAssessmentDate: "2025-09-15",
  propertyAppreciation: 5.2,
  unpaidMonths: [
    {
      month: "September",
      year: 2025,
      amount: 1299.99,
      dueDate: "2025-09-15",
      status: "unpaid",
    },
    {
      month: "August",
      year: 2025,
      amount: 1299.99,
      dueDate: "2025-08-15",
      status: "overdue",
      lateFees: 50,
    },
    {
      month: "July",
      year: 2025,
      amount: 1249.99,
      dueDate: "2025-07-15",
      status: "overdue",
      lateFees: 75,
    },
  ],
  totalAmount: 3849.97,
  totalLateFees: 125,
};

export const mockChatResponses = {
  initial: {
    content: `## Welcome to Mr. Cooper! 👋

I'm your dedicated mortgage assistant, ready to help you manage your property payments efficiently.

### Property Details

**Address**
${mockTaxBreakdown.address}

**Annual Tax Rate**
${mockTaxBreakdown.annualTaxRate}%
+${(mockTaxBreakdown.annualTaxRate - mockTaxBreakdown.previousTaxRate).toFixed(
      1
    )}% from last year

**Property Value**
$${mockTaxBreakdown.propertyValue.toLocaleString()}
+${mockTaxBreakdown.propertyAppreciation}% appreciation

**Tax Assessment Notice**
Your property has been reassessed. The new tax rate will be effective from October 2025.

*Your financial security is our top priority.*
*All transactions are encrypted and secure.*`,
  },
  taxBreakdown: {
    content: `## Tax Installment Breakdown 📊

Let's review your tax installment details and options.

### Payment Summary

#### 💰 Total Amount Due

• Principal: $${mockTaxBreakdown.totalAmount.toFixed(2)}

• Late Fees: $${mockTaxBreakdown.totalLateFees.toFixed(2)}

• Total Due: $${(
      mockTaxBreakdown.totalAmount + mockTaxBreakdown.totalLateFees
    ).toFixed(2)}

#### 📈 Tax Rate Information

• Current Rate: ${mockTaxBreakdown.annualTaxRate}%

• Previous Rate: ${mockTaxBreakdown.previousTaxRate}%

• Property Value: $${mockTaxBreakdown.propertyValue.toLocaleString()}

### Payment Options

#### 💳 Pay Multiple Months

• Select months below

• Pay in bulk

• Clear overdue amounts

*Select the months you'd like to pay for hassle-free payments.*`,
    taxBreakdown: mockTaxBreakdown,
  },
};
