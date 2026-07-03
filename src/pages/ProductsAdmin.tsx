import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types/Product";
import {
  getProductsAdmin,
  deleteProduct,
  updateProduct
} from "../services/productService";
import AdminSidebar from "../components/AdminSidebar";

function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const data = await getProductsAdmin();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

      <main className="admin-content">
        <div className="admin-header">
          <p>Gestión</p>
          <h1>Productos</h1>

          <Link to="/admin/products/create" className="admin-create-button">
            + Nueva vela
          </Link>
        </div>

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
                        onClick={() =>
                          handleDelete(product._id, product.name)
                        }
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
    </div>
  );
}

export default ProductsAdmin; 