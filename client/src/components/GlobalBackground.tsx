import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Global Background Effects
 * Aurora glow, particles, tech lines, animated grid, cinematic noise, reflections
 */

export default function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle system
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }

    const particles: Particle[] = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
        color: Math.random() > 0.5 ? '#00D9FF' : '#00FFFF',
      });
    }

    // Connection lines
    const connections: Array<{p1: Particle, p2: Particle, opacity: number}> = [];

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update particles
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw connections
      ctx.strokeStyle = '#00D9FF';
      ctx.globalAlpha = 0.1;
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 -z-20 pointer-events-none">
      {/* Canvas for particles and connections */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />

      {/* Aurora glow effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-cyan-500/10 via-cyan-400/5 to-transparent"
          animate={{
            background: [
              'linear-gradient(to bottom, rgba(0, 217, 255, 0.1), rgba(0, 217, 255, 0.05), transparent)',
              'linear-gradient(to bottom, rgba(0, 255, 255, 0.15), rgba(0, 217, 255, 0.08), transparent)',
              'linear-gradient(to bottom, rgba(0, 217, 255, 0.1), rgba(0, 217, 255, 0.05), transparent)',
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-2/3 h-1/2 bg-gradient-to-tl from-cyan-400/8 via-cyan-300/4 to-transparent"
          animate={{
            background: [
              'linear-gradient(to top left, rgba(0, 217, 255, 0.08), rgba(0, 255, 255, 0.04), transparent)',
              'linear-gradient(to top left, rgba(0, 255, 255, 0.12), rgba(0, 217, 255, 0.06), transparent)',
              'linear-gradient(to top left, rgba(0, 217, 255, 0.08), rgba(0, 255, 255, 0.04), transparent)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="global-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0, 217, 255, 0.1)" strokeWidth="1"/>
            </pattern>
            <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 217, 255, 0.1)" />
              <stop offset="50%" stopColor="rgba(0, 255, 255, 0.05)" />
              <stop offset="100%" stopColor="rgba(0, 217, 255, 0.1)" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#global-grid)" />
        </svg>
      </div>

      {/* Tech lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
            style={{
              top: `${20 + i * 15}%`,
              left: 0,
              right: 0,
            }}
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}
      </div>

      {/* Cinematic noise texture */}
      <div
        className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          animation: 'noise 0.5s steps(2) infinite',
        }}
      />

      {/* Reflections */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
    </div>
  );
}