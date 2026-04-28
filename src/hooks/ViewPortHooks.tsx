import { useEffect, useRef, useState } from "react";


export function useMediaQuery(query = '(max-width: 1023px)') {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => { setMatches(media.matches); };
    window.addEventListener("resize", listener);
    return () => { window.removeEventListener("resize", listener); };
  }, [matches, query]);

  return matches;
} 


export function useInfiniteScroll<T>(items: T[], initialCount = 10, step = 10) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentTrigger = triggerRef.current;
    if (!currentTrigger) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting && !isLoading) {
          // Use a functional state check to avoid needing visibleCount in deps
          setVisibleCount((prev) => {
            if (prev < items.length) {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
              }, 200);
              return prev + step;
            }
            return prev;
          });
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.1,
      }
    );

    observer.observe(currentTrigger);
    return () => { observer.disconnect(); };

    // items.length is enough to trigger a refresh if the list changes
    // isLoading is needed because it's used in the conditional logic
  }, [items.length, step, isLoading]);
  return {
    triggerRef,
    visibleData: items.slice(0, visibleCount),
    hasMore: visibleCount < items.length,
    isLoading,
  };
}

