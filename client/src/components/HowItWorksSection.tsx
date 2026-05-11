import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

/**
 * Design: Cyber-Luxury Minimalista
 * - Timeline futurista com linhas luminosas
 * - Números em gradiente neon
 * - Cards com glassmorphism
 * - Animações cinematográficas
 */

interface Step {
  number: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Diagnóstico',
    description: 'Analisamos seus processos e identificamos oportunidades de automação',
  },
  {
    number: 2,
    title: 'Estratégia',
    description: 'Desenvolvemos um plano customizado de implementação',
  },
  {
    number: 3,
    title: 'Implementação',
    description: 'Configuramos e testamos todas as automações',
  },
  {
    number: 4,
    title: 'Escala',
    description: 'Otimizamos e expandimos para toda a empresa',
  },
];

export default function HowItWorksSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Background gradient */}
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
            Como Funciona
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Processo simples e eficiente para transformar seu negócio
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Linha conectora (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 transform -translate-y-1/2" />

          {/* Grid de passos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                {/* Card */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/10 rounded-xl p-6 h-full flex flex-col items-center text-center hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all duration-300">
                  {/* Número com glow */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border-2 border-cyan-500/30 mb-4 relative">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">
                      {step.number}
                    </span>
                    {/* Glow background */}
                    <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-lg -z-10" />
                  </div>

                  {/* Título */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>

                  {/* Descrição */}
                  <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                    {step.description}
                  </p>

                  {/* Checkmark */}
                  <div className="mt-4">
                    <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>

                {/* Seta para próximo (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <div className="w-6 h-1 bg-gradient-to-r from-cyan-500 to-cyan-500/0" />
                    <div className="w-3 h-3 bg-cyan-500 rounded-full transform translate-x-1" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 mb-6">
            Pronto para começar sua transformação digital?
          </p>
          <button className="btn-neon-solid rounded-lg font-semibold">
            Agendar Diagnóstico Gratuito
          </button>
        </motion.div>
      </div>
    </section>
  );
}
