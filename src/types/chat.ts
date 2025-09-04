export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  recommendations?: ProductRecommendation[];
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
