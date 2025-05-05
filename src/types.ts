export interface ProductDetails {
  weight: string;
  expirationDays: number;
  calories: number;
  packaging: string;
  proteins: number;
  fats: number;
  carbs: number;
  storageConditions: string;
  ingredients: string;
  piecesInPackage?: number;
  manufacturer: string;
  countryOfOrigin: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  additionalImages?: string[];
  categoryId: string;
  inStock: boolean;
  createdAt: string;
  details?: ProductDetails;
  articleNumber?: string; // Added article number field
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  image?: string;
  images?: string[];
  date: string;
  author: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  url?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  image: string;
}

export type Language = 'uk' | 'en';

export interface TranslationDictionary {
  [key: string]: string;
}

export interface TranslationContent {
  uk: TranslationDictionary;
  en: TranslationDictionary;
}

// Order types
export * from './types/order';
