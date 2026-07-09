import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { Product } from "../types/Product";

export interface CartItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  image?: string;
  aroma?: string;
  customization?: string;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, quantity: number, image?: string) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  updateItemDetails: (
    productId: string,
    details: {
      aroma?: string;
      customization?: string;
    }
  ) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "harmonia-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) return [];

    try {
      return JSON.parse(storedCart);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number, image?: string) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.productId === product._id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === product._id
            ? {
                ...item,
                quantity: item.quantity + quantity
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          productId: product._id,
          name: product.name,
          unitPrice: product.unitPrice || product.price || 0,
          quantity,
          image,
          aroma: "",
          customization: ""
        }
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId)
    );
  };

  const increaseQuantity = (productId: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: string) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const updateItemDetails = (
    productId: string,
    details: {
      aroma?: string;
      customization?: string;
    }
  ) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              ...details
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        updateItemDetails,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
} 