export interface Product {
  _id: string;
  name: string;
  description: string;

  price?: number;

  unitPrice: number;
  wholesalePrice: number;
  wholesaleMinQuantity: number;

  images: string[];

  available: boolean;
  featured: boolean;
} 