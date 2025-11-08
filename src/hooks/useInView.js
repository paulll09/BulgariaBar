import { useEffect, useRef, useState } from "react";

export default function useInView({ root = null, rootMargin = "0px", threshold = 0.15 } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respeta usuarios con motion reducido
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        io.unobserve(entry.target); // solo una vez
      }
    }, { root, rootMargin, threshold });

    io.observe(el);
    return () => io.disconnect();
  }, [root, rootMargin, threshold]);

  return { ref, inView };
}
