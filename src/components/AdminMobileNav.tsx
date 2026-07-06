import { Link, useLocation } from "react-router-dom";
import { Home, Package, Plus, MoreHorizontal } from "lucide-react";

function AdminMobileNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.includes(path);
  };

  return (
    <nav className="admin-mobile-bottom-nav">
      <Link to="/admin" className={isActive("/admin") ? "active" : ""}>
        <Home size={20} strokeWidth={2.2} />
        <span>Inicio</span>
      </Link>

      <Link
        to="/admin/products"
        className={isActive("/admin/products") ? "active" : ""}
      >
        <Package size={20} strokeWidth={2.2} />
        <span>Productos</span>
      </Link>

      <Link
        to="/admin/products/create"
        className={isActive("/admin/products/create") ? "active" : ""}
      >
        <Plus size={20} strokeWidth={2.2} />
        <span>Nueva</span>
      </Link>

      <Link to="/admin" className="">
        <MoreHorizontal size={20} strokeWidth={2.2} />
        <span>Más</span>
      </Link>
    </nav>
  );
}

export default AdminMobileNav; 