import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  LogOut,
  CircleCheck
} from "lucide-react";
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
      <div>
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
            <LayoutDashboard size={19} strokeWidth={2} />
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
            <Package size={19} strokeWidth={2} />
            Productos
          </Link>
        </nav>
      </div>

      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-status">
          <CircleCheck size={16} strokeWidth={2.3} />
          Sistema activo
        </div>

        <button type="button" onClick={handleLogout}>
          <LogOut size={18} strokeWidth={2} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar; 