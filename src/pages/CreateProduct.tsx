import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { createProduct } from "../services/productService";

function CreateProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    unitPrice: "",
    wholesalePrice: "",
    wholesaleMinQuantity: "10",
    available: true,
    featured: false
  });

  const [images, setImages] = useState<File[]>([]);
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

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    setError("");

    if (selectedFiles.length > 3) {
      setError("Podés subir como máximo 3 imágenes.");
      e.target.value = "";
      setImages([]);
      return;
    }

    setImages(selectedFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("El nombre del producto es obligatorio.");
      return;
    }

    if (!form.description.trim()) {
      setError("La descripción del producto es obligatoria.");
      return;
    }

    if (!form.unitPrice || Number(form.unitPrice) <= 0) {
      setError("El precio unitario debe ser mayor a 0.");
      return;
    }

    if (!form.wholesalePrice || Number(form.wholesalePrice) <= 0) {
      setError("El precio mayorista debe ser mayor a 0.");
      return;
    }

    if (
      !form.wholesaleMinQuantity ||
      Number(form.wholesaleMinQuantity) <= 0
    ) {
      setError("La cantidad mínima mayorista debe ser mayor a 0.");
      return;
    }

    if (images.length === 0) {
      setError("Subí al menos una imagen del producto.");
      return;
    }

    if (images.length > 3) {
      setError("Podés subir como máximo 3 imágenes.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("unitPrice", form.unitPrice);
      formData.append("wholesalePrice", form.wholesalePrice);
      formData.append("wholesaleMinQuantity", form.wholesaleMinQuantity);
      formData.append("available", String(form.available));
      formData.append("featured", String(form.featured));

      images.forEach((image) => {
        formData.append("images", image);
      });

      await createProduct(formData);

      navigate("/admin/products");
    } catch (error) {
      console.error("Error al crear producto:", error);
      setError("No se pudo guardar el producto. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        <div className="admin-header">
          <p>Productos</p>
          <h1>Nueva vela</h1>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          {error && <p className="admin-form-error">{error}</p>}

          <label>Nombre</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej: Vela Osito"
          />

          <label>Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción del producto"
          />

          <label>Precio unitario</label>
          <input
            name="unitPrice"
            type="number"
            value={form.unitPrice}
            onChange={handleChange}
            placeholder="Ej: 5000"
          />

          <label>Precio mayorista</label>
          <input
            name="wholesalePrice"
            type="number"
            value={form.wholesalePrice}
            onChange={handleChange}
            placeholder="Ej: 4000"
          />

          <label>Cantidad mínima mayorista</label>
          <input
            name="wholesaleMinQuantity"
            type="number"
            value={form.wholesaleMinQuantity}
            onChange={handleChange}
          />

          <label>Imágenes del producto</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
          />

          <small className="admin-form-help">
            Podés subir entre 1 y 3 imágenes.
          </small>

          {images.length > 0 && (
            <div className="admin-preview-images">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Vista previa ${index + 1}`}
                  className="admin-preview-image"
                />
              ))}
            </div>
          )}

          <label className="admin-checkbox">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />
            Producto destacado
          </label>

          <label className="admin-checkbox">
            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={handleChange}
            />
            Producto activo
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar producto"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateProduct; 