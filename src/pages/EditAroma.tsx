import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { getAromaById, updateAroma } from "../services/aromaService";

function EditAroma() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    description: "",
    available: true
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAroma = async () => {
      if (!id) return;

      try {
        const aroma = await getAromaById(id);

        setForm({
          name: aroma.name,
          description: aroma.description,
          available: aroma.available
        });
      } catch (error) {
        console.error("Error al cargar aroma:", error);
        setError("No se pudo cargar el aroma.");
      }
    };

    fetchAroma();
  }, [id]);

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

    if (!id) return;

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

      await updateAroma(id, {
        name: form.name,
        description: form.description,
        available: form.available
      });

      navigate("/admin/aromas");
    } catch (error) {
      console.error("Error al actualizar aroma:", error);
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
          <h1>Editar aroma</h1>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          {error && <p className="admin-form-error">{error}</p>}

          <label>Nombre</label>
          <input name="name" value={form.name} onChange={handleChange} />

          <label>Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
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
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default EditAroma; 