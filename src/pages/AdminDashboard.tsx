import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import type { Product } from "../types/Product";
import { getProductsAdmin } from "../services/productService";
import { getInquiryStats } from "../services/inquiryService";
import {
  Package,
  CircleCheck,
  EyeOff,
  Star,
  MessageCircleMore,
  Leaf
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

interface InquiryStats {
  totalConsultas: number;
  topProducts: {
    _id: string;
    productName: string;
    total: number;
  }[];
  chartData: {
    date: string;
    total: number;
  }[];
}

function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiryStats, setInquiryStats] = useState<InquiryStats>({
    totalConsultas: 0,
    topProducts: [],
    chartData: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const productsData = await getProductsAdmin();
      const statsData = await getInquiryStats();

      setProducts(productsData);
      setInquiryStats(statsData);
    };

    fetchData();
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
              Gestioná productos, disponibilidad y consultas desde un solo lugar.
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
              <Package size={22} />
            </div>
            <div>
              <p>Total productos</p>
              <h2>{totalProducts}</h2>
            </div>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon">
              <CircleCheck size={22} />
            </div>
            <div>
              <p>Productos activos</p>
              <h2>{activeProducts}</h2>
            </div>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon">
              <EyeOff size={22} />
            </div>
            <div>
              <p>Productos ocultos</p>
              <h2>{hiddenProducts}</h2>
            </div>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon">
              <Star size={22} />
            </div>
            <div>
              <p>Destacados</p>
              <h2>{featuredProducts}</h2>
            </div>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon">
              <MessageCircleMore size={22} />
            </div>
            <div>
              <p>Total consultas</p>
              <h2>{inquiryStats.totalConsultas}</h2>
            </div>
          </article>
        </section>

        <section className="admin-dashboard-grid">
          <div className="admin-dashboard-panel">
            <div className="admin-panel-header">
              <div>
                <p>Actividad</p>
                <h3>Consultas últimos 7 días</h3>
              </div>
            </div>

            <div className="admin-chart-wrapper">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={inquiryStats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="total" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="admin-dashboard-panel">
            <div className="admin-panel-header">
              <div>
                <p>Ranking</p>
                <h3>Top 3 más consultados</h3>
              </div>
            </div>

            <div className="admin-top-products">
              {inquiryStats.topProducts.length === 0 ? (
                <p className="admin-empty-text">
                  Todavía no hay consultas registradas.
                </p>
              ) : (
                inquiryStats.topProducts.map((product, index) => (
                  <article key={product._id} className="admin-top-product-item">
                    <div className="admin-top-product-rank">#{index + 1}</div>

                    <div className="admin-top-product-info">
                      <h4>{product.productName}</h4>
                      <p>{product.total} consultas</p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
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
                      $
                      {" "}
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

          <div className="admin-dashboard-panel">
            <div className="admin-panel-header">
              <div>
                <p>Lectura rápida</p>
                <h3>Estado del catálogo</h3>
              </div>
            </div>

            <ul className="admin-tips-list">
              <li>Productos activos: {activeProducts}</li>
              <li>Productos ocultos: {hiddenProducts}</li>
              <li>Productos destacados: {featuredProducts}</li>
              <li>Consultas acumuladas: {inquiryStats.totalConsultas}</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;