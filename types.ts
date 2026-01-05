
export type ProductSize = 'S' | 'M' | 'L' | 'XL';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  gallery: string[];
  description: string;
  longDescription: string;
  sizes: ProductSize[];
  faq: FAQItem[];
}

export interface CartItem extends Product {
  selectedSize: ProductSize;
  quantity: number;
}