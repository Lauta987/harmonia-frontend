import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { getProductById, updateProduct } from "../services/productService";

const API_BASE_URL = "https://harmonia-backend-4uu0.onrender.com";

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    description: "",
    unitPrice: "",
    wholesalePrice: "",
    wholesaleMinQuantity: "10",
    available: true,
    featured: false,
    category: "classic"
  });

  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const product = await getProductById(id);

        setForm({
          name: product.name,
          description: product.description,
          unitPrice: String(product.unitPrice || product.price || 0),
          wholesalePrice: String(product.wholesalePrice || product.price || 0),
          wholesaleMinQuantity: String(product.wholesaleMinQuantity || 10),
          available: product.available,
          featured: product.featured,
          category: product.category || "classic"
        });

        setCurrentImages(product.images || []);
      } catch (error) {
        console.error("Error al cargar producto:", error);
        setError("No se pudo cargar el producto.");
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    setError("");

    if (selectedFiles.length > 3) {
      setError("Podés subir como máximo 3 imágenes.");
      e.target.value = "";
      setNewImages([]);
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFile) {
      setError("Formato no permitido. Subí imágenes JPG, PNG o WEBP.");
      e.target.value = "";
      setNewImages([]);
      return;
    }

    setNewImages(selectedFiles);
  };

  const getImageUrl = (image: string) => {
    if (image.startsWith("http")) return image;
    return `${API_BASE_URL}${image}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

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

    if (!form.wholesaleMinQuantity || Number(form.wholesaleMinQuantity) <= 0) {
      setError("La cantidad mínima mayorista debe ser mayor a 0.");
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
      formData.append("category", form.category);

      newImages.forEach((image) => {
        formData.append("images", image);
      });

      await updateProduct(id, formData);

      navigate("/admin/products");
    } catch (error) {
      console.error("Error al actualizar producto:", error);
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
          <h1>Editar vela</h1>
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

          <label>Precio unitario</label>
          <input
            name="unitPrice"
            type="number"
            value={form.unitPrice}
            onChange={handleChange}
          />

          <label>Precio mayorista</label>
          <input
            name="wholesalePrice"
            type="number"
            value={form.wholesalePrice}
            onChange={handleChange}
          />

          <label>Cantidad mínima mayorista</label>
          <input
            name="wholesaleMinQuantity"
            type="number"
            value={form.wholesaleMinQuantity}
            onChange={handleChange}
          />

          <label>Categoría</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="classic">Velas clásicas</option>
            <option value="bakery">Línea Bakery</option>
            <option value="wax-melts">Wax Melts</option>
          </select>

          {currentImages.length > 0 && (
            <>
              <label>Imágenes actuales</label>

              <div className="admin-preview-images">
                {currentImages.map((image, index) => (
                  <img
                    key={index}
                    src={getImageUrl(image)}
                    alt={`Imagen actual ${index + 1}`}
                    className="admin-preview-image"
                  />
                ))}
              </div>
            </>
          )}

          <label>Cambiar imágenes</label>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImagesChange}
          />

          <small className="admin-form-help">
            Opcional. Si cargás nuevas imágenes, reemplazan a las actuales.
            Máximo 3 imágenes.
          </small>

          {newImages.length > 0 && (
            <>
              <label>Nuevas imágenes</label>

              <div className="admin-preview-images">
                {newImages.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Nueva imagen ${index + 1}`}
                    className="admin-preview-image"
                  />
                ))}
              </div>
            </>
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
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default EditProduct; 