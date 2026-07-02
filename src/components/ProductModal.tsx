import { useState } from "react";
import type { Product } from "../types/Product";

interface ProductModalProps {
  product: Product;
  images: string[];
  onClose: () => void;
}

function ProductModal({ product, images, onClose }: ProductModalProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const whatsappMessage = `¡Hola! 😊 Me interesa la ${product.name} que vi en la página de Harmonia Aromas. ¿Podrían brindarme más información?`;

  const whatsappUrl = `https://wa.me/5493465659024?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const previousImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-image carousel">
          <button className="carousel-button left" onClick={previousImage}>
            ‹
          </button>

          <img src={images[currentImage]} alt={product.name} />

          <button className="carousel-button right" onClick={nextImage}>
            ›
          </button>

          <div className="carousel-dots">
            {images.map((_, index) => (
              <button
                key={index}
                className={index === currentImage ? "dot active" : "dot"}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
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
              <strong>$ {product.wholesalePrice.toLocaleString("es-AR")}</strong>
              <small>desde {product.wholesaleMinQuantity} unidades</small>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-button"
          >
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProductModal; 