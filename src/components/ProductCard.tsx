import type { Product } from "../types/Product";

interface ProductCardProps {
  product: Product;
  image: string;
  onClick: () => void;
}

function ProductCard({ product, image, onClick }: ProductCardProps) {
  return (
    <article className="product-card" onClick={onClick}>
      <div className="product-image">
        <img src={image} alt={product.name} />
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        <p>{product.description}</p>

        <div className="price-boxes">
          <div className="price-box">
            <span>Unitario</span>

            <strong>
              $ {product.unitPrice.toLocaleString("es-AR")}
            </strong>
          </div>

          <div className="price-box">
            <span>Mayorista</span>

            <strong>
              $ {product.wholesalePrice.toLocaleString("es-AR")}
            </strong>

            <small>
              desde {product.wholesaleMinQuantity} unidades
            </small>
          </div>
        </div>

        <button className="whatsapp-button">
          Ver detalle
        </button>
      </div>
    </article>
  );
}

export default ProductCard; 