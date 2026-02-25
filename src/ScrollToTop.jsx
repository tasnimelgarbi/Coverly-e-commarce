import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // لو فيه hash زي #categories
    if (hash) {
      const id = hash.replace("#", "");
      // خليها بعد الرندر عشان العنصر يكون موجود
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // fallback لو العنصر مش موجود
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
      });
      return;
    }

    // لو مفيش hash يبقى scroll للـ top طبيعي
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}