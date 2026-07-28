function RefillSection() {
  const whatsappMessage =
    "¡Hola! 😊 Quiero consultar por el servicio de refill de velas de Harmonia Aromas.";

  const whatsappUrl = `https://wa.me/5493465659024?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <section id="refill" className="refill-section">
      <div className="refill-shell">
        <div className="refill-top-label">
          <span>Harmonia Aromas</span>
          <div className="refill-top-line" />
        </div>

        <h2 className="refill-title">Servicio de Refill</h2>

        <p className="refill-subtitle">Dale una nueva vida a tu vela</p>

        <div className="refill-subtitle-line" />

        <div className="refill-steps-line">
          <div className="refill-step-marker">
            <span>01</span>
          </div>

          <div className="refill-step-line" />

          <div className="refill-step-marker">
            <span>02</span>
          </div>

          <div className="refill-step-line" />

          <div className="refill-step-marker">
            <span>03</span>
          </div>
        </div>

        <div className="refill-grid">
          <article className="refill-card">
            <h3>Traé tu envase</h3>

            <div className="refill-dot" />

            <p>
              Acercalo a nuestro espacio
              <br />
              o coordiná la entrega.
            </p>
          </article>

          <article className="refill-card">
            <h3>Elegí tu aroma</h3>

            <div className="refill-dot" />

            <p>
              Seleccioná la fragancia que
              <br />
              más te guste.
            </p>
          </article>

          <article className="refill-card">
            <h3>Volvé a encenderlo</h3>

            <div className="refill-dot" />

            <p>
              Renovamos tu vela con cera vegetal
              <br />
              y una mecha nueva.
            </p>
          </article>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="refill-button"
        >
          Quiero renovar mi vela
        </a>
      </div>
    </section>
  );
}

export default RefillSection; 