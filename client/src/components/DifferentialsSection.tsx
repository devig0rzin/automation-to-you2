import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Zap, Users, Cpu, TrendingUp, Lock, Gauge } from 'lucide-react';

/**
 * Design: Cyber-Luxury Minimalista\n * - Cards com ícones grandes\n * - Glassmorphism premium\n * - Hover com efeito neon\n * - Grid com espaço negativo\n */

interface Differential {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const differentials: Differential[] = [
  {
    icon: <Cpu className="w-12 h-12" />,
    title: 'Tecnologia Avançada',
    description: 'IA e machine learning de ponta para automações inteligentes',
  },
  {
    icon: <Users className="w-12 h-12" />,
    title: 'Atendimento Humanizado',
    description: 'Suporte especializado e consultoria contínua',
  },
  {
    icon: <Zap className="w-12 h-12" />,
    title: 'Performance',
    description: 'Sistemas otimizados para máxima velocidade e eficiência',
  },
  {
    icon: <TrendingUp className="w-12 h-12" />,
    title: 'Escalabilidade',
    description: 'Soluções que crescem com seu negócio',
  },
  {
    icon: <Lock className="w-12 h-12" />,
    title: 'Segurança',
    description: 'Proteção de dados com padrões internacionais',
  },
  {
    icon: <Gauge className="w-12 h-12" />,
    title: 'Soluções Personalizadas',
    description: 'Customizadas para suas necessidades específicas',
  },
];

export default function DifferentialsSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-background to-background opacity-50 z-0" />

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
            Por que Escolher a Gente
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Diferenciais que nos tornam referência em automação e IA
          </p>
        </motion.div>

        {/* Grid de diferenciais */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {differentials.map((diff, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              {/* Card */}
              <div className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/10 rounded-xl p-8 h-full flex flex-col items-center text-center hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all duration-300 cursor-pointer">
                {/* Ícone com glow */}
                <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 text-cyan-400 mb-4 group-hover:shadow-lg group-hover:shadow-cyan-500/40 transition-all duration-300">
                  {diff.icon}
                </div>

                {/* Título */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                  {diff.title}
                </h3>

                {/* Descrição */}
                <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                  {diff.description}
                </p>

                {/* Linha decorativa */}
                <div className="mt-4 h-1 w-0 bg-gradient-to-r from-cyan-400 to-cyan-300 group-hover:w-12 transition-all duration-500" />
              </div>

              {/* Glow background */}
              <div className="absolute inset-0 bg-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
