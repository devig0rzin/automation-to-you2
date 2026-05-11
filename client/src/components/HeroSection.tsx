import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const tilt = useTransform(scrollYProgress, [0, 1], [0, -8]);
  const translateY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMetadata = () => {
      if (video.duration && Number.isFinite(video.duration)) {
        setVideoDuration(video.duration);
        video.playbackRate = 1.5; // Aumenta a velocidade para 1.5x
      }
    };

    video.addEventListener('loadedmetadata', handleMetadata);
    video.loop = true; // Ativa o loop
    video.play().catch(() => {});

    return () => {
      video.removeEventListener('loadedmetadata', handleMetadata);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-[#02030a] text-white">
      <motion.div
        style={{ rotateY: tilt, y: translateY }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          src="/hero-video.mp4"
          preload="auto"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(2,210,255,0.16),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(171,69,255,0.14),_transparent_20%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.05),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.04),_transparent_30%)] pointer-events-none" />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1480px] flex-col px-6 py-10 lg:px-10">
        <header className="flex items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 text-sm font-bold text-black shadow-[0_0_30px_rgba(0,217,255,0.18)]">
              AT
            </div>
            <span className="uppercase tracking-[0.35em] text-xs text-slate-400">Automation to You</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10">
              EN
            </button>
            <button className="flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10">
              <span className="block h-[2px] w-6 rounded-full bg-white" />
              <span className="block h-[2px] w-6 rounded-full bg-white" />
              <span className="block h-[2px] w-6 rounded-full bg-white" />
            </button>
          </div>
        </header>

        <div className="grid min-h-[calc(100vh-96px)] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.35em] text-cyan-300 shadow-[0_0_20px_rgba(0,217,255,0.08)]">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              engenharia visual • inteligencia artificial • conversao absoluta
            </div>

            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.04em] text-white md:text-7xl lg:text-8xl">
              {Array.from("NOS").map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block cursor-pointer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {letter}
                </motion.span>
              ))}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-500 to-violet-400">
                {Array.from("ENGENHAMOS").map((letter, index) => (
                  <motion.span
                    key={index}
                    className="inline-block cursor-pointer"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
              <br />
              {Array.from("A REALIDADE.").map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block cursor-pointer"
                  whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? 3 : -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {letter}
                </motion.span>
              ))}
            </h1>

            <p className="max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
              Criamos experiencias digitais hipnoticas, automacoes inteligentes e funis de conversao que aceleram o crescimento real da sua marca.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="btn-neon-solid rounded-full px-8 py-4 text-base font-semibold">
                Ver Cases
              </button>
              <button className="btn-neon rounded-full px-8 py-4 text-base font-semibold">
                Vamos Conversar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
