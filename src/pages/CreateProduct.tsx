import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { createProduct } from "../services/productService";
import { getAromas } from "../services/aromaService";
import type { Aroma } from "../types/Aroma";

interface ReadyStockDraft {
  aroma: string;
  quantity: string;
}

function CreateProduct() {
  const navigate = useNavigate();

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

  const [images, setImages] = useState<File[]>([]);
  const [aromas, setAromas] = useState<Aroma[]>([]);
  const [aromasLoading, setAromasLoading] = useState(false);
  const [aromasError, setAromasError] = useState("");
  const [readyStock, setReadyStock] = useState<ReadyStockDraft[]>([]);
  const [selectedAromaId, setSelectedAromaId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState("1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAromas = async () => {
      try {
        setAromasLoading(true);
        setAromasError("");

        const data = await getAromas();

        setAromas(data.filter((aroma) => aroma.available));
      } catch (error) {
        console.error("Error al cargar aromas:", error);
        setAromasError("No se pudieron cargar los aromas.");
      } finally {
        setAromasLoading(false);
      }
    };

    fetchAromas();
  }, []);

  const availableAromasToAdd = useMemo(() => {
    const usedAromaIds = new Set(readyStock.map((item) => item.aroma));

    return aromas.filter((aroma) => !usedAromaIds.has(aroma._id));
  }, [aromas, readyStock]);

  const getAromaName = (aromaId: string) => {
    return aromas.find((aroma) => aroma._id === aromaId)?.name || "Aroma";
  };

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
      setImages([]);
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFile) {
      setError("Formato no permitido. Subí imágenes JPG, PNG o WEBP.");
      e.target.value = "";
      setImages([]);
      return;
    }

    setImages(selectedFiles);
  };

  const handleAddReadyStock = () => {
    setError("");

    if (!selectedAromaId) {
      setError("Elegí un aroma para agregar al stock inmediato.");
      return;
    }

    const quantity = Number(selectedQuantity);

    if (!Number.isInteger(quantity) || quantity < 0) {
      setError("La cantidad del stock inmediato debe ser un número entero igual o mayor a 0.");
      return;
    }

    const aromaAlreadyAdded = readyStock.some(
      (item) => item.aroma === selectedAromaId
    );

    if (aromaAlreadyAdded) {
      setError("Ese aroma ya fue agregado al stock inmediato de este producto.");
      return;
    }

    setReadyStock((current) => [
      ...current,
      {
        aroma: selectedAromaId,
        quantity: String(quantity)
      }
    ]);

    setSelectedAromaId("");
    setSelectedQuantity("1");
  };

  const handleReadyStockQuantityChange = (aromaId: string, quantity: string) => {
    setReadyStock((current) =>
      current.map((item) =>
        item.aroma === aromaId
          ? {
              ...item,
              quantity
            }
          : item
      )
    );
  };

  const handleRemoveReadyStock = (aromaId: string) => {
    setReadyStock((current) => current.filter((item) => item.aroma !== aromaId));
  };

  const validateReadyStock = () => {
    const aromaIds = new Set<string>();

    for (const item of readyStock) {
      if (aromaIds.has(item.aroma)) {
        return "No puede repetirse el mismo aroma en el stock inmediato.";
      }

      aromaIds.add(item.aroma);

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 0) {
        return "Todas las cantidades del stock inmediato deben ser enteros iguales o mayores a 0.";
      }
    }

    return "";
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

    if (!form.wholesaleMinQuantity || Number(form.wholesaleMinQuantity) <= 0) {
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

    const readyStockError = validateReadyStock();

    if (readyStockError) {
      setError(readyStockError);
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

      formData.append(
        "readyStock",
        JSON.stringify(
          readyStock.map((item) => ({
            aroma: item.aroma,
            quantity: Number(item.quantity)
          }))
        )
      );

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

          <label>Categoría</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="classic">Velas clásicas</option>
            <option value="bakery">Línea Bakery</option>
            <option value="wax-melts">Wax Melts</option>
            <option value="candle-box">Candle Box</option>
          </select>

          <section className="admin-ready-stock-section">
            <div className="admin-ready-stock-header">
              <div>
                <h2>Stock para entrega inmediata</h2>
                <p>
                  Cargá qué aromas ya están fabricados para este producto.
                  Los demás aromas seguirán disponibles por encargo.
                </p>
              </div>
            </div>

            {aromasError && (
              <p className="admin-form-error">{aromasError}</p>
            )}

            <div className="admin-ready-stock-controls">
              <div>
                <label>Aroma</label>
                <select
                  value={selectedAromaId}
                  onChange={(event) => setSelectedAromaId(event.target.value)}
                  disabled={aromasLoading}
                >
                  <option value="">
                    {aromasLoading ? "Cargando aromas..." : "Seleccionar aroma"}
                  </option>

                  {availableAromasToAdd.map((aroma) => (
                    <option key={aroma._id} value={aroma._id}>
                      {aroma.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Cantidad lista</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={selectedQuantity}
                  onChange={(event) => setSelectedQuantity(event.target.value)}
                />
              </div>

              <button type="button" onClick={handleAddReadyStock}>
                Agregar aroma
              </button>
            </div>

            {readyStock.length === 0 ? (
              <p className="admin-ready-stock-empty">
                Este producto todavía no tiene aromas marcados para entrega inmediata.
              </p>
            ) : (
              <div className="admin-ready-stock-list">
                {readyStock.map((item) => (
                  <article className="admin-ready-stock-item" key={item.aroma}>
                    <div>
                      <strong>{getAromaName(item.aroma)}</strong>
                      <span>
                        {Number(item.quantity) > 0
                          ? "Entrega inmediata"
                          : "Disponible por encargo"}
                      </span>
                    </div>

                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={item.quantity}
                      onChange={(event) =>
                        handleReadyStockQuantityChange(
                          item.aroma,
                          event.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveReadyStock(item.aroma)}
                    >
                      Eliminar
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <label>Imágenes del producto</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImagesChange}
          />

          <small className="admin-form-help">
            Podés subir entre 1 y 3 imágenes. Si la foto está en Google Fotos,
            descargala primero al dispositivo.
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