
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProductsAdmin from "./pages/ProductsAdmin";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import AromasAdmin from "./pages/AromasAdmin";
import CreateAroma from "./pages/CreateAroma";
import EditAroma from "./pages/EditAroma";

import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";

// SEO: controla la indexación según la ruta
import SeoManager from "./components/SeoManager";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <SeoManager />

        <Routes>
          {/* Página pública */}
          <Route path="/" element={<App />} />

          {/* Inicio de sesión administrativo */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Panel principal */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Administración de productos */}
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <ProductsAdmin />
              </ProtectedRoute>
            }
          />

          {/* Crear producto */}
          <Route
            path="/admin/products/create"
            element={
              <ProtectedRoute>
                <CreateProduct />
              </ProtectedRoute>
            }
          />

          {/* Editar producto */}
          <Route
            path="/admin/products/edit/:id"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />

          {/* Administración de aromas */}
          <Route
            path="/admin/aromas"
            element={
              <ProtectedRoute>
                <AromasAdmin />
              </ProtectedRoute>
            }
          />

          {/* Crear aroma */}
          <Route
            path="/admin/aromas/create"
            element={
              <ProtectedRoute>
                <CreateAroma />
              </ProtectedRoute>
            }
          />

          {/* Editar aroma */}
          <Route
            path="/admin/aromas/edit/:id"
            element={
              <ProtectedRoute>
                <EditAroma />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </StrictMode>
);
 