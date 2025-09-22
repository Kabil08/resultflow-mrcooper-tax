export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  taxBreakdown?: TaxBreakdown;
}

export interface TaxBreakdown {
  propertyId: string;
  address: string;
  propertyValue: number;
  annualTaxRate: number;
  previousTaxRate: number;
  lastAssessmentDate: string;
  nextAssessmentDate: string;
  propertyAppreciation: number;
  escrowBalance: number;
  monthlyEscrowPayment: number;
  unpaidMonths: {
    month: string;
    year: number;
    amount: number;
    dueDate: string;
    status: "unpaid" | "overdue" | "paid";
    lateFees?: number;
  }[];
  totalAmount: number;
  totalLateFees: number;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyDetails: {
    propertyId: string;
    address: string;
    loanNumber: string;
    monthlyPayment: number;
    nextDueDate: string;
  };
  paymentMethod?: {
    type: "bank" | "card";
    lastFourDigits: string;
    bankName?: string;
    cardType?: string;
    expiryDate?: string;
  };
  monthlyPayment?: number;
  dueDate?: number;
}
