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
    setImages(files.slice(0, 3));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

          <label>Imágenes del producto, máximo 3</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagesChange}
          />

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

          <button type="submit">Guardar producto</button>
        </form>
      </main>
    </div>
  );
}

export default CreateProduct;  