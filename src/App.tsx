import { useEffect, useState } from "react";
import type { Product } from "./types/Product";
import { getFeaturedProducts, getProducts } from "./services/productService";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import AromaModal from "./components/AromaModal";
import logo from "./assets/logo.png";
import hero from "./assets/hero.png";

import {
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
  FaEnvelope
} from "react-icons/fa";

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
    description: "Aromas frescos, dulces y vibrantes.",
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
    description: "Fragancias profundas y envolventes.",
    image: aromaIntensos,
    aromas: ["Café", "Capuccino", "Chocolate", "Pitanga maracuyá"]
  },
  {
    title: "Dulces",
    description: "Aromas suaves, cálidos y reconfortantes.",
    image: aromaDulces,
    aromas: ["Dulce de leche", "Vainilla", "Vainilla coco", "Cherry"]
  },
  {
    title: "Florales",
    description: "Fragancias delicadas y elegantes.",
    image: aromaFlorales,
    aromas: ["Orquídeas", "Jazmín", "Lavanda", "Flores blancas"]
  }
];

function App() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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

  return (
    <main className="app">
      <nav className="navbar">
  <a href="#inicio" className="brand-logo">
    <img src={logo} alt="Harmonia Aromas" className="brand-logo-img" />

    <div className="brand-logo-text">
      <span>HARMONIA</span>
      <small>AROMAS</small>
    </div>
  </a>

  <div className="nav-links">
    <a href="#inicio">Inicio</a>
    <a href="#destacados">Destacados</a>
    <a href="#catalogo">Catálogo</a>
    <a href="#aromas">Aromas</a>
    <a href="#contacto">Contacto</a>
  </div>

  <a
    href="https://wa.me/5493465659024"
    target="_blank"
    rel="noreferrer"
    className="navbar-whatsapp"
  >
    Pedidos
  </a>
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
            Ver catálogo
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

<section className="trust-section">
  <div className="trust-grid">
    <article className="trust-card">
      <span>🌿</span>
      <h3>Cera de soja</h3>
      <p>Velas elaboradas con materiales seleccionados y aromas cuidadosamente elegidos.</p>
    </article>

    <article className="trust-card">
      <span>🤎</span>
      <h3>Hechas a mano</h3>
      <p>Cada pieza se realiza con dedicación, detalle y una terminación única.</p>
    </article>

    <article className="trust-card">
      <span>🚚</span>
      <h3>Envíos a todo el país</h3>
      <p>Preparamos cada pedido con cuidado para que llegue en perfectas condiciones.</p>
    </article>

    <article className="trust-card">
      <span>🏷️</span>
      <h3>Venta mayorista</h3>
      <p>Opciones ideales para souvenirs, eventos, regalos empresariales y reventa.</p>
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
        <h2>Todas nuestras velas</h2>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              image={getProductImages(product)[0]}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </section>

      <section id="aromas" className="aromas-section">
        <p className="section-subtitle">Fragancias disponibles</p>
        <h2>Aromas para elegir</h2>

        <div className="aroma-cards-grid">
          {aromaCategories.map((category) => (
            <article
              key={category.title}
              className="aroma-category-card"
              onClick={() => setSelectedAromaCategory(category)}
            >
              <div className="aroma-card-image">
                <img src={category.image} alt={category.title} />
              </div>

              <h3>{category.title}</h3>
              <p>{category.description}</p>
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
    </main>
  );
}

export default App; 