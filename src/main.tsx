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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <ProductsAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products/create"
            element={
              <ProtectedRoute>
                <CreateProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products/edit/:id"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/aromas"
            element={
              <ProtectedRoute>
                <AromasAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/aromas/create"
            element={
              <ProtectedRoute>
                <CreateAroma />
              </ProtectedRoute>
            }
          />

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