import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import type { Variants } from 'framer-motion';

/**
 * Design: Cyber-Luxury Minimalista
 * - Números animados com contagem
 * - Ícones minimalistas
 * - Fundo com gradiente sutil
 * - Espaço negativo estratégico
 */

interface Stat {
  value: number;
  label: string;
  suffix: string;
}

const stats: Stat[] = [
  { value: 500, label: 'Empresas Automatizadas', suffix: '+' },
  { value: 50000000, label: 'Mensagens Processadas', suffix: '+' },
  { value: 85, label: 'Aumento de Produtividade', suffix: '%' },
  { value: 60, label: 'Redução de Tempo Operacional', suffix: '%' },
];

interface AnimatedNumberProps {
  value: number;
  suffix: string;
}

function AnimatedNumber({ value, suffix }: AnimatedNumberProps) {
  const isLarge = value > 1000;
  const displayValue = isLarge ? Math.floor(value / 1000000) + 'M' : value;

  return (
    <motion.span
      className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300"
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {displayValue}{suffix}
    </motion.span>
  );
}

export default function ResultsSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Background com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-950 to-background opacity-50 z-0" />

      {/* Conteúdo */}
      <div className="relative z-10 container max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Resultados que Falam
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Números reais de empresas transformadas pela automação
          </p>
        </motion.div>

        {/* Grid de estatísticas */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center justify-center p-8 rounded-xl bg-gradient-to-br from-cyan-500/5 to-cyan-500/0 border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 group cursor-pointer"
            >
              {/* Número animado */}
              <div className="mb-4">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <p className="text-center text-gray-300 font-medium group-hover:text-cyan-300 transition-colors duration-300">
                {stat.label}
              </p>

              {/* Linha decorativa */}
              <div className="mt-4 h-1 w-0 bg-gradient-to-r from-cyan-400 to-cyan-300 group-hover:w-12 transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
