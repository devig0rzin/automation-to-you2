import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Instagram, MessageCircle, Mail, ArrowRight } from 'lucide-react';

/**
 * Design: Cyber-Luxury Minimalista
 * - Footer elegante e minimalista
 * - Links com hover neon
 * - Ícones de redes sociais
 * - Glow sutil
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <footer className="relative bg-background border-t border-cyan-500/10 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 to-background opacity-50 z-0" />

      {/* Conteúdo */}
      <motion.div
        className="relative z-10 container max-w-6xl mx-auto px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo e descrição */}
          <motion.div variants={itemVariants} className="space-y-4">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029218109/3cgCxCq7UVz4omHv5sk2Qf/aty-logo.png"
              alt="Automation to You"
              className="h-8 w-auto"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Transformando empresas através de automação, IA e inovação tecnológica.
            </p>
          </motion.div>

          {/* Links rápidos */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-white font-semibold">Produto</h4>
            <ul className="space-y-2">
              {['Chatbots', 'Automação', 'Integrações', 'Preços'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Empresa */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-white font-semibold">Empresa</h4>
            <ul className="space-y-2">
              {['Sobre', 'Blog', 'Contato', 'Carreiras'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Redes sociais */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-white font-semibold">Conecte-se</h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/automationtoy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center hover:bg-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center hover:bg-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="mailto:contato@automationtoyou.com"
                className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center hover:bg-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-cyan-500/0 mb-8" />

        {/* Bottom */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500"
        >
          <p>&copy; {currentYear} Automation to You. Todos os direitos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Termos de Serviço
            </a>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
