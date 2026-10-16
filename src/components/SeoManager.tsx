
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://www.harmoniaaromas.com.ar";

export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

    const robots = document.querySelector<HTMLMetaElement>(
      'meta[name="robots"]'
    );

    const canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );

    if (isAdmin) {
      document.title = "Administración | Harmonia Aromas";

      robots?.setAttribute("content", "noindex, nofollow");
      canonical?.remove();
    } else {
      document.title =
        "Harmonia Aromas | Velas de Soja y Aromas para tu Hogar";

      robots?.setAttribute("content", "index, follow");

      if (!document.querySelector('link[rel="canonical"]')) {
        const link = document.createElement("link");
        link.rel = "canonical";
        link.href = `${SITE_URL}/`;
        document.head.appendChild(link);
      }
    }
  }, [pathname]);

  return null;
}
 