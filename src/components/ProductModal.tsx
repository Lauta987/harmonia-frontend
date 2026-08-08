import { useEffect, useMemo, useState } from "react";
import type { Aroma } from "../types/Aroma";
import type { Product, ReadyStockItem } from "../types/Product";
import { getAromas } from "../services/aromaService";
import { useCart } from "../context/CartContext";

interface ProductModalProps {
  product: Product;
  images: string[];
  onClose: () => void;
}

type AromaFilter = "all" | "ready";

const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const getReadyStockAromaId = (stockItem: ReadyStockItem) => {
  if (!stockItem.aroma) return "";

  if (typeof stockItem.aroma === "string") {
    return stockItem.aroma;
  }

  return stockItem.aroma._id || "";
};

function ProductModal({ product, images, onClose }: ProductModalProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");
  const [aromas, setAromas] = useState<Aroma[]>([]);
  const [aromasLoading, setAromasLoading] = useState(false);
  const [aromasError, setAromasError] = useState("");
  const [isAromaSelectorOpen, setIsAromaSelectorOpen] = useState(false);
  const [selectedAromaId, setSelectedAromaId] = useState("");
  const [aromaSearch, setAromaSearch] = useState("");
  const [activeAromaFilter, setActiveAromaFilter] = useState<AromaFilter>("all");
  const [selectionError, setSelectionError] = useState("");

  const { addToCart } = useCart();

  const hasMultipleImages = images.length > 1;
  const activeImage = images[currentImage] || images[0];

  const unitPrice = product.unitPrice || product.price || 0;
  const wholesalePrice = product.wholesalePrice || product.price || 0;

  useEffect(() => {
    setCurrentImage(0);
    setQuantity(1);
    setAddedMessage("");
    setIsAromaSelectorOpen(false);
    setSelectedAromaId("");
    setAromaSearch("");
    setActiveAromaFilter("all");
    setSelectionError("");
  }, [product._id]);

  useEffect(() => {
    const fetchAromas = async () => {
      try {
        setAromasLoading(true);
        setAromasError("");

        const aromasData = await getAromas();

        setAromas(aromasData.filter((aroma) => aroma.available));
      } catch {
        setAromasError("No pudimos cargar los aromas. Intentá nuevamente.");
      } finally {
        setAromasLoading(false);
      }
    };

    fetchAromas();
  }, []);

  const readyStockByAromaId = useMemo(() => {
    const stockMap = new Map<string, number>();

    product.readyStock?.forEach((stockItem) => {
      const aromaId = getReadyStockAromaId(stockItem);

      if (aromaId) {
        stockMap.set(aromaId, stockItem.quantity || 0);
      }
    });

    return stockMap;
  }, [product.readyStock]);

  const getAromaReadyQuantity = (aromaId: string) => {
    return readyStockByAromaId.get(aromaId) || 0;
  };

  const isAromaReady = (aromaId: string) => {
    return getAromaReadyQuantity(aromaId) > 0;
  };

  const sortedAndFilteredAromas = useMemo(() => {
    const search = normalizeText(aromaSearch.trim());

    return aromas
      .filter((aroma) => {
        const matchesSearch = normalizeText(aroma.name).includes(search);
        const matchesFilter =
          activeAromaFilter === "all" || isAromaReady(aroma._id);

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const aReady = isAromaReady(a._id);
        const bReady = isAromaReady(b._id);

        if (aReady && !bReady) return -1;
        if (!aReady && bReady) return 1;

        return a.name.localeCompare(b.name, "es");
      });
  }, [aromas, aromaSearch, activeAromaFilter, readyStockByAromaId]);

  const selectedAroma = aromas.find((aroma) => aroma._id === selectedAromaId);

  const selectedAromaReadyQuantity = selectedAroma
    ? getAromaReadyQuantity(selectedAroma._id)
    : 0;

  const selectedTotal = unitPrice * quantity;
  const selectedIsReady = selectedAromaReadyQuantity > 0;

  const selectedAvailabilityLabel = selectedIsReady
    ? "Entrega inmediata"
    : "Disponible por encargo";

  const nextImage = () => {
    if (!hasMultipleImages) return;

    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const previousImage = () => {
    if (!hasMultipleImages) return;

    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev === 1 ? 1 : prev - 1));
  };

  const handleAddToCart = () => {
    if (!isAromaSelectorOpen) {
      setIsAromaSelectorOpen(true);
      return;
    }

    if (!selectedAroma) {
      setSelectionError("Elegí un aroma para agregar el producto al carrito.");
      return;
    }

    addToCart(product, quantity, activeImage, {
      aromaId: selectedAroma._id,
      aromaName: selectedAroma.name,
      availabilityStatus:
        selectedAromaReadyQuantity > 0 ? "ready" : "custom-order",
      readyQuantity: selectedAromaReadyQuantity
    });

    setAddedMessage("Producto agregado al carrito");
    setSelectionError("");

    setTimeout(() => {
      setAddedMessage("");
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-left-column">
          <div className="modal-image carousel">
            {hasMultipleImages && (
              <button
                type="button"
                className="carousel-button left"
                onClick={previousImage}
              >
                ‹
              </button>
            )}

            {activeImage && <img src={activeImage} alt={product.name} />}

            {hasMultipleImages && (
              <button
                type="button"
                className="carousel-button right"
                onClick={nextImage}
              >
                ›
              </button>
            )}

            {hasMultipleImages && (
              <div className="carousel-dots">
                {images.map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    className={index === currentImage ? "dot active" : "dot"}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="modal-selection-summary">
            <p className="modal-selection-kicker">Tu elección</p>

            <div className="modal-selection-card">
              <div className="modal-selection-row">
                <span>Aroma</span>
                <strong>
                  {selectedAroma ? selectedAroma.name : "Sin seleccionar"}
                </strong>
              </div>

              <div className="modal-selection-row">
                <span>Cantidad</span>
                <strong>{quantity}</strong>
              </div>

              <div className="modal-selection-row">
                <span>Disponibilidad</span>

                {selectedAroma ? (
                  <strong
                    className={
                      selectedIsReady
                        ? "modal-selection-status ready"
                        : "modal-selection-status custom-order"
                    }
                  >
                    {selectedIsReady ? "✓ " : "◷ "}
                    {selectedAvailabilityLabel}
                  </strong>
                ) : (
                  <strong className="modal-selection-muted">
                    Elegí un aroma
                  </strong>
                )}
              </div>

              <div className="modal-selection-row total">
                <span>Total</span>
                <strong>$ {selectedTotal.toLocaleString("es-AR")}</strong>
              </div>
            </div>

            <div className="modal-selection-benefits">
              <div>
                <span>♧</span>
                <p>Elaboración artesanal</p>
              </div>

              <div>
                <span>◷</span>
                <p>Pedido por WhatsApp</p>
              </div>

              <div>
                <span>♡</span>
                <p>Preparado con cuidado</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-info">
          <p className="section-subtitle">Detalle del producto</p>

          <h2>{product.name}</h2>

          <p>{product.description}</p>

          <div className="modal-price-boxes">
            <div className="modal-price-box">
              <span>Precio unitario</span>
              <strong>$ {unitPrice.toLocaleString("es-AR")}</strong>
              <small>1 unidad</small>
            </div>

            <div className="modal-price-box">
              <span>Precio mayorista</span>
              <strong>$ {wholesalePrice.toLocaleString("es-AR")}</strong>
              <small>desde 10 productos en el carrito</small>
            </div>
          </div>

          <div className="modal-quantity-box">
            <span>Cantidad</span>

            <div className="modal-quantity-controls">
              <button type="button" onClick={decreaseQuantity}>
                -
              </button>

              <strong>{quantity}</strong>

              <button type="button" onClick={increaseQuantity}>
                +
              </button>
            </div>
          </div>

          {isAromaSelectorOpen && (
            <div className="aroma-selector-panel">
              <div className="aroma-selector-header">
                <h3>Elegí el aroma</h3>

                <p>
                  Todos los aromas están disponibles. Los identificados en verde
                  ya se encuentran listos para entregar.
                </p>
              </div>

              <input
                className="aroma-selector-search"
                value={aromaSearch}
                onChange={(event) => setAromaSearch(event.target.value)}
                placeholder="Buscar aroma..."
              />

              <div className="aroma-selector-filters">
                <button
                  type="button"
                  className={activeAromaFilter === "all" ? "active" : ""}
                  onClick={() => setActiveAromaFilter("all")}
                >
                  Todos
                </button>

                <button
                  type="button"
                  className={activeAromaFilter === "ready" ? "active" : ""}
                  onClick={() => setActiveAromaFilter("ready")}
                >
                  Entrega inmediata
                </button>
              </div>

              {aromasLoading && (
                <p className="aroma-selector-message">Cargando aromas...</p>
              )}

              {aromasError && (
                <p className="aroma-selector-error">{aromasError}</p>
              )}

              {!aromasLoading && !aromasError && (
                <div className="aroma-selector-list">
                  {sortedAndFilteredAromas.length === 0 ? (
                    <p className="aroma-selector-message">
                      No encontramos aromas con esa búsqueda.
                    </p>
                  ) : (
                    sortedAndFilteredAromas.map((aroma) => {
                      const readyQuantity = getAromaReadyQuantity(aroma._id);
                      const ready = readyQuantity > 0;
                      const selected = selectedAromaId === aroma._id;

                      return (
                        <button
                          type="button"
                          key={aroma._id}
                          className={
                            selected
                              ? "aroma-selector-option selected"
                              : "aroma-selector-option"
                          }
                          onClick={() => {
                            setSelectedAromaId(aroma._id);
                            setSelectionError("");
                          }}
                        >
                          <span className="aroma-selector-radio">
                            {selected && <span></span>}
                          </span>

                          <span className="aroma-selector-name">
                            {aroma.name}
                          </span>

                          <span
                            className={
                              ready
                                ? "aroma-selector-status ready"
                                : "aroma-selector-status custom-order"
                            }
                          >
                            {ready
                              ? `✓ Inmediata${
                                  readyQuantity
                                    ? ` · ${readyQuantity} disp.`
                                    : ""
                                }`
                              : "◷ Por encargo"}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}

              {selectionError && (
                <p className="aroma-selector-error">{selectionError}</p>
              )}
            </div>
          )}

          {addedMessage && (
            <p className="modal-added-message">{addedMessage}</p>
          )}

          <button
            type="button"
            className="whatsapp-button"
            onClick={handleAddToCart}
          >
            {selectedAroma
              ? `Agregar al carrito — ${selectedAroma.name}`
              : isAromaSelectorOpen
                ? "Agregar al carrito"
                : "Elegir aroma"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal; 