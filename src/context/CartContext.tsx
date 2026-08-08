import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { Product } from "../types/Product";

export type AromaAvailabilityStatus = "ready" | "custom-order";

export interface SelectedCartAroma {
  aromaId: string;
  aromaName: string;
  availabilityStatus: AromaAvailabilityStatus;
  readyQuantity?: number;
}

export interface CartItem {
  lineId: string;
  productId: string;
  name: string;
  unitPrice: number;
  wholesalePrice: number;
  wholesaleMinQuantity: number;
  quantity: number;
  image?: string;
  aromaId?: string;
  aromaName?: string;
  aromaAvailabilityStatus?: AromaAvailabilityStatus;
  readyQuantity?: number;
  aroma?: string;
  customization?: string;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (
    product: Product,
    quantity: number,
    image: string | undefined,
    selectedAroma: SelectedCartAroma
  ) => void;
  removeFromCart: (lineId: string) => void;
  increaseQuantity: (lineId: string) => void;
  decreaseQuantity: (lineId: string) => void;
  updateItemDetails: (
    lineId: string,
    details: {
      customization?: string;
    }
  ) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "harmonia-cart";
const WHOLESALE_GLOBAL_MIN_QUANTITY = 10;

const buildLineId = (productId: string, aromaId?: string) => {
  return `${productId}-${aromaId || "sin-aroma"}`;
};

const normalizeStoredItems = (items: CartItem[]) => {
  return items.map((item) => {
    const aromaName = item.aromaName || item.aroma || "";
    const aromaId = item.aromaId || aromaName || "sin-aroma";

    return {
      ...item,
      lineId: item.lineId || buildLineId(item.productId, aromaId),
      aromaName,
      aromaAvailabilityStatus:
        item.aromaAvailabilityStatus || "custom-order"
    };
  });
};

export const getCartItemUnitPrice = (item: CartItem, totalItems: number) => {
  const hasWholesalePrice = item.wholesalePrice > 0;

  if (hasWholesalePrice && totalItems >= WHOLESALE_GLOBAL_MIN_QUANTITY) {
    return item.wholesalePrice;
  }

  return item.unitPrice;
};

export const hasWholesaleApplied = (item: CartItem, totalItems: number) => {
  return item.wholesalePrice > 0 && totalItems >= WHOLESALE_GLOBAL_MIN_QUANTITY;
};

export const getCartItemAvailabilityLabel = (item: CartItem) => {
  return item.aromaAvailabilityStatus === "ready"
    ? "Entrega inmediata"
    : "Disponible por encargo";
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) return [];

    try {
      return normalizeStoredItems(JSON.parse(storedCart));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (
    product: Product,
    quantity: number,
    image: string | undefined,
    selectedAroma: SelectedCartAroma
  ) => {
    const lineId = buildLineId(product._id, selectedAroma.aromaId);

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.lineId === lineId);

      if (existingItem) {
        return currentItems.map((item) =>
          item.lineId === lineId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                unitPrice: product.unitPrice || product.price || item.unitPrice,
                wholesalePrice:
                  product.wholesalePrice || item.wholesalePrice || 0,
                wholesaleMinQuantity:
                  product.wholesaleMinQuantity ||
                  item.wholesaleMinQuantity ||
                  10,
                aromaId: selectedAroma.aromaId,
                aromaName: selectedAroma.aromaName,
                aroma: selectedAroma.aromaName,
                aromaAvailabilityStatus: selectedAroma.availabilityStatus,
                readyQuantity: selectedAroma.readyQuantity
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          lineId,
          productId: product._id,
          name: product.name,
          unitPrice: product.unitPrice || product.price || 0,
          wholesalePrice: product.wholesalePrice || 0,
          wholesaleMinQuantity: product.wholesaleMinQuantity || 10,
          quantity,
          image,
          aromaId: selectedAroma.aromaId,
          aromaName: selectedAroma.aromaName,
          aroma: selectedAroma.aromaName,
          aromaAvailabilityStatus: selectedAroma.availabilityStatus,
          readyQuantity: selectedAroma.readyQuantity,
          customization: ""
        }
      ];
    });
  };

  const removeFromCart = (lineId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.lineId !== lineId)
    );
  };

  const increaseQuantity = (lineId: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.lineId === lineId
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    );
  };

  const decreaseQuantity = (lineId: string) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.lineId === lineId
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
    lineId: string,
    details: {
      customization?: string;
    }
  ) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.lineId === lineId
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
    return items.reduce((total, item) => {
      const finalUnitPrice = getCartItemUnitPrice(item, totalItems);

      return total + finalUnitPrice * item.quantity;
    }, 0);
  }, [items, totalItems]);

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