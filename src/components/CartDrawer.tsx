import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "../context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    items,
    totalItems,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    updateItemDetails,
    clearCart
  } = useCart();

  const formatPrice = (price: number) => {
    return price.toLocaleString("es-AR");
  };

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;

    const productsText = items
      .map((item) => {
        const subtotal = item.unitPrice * item.quantity;

        return `- ${item.quantity} x ${item.name} — $${formatPrice(subtotal)}
  Aroma: ${item.aroma?.trim() || "A confirmar"}
  Personalización: ${item.customization?.trim() || "Sin aclaraciones"}`;
      })
      .join("\n\n");

    const message = `¡Hola! 😊 Quiero hacer un pedido en Harmonia Aromas.

Productos:
${productsText}

Total: $${formatPrice(totalPrice)}

¿Podrían confirmarme disponibilidad y tiempo de preparación?`;

    const whatsappUrl = `https://wa.me/5493465659024?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className={isOpen ? "cart-drawer-overlay open" : "cart-drawer-overlay"}>
      <div className="cart-drawer-backdrop" onClick={onClose} />

      <aside className={isOpen ? "cart-drawer open" : "cart-drawer"}>
        <div className="cart-drawer-header">
          <div>
            <p>Tu pedido</p>
            <h2>Carrito</h2>
          </div>

          <button type="button" className="cart-close-button" onClick={onClose}>
            <X size={22} strokeWidth={2.3} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingBag size={34} strokeWidth={2.1} />
            </div>

            <h3>Tu carrito está vacío</h3>
            <p>Agregá una o más velas para armar tu pedido.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.productId}>
                  <div className="cart-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <ShoppingBag size={24} strokeWidth={2.1} />
                    )}
                  </div>

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>

                    <p>$ {formatPrice(item.unitPrice)} c/u</p>

                    <div className="cart-quantity">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.productId)}
                      >
                        <Minus size={15} strokeWidth={2.4} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.productId)}
                      >
                        <Plus size={15} strokeWidth={2.4} />
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-right">
                    <strong>
                      $ {formatPrice(item.unitPrice * item.quantity)}
                    </strong>

                    <button
                      type="button"
                      className="cart-remove-button"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 size={16} strokeWidth={2.2} />
                    </button>
                  </div>

                  <div className="cart-item-details">
                    <label>Aroma elegido</label>
                    <input
                      value={item.aroma || ""}
                      onChange={(e) =>
                        updateItemDetails(item.productId, {
                          aroma: e.target.value
                        })
                      }
                      placeholder="Ej: Vainilla, coco, lavanda..."
                    />

                    <label>Personalización</label>
                    <textarea
                      value={item.customization || ""}
                      onChange={(e) =>
                        updateItemDetails(item.productId, {
                          customization: e.target.value
                        })
                      }
                      placeholder="Ej: color, frase, nombre, evento, detalles del souvenir..."
                    />
                  </div>
                </article>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Productos</span>
                <strong>{totalItems}</strong>
              </div>

              <div className="cart-summary-row total">
                <span>Total</span>
                <strong>$ {formatPrice(totalPrice)}</strong>
              </div>

              <button
                type="button"
                className="cart-whatsapp-button"
                onClick={handleWhatsAppOrder}
              >
                Finalizar pedido por WhatsApp
              </button>

              <button
                type="button"
                className="cart-clear-button"
                onClick={clearCart}
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer; 