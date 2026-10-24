import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { getProductById, updateProduct } from "../services/productService";
import { getAromas } from "../services/aromaService";
import type { Aroma } from "../types/Aroma";
import type { Product, ReadyStockItem } from "../types/Product";
import ImageCropEditor, {
  prepareFilesForUpload,
  type CropPosition
} from "../components/ImageCropEditor";

const API_BASE_URL = "https://harmonia-backend-4uu0.onrender.com";

interface ReadyStockDraft {
  aroma: string;
  quantity: string;
  aromaName?: string;
}

const getReadyStockAromaId = (stockItem: ReadyStockItem) => {
  if (typeof stockItem.aroma === "string") return stockItem.aroma;

  return stockItem.aroma._id;
};

const getReadyStockAromaName = (stockItem: ReadyStockItem) => {
  if (typeof stockItem.aroma === "string") return "";

  return stockItem.aroma.name;
};

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
  const [currentImagePositions, setCurrentImagePositions] =
    useState<CropPosition[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePositions, setNewImagePositions] =
    useState<CropPosition[]>([]);
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

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const product: Product = await getProductById(id);

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

        const savedImages = product.images || [];
        const savedPositions = product.imagePositions || [];

        setCurrentImages(savedImages);
        setCurrentImagePositions(
          savedImages.map(
            (_, index) => savedPositions[index] || { x: 50, y: 50 }
          )
        );

        setReadyStock(
          (product.readyStock || []).map((stockItem) => ({
            aroma: getReadyStockAromaId(stockItem),
            quantity: String(stockItem.quantity),
            aromaName: getReadyStockAromaName(stockItem)
          }))
        );
      } catch (error) {
        console.error("Error al cargar producto:", error);
        setError("No se pudo cargar el producto.");
      }
    };

    fetchProduct();
  }, [id]);

  const availableAromasToAdd = useMemo(() => {
    const usedAromaIds = new Set(readyStock.map((item) => item.aroma));

    return aromas.filter((aroma) => !usedAromaIds.has(aroma._id));
  }, [aromas, readyStock]);

  const getAromaName = (aromaId: string) => {
    const activeAromaName = aromas.find(
      (aroma) => aroma._id === aromaId
    )?.name;

    const savedAromaName = readyStock.find(
      (item) => item.aroma === aromaId
    )?.aromaName;

    return activeAromaName || savedAromaName || "Aroma";
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
      setNewImages([]);
      setNewImagePositions([]);
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFile) {
      setError("Formato no permitido. Subí imágenes JPG, PNG o WEBP.");
      e.target.value = "";
      setNewImages([]);
      setNewImagePositions([]);
      return;
    }

    setNewImages(selectedFiles);
    setNewImagePositions(selectedFiles.map(() => ({ x: 50, y: 50 })));
  };

  const getImageUrl = (image: string) => {
    if (image.startsWith("http")) return image;
    return `${API_BASE_URL}${image}`;
  };

  const handleAddReadyStock = () => {
    setError("");

    if (!selectedAromaId) {
      setError("Elegí un aroma para agregar al stock inmediato.");
      return;
    }

    const quantity = Number(selectedQuantity);

    if (!Number.isInteger(quantity) || quantity < 0) {
      setError(
        "La cantidad del stock inmediato debe ser un número entero igual o mayor a 0."
      );
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
        quantity: String(quantity),
        aromaName: getAromaName(selectedAromaId)
      }
    ]);

    setSelectedAromaId("");
    setSelectedQuantity("1");
  };

  const handleReadyStockQuantityChange = (
    aromaId: string,
    quantity: string
  ) => {
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
    setReadyStock((current) =>
      current.filter((item) => item.aroma !== aromaId)
    );
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

      if (newImages.length > 0) {
        formData.append("imagePositions", JSON.stringify(newImagePositions));

        const preparedImages = await prepareFilesForUpload(newImages);

        preparedImages.forEach((image) => {
          formData.append("images", image);
        });
      } else {
        formData.append(
          "imagePositions",
          JSON.stringify(currentImagePositions)
        );
      }

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
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
          />

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
            <option value="candle-box">Candle Box</option>
            <option value="christmas">Colección navideña</option>
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

          {currentImages.length > 0 && (
            <>
              <label>Imágenes actuales</label>

              <small className="admin-form-help">
                Podés cambiar el encuadre de las imágenes que ya están publicadas
                sin volver a subirlas.
              </small>

              <ImageCropEditor
                imageUrls={currentImages.map(getImageUrl)}
                labels={currentImages.map(
                  (_, index) => `Imagen actual ${index + 1}`
                )}
                positions={currentImagePositions}
                onPositionsChange={setCurrentImagePositions}
                title="Encuadre de las imágenes actuales"
                description="Arrastrá cada foto para corregir qué parte se ve en la web. La imagen original no se recorta ni se vuelve a subir."
              />
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
            Máximo 3 imágenes. Podés ajustar el encuadre antes de guardar.
          </small>

          {newImages.length > 0 && (
            <>
              <label>Encuadre de las nuevas imágenes</label>

              <ImageCropEditor
                files={newImages}
                positions={newImagePositions}
                onPositionsChange={setNewImagePositions}
              />
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