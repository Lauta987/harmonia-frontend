import type { Aroma } from "./Aroma";

export interface ReadyStockItem {
  aroma: string | Aroma;
  quantity: number;
}

export interface ImagePosition {
  x: number;
  y: number;
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
  imagePositions?: ImagePosition[];
  imageUrl?: string;
  available: boolean;
  featured: boolean;
  category?: "classic" | "bakery" | "wax-melts" | "candle-box";
  readyStock?: ReadyStockItem[];
}
 