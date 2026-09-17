import { useEffect, useMemo, useRef } from "react";

export interface CropPosition {
  x: number;
  y: number;
}

interface ImageCropEditorProps {
  files?: File[];
  imageUrls?: string[];
  labels?: string[];
  positions: CropPosition[];
  onPositionsChange: (positions: CropPosition[]) => void;
  title?: string;
  description?: string;
}

const DEFAULT_POSITION: CropPosition = { x: 50, y: 50 };

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const loadImage = (src: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo leer la imagen."));
    image.src = src;
  });
};

/**
 * Optimiza archivos nuevos antes de subirlos, pero conserva la imagen completa.
 * El encuadre se guarda por separado mediante imagePositions, así se puede
 * volver a editar en cualquier momento sin perder partes de la foto original.
 */
export const prepareFilesForUpload = async (files: File[]) => {
  return Promise.all(
    files.map(async (file) => {
      const previewUrl = URL.createObjectURL(file);

      try {
        const image = await loadImage(previewUrl);
        const maxDimension = 2200;
        const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
        const scale = longestSide > maxDimension ? maxDimension / longestSide : 1;

        const outputWidth = Math.max(1, Math.round(image.naturalWidth * scale));
        const outputHeight = Math.max(1, Math.round(image.naturalHeight * scale));

        const canvas = document.createElement("canvas");
        canvas.width = outputWidth;
        canvas.height = outputHeight;

        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("No se pudo preparar la imagen para subir.");
        }

        context.drawImage(image, 0, 0, outputWidth, outputHeight);

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (result) => {
              if (result) {
                resolve(result);
                return;
              }

              reject(new Error("No se pudo optimizar la imagen."));
            },
            "image/webp",
            0.9
          );
        });

        const baseName = file.name.replace(/\.[^/.]+$/, "");

        return new File([blob], `${baseName}-harmonia.webp`, {
          type: "image/webp",
          lastModified: Date.now()
        });
      } finally {
        URL.revokeObjectURL(previewUrl);
      }
    })
  );
};

function ImageCropEditor({
  files = [],
  imageUrls = [],
  labels = [],
  positions,
  onPositionsChange,
  title = "Encuadre de las imágenes",
  description = "Arrastrá cada foto dentro del marco para elegir qué parte se verá en las tarjetas de la web."
}: ImageCropEditorProps) {
  const filePreviews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  );

  useEffect(() => {
    return () => {
      filePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [filePreviews]);

  const sources = imageUrls.length > 0 ? imageUrls : filePreviews;

  const dragState = useRef<{
    index: number;
    startClientX: number;
    startClientY: number;
    startX: number;
    startY: number;
    width: number;
    height: number;
  } | null>(null);

  const updatePosition = (index: number, nextPosition: CropPosition) => {
    const nextPositions = sources.map((_, positionIndex) => {
      if (positionIndex === index) {
        return {
          x: clamp(nextPosition.x, 0, 100),
          y: clamp(nextPosition.y, 0, 100)
        };
      }

      return positions[positionIndex] || DEFAULT_POSITION;
    });

    onPositionsChange(nextPositions);
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
    index: number
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const position = positions[index] || DEFAULT_POSITION;

    dragState.current = {
      index,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: position.x,
      startY: position.y,
      width: rect.width,
      height: rect.height
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;

    if (!drag) return;

    const deltaX = event.clientX - drag.startClientX;
    const deltaY = event.clientY - drag.startClientY;

    updatePosition(drag.index, {
      x: drag.startX - (deltaX / drag.width) * 100,
      y: drag.startY - (deltaY / drag.height) * 100
    });
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragState.current) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // El pointer puede haberse liberado automáticamente en algunos navegadores.
      }
    }

    dragState.current = null;
  };

  if (sources.length === 0) return null;

  return (
    <section className="admin-image-editor-section">
      <div className="admin-image-editor-heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className="admin-image-editor-grid">
        {sources.map((src, index) => {
          const position = positions[index] || DEFAULT_POSITION;
          const label =
            labels[index] || files[index]?.name || `Imagen ${index + 1}`;

          return (
            <article className="admin-image-editor-card" key={`${src}-${index}`}>
              <div className="admin-image-editor-card-top">
                <strong>Imagen {index + 1}</strong>
                <span>{label}</span>
              </div>

              <div
                className="admin-image-crop-frame"
                onPointerDown={(event) => handlePointerDown(event, index)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
              >
                <img
                  src={src}
                  alt={`Encuadre de ${label}`}
                  draggable={false}
                  style={{
                    objectPosition: `${position.x}% ${position.y}%`
                  }}
                />

                <div className="admin-image-crop-overlay">
                  <span>Vista previa en la web</span>
                </div>
              </div>

              <div className="admin-image-editor-controls">
                <label>
                  Horizontal
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={position.x}
                    onChange={(event) =>
                      updatePosition(index, {
                        ...position,
                        x: Number(event.target.value)
                      })
                    }
                  />
                </label>

                <label>
                  Vertical
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={position.y}
                    onChange={(event) =>
                      updatePosition(index, {
                        ...position,
                        y: Number(event.target.value)
                      })
                    }
                  />
                </label>
              </div>

              <button
                type="button"
                className="admin-image-editor-center-button"
                onClick={() => updatePosition(index, DEFAULT_POSITION)}
              >
                Centrar imagen
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default ImageCropEditor; 
 