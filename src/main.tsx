import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import EditProduct from "./pages/EditProduct";

import App from "./App";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProductsAdmin from "./pages/ProductsAdmin";
import CreateProduct from "./pages/CreateProduct";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ProductsAdmin />} />
        <Route path="/admin/products/create" element={<CreateProduct />} />
        <Route path="/admin/products/edit/:id" element={<EditProduct />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
); 