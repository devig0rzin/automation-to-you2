import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticCursorProps {
  children: React.ReactNode;
}

export function MagneticCursor({ children }: MagneticCursorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16); // Center on cursor
      mouseY.set(e.clientY - 16);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      {children}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-50 mix-blend-difference"
        style={{
          x: springX,
          y: springY,
        }}
      >
        <motion.div
          className="w-full h-full bg-cyan-400 rounded-full"
          animate={{
            scale: isHovered ? 1.5 : 1,
            opacity: isHovered ? 0.8 : 0.6,
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="absolute inset-0 border border-cyan-400 rounded-full"
          animate={{
            scale: isHovered ? 2 : 1,
            opacity: isHovered ? 0.4 : 0.2,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </>
  );
}

// Hook for magnetic elements
export function useMagneticEffect(strength: number = 0.3) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 400, damping: 25 });
  const springY = useSpring(y, { stiffness: 400, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isHovered) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return {
    x: springX,
    y: springY,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    isHovered,
  };
}

export default MagneticCursor;