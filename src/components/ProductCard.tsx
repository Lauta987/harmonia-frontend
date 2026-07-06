import type { Product } from "../types/Product";

interface ProductCardProps {
  product: Product;
  image: string;
  onClick: () => void;
}

function ProductCard({ product, image, onClick }: ProductCardProps) {
  const unitPrice = product.unitPrice || product.price || 0;
  const wholesalePrice = product.wholesalePrice || product.price || 0;

  return (
    <article className="product-card premium-product-card" onClick={onClick}>
      <div className="premium-product-image-wrapper">
        <img src={image} alt={product.name} className="product-image" />

        {product.featured && (
          <span className="premium-product-badge">Destacado</span>
        )}
      </div>

      <div className="premium-product-content">
        <div className="premium-product-header">
          <p className="premium-product-category">Vela artesanal</p>
          <h3>{product.name}</h3>
        </div>

        <p className="premium-product-description">
          {product.description}
        </p>

        <div className="premium-price-box">
          <div>
            <span>Unitario</span>
            <strong>${unitPrice.toLocaleString("es-AR")}</strong>
          </div>

          <div>
            <span>Mayorista</span>
            <strong>${wholesalePrice.toLocaleString("es-AR")}</strong>
          </div>
        </div>

        <p className="premium-minimum">
          Desde {product.wholesaleMinQuantity || 10} unidades
        </p>

        <button type="button" className="premium-product-button">
          Ver detalle
        </button>
      </div>
    </article>
  );
}

export default ProductCard; 