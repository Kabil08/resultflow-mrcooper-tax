import { KYCVerification, TaxBreakdown, UserData } from "@/types/chat";

export const mockUserData: UserData = {
  id: "user123",
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  propertyDetails: {
    propertyId: "PROP123",
    address: "123 Main Street, San Francisco, CA 94105",
    loanNumber: "LOAN789012",
    monthlyPayment: 2500,
    nextDueDate: "2025-10-01",
  },
  kycStatus: "pending",
  paymentMethod: {
    type: "bank",
    lastFourDigits: "4321",
    bankName: "Bank of America",
  },
  autoPayEnabled: false,
};

export const welcomeMessage = `Hi **${
  mockUserData.name
}**! I'm your Mr. Cooper personal assistant. Based on your account analysis, here's what I see:

🏠 **Your Property Details:**
• Address: ${mockUserData.propertyDetails.address}
• Loan Number: ****${mockUserData.propertyDetails.loanNumber.slice(-4)}
• Monthly Payment: **$${mockUserData.propertyDetails.monthlyPayment.toFixed(
  2
)}**

💳 **Payment Information:**
• Current Method: **${
  mockUserData.paymentMethod?.type === "bank" ? "Bank Account" : "Credit Card"
}**
• Payment Status: **Verified**
• AutoPay Status: **${mockUserData.autoPayEnabled ? "Enabled" : "Not Enabled"}**

📋 **Account Status:**
• KYC Verification: **${
  mockUserData.kycStatus === "pending"
    ? "Pending - Action Required"
    : "Completed"
}**
• Next Payment Due: **${new Date(
  mockUserData.propertyDetails.nextDueDate
).toLocaleDateString()}**

**I can help you with:**

1. **Complete KYC Verification**
2. **Check Tax/EMI Payments**
3. **Set up AutoPay** to avoid late fees

How can I assist you today?`;

export const mockKYCVerification: KYCVerification = {
  status: "pending",
  steps: {
    imageVerification: {
      status: "pending",
      message:
        "Please provide a clear selfie and government-issued ID for verification",
    },
    addressVerification: {
      status: "pending",
      message:
        "Please provide proof of address (utility bill, bank statement, etc.)",
    },
    paymentVerification: {
      status: "pending",
      message: "Please provide payment information for verification",
    },
  },
  documents: {},
};

export const mockTaxBreakdown: TaxBreakdown = {
  propertyId: "PROP123",
  address: "123 Main Street, San Francisco, CA 94105",
  unpaidMonths: [
    {
      month: "September",
      year: 2025,
      amount: 3200,
      dueDate: "2025-09-01",
      status: "unpaid",
    },
    {
      month: "August",
      year: 2025,
      amount: 2800,
      dueDate: "2025-08-01",
      status: "overdue",
    },
    {
      month: "July",
      year: 2025,
      amount: 2500,
      dueDate: "2025-07-01",
      status: "overdue",
    },
  ],
  totalAmount: 8500,
  totalLateFees: 0,
  autoPayEnabled: false,
};

export const mockChatResponses = {
  initial: {
    content: welcomeMessage,
  },
  kycIntro: {
    content:
      "Hi! I'm your Mr. Cooper assistant. I notice that we need to complete your KYC (Know Your Customer) verification. This is a required step to ensure the security of your account and transactions. The process includes:\n\n" +
      "1. Image Verification (Selfie & ID)\n" +
      "2. Address Verification\n" +
      "3. Payment Information\n\n" +
      "Would you like to start the verification process now?",
    kycVerification: mockKYCVerification,
  },
  taxReminder: {
    content:
      "I noticed that you have some pending property tax payments. Here's a breakdown of your current situation:\n\n" +
      "**📅 Overdue Payments:**\n" +
      "• July 2025: $2,500 (+ $125 late fee)\n" +
      "• August 2025: $2,500 (+ $75 late fee)\n\n" +
      "**💰 Current Payment Due:**\n" +
      "• September 2025: $2,500\n\n" +
      "**Total Amount Due: $7,700** (including late fees)\n\n" +
      "Would you like to:\n" +
      "1. Make a payment now\n" +
      "2. Set up AutoPay to avoid future late fees\n" +
      "3. Learn more about payment options",
    taxBreakdown: mockTaxBreakdown,
  },
  kycImageVerification: {
    content:
      "Great! Let's start with the image verification. I'll need:\n\n" +
      "1. A clear selfie of your face\n" +
      "2. A photo of your government-issued ID (driver's license, passport, etc.)\n\n" +
      "Please ensure:\n" +
      "• Good lighting\n" +
      "• Clear, unobstructed view\n" +
      "• All details are readable\n\n" +
      "Ready to proceed with the image capture?",
  },
  kycAddressVerification: {
    content:
      "Perfect! Now let's verify your address. Please provide:\n\n" +
      "• Current residential address\n" +
      "• Proof of address (utility bill, bank statement, etc.)\n\n" +
      "The document should be:\n" +
      "• Less than 3 months old\n" +
      "• Show your full name and address\n" +
      "• From a recognized provider\n\n" +
      "Would you like to upload your address proof now?",
  },
  kycPaymentVerification: {
    content:
      "Last step! Let's verify your payment information:\n\n" +
      "• Bank account or credit card details\n" +
      "• Billing address\n\n" +
      "This information will be securely stored for your future payments.\n\n" +
      "Would you like to proceed with payment verification?",
  },
  autopaySetup: {
    content:
      "Setting up AutoPay is a great way to avoid late fees! Here's what you need to know:\n\n" +
      "**✅ Benefits:**\n" +
      "• Never miss a payment\n" +
      "• No late fees\n" +
      "• Peace of mind\n\n" +
      "**💳 Payment Details:**\n" +
      "• Monthly amount: $2,500\n" +
      "• Due date: 1st of each month\n" +
      "• Payment method: Bank account ending in 4321\n\n" +
      "Would you like to enable AutoPay?",
  },
};
