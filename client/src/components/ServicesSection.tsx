import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Bot, MessageSquare, Zap, BarChart3, Cpu, Network } from 'lucide-react';

/**
 * Design: Futuristic AI Automation Center
 * - Cards assimétricos com layers 3D
 * - Animações internas holográficas
 * - Efeitos de brilho reagindo ao mouse
 * - Bordas animadas e motion orgânico
 * - Profundidade visual extrema
 */

function ServiceHologram({ isHovered }: { isHovered: boolean }) {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.7;
      sphereRef.current.scale.setScalar(isHovered ? 1.2 : 1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={sphereRef} args={[0.3, 32, 32]}>
        <meshStandardMaterial
          color={isHovered ? "#00FFFF" : "#00D9FF"}
          emissive={isHovered ? "#00FFFF" : "#00D9FF"}
          emissiveIntensity={isHovered ? 0.4 : 0.2}
          transparent
          opacity={0.8}
          roughness={0}
          metalness={0.9}
        />
      </Sphere>
    </Float>
  );
}

interface ServiceCardProps {
  service: {
    icon: React.ReactNode;
    title: string;
    description: string;
  };
  index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      className="group relative h-80 cursor-pointer"
      initial={{ opacity: 0, y: 50, rotateY: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        scale: 1.05,
        rotateY: 5,
        z: 50
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D Canvas for hologram */}
      <div className="absolute top-4 right-4 w-16 h-16 z-20">
        <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#00D9FF" />
          <ServiceHologram isHovered={isHovered} />
        </Canvas>
      </div>

      {/* Main card with asymmetric design */}
      <div className="relative h-full p-8 rounded-2xl overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-cyan-500/30"
           style={{
             background: isHovered
               ? 'linear-gradient(135deg, rgba(10, 10, 10, 0.9), rgba(0, 217, 255, 0.1))'
               : 'linear-gradient(135deg, rgba(10, 10, 10, 0.8), rgba(20, 20, 20, 0.6))',
             backdropFilter: 'blur(20px)',
             border: isHovered ? '1px solid rgba(0, 217, 255, 0.4)' : '1px solid rgba(0, 217, 255, 0.1)',
             transform: isHovered ? 'translateZ(20px) rotateX(5deg)' : 'translateZ(0px) rotateX(0deg)',
           }}>

        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
            isHovered ? 'bg-gradient-to-r from-cyan-400/20 via-transparent to-cyan-400/20' : 'bg-transparent'
          }`} />
          <motion.div
            className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            animate={{ x: isHovered ? ['-100%', '100%'] : '0%' }}
            transition={{ duration: 2, repeat: isHovered ? Infinity : 0, ease: "linear" }}
          />
        </div>

        {/* Content layers */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Icon with glow effect */}
          <motion.div
            className="flex items-center justify-center w-14 h-14 rounded-xl text-cyan-400 mb-6"
            style={{
              background: isHovered
                ? 'rgba(0, 217, 255, 0.2)'
                : 'rgba(0, 217, 255, 0.1)',
              boxShadow: isHovered
                ? '0 0 20px rgba(0, 217, 255, 0.5), inset 0 0 20px rgba(0, 217, 255, 0.2)'
                : '0 0 10px rgba(0, 217, 255, 0.3)',
            }}
            animate={{
              rotate: isHovered ? [0, -5, 5, 0] : 0,
              scale: isHovered ? [1, 1.1, 1] : 1
            }}
            transition={{ duration: 0.6 }}
          >
            {service.icon}
          </motion.div>

          {/* Title with reveal effect */}
          <div className="mb-4 overflow-hidden">
            <motion.h3
              className="text-2xl font-bold text-white"
              animate={{
                y: isHovered ? [-20, 0] : 0,
                opacity: isHovered ? [0, 1] : 1
              }}
              transition={{ duration: 0.4 }}
            >
              {service.title}
            </motion.h3>
          </div>

          {/* Description */}
          <motion.p
            className="text-gray-400 text-sm leading-relaxed flex-grow"
            animate={{
              opacity: isHovered ? 0.8 : 0.6,
              y: isHovered ? [10, 0] : 0
            }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {service.description}
          </motion.p>

          {/* Bottom accent */}
          <motion.div
            className="mt-6 h-1 bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-full"
            animate={{
              width: isHovered ? '100%' : '30%',
              opacity: isHovered ? 1 : 0.5
            }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Floating particles effect */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                initial={{
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                  opacity: 0
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%'
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Shadow effect */}
      <motion.div
        className="absolute inset-0 bg-cyan-500/10 rounded-2xl blur-xl -z-10"
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="relative py-32 bg-black overflow-hidden">
      {/* 3D Grid background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="service-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(0, 217, 255, 0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#service-grid)" />
        </svg>
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
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
          <motion.h2
            className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-none"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            TECNOLOGIAS DE
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">
              AUTOMAÇÃO AVANÇADA
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Soluções completas de IA e automação que transformam processos manuais em sistemas inteligentes e autônomos
          </motion.p>
        </motion.div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
const services = [
  {
    icon: <Bot size={24} />,
    title: 'Bots Inteligentes',
    description: 'Automatize atendimento, vendas e fluxos de suporte com chatbots que entendem seus clientes.',
  },
  {
    icon: <MessageSquare size={24} />,
    title: 'Automação de Conversão',
    description: 'Crie jornadas conversacionais que qualificam leads, agendam reuniões e elevam a conversão.',
  },
  {
    icon: <Zap size={24} />,
    title: 'Ações Instantâneas',
    description: 'Dispare notificações, integrações e tarefas em tempo real sem precisar de intervenção manual.',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Análise de Performance',
    description: 'Monitore resultados em tempo real e ajuste processos com insights inteligentes.',
  },
  {
    icon: <Cpu size={24} />,
    title: 'IA Embutida',
    description: 'Use inteligência artificial para classificar dados, prever demandas e recomendar ações.',
  },
  {
    icon: <Network size={24} />,
    title: 'Infraestrutura Conectada',
    description: 'Integre sistemas, CRM, ERP e canais de vendas com APIs e automações personalizadas.',
  },
];