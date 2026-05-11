import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * Authority Section
 * Mostra credibilidade com números reais, logos de clientes, cases, etc.
 */

const stats = [
  { number: "500+", label: "Automações Criadas", suffix: "" },
  { number: "98%", label: "Satisfação dos Clientes", suffix: "%" },
  { number: "R$ 50M+", label: "Economizados para Clientes", suffix: "" },
  { number: "24/7", label: "Suporte Automatizado", suffix: "" },
];

const clients = [
  { name: "TechCorp", logo: "🏢" },
  { name: "DataFlow", logo: "📊" },
  { name: "AutoSys", logo: "🤖" },
  { name: "CloudNet", logo: "☁️" },
  { name: "BizAI", logo: "💼" },
  { name: "SmartOps", logo: "⚡" },
];

const testimonials = [
  {
    name: "Carlos Silva",
    role: "CEO",
    company: "TechCorp Brasil",
    content: "A Automation to You revolucionou nossos processos. Economizamos 40 horas por semana e aumentamos vendas em 150%.",
    avatar: "👨‍💼"
  },
  {
    name: "Ana Costa",
    role: "Diretora de Operações",
    company: "DataFlow Solutions",
    content: "Sistema de cobrança automatizado recuperou R$ 2 milhões em 6 meses. Resultado impressionante.",
    avatar: "👩‍💼"
  },
  {
    name: "Roberto Santos",
    role: "Founder",
    company: "AutoSys",
    content: "WhatsApp automatizado atende 500+ clientes simultaneamente. Suporte 24/7 que realmente funciona.",
    avatar: "👨‍🚀"
  }
];

export default function AuthoritySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="relative py-32 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        className="relative z-10 container max-w-7xl mx-auto px-4"
        style={{ y }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-20 space-y-6"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-none">
            RESULTADOS
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">
              QUE FALAM POR SI
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            Números reais de empresas que transformaram seus negócios com nossas soluções de automação
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <motion.div
                  className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300 mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {stat.number}
                  <span className="text-2xl md:text-4xl">{stat.suffix}</span>
                </motion.div>
                <p className="text-gray-400 text-sm md:text-base font-medium">
                  {stat.label}
                </p>
                <motion.div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-300 group-hover:w-full transition-all duration-500"
                  whileHover={{ width: "100%" }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Client Logos */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Empresas que Confiam em Nós
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
            {clients.map((client, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center justify-center p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 group"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {client.logo}
                </div>
                <p className="text-cyan-400 text-sm font-medium text-center">
                  {client.name}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            O que Nossos Clientes Dizem
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group"
                whileHover={{ scale: 1.02, y: -5 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-white font-bold">{testimonial.name}</p>
                    <p className="text-cyan-400 text-sm">{testimonial.role}</p>
                    <p className="text-gray-400 text-xs">{testimonial.company}</p>
                  </div>
                </div>
                <blockquote className="text-gray-300 italic leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                <div className="absolute top-4 right-4 text-cyan-400 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="btn-neon-solid rounded-xl font-semibold text-lg px-8 py-4 mb-4"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 40px rgba(0, 217, 255, 0.6)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Ver Todos os Cases de Sucesso
          </motion.button>
          <p className="text-gray-400 text-sm">
            Mais de 200 estudos de caso documentados
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}