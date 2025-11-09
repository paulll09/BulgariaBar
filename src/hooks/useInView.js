import { useEffect, useRef, useState } from "react";

export default function useInView({
  root = null,
  rootMargin = "0px 0px -10% 0px",
  threshold = 0.2,
  once = true,
  startupDelay = 120,
} = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setInView(true);
      return;
    }

    let rafId;
    let timerId;

    const start = () => {
      const io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          }
        },
        { root, rootMargin, threshold }
      );
      io.observe(el);
    };

    rafId = requestAnimationFrame(() => {
      timerId = setTimeout(start, startupDelay);
    });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [root, rootMargin, threshold, once, startupDelay]);

  return { ref, inView };
}
