import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  CircleCheck,
  EyeOff,
  Star,
  Leaf,
  MessageCircleMore,
  Plus,
  Box,
  BarChart3,
  ChevronRight
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";
import AdminMobileNav from "../components/AdminMobileNav";
import type { Product } from "../types/Product";
import { getProductsAdmin } from "../services/productService";
import { getInquiryStats } from "../services/inquiryService";

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
      try {
        const productsData = await getProductsAdmin();
        const statsData = await getInquiryStats();

        setProducts(productsData);
        setInquiryStats(statsData);
      } catch (error) {
        console.error("Error al cargar el dashboard:", error);
      }
    };

    fetchData();
  }, []);

  const totalProducts = products.length;
  const activeProducts = products.filter((product) => product.available).length;
  const hiddenProducts = products.filter((product) => !product.available).length;
  const featuredProducts = products.filter((product) => product.featured).length;

  const latestProducts = [...products].slice(-4).reverse();

  const chartData = inquiryStats.chartData || [];

  const maxConsultas = Math.max(
    ...chartData.map((item) => item.total),
    1
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content admin-dashboard">
        <section className="admin-mobile-hero">
          <div className="admin-mobile-brand">
            <Leaf size={20} strokeWidth={2.2} />

            <div>
              <h2>Harmonia</h2>
              <p>Panel Admin</p>
            </div>
          </div>

          <div className="admin-mobile-hello">
            <h1>Hola, Admin</h1>
            <p>Consultas y catálogo en tiempo real</p>
          </div>
        </section>

        <section className="admin-dashboard-hero">
          <div>
            <p>Panel de administración</p>

            <h1>Resumen de Harmonia</h1>

            <span>
              Gestioná productos, disponibilidad y consultas desde un solo
              lugar.
            </span>
          </div>

          <div className="admin-dashboard-badge">
            <Leaf size={18} strokeWidth={2.2} />
            Harmonia Aromas
          </div>
        </section>

        <section className="admin-stats-grid admin-mobile-stats">
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
              <p>Activos</p>
              <h2>{activeProducts}</h2>
            </div>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon">
              <EyeOff size={24} strokeWidth={2.2} />
            </div>

            <div>
              <p>Ocultos</p>
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

          <article className="admin-stat-card admin-consultas-card">
            <div className="admin-stat-icon">
              <MessageCircleMore size={24} strokeWidth={2.2} />
            </div>

            <div>
              <p>Consultas</p>
              <h2>{inquiryStats.totalConsultas}</h2>
            </div>
          </article>
        </section>

        <section className="admin-mobile-quick-actions">
          <div className="admin-panel-header">
            <div>
              <p>Accesos rápidos</p>
              <h3>Gestioná tu tienda</h3>
            </div>
          </div>

          <div className="admin-quick-grid">
            <Link to="/admin/products/create" className="admin-quick-card primary">
              <Plus size={22} strokeWidth={2.2} />
              <span>Nueva vela</span>
            </Link>

            <Link to="/admin/products" className="admin-quick-card">
              <Box size={22} strokeWidth={2.2} />
              <span>Productos</span>
            </Link>

            <Link to="/admin/products" className="admin-quick-card">
              <Star size={22} strokeWidth={2.2} />
              <span>Destacar</span>
            </Link>

            <Link to="/admin" className="admin-quick-card">
              <BarChart3 size={22} strokeWidth={2.2} />
              <span>Consultas</span>
            </Link>
          </div>
        </section>

        <section className="admin-dashboard-grid admin-consultas-grid">
          <div className="admin-dashboard-panel">
            <div className="admin-panel-header">
              <div>
                <p>Actividad</p>
                <h3>Consultas últimos 7 días</h3>
              </div>
            </div>

            <div className="admin-simple-chart">
              {chartData.map((item) => {
                const barHeight =
                  item.total === 0
                    ? 8
                    : Math.max((item.total / maxConsultas) * 130, 18);

                return (
                  <div className="admin-simple-chart-column" key={item.date}>
                    <span className="admin-simple-chart-value">
                      {item.total}
                    </span>

                    <div className="admin-simple-chart-track">
                      <div
                        className="admin-simple-chart-bar"
                        style={{ height: `${barHeight}px` }}
                      />
                    </div>

                    <span className="admin-simple-chart-label">
                      {item.date}
                    </span>
                  </div>
                );
              })}
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
            <div className="admin-panel-header admin-panel-header-row">
              <div>
                <p>Últimos movimientos</p>
                <h3>Productos recientes</h3>
              </div>

              <Link to="/admin/products" className="admin-see-all">
                Ver todos
              </Link>
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

                  <div className="admin-recent-right">
                    <span
                      className={
                        product.available
                          ? "admin-pill-active"
                          : "admin-pill-hidden"
                      }
                    >
                      {product.available ? "Activo" : "Oculto"}
                    </span>

                    <ChevronRight size={18} strokeWidth={2.2} />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="admin-dashboard-panel admin-status-panel">
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

      <AdminMobileNav />
    </div>
  );
}

export default AdminDashboard; 