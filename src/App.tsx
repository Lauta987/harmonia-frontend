import { useEffect, useState } from "react";
import type { Product } from "./types/Product";
import { getFeaturedProducts, getProducts } from "./services/productService";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import AromaModal from "./components/AromaModal";
import CartButton from "./components/CartButton";
import CartDrawer from "./components/CartDrawer";
import logo from "./assets/logo.png";
import hero from "./assets/hero.png";

import {
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
  FaEnvelope
} from "react-icons/fa";

import { Leaf, HeartHandshake, Truck, Tag } from "lucide-react";

import aromaFrutales from "./assets/aromaFrutales.png";
import aromaIntensos from "./assets/aromaIntensos.png";
import aromaDulces from "./assets/aromaDulces.png";
import aromaFlorales from "./assets/aromaFlorales.png";

import VelaOsito1 from "./assets/VelaOsito1.png";
import VelaOsito2 from "./assets/VelaOsito2.png";
import VelaOsito3 from "./assets/VelaOsito3.png";

import VelaMacarron1 from "./assets/VelaMacarron1.png";
import VelaMacarron2 from "./assets/VelaMacarron2.png";
import VelaMacarron3 from "./assets/VelaMacarron3.png";

import VelaFrutilla1 from "./assets/VelaFrutilla1.png";
import VelaFrutilla2 from "./assets/VelaFrutilla2.png";
import VelaFrutilla3 from "./assets/VelaFrutilla3.png";

import VelaMinicircul1 from "./assets/VelaMinicircul1.png";
import VelaMinicircul2 from "./assets/VelaMinicircul2.png";
import VelaMinicircul3 from "./assets/VelaMinicircul3.png";

import VelaReluciente1 from "./assets/VelaReluciente1.png";
import VelaReluciente2 from "./assets/VelaReluciente2.png";
import VelaReluciente3 from "./assets/VelaReluciente3.png";

import VelaSol1 from "./assets/VelaSol1.png";
import VelaSol2 from "./assets/VelaSol2.png";
import VelaSol3 from "./assets/VelaSol3.png";

import VelaRusticaCorazon1 from "./assets/VelaRusticaCorazon1.png";
import VelaRusticaCorazon2 from "./assets/VelaRusticaCorazon2.png";
import VelaRusticaCorazon3 from "./assets/VelaRusticaCorazon3.png";

import "./index.css";

type CatalogCategory = "classic" | "bakery" | "wax-melts" | "candle-box";

const productImages: Record<string, string[]> = {
  "Vela Osito": [VelaOsito1, VelaOsito2, VelaOsito3],
  "Vela Macarron": [VelaMacarron1, VelaMacarron2, VelaMacarron3],
  "Vela Frutilla": [VelaFrutilla1, VelaFrutilla2, VelaFrutilla3],
  "Vela Minicircul": [VelaMinicircul1, VelaMinicircul2, VelaMinicircul3],
  "Vela Reluciente": [VelaReluciente1, VelaReluciente2, VelaReluciente3],
  "Vela Sol": [VelaSol1, VelaSol2, VelaSol3],
  "Vela Rústica Corazon": [
    VelaRusticaCorazon1,
    VelaRusticaCorazon2,
    VelaRusticaCorazon3
  ]
};

const aromaCategories = [
  {
    title: "Frutales",
    description: "Frescos, dulces y vibrantes.",
    image: aromaFrutales,
    aromas: [
      "Mandarina",
      "Coco",
      "Frutilla",
      "Frutos rojos",
      "Limón",
      "Maracuyá"
    ]
  },
  {
    title: "Intensos",
    description: "Profundos y envolventes.",
    image: aromaIntensos,
    aromas: ["Café", "Capuccino", "Chocolate", "Pitanga maracuyá"]
  },
  {
    title: "Dulces",
    description: "Suaves, cálidos y reconfortantes.",
    image: aromaDulces,
    aromas: ["Dulce de leche", "Vainilla", "Vainilla coco", "Cherry"]
  },
  {
    title: "Florales",
    description: "Delicados y elegantes.",
    image: aromaFlorales,
    aromas: ["Orquídeas", "Jazmín", "Lavanda", "Flores blancas"]
  }
];

function App() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCatalogCategory, setActiveCatalogCategory] =
    useState<CatalogCategory>("classic");

  const [selectedAromaCategory, setSelectedAromaCategory] = useState<{
    title: string;
    aromas: string[];
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const featuredData = await getFeaturedProducts();
      const productsData = await getProducts();

      setFeaturedProducts(featuredData);
      setProducts(productsData);
    };

    fetchData();
  }, []);

  const getProductImages = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images.map((image) => {
        if (image.startsWith("http")) return image;

        return `https://harmonia-backend-4uu0.onrender.com${image}`;
      });
    }

    return productImages[product.name] || [VelaOsito1, VelaOsito2, VelaOsito3];
  };

  const filteredProducts = products.filter((product) => {
    const productCategory = product.category || "classic";
    return productCategory === activeCatalogCategory;
  });

  const openCart = () => {
    setIsMobileMenuOpen(false);
    setIsCartOpen(true);
  };

  const refillWhatsAppMessage =
    "¡Hola! 😊 Quiero consultar por el servicio de refill de velas de Harmonia Aromas. Tengo un envase para rellenar y me gustaría saber opciones de aromas, precio y tiempo de preparación.";

  const refillWhatsAppUrl = `https://wa.me/5493465659024?text=${encodeURIComponent(
    refillWhatsAppMessage
  )}`;

  return (
    <main className="app">
      <nav className="navbar">
        <a
          href="#inicio"
          className="brand-logo"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <img src={logo} alt="Harmonia Aromas" className="brand-logo-img" />

          <div className="brand-logo-text">
            <span>HARMONIA</span>
            <small>AROMAS</small>
          </div>
        </a>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? "nav-links-open" : ""}`}>
          <a href="#inicio" onClick={() => setIsMobileMenuOpen(false)}>
            Inicio
          </a>

          <a href="#destacados" onClick={() => setIsMobileMenuOpen(false)}>
            Destacados
          </a>

          <a href="#catalogo" onClick={() => setIsMobileMenuOpen(false)}>
            Catálogo
          </a>

          <a href="#refill" onClick={() => setIsMobileMenuOpen(false)}>
            Refill
          </a>

          <a href="#aromas" onClick={() => setIsMobileMenuOpen(false)}>
            Aromas
          </a>

          <a href="#contacto" onClick={() => setIsMobileMenuOpen(false)}>
            Contacto
          </a>
        </div>

        <button type="button" className="navbar-whatsapp" onClick={openCart}>
          Carrito
        </button>
      </nav>

      <section id="inicio" className="hero">
        <div className="hero-text">
          <img src={logo} alt="Harmonia Aromas" className="hero-logo" />

          <p className="subtitle">Velas artesanales</p>

          <h1>Aromas que enamoran el hogar</h1>

          <p className="description">
            Creamos velas artesanales y souvenirs únicos, pensados para llenar
            cada rincón de tu hogar con armonía, calidez y un aroma inolvidable.
          </p>

          <a href="#catalogo" className="primary-button">
            Comprar ahora
          </a>
        </div>

        <div className="hero-product">
          <img src={hero} alt="Harmonia Aromas" />

          <div className="hero-product-badge">
            <span>Velas artesanales</span>
            <strong>Hechas con amor 🤎</strong>
          </div>
        </div>
      </section>

      <section className="trust-editorial-section">
        <div className="trust-editorial-grid">
          <article className="trust-editorial-item">
            <Leaf className="trust-editorial-icon" strokeWidth={1.4} />

            <div className="trust-editorial-ornament">
              <span></span>
            </div>

            <h3>Cera vegetal</h3>

            <p>
              Elaboradas con cera de soja y aromas cuidadosamente seleccionados.
            </p>
          </article>

          <article className="trust-editorial-item">
            <HeartHandshake
              className="trust-editorial-icon"
              strokeWidth={1.4}
            />

            <div className="trust-editorial-ornament">
              <span></span>
            </div>

            <h3>Hechas a mano</h3>

            <p>
              Cada vela está creada artesanalmente con atención en cada detalle.
            </p>
          </article>

          <article className="trust-editorial-item">
            <Truck className="trust-editorial-icon" strokeWidth={1.4} />

            <div className="trust-editorial-ornament">
              <span></span>
            </div>

            <h3>Envíos nacionales</h3>

            <p>
              Preparamos cada pedido para que llegue en perfectas condiciones.
            </p>
          </article>

          <article className="trust-editorial-item">
            <Tag className="trust-editorial-icon" strokeWidth={1.4} />

            <div className="trust-editorial-ornament">
              <span></span>
            </div>

            <h3>Ventas mayoristas</h3>

            <p>
              Propuestas para eventos, regalos empresariales y reventa.
            </p>
          </article>
        </div>
      </section>

      <section id="destacados" className="section">
        <p className="section-subtitle">Nuestros favoritos</p>
        <h2>Productos destacados</h2>

        <div className="products-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              image={getProductImages(product)[0]}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </section>

      <section id="catalogo" className="section catalog-section">
        <p className="section-subtitle">Catálogo</p>
        <h2>Elegí tu línea favorita</h2>

        <div className="catalog-tabs">
          <button
            type="button"
            className={activeCatalogCategory === "classic" ? "active" : ""}
            onClick={() => setActiveCatalogCategory("classic")}
          >
            Velas clásicas
          </button>

          <button
            type="button"
            className={activeCatalogCategory === "bakery" ? "active" : ""}
            onClick={() => setActiveCatalogCategory("bakery")}
          >
            Línea Bakery
          </button>

          <button
            type="button"
            className={activeCatalogCategory === "wax-melts" ? "active" : ""}
            onClick={() => setActiveCatalogCategory("wax-melts")}
          >
            Wax Melts
          </button>

          <button
            type="button"
            className={activeCatalogCategory === "candle-box" ? "active" : ""}
            onClick={() => setActiveCatalogCategory("candle-box")}
          >
            Candle Box
          </button>
        </div>

        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <p className="catalog-empty-message">
              Todavía no hay productos cargados en esta línea.
            </p>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                image={getProductImages(product)[0]}
                onClick={() => setSelectedProduct(product)}
              />
            ))
          )}
        </div>
      </section>

      <section id="refill" className="refill-split-section">
        <div className="refill-split-left">
          <div className="refill-split-left-content">
            <h2>
              Servicio
              <br />
              de Refill
            </h2>

            <div className="refill-split-divider"></div>

            <p>
              Dale una nueva vida
              <br />
              a tu vela
            </p>

            <div className="refill-split-line">
              <span></span>
            </div>

            <a
              href={refillWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="refill-split-button refill-split-button-desktop"
            >
              Quiero renovar mi vela
            </a>
          </div>
        </div>

        <div className="refill-split-right">
          <div className="refill-split-steps">
            <article className="refill-split-step">
              <div className="refill-split-number">01</div>

              <div className="refill-split-step-text">
                <h3>Traé tu envase</h3>
                <span></span>
                <p>
                  Acercalo a nuestro espacio
                  <br />
                  o coordiná la entrega.
                </p>
              </div>
            </article>

            <article className="refill-split-step">
              <div className="refill-split-number">02</div>

              <div className="refill-split-step-text">
                <h3>Elegí tu aroma</h3>
                <span></span>
                <p>
                  Seleccioná la fragancia que
                  <br />
                  más te guste.
                </p>
              </div>
            </article>

            <article className="refill-split-step">
              <div className="refill-split-number">03</div>

              <div className="refill-split-step-text">
                <h3>Volvé a encenderlo</h3>
                <span></span>
                <p>
                  Renovamos tu vela con cera de soja
                  <br />
                  y una mecha nueva.
                </p>
              </div>
            </article>
          </div>

          <a
            href={refillWhatsAppUrl}
            target="_blank"
            rel="noreferrer"
            className="refill-split-button refill-split-button-mobile"
          >
            Quiero renovar mi vela
          </a>
        </div>
      </section>

      <section id="aromas" className="aromas-editorial-section">
        <div className="aromas-editorial-header">
          <div className="aromas-editorial-title-block">
            <p>Harmonia Aromas</p>
            <h2>Aromas para elegir</h2>

            <div className="aromas-editorial-divider">
              <span></span>
            </div>
          </div>

          <div className="aromas-editorial-text">
            <p>Explorá aromas únicos creados para acompañar cada momento.</p>
          </div>
        </div>

        <div className="aromas-editorial-grid">
          {aromaCategories.map((category, index) => (
            <article
              key={category.title}
              className="aroma-editorial-card"
              onClick={() => setSelectedAromaCategory(category)}
            >
              <img src={category.image} alt={category.title} />

              <div className="aroma-editorial-overlay"></div>

              <div className="aroma-editorial-content">
                <div className="aroma-editorial-middle">
                  <span className="aroma-editorial-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <button
                    type="button"
                    className="aroma-editorial-arrow"
                    aria-label={`Ver aromas ${category.title}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedAromaCategory(category);
                    }}
                  >
                    →
                  </button>
                </div>

                <div className="aroma-editorial-bottom">
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer id="contacto" className="footer">
        <p className="section-subtitle">Nuestras redes 🌿</p>

        <h2>Seguinos y contactanos</h2>

        <p className="footer-text">
          Encontranos en nuestras redes y escribinos cuando quieras.
        </p>

        <div className="social-grid">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=harmonia.aromas1@gmail.com"
            className="social-card"
          >
            <FaEnvelope className="social-icon email-icon" />

            <h3>Email</h3>

            <p>Escribinos</p>
          </a>

          <a
            href="https://instagram.com/harmonia_aromass"
            target="_blank"
            rel="noreferrer"
            className="social-card"
          >
            <FaInstagram className="social-icon instagram-icon" />

            <h3>Instagram</h3>

            <p>@harmonia_aromass</p>
          </a>

          <a
            href="https://wa.me/5493465659024"
            target="_blank"
            rel="noreferrer"
            className="social-card"
          >
            <FaWhatsapp className="social-icon whatsapp-icon" />

            <h3>WhatsApp</h3>

            <p>Escribinos</p>
          </a>

          <a
            href="https://www.tiktok.com/@harmonia.aromas2"
            target="_blank"
            rel="noreferrer"
            className="social-card"
          >
            <FaTiktok className="social-icon tiktok-icon" />

            <h3>TikTok</h3>

            <p>@harmonia.aromas2</p>
          </a>
        </div>

        <div className="footer-divider">
          <span>🤎</span>
        </div>

        <p className="footer-copy">© 2026 Harmonia Aromas · Hecho con 🤎</p>

        <p className="footer-credit">
          Sitio web desarrollado por{" "}
          <a
            href="https://innova-web-mauve.vercel.app/"
            target="_blank"
            rel="noreferrer"
          >
            Innova
          </a>
        </p>
      </footer>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          images={getProductImages(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {selectedAromaCategory && (
        <AromaModal
          title={selectedAromaCategory.title}
          aromas={selectedAromaCategory.aromas}
          onClose={() => setSelectedAromaCategory(null)}
        />
      )}

      <CartButton onClick={() => setIsCartOpen(true)} />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main>
  );
}

export default App; 