import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [showHologram, setShowHologram] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScanner(true);
    }, 500);

    const hologramTimer = setTimeout(() => {
      setShowHologram(true);
    }, 1000);

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => {
      clearTimeout(timer);
      clearTimeout(hologramTimer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029218109/3cgCxCq7UVz4omHv5sk2Qf/aty-logo.png"
              alt="Automation to You"
              className="h-20 w-auto mx-auto filter drop-shadow-2xl"
            />
          </motion.div>

          {/* Scanner effect */}
          <AnimatePresence>
            {showScanner && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-8"
              >
                <div className="relative w-64 h-1 bg-gray-800 rounded-full mx-auto overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    animate={{ x: ['-100%', '400%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <p className="text-cyan-400 text-sm mt-2 font-mono">Scanning systems...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hologram effect */}
          <AnimatePresence>
            {showHologram && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mb-8"
              >
                <div className="relative">
                  <motion.div
                    className="text-2xl font-bold text-cyan-400 font-mono"
                    animate={{
                      textShadow: [
                        '0 0 10px rgba(0, 217, 255, 0.5)',
                        '0 0 20px rgba(0, 217, 255, 0.8)',
                        '0 0 10px rgba(0, 217, 255, 0.5)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    INITIALIZING AI CORE
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 text-2xl font-bold text-cyan-400 font-mono opacity-50"
                    animate={{ x: [0, 2, 0] }}
                    transition={{ duration: 0.1, repeat: Infinity }}
                  >
                    INITIALIZING AI CORE
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <div className="w-80 mx-auto">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Loading Automation Engine</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Loading dots */}
          <motion.div
            className="flex justify-center mt-6 space-x-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-cyan-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 217, 255, 0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}