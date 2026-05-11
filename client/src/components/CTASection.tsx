import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/**
 * Design: Cyber-Luxury Minimalista
 * - Urgência e impacto visual
 * - Gradiente neon
 * - Botões com efeito premium
 * - Espaço negativo estratégico
 */

export default function CTASection() {
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
      {/* Background com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-950 to-background opacity-50 z-0" />

      {/* Conteúdo */}
      <motion.div
        className="relative z-10 container max-w-4xl mx-auto px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Headline */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
        >
          Enquanto sua empresa perde tempo em processos manuais,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">
            a concorrência já está automatizando tudo
          </span>
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
        >
          Não deixe seu negócio para trás. Comece sua transformação digital hoje mesmo e veja resultados em semanas.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="btn-neon-solid rounded-lg font-semibold flex items-center justify-center gap-2 group">
            Agendar Diagnóstico Gratuito
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="btn-neon rounded-lg font-semibold">
            Falar no WhatsApp
          </button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-12 border-t border-cyan-500/10"
        >
          <p className="text-gray-400 text-sm mb-4">Confiado por empresas como:</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            <div className="text-gray-500 font-semibold">500+ Empresas</div>
            <div className="text-gray-500 font-semibold">50M+ Mensagens</div>
            <div className="text-gray-500 font-semibold">85% Produtividade</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
