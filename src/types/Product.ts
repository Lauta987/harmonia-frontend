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
} 