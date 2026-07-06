import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Star,
  Eye,
  EyeOff,
  Trash2,
  Package
} from "lucide-react";
import type { Product } from "../types/Product";
import {
  getProductsAdmin,
  deleteProduct,
  updateProduct
} from "../services/productService";
import AdminSidebar from "../components/AdminSidebar";
import AdminMobileNav from "../components/AdminMobileNav";
import VelaOsito1 from "../assets/VelaOsito1.png";
import VelaMacarron1 from "../assets/VelaMacarron1.png";
import VelaFrutilla1 from "../assets/VelaFrutilla1.png";
import VelaMinicircul1 from "../assets/VelaMinicircul1.png";
import VelaReluciente1 from "../assets/VelaReluciente1.png";
import VelaSol1 from "../assets/VelaSol1.png";
import VelaRusticaCorazon1 from "../assets/VelaRusticaCorazon1.png";

const API_BASE_URL = "https://harmonia-backend-4uu0.onrender.com";
const productFallbackImages: Record<string, string> = {
  "Vela Osito": VelaOsito1,
  "Vela Macarron": VelaMacarron1,
  "Vela Frutilla": VelaFrutilla1,
  "Vela Minicircul": VelaMinicircul1,
  "Vela Reluciente": VelaReluciente1,
  "Vela Sol": VelaSol1,
  "Vela Rústica Corazon": VelaRusticaCorazon1
}; 

function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const data = await getProductsAdmin();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProductImage = (product: Product) => {
  const image =
    product.images && product.images.length > 0
      ? product.images[0]
      : product.imageUrl;

  const fallbackImage = productFallbackImages[product.name] || "";

  if (!image) return fallbackImage;

  if (image.includes("mis-imagenes")) {
    return fallbackImage;
  }

  if (image.startsWith("https://res.cloudinary.com")) {
    return image;
  }

  if (image.startsWith("/uploads")) {
    return `${API_BASE_URL}${image}`;
  }

  if (image.startsWith("http")) {
    return image;
  }

  return fallbackImage;
}; 

  const handleDelete = async (id: string, name: string) => {
    const confirmDelete = window.confirm(
      `¿Seguro que querés eliminar "${name}"?`
    );

    if (!confirmDelete) return;

    await deleteProduct(id);
    fetchProducts();
  };

  const handleToggleAvailable = async (id: string, available: boolean) => {
    const formData = new FormData();
    formData.append("available", String(!available));

    await updateProduct(id, formData);
    fetchProducts();
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    const formData = new FormData();
    formData.append("featured", String(!featured));

    await updateProduct(id, formData);
    fetchProducts();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content admin-products-page">
        <section className="admin-products-mobile-hero">
          <div>
            <p>Gestión</p>
            <h1>Productos</h1>
            <span>Administrá tus velas desde el celular.</span>
          </div>

          <Link to="/admin/products/create" className="admin-mobile-add-button">
            <Plus size={18} strokeWidth={2.2} />
            Nueva vela
          </Link>
        </section>

        <div className="admin-header">
          <div>
            <p>Gestión</p>
            <h1>Productos</h1>
          </div>

          <Link to="/admin/products/create" className="admin-create-button">
            + Nueva vela
          </Link>
        </div>

        <section className="admin-products-mobile-list">
          {products.map((product) => {
            const image = getProductImage(product);

            return (
              <article key={product._id} className="admin-product-mobile-card">
                <div className="admin-product-mobile-top">
                  <div className="admin-product-mobile-image">
                    {image ? (
                      <img src={image} alt={product.name} />
                    ) : (
                      <Package size={28} strokeWidth={2.1} />
                    )}
                  </div>

                  <div className="admin-product-mobile-info">
                    <div className="admin-product-mobile-title">
                      <h3>{product.name}</h3>

                      <span
                        className={
                          product.available
                            ? "admin-pill-active"
                            : "admin-pill-hidden"
                        }
                      >
                        {product.available ? "Activo" : "Oculto"}
                      </span>
                    </div>

                    <p>
                      ${" "}
                      {(product.unitPrice || product.price || 0).toLocaleString(
                        "es-AR"
                      )}
                    </p>

                    <small>
                      Mayorista ${" "}
                      {(
                        product.wholesalePrice ||
                        product.price ||
                        0
                      ).toLocaleString("es-AR")}{" "}
                      · desde {product.wholesaleMinQuantity || 10} unidades
                    </small>
                  </div>
                </div>

                <div className="admin-product-mobile-meta">
                  <span>
                    <Star size={14} strokeWidth={2.2} />
                    {product.featured ? "Destacado" : "Sin destacar"}
                  </span>

                  <span>
                    <Package size={14} strokeWidth={2.2} />
                    {product.wholesaleMinQuantity || 10} mín.
                  </span>
                </div>

                <div className="admin-product-mobile-actions">
                  <Link
                    to={`/admin/products/edit/${product._id}`}
                    className="admin-mobile-action edit"
                  >
                    <Pencil size={16} strokeWidth={2.2} />
                    Editar
                  </Link>

                  <button
                    type="button"
                    className="admin-mobile-action featured"
                    onClick={() =>
                      handleToggleFeatured(product._id, product.featured)
                    }
                  >
                    <Star size={16} strokeWidth={2.2} />
                    {product.featured ? "Quitar" : "Destacar"}
                  </button>

                  <button
                    type="button"
                    className="admin-mobile-action visibility"
                    onClick={() =>
                      handleToggleAvailable(product._id, product.available)
                    }
                  >
                    {product.available ? (
                      <EyeOff size={16} strokeWidth={2.2} />
                    ) : (
                      <Eye size={16} strokeWidth={2.2} />
                    )}
                    {product.available ? "Ocultar" : "Activar"}
                  </button>

                  <button
                    type="button"
                    className="admin-mobile-action delete"
                    onClick={() => handleDelete(product._id, product.name)}
                  >
                    <Trash2 size={16} strokeWidth={2.2} />
                    Eliminar
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Unitario</th>
                <th>Mayorista</th>
                <th>Desde</th>
                <th>Destacado</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>

                  <td>
                    ${" "}
                    {(product.unitPrice || product.price || 0).toLocaleString(
                      "es-AR"
                    )}
                  </td>

                  <td>
                    ${" "}
                    {(
                      product.wholesalePrice ||
                      product.price ||
                      0
                    ).toLocaleString("es-AR")}
                  </td>

                  <td>{product.wholesaleMinQuantity} unidades</td>

                  <td>{product.featured ? "⭐ Sí" : "No"}</td>

                  <td>
                    {product.available ? (
                      <span className="status-active">Activo</span>
                    ) : (
                      <span className="status-hidden">Oculto</span>
                    )}
                  </td>

                  <td>
                    <div className="admin-actions">
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="admin-edit-button"
                      >
                        Editar
                      </Link>

                      <button
                        className="admin-featured-button"
                        onClick={() =>
                          handleToggleFeatured(product._id, product.featured)
                        }
                      >
                        {product.featured ? "Quitar ⭐" : "Destacar ⭐"}
                      </button>

                      <button
                        className="admin-toggle-button"
                        onClick={() =>
                          handleToggleAvailable(product._id, product.available)
                        }
                      >
                        {product.available ? "Ocultar" : "Activar"}
                      </button>

                      <button
                        className="admin-delete-button"
                        onClick={() => handleDelete(product._id, product.name)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <AdminMobileNav />
    </div>
  );
}

export default ProductsAdmin; 