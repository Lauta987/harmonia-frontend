import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function AdminSidebar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  return (
    <aside className="admin-sidebar">
      <img src={logo} alt="Harmonia Aromas" className="admin-sidebar-logo" />

      <h2>Harmonia Admin</h2>

      <nav>
        <Link to="/admin">📊 Dashboard</Link>
        <Link to="/admin/products">🕯️ Productos</Link>
        <Link to="/admin/socials">🌐 Redes Sociales</Link>

        <button onClick={logout}>🚪 Cerrar sesión</button>
      </nav>
    </aside>
  );
}

export default AdminSidebar; 