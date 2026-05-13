import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, GitBranch } from 'lucide-react';
import Logo from './Logo';

interface LoadingScreenProps {
  onComplete: () => void;
}

const loadingSteps = [
  { label: 'Preparando ambiente', start: 0, end: 35 },
  { label: 'Carregando experiência', start: 36, end: 70 },
  { label: 'Iniciando navegação', start: 71, end: 100 },
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 100) {
          clearInterval(progressTimer);
          setTimeout(onComplete, 420);
          return 100;
        }

        return Math.min(currentProgress + 4, 100);
      });
    }, 45);

    return () => clearInterval(progressTimer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="loading-screen fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#f8fbff] px-4"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(56,189,248,0.16),transparent_32%),linear-gradient(135deg,#f8fbff_0%,#eaf7ff_45%,#f7fbff_100%)]" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-sky-200/80 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative z-10 w-[min(92vw,540px)] rounded-[28px] border border-sky-200/60 bg-white/90 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.13)] backdrop-blur-xl sm:p-8"
        >
          <div className="mb-7">
            <div>
              <Logo className="mb-3 h-16 w-auto" />
              <h1 className="mt-1 text-2xl font-semibold text-slate-950">Preparando sua experiência</h1>
              <p className="mt-1 text-sm leading-6 text-slate-600">Estamos carregando a experiência digital da ATY.</p>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {loadingSteps.map((step, index) => {
              const status = progress >= 100 || progress > step.end ? 'completed' : progress >= step.start ? 'active' : 'pending';
              const isCompleted = status === 'completed';
              const isActive = status === 'active';

              return (
                <div
                  key={step.label}
                  className={`rounded-2xl border px-3 py-3 text-[#142033] transition ${
                    isCompleted
                      ? 'border-[#5bb8ff] bg-[#eef7ff] shadow-[0_10px_28px_rgba(10,102,255,0.10)]'
                      : isActive
                        ? 'border-[#0a66ff] bg-[#eaf6ff] shadow-[0_0_0_3px_rgba(10,102,255,0.08),0_12px_32px_rgba(10,102,255,0.14)]'
                        : 'border-[#b9e2ff] bg-[#f8fcff]'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-[#0a66ff]" />
                    ) : (
                      <GitBranch className={`h-4 w-4 ${isActive ? 'text-[#0a66ff]' : 'text-[#0b2e6b]/60'}`} />
                    )}
                    <span className={`text-[11px] ${isActive || isCompleted ? 'font-semibold text-[#0a66ff]' : 'text-[#0b2e6b]/60'}`}>0{index + 1}</span>
                  </div>
                  <p className={`text-xs leading-4 ${isActive ? 'font-semibold text-[#142033]' : 'text-[#142033]/78'}`}>{step.label}</p>
                </div>
              );
            })}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
              <span>{progress >= 100 ? 'Tudo pronto' : 'Carregando site'}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-950/[0.08]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#003b91] via-[#0284c7] to-[#22d3ee] shadow-[0_0_18px_rgba(34,211,238,0.35)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
