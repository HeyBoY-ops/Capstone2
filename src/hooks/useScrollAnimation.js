import { useEffect, useRef, useState } from 'react';

/**
 * Hook to trigger animations when element enters viewport
 * @param {Object} options - IntersectionObserver options
 * @returns {Array} [ref, isVisible]
 */
export const useScrollAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const threshold = options.threshold || 0.1;
    const rootMargin = options.rootMargin || '0px';
    const once = options.once !== false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optional: unobserve after animation triggers
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options.threshold, options.rootMargin, options.once]);

  return [ref, isVisible];
};

export default useScrollAnimation;

