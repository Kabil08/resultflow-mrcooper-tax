export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  recommendations?: ProductRecommendation[];
  kycVerification?: KYCVerification;
  taxBreakdown?: TaxBreakdown;
}

export interface KYCVerification {
  status: "pending" | "in_progress" | "completed" | "failed";
  steps: {
    imageVerification: KYCStep;
    addressVerification: KYCStep;
    paymentVerification: KYCStep;
  };
  documents: {
    selfie?: string;
    idProof?: string;
    addressProof?: string;
  };
}

export interface KYCStep {
  status: "pending" | "in_progress" | "completed" | "failed";
  message?: string;
  errorMessage?: string;
}

export interface TaxBreakdown {
  propertyId: string;
  address: string;
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
  autoPayEnabled: boolean;
}

export interface ProductRecommendation {
  title: string;
  description: string;
  discount?: number;
  savings?: number;
  products: Product[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
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
  kycStatus: KYCVerification["status"];
  paymentMethod?: {
    type: "bank" | "card";
    lastFourDigits: string;
    bankName?: string;
    cardType?: string;
    expiryDate?: string;
  };
  autoPayEnabled: boolean;
  monthlyPayment?: number;
  dueDate?: number;
  bankName?: string;
  accountLast4?: string;
}
