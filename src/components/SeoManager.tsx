
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://www.harmoniaaromas.com.ar/";

const HOME_TITLE =
  "Velas de Soja Artesanales en Venado Tuerto | Harmonia Aromas";

export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const isAdmin =
      pathname === "/admin" ||
      pathname.startsWith("/admin/");

    let robots =
      document.querySelector<HTMLMetaElement>(
        'meta[name="robots"]'
      );

    let canonical =
      document.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]'
      );

    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }

    if (isAdmin) {
      document.title = "Administración | Harmonia Aromas";

      robots.content = "noindex, nofollow";

      canonical?.remove();
    } else if (pathname === "/") {
      document.title = HOME_TITLE;

      robots.content = "index, follow";

      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }

      canonical.href = SITE_URL;
    } else {
      document.title = "Página no encontrada | Harmonia Aromas";

      robots.content = "noindex, follow";

      canonical?.remove();
    }
  }, [pathname]);

  return null;
}
 