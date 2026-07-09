import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import { useCart } from "../context/CartContext";

interface ProductModalProps {
  product: Product;
  images: string[];
  onClose: () => void;
}

function ProductModal({ product, images, onClose }: ProductModalProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");

  const { addToCart } = useCart();

  const hasMultipleImages = images.length > 1;
  const activeImage = images[currentImage] || images[0];

  useEffect(() => {
    setCurrentImage(0);
    setQuantity(1);
    setAddedMessage("");
  }, [product._id, images]);

  const nextImage = () => {
    if (!hasMultipleImages) return;

    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const previousImage = () => {
    if (!hasMultipleImages) return;

    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev === 1 ? 1 : prev - 1));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, activeImage);

    setAddedMessage("Producto agregado al carrito");

    setTimeout(() => {
      setAddedMessage("");
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-image carousel">
          {hasMultipleImages && (
            <button className="carousel-button left" onClick={previousImage}>
              ‹
            </button>
          )}

          {activeImage && <img src={activeImage} alt={product.name} />}

          {hasMultipleImages && (
            <button className="carousel-button right" onClick={nextImage}>
              ›
            </button>
          )}

          {hasMultipleImages && (
            <div className="carousel-dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={index === currentImage ? "dot active" : "dot"}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="modal-info">
          <p className="section-subtitle">Detalle del producto</p>

          <h2>{product.name}</h2>

          <p>{product.description}</p>

          <div className="modal-price-boxes">
            <div className="modal-price-box">
              <span>Precio unitario</span>
              <strong>$ {product.unitPrice.toLocaleString("es-AR")}</strong>
              <small>1 unidad</small>
            </div>

            <div className="modal-price-box">
              <span>Precio mayorista</span>
              <strong>
                $ {product.wholesalePrice.toLocaleString("es-AR")}
              </strong>
              <small>desde {product.wholesaleMinQuantity} unidades</small>
            </div>
          </div>

          <div className="modal-quantity-box">
            <span>Cantidad</span>

            <div className="modal-quantity-controls">
              <button type="button" onClick={decreaseQuantity}>
                -
              </button>

              <strong>{quantity}</strong>

              <button type="button" onClick={increaseQuantity}>
                +
              </button>
            </div>
          </div>

          {addedMessage && (
            <p className="modal-added-message">{addedMessage}</p>
          )}

          <button
            type="button"
            className="whatsapp-button"
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal; 