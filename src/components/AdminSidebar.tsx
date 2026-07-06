import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <img src={logo} alt="Harmonia Aromas" className="admin-sidebar-logo" />

        <div>
          <h2>Harmonia</h2>
          <p>Panel Admin</p>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        <Link
          to="/admin"
          className={isActive("/admin") ? "admin-nav-active" : ""}
        >
          <span>📊</span>
          Dashboard
        </Link>

        <Link
          to="/admin/products"
          className={
            location.pathname.includes("/admin/products")
              ? "admin-nav-active"
              : ""
          }
        >
          <span>🕯️</span>
          Productos
        </Link>
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-status">
          <span></span>
          Sistema activo
        </div>

        <button type="button" onClick={handleLogout}>
          <span>↩</span>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar; 