export interface PaymentRecommendation {
  title: string;
  cardType: string;
  lastFour: string;
  benefits: string[];
}

export interface DeliveryRecommendation {
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  deliverySpeed: string;
  confidence: string;
}

export interface SubscriptionRecommendation {
  title: string;
  interval: string;
  savings: string;
  benefits: string[];
}

export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  recommendations?: ProductRecommendation[];
  paymentRecommendation?: PaymentRecommendation;
  deliveryRecommendation?: DeliveryRecommendation;
  subscriptionRecommendation?: SubscriptionRecommendation;
}

export interface ProductRecommendation {
  title: string;
  description: string;
  products: Product[];
  discount?: number;
  savings?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface UserData {
  addresses: Address[];
}
