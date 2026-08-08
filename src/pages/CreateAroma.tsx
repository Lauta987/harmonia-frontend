import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { createAroma } from "../services/aromaService";

function CreateAroma() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    available: true
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;

      setForm({
        ...form,
        [name]: checked
      });

      return;
    }

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("El nombre del aroma es obligatorio.");
      return;
    }

    if (!form.description.trim()) {
      setError("La descripción del aroma es obligatoria.");
      return;
    }

    try {
      setLoading(true);

      await createAroma({
        name: form.name,
        description: form.description,
        available: form.available
      });

      navigate("/admin/aromas");
    } catch (error) {
      console.error("Error al crear aroma:", error);
      setError("No se pudo guardar el aroma. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        <div className="admin-header">
          <p>Aromas</p>
          <h1>Nuevo aroma</h1>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          {error && <p className="admin-form-error">{error}</p>}

          <label>Nombre</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej: Frutos rojos"
          />

          <label>Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Ej: Aroma frutal, dulce y vibrante."
          />

          <label className="admin-checkbox">
            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={handleChange}
            />
            Aroma activo
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar aroma"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateAroma; 