import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { getProductById, updateProduct } from "../services/productService";

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    description: "",
    unitPrice: "",
    wholesalePrice: "",
    wholesaleMinQuantity: "10",
    imageUrl: "",
    available: true,
    featured: false
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      const product = await getProductById(id);

      setForm({
        name: product.name,
        description: product.description,
        unitPrice: String(product.unitPrice),
        wholesalePrice: String(product.wholesalePrice),
        wholesaleMinQuantity: String(product.wholesaleMinQuantity),
        imageUrl: product.imageUrl,
        available: product.available,
        featured: product.featured
      });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    await updateProduct(id, {
      ...form,
      unitPrice: Number(form.unitPrice),
      wholesalePrice: Number(form.wholesalePrice),
      wholesaleMinQuantity: Number(form.wholesaleMinQuantity)
    });

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

          <label>URL de imagen</label>
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />

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