import { useEffect, useState } from "react";
import {
  Package,
  CircleCheck,
  EyeOff,
  Star,
  Leaf
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import type { Product } from "../types/Product";
import { getProductsAdmin } from "../services/productService";

function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProductsAdmin();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const totalProducts = products.length;
  const activeProducts = products.filter((product) => product.available).length;
  const hiddenProducts = products.filter((product) => !product.available).length;
  const featuredProducts = products.filter((product) => product.featured).length;

  const latestProducts = [...products].slice(-4).reverse();

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content admin-dashboard">
        <section className="admin-dashboard-hero">
          <div>
            <p>Panel de administración</p>

            <h1>Resumen de Harmonia</h1>

            <span>
              Gestioná productos, destacados y disponibilidad desde un solo
              lugar.
            </span>
          </div>

          <div className="admin-dashboard-badge">
            <Leaf size={18} strokeWidth={2.2} />
            Harmonia Aromas
          </div>
        </section>

        <section className="admin-stats-grid">
          <article className="admin-stat-card">
            <div className="admin-stat-icon">
              <Package size={24} strokeWidth={2.2} />
            </div>

            <div>
              <p>Total productos</p>
              <h2>{totalProducts}</h2>
            </div>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon">
              <CircleCheck size={24} strokeWidth={2.2} />
            </div>

            <div>
              <p>Productos activos</p>
              <h2>{activeProducts}</h2>
            </div>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon">
              <EyeOff size={24} strokeWidth={2.2} />
            </div>

            <div>
              <p>Productos ocultos</p>
              <h2>{hiddenProducts}</h2>
            </div>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon">
              <Star size={24} strokeWidth={2.2} />
            </div>

            <div>
              <p>Destacados</p>
              <h2>{featuredProducts}</h2>
            </div>
          </article>
        </section>

        <section className="admin-dashboard-grid">
          <div className="admin-dashboard-panel">
            <div className="admin-panel-header">
              <div>
                <p>Últimos movimientos</p>
                <h3>Productos recientes</h3>
              </div>
            </div>

            <div className="admin-recent-list">
              {latestProducts.length === 0 && (
                <p className="admin-empty-text">Todavía no hay productos.</p>
              )}

              {latestProducts.map((product) => (
                <article key={product._id} className="admin-recent-item">
                  <div>
                    <h4>{product.name}</h4>

                    <p>
                      ${" "}
                      {(product.unitPrice || product.price || 0).toLocaleString(
                        "es-AR"
                      )}
                    </p>
                  </div>

                  <span
                    className={
                      product.available
                        ? "admin-pill-active"
                        : "admin-pill-hidden"
                    }
                  >
                    {product.available ? "Activo" : "Oculto"}
                  </span>
                </article>
              ))}
            </div>
          </div>

          <div className="admin-dashboard-panel admin-tips-panel">
            <div className="admin-panel-header">
              <div>
                <p>Recomendación</p>
                <h3>Próximas mejoras</h3>
              </div>
            </div>

            <ul className="admin-tips-list">
              <li>Usar fotos claras y con fondo prolijo.</li>
              <li>Destacar los productos más vendidos.</li>
              <li>Mantener precios mayoristas actualizados.</li>
              <li>Ocultar productos sin stock o fuera de temporada.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard; 