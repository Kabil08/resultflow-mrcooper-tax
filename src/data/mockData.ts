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
    content: `## Welcome to Mr. Cooper! 👋

I'm your dedicated financial assistant, ready to help you manage your tax and EMI payments efficiently.

### Available Services

#### 💰 Tax/EMI Payment Management

• View payment history

• Check due amounts

• Make instant payments

• View payment breakdown

• Manage multiple months

#### ⚡ AutoPay Setup

• Automatic monthly payments

• Never miss a due date

• Avoid late fees

• Flexible scheduling

• Email notifications

#### 🔍 Payment Analytics

• Track payment history

• View tax rate changes

• Monitor property value

• Analyze payment trends

• Get insights and forecasts

Select an option above, and I'll guide you through the process!

*Your financial security is our top priority.*
*All transactions are encrypted and secure.*`,
  },
  autopaySetup: {
    content: `## Set Up AutoPay ⚡

Let's help you set up automatic payments for hassle-free tax management.

### Benefits of AutoPay

#### ✅ Never Miss a Payment

• Automatic monthly deductions

• Scheduled on your preferred date

• Email reminders before deduction

#### 💰 Save Money

• Zero late payment fees

• No manual transaction charges

• Avoid penalties completely

#### 🔒 Secure Transactions

• Bank-level encryption

• Secure payment gateway

• Regular security audits

### How It Works

• Choose your preferred payment date

• Select payment method

• Set up email notifications

• Confirm your preferences

*Your payment information is protected with industry-leading security measures.*`,
    showAutoPaySetup: true,
  },
  autopaySuccess: {
    content: `## AutoPay Successfully Activated! 🎉

Your automatic payment setup is complete and ready to go.

### What's Set Up

#### ✅ Payment Schedule

• Monthly automatic payments

• Scheduled for the 15th

• Email notifications enabled

#### 💳 Payment Method

• Bank account ending in ${mockUserData.accountLast4}

• ${mockUserData.bankName}

• Secure transaction system

#### 📅 Next Steps

• First payment: Next due date

• Email confirmation sent

• Payment reminders scheduled

*You'll receive email notifications 3 days before each payment.*
*You can modify these settings anytime.*`,
  },
  autopayDisabled: {
    content: `## AutoPay Disabled ⚠️

Your automatic payments have been successfully disabled.

### Important Information

#### 📌 Manual Payments Required

• You'll need to initiate payments

• Due on the 15th of each month

• Late fees may apply if delayed

#### 💡 Payment Options

• Online portal

• Mobile app

• Phone payment

• Mail-in check

#### ⚡ Re-enable Anytime

• Easy setup process

• No waiting period

• Same account eligible

*Need to re-enable AutoPay? Just let me know, and I'll help you set it up again.*`,
  },
  taxBreakdown: {
    content: `## Tax Payment Breakdown 📊

Let's review your tax payment details and options.

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

#### 🔄 Set up AutoPay

• Never miss a payment

• Avoid late fees

• Convenient and secure

#### 💳 Pay Multiple Months

• Select months below

• Pay in bulk

• Clear overdue amounts

*Select the months you'd like to pay or set up AutoPay for hassle-free payments.*`,
    taxBreakdown: mockTaxBreakdown,
  },
};
