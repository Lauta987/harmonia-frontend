import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Leaf, Pencil, Plus, Trash2 } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminMobileNav from "../components/AdminMobileNav";
import type { Aroma } from "../types/Aroma";
import {
  deleteAroma,
  getAromasAdmin,
  updateAroma
} from "../services/aromaService";

function AromasAdmin() {
  const [aromas, setAromas] = useState<Aroma[]>([]);
  const [error, setError] = useState("");

  const fetchAromas = async () => {
    try {
      setError("");
      const data = await getAromasAdmin();
      setAromas(data);
    } catch (error) {
      console.error("Error al cargar aromas:", error);
      setError("No se pudieron cargar los aromas.");
    }
  };

  useEffect(() => {
    fetchAromas();
  }, []);

  const handleToggleAvailable = async (aroma: Aroma) => {
    try {
      await updateAroma(aroma._id, {
        available: !aroma.available
      });

      fetchAromas();
    } catch (error) {
      console.error("Error al cambiar estado del aroma:", error);
      setError("No se pudo actualizar el aroma.");
    }
  };

  const handleDelete = async (aroma: Aroma) => {
    const confirmDelete = window.confirm(
      `¿Seguro que querés ocultar "${aroma.name}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteAroma(aroma._id);
      fetchAromas();
    } catch (error) {
      console.error("Error al ocultar aroma:", error);
      setError("No se pudo ocultar el aroma.");
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content admin-aromas-page">
        <section className="admin-products-mobile-hero">
          <div>
            <p>Gestión</p>
            <h1>Aromas</h1>
            <span>Administrá los aromas disponibles para tus velas.</span>
          </div>

          <Link to="/admin/aromas/create" className="admin-mobile-add-button">
            <Plus size={18} strokeWidth={2.2} />
            Nuevo aroma
          </Link>
        </section>

        <div className="admin-header">
          <div>
            <p>Gestión</p>
            <h1>Aromas</h1>
          </div>

          <Link to="/admin/aromas/create" className="admin-create-button">
            + Nuevo aroma
          </Link>
        </div>

        {error && <p className="admin-form-error">{error}</p>}

        <section className="admin-aromas-grid">
          {aromas.length === 0 ? (
            <div className="admin-empty-panel">
              <Leaf size={34} strokeWidth={2} />
              <h3>Todavía no hay aromas cargados</h3>
              <p>Creá tu primer aroma para usarlo en los productos.</p>
            </div>
          ) : (
            aromas.map((aroma) => (
              <article className="admin-aroma-card" key={aroma._id}>
                <div className="admin-aroma-card-top">
                  <div className="admin-aroma-icon">
                    <Leaf size={22} strokeWidth={2.1} />
                  </div>

                  <span
                    className={
                      aroma.available ? "admin-pill-active" : "admin-pill-hidden"
                    }
                  >
                    {aroma.available ? "Activo" : "Oculto"}
                  </span>
                </div>

                <h3>{aroma.name}</h3>
                <p>{aroma.description}</p>

                <div className="admin-aroma-actions">
                  <Link
                    to={`/admin/aromas/edit/${aroma._id}`}
                    className="admin-mobile-action edit"
                  >
                    <Pencil size={16} strokeWidth={2.2} />
                    Editar
                  </Link>

                  <button
                    type="button"
                    className="admin-mobile-action visibility"
                    onClick={() => handleToggleAvailable(aroma)}
                  >
                    {aroma.available ? (
                      <EyeOff size={16} strokeWidth={2.2} />
                    ) : (
                      <Eye size={16} strokeWidth={2.2} />
                    )}
                    {aroma.available ? "Ocultar" : "Activar"}
                  </button>

                  <button
                    type="button"
                    className="admin-mobile-action delete"
                    onClick={() => handleDelete(aroma)}
                  >
                    <Trash2 size={16} strokeWidth={2.2} />
                    Ocultar
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      <AdminMobileNav />
    </div>
  );
}

export default AromasAdmin; 