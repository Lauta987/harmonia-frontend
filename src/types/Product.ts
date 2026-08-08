import type { Aroma } from "./Aroma";

export interface ReadyStockItem {
  aroma: string | Aroma;
  quantity: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price?: number;
  unitPrice: number;
  wholesalePrice: number;
  wholesaleMinQuantity: number;
  images: string[];
  imageUrl?: string;
  available: boolean;
  featured: boolean;
  category?: "classic" | "bakery" | "wax-melts" | "candle-box";
  readyStock?: ReadyStockItem[];
} 