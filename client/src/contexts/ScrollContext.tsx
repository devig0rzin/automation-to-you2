import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';

interface ScrollContextType {
  lenis: Lenis | null;
}

const ScrollContext = createContext<ScrollContextType>({ lenis: null });

export const useScroll = () => useContext(ScrollContext);

interface ScrollProviderProps {
  children: ReactNode;
}

export function ScrollProvider({ children }: ScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    const lenis = lenisRef.current;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <ScrollContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </ScrollContext.Provider>
  );
}