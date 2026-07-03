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
    featured: false
  });

  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      const product = await getProductById(id);

      setForm({
        name: product.name,
        description: product.description,
        unitPrice: String(product.unitPrice || product.price || 0),
        wholesalePrice: String(product.wholesalePrice || product.price || 0),
        wholesaleMinQuantity: String(product.wholesaleMinQuantity || 10),
        available: product.available,
        featured: product.featured
      });

      setCurrentImages(product.images || []);
    };

    fetchProduct();
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

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setNewImages(files.slice(0, 3));
  };

  const getImageUrl = (image: string) => {
    if (image.startsWith("http")) return image;
    return `${API_BASE_URL}${image}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("unitPrice", form.unitPrice);
    formData.append("wholesalePrice", form.wholesalePrice);
    formData.append("wholesaleMinQuantity", form.wholesaleMinQuantity);
    formData.append("available", String(form.available));
    formData.append("featured", String(form.featured));

    newImages.forEach((image) => {
      formData.append("images", image);
    });

    await updateProduct(id, formData);

    navigate("/admin/products");
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

          <label>Cambiar imágenes, máximo 3</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagesChange}
          />

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

          <button type="submit">Guardar cambios</button>
        </form>
      </main>
    </div>
  );
}

export default EditProduct; 