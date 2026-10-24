import type { Product } from "../types/Product";
import "./CatalogFilters.css";

type CatalogCategory = NonNullable<Product["category"]>;

interface CatalogFiltersProps {
  activeCategory: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
}

const categories: {
  value: CatalogCategory;
  label: string;
}[] = [
  { value: "classic", label: "Velas clásicas" },
  { value: "bakery", label: "Línea Bakery" },
  { value: "wax-melts", label: "Wax Melts" },
  { value: "candle-box", label: "Candle Box" },
  { value: "christmas", label: "Colección navideña" }
];

function ChristmasBow({
  className = "harmonia-line-filter__bow"
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M39 35C29 30 10 27 10 15C10 3 26 10 40 31"
        fill="none"
        stroke="#b42128"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M41 35C52 30 70 27 70 15C70 3 54 10 40 31"
        fill="none"
        stroke="#b42128"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 36C32 49 23 63 17 70L27 66L30 76C35 62 39 48 42 37Z"
        fill="#a91420"
      />
      <path
        d="M44 36C49 47 58 57 65 67L55 64L54 74C46 61 41 47 38 37Z"
        fill="#c32b30"
      />
      <path
        d="M14 14C14 8 27 17 35 27"
        fill="none"
        stroke="#ed8b81"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M66 14C66 8 53 17 45 27"
        fill="none"
        stroke="#ed8b81"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="33"
        y="28"
        width="14"
        height="13"
        rx="5"
        fill="#b42128"
        transform="rotate(-8 40 34)"
      />
    </svg>
  );
}

function ChristmasDecorations() {
  return (
    <div className="harmonia-christmas-decoration" aria-hidden="true">
      <svg
        className="harmonia-christmas-ribbon"
        viewBox="0 0 240 160"
        fill="none"
        focusable="false"
      >
        <path
          d="M-35 103C52 135 130 69 180-35"
          stroke="#79131c"
          strokeWidth="30"
        />
        <path
          d="M-35 98C52 130 130 64 180-40"
          stroke="#b7222d"
          strokeWidth="24"
        />
        <path
          d="M-35 90C52 122 130 56 180-48"
          stroke="#e87970"
          strokeWidth="2"
          opacity="0.75"
        />
        <path
          d="M-35 109C52 141 130 75 180-29"
          stroke="#ecb17e"
          strokeWidth="1"
          strokeDasharray="2 4"
          opacity="0.7"
        />
      </svg>

      {Array.from({ length: 10 }, (_, index) => (
        <svg
          key={index}
          className={`harmonia-christmas-star harmonia-christmas-star--${index + 1}`}
          viewBox="0 0 40 56"
          focusable="false"
        >
          <path
            d="M20 2L25 21L37 28L25 34L20 54L15 34L3 28L15 21Z"
            fill="#d9ad6a"
            stroke="#ba8747"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path
            d="M20 4L20 28L5 28L16 22Z"
            fill="#f5d8a2"
          />
          <path
            d="M20 28L35 28L24 33L20 51Z"
            fill="#bd8b4e"
            opacity="0.65"
          />
        </svg>
      ))}
    </div>
  );
}

function CatalogFilters({
  activeCategory,
  onCategoryChange
}: CatalogFiltersProps) {
  const isChristmasSelected = activeCategory === "christmas";

  return (
    <>
      {isChristmasSelected && <ChristmasDecorations />}

      <div
        className={[
          "harmonia-line-filters",
          isChristmasSelected
            ? "harmonia-line-filters--christmas-selected"
            : ""
        ]
          .filter(Boolean)
          .join(" ")}
        role="group"
        aria-label="Filtrar catálogo por línea"
      >
        {isChristmasSelected && (
          <div
            className="harmonia-christmas-divider"
            aria-hidden="true"
          >
            <span />
            <ChristmasBow className="harmonia-christmas-divider__bow" />
            <span />
          </div>
        )}

        {categories.map(({ value, label }) => {
          const isChristmas = value === "christmas";
          const isActive = activeCategory === value;

          return (
            <button
              key={value}
              type="button"
              className={[
                "harmonia-line-filter",
                isChristmas ? "harmonia-line-filter--christmas" : "",
                isActive ? "is-active" : ""
              ]
                .filter(Boolean)
                .join(" ")}
              aria-pressed={isActive}
              onClick={() => onCategoryChange(value)}
            >
              <span className="harmonia-line-filter__label">
                {label}
              </span>

              {isChristmas && <ChristmasBow />}
            </button>
          );
        })}
      </div>
    </>
  );
}

export default CatalogFilters; 