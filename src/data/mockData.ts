import { TaxBreakdown } from "@/types/chat";

export const mockUserData = {
  autoPayEnabled: false,
  monthlyPayment: 1299.99,
  dueDate: 15,
  bankName: "Chase Bank",
  accountLast4: "4321",
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
  autoPayEnabled: false,
};

export const mockChatResponses = {
  initial: {
    content:
      "Hi! I'm your assistant. How can I help you today?\n\nI can help you with:\n1. Check Tax/EMI Payments\n2. Set up AutoPay\n\nWhat would you like to do?",
  },
  autopaySetup: {
    content:
      "I'll help you set up AutoPay for your monthly EMI payments. This will help you avoid late fees and ensure timely payments.",
    showAutoPaySetup: true,
  },
  autopaySuccess: {
    content:
      "Great! I've successfully set up AutoPay for your monthly EMI payments. You'll receive email notifications before each payment.",
  },
  autopayDisabled: {
    content:
      "I've disabled AutoPay for your account. You'll need to make manual payments going forward.",
  },
  taxBreakdown: {
    content:
      "Here's your tax payment breakdown. You can select multiple months to pay at once or set up AutoPay to avoid late fees.",
    taxBreakdown: mockTaxBreakdown,
  },
};
