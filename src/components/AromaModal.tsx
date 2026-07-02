interface AromaModalProps {
  title: string;
  aromas: string[];
  onClose: () => void;
}

function AromaModal({ title, aromas, onClose }: AromaModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="aroma-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <p className="section-subtitle">Aromas disponibles</p>
        <h2>{title}</h2>

        <div className="aroma-list">
          {aromas.map((aroma) => (
            <span key={aroma}>{aroma}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AromaModal; 