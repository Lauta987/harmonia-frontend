import { Link } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

function AdminDashboard() {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        <div className="admin-header">
          <p>Panel privado</p>
          <h1>Bienvenido al administrador</h1>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <span>🕯️</span>
            <h3>Productos</h3>
            <p>Gestioná velas, precios, imágenes y disponibilidad.</p>

            <Link to="/admin/products">
              Gestionar productos
            </Link>
          </div>

          <div className="dashboard-card">
            <span>🌐</span>
            <h3>Redes Sociales</h3>
            <p>Actualizá Instagram, TikTok, WhatsApp y email.</p>

            <Link to="/admin/socials">
              Editar redes
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard; 