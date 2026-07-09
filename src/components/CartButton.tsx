import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

interface CartButtonProps {
  onClick: () => void;
}

function CartButton({ onClick }: CartButtonProps) {
  const { totalItems } = useCart();

  return (
    <button type="button" className="cart-floating-button" onClick={onClick}>
      <ShoppingBag size={22} strokeWidth={2.3} />

      {totalItems > 0 && (
        <span className="cart-floating-count">{totalItems}</span>
      )}
    </button>
  );
}

export default CartButton; 