import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Storytelling Visual Section
 * Transforma o scroll em narrativa cinematográfica:
 * 1. Caos manual → 2. IA organizando → 3. Crescimento → 4. Resultado absurdo
 */

function ChaosScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      groupRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(state.clock.elapsedTime + i) * 0.5;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Chaos elements - scattered documents, clocks, etc. */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={2} floatIntensity={3}>
          <Box args={[0.1, 0.15, 0.02]} position={[
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 2
          ]}>
            <meshStandardMaterial color="#ff4444" transparent opacity={0.7} />
          </Box>
        </Float>
      ))}
    </group>
  );
}

function AIScene() {
  const brainRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group>
      {/* AI Brain */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere ref={brainRef} args={[0.8, 32, 32]}>
          <meshStandardMaterial
            color="#00D9FF"
            emissive="#00D9FF"
            emissiveIntensity={0.2}
            transparent
            opacity={0.8}
          />
        </Sphere>
      </Float>

      {/* Organizing particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={new Float32Array(Array.from({ length: 300 }, () => (Math.random() - 0.5) * 6))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#00D9FF" size={0.02} transparent opacity={0.6} />
      </points>
    </group>
  );
}

function GrowthScene() {
  const chartRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (chartRef.current) {
      // Animate growth bars
    }
  });

  return (
    <group ref={chartRef}>
      {/* Growth visualization - bars rising */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Box key={i} args={[0.2, i * 0.3 + 0.5, 0.1]} position={[-2 + i * 0.5, 0, 0]}>
          <meshStandardMaterial color="#00FF88" emissive="#00FF88" emissiveIntensity={0.1} />
        </Box>
      ))}
    </group>
  );
}

function ResultScene() {
  const trophyRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (trophyRef.current) {
      trophyRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      trophyRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group>
      {/* Trophy/result symbol */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <Box ref={trophyRef} args={[0.3, 0.8, 0.3]} position={[0, 0.4, 0]}>
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </Box>
      </Float>

      {/* Success particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <Float key={i} speed={3} rotationIntensity={2} floatIntensity={4}>
          <Sphere args={[0.05, 8, 8]} position={[
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 4
          ]}>
            <meshBasicMaterial color="#FFD700" transparent opacity={0.8} />
          </Sphere>
        </Float>
      ))}
    </group>
  );
}

interface StorytellingSectionProps {
  className?: string;
}

export default function StorytellingSection({ className = "" }: StorytellingSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const sceneProgress = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 1, 2, 3, 4]);

  const scenes = [
    { component: ChaosScene, title: "CAOS MANUAL", subtitle: "Processos desorganizados, tempo perdido, erros constantes" },
    { component: AIScene, title: "IA ORGANIZANDO", subtitle: "Automação inteligente analisando e estruturando dados" },
    { component: GrowthScene, title: "CRESCIMENTO", subtitle: "Eficiência aumenta, custos diminuem, resultados melhoram" },
    { component: ResultScene, title: "RESULTADO ABSURDO", subtitle: "Empresa transformada em máquina de crescimento perpétuo" }
  ];

  return (
    <section ref={containerRef} className={`relative min-h-[400vh] bg-black ${className}`}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ alpha: true, antialias: true }}
          className="absolute inset-0"
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#00D9FF" />
          <directionalLight position={[-10, -10, -5]} intensity={0.4} color="#ffffff" />

          {scenes.map((scene, index) => (
            <motion.group
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: sceneProgress.get() >= index && sceneProgress.get() < index + 1 ? 1 : 0,
                scale: sceneProgress.get() >= index && sceneProgress.get() < index + 1 ? 1 : 0.8
              }}
              transition={{ duration: 0.8 }}
            >
              <scene.component />
            </motion.group>
          ))}
        </Canvas>

        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center max-w-4xl px-4">
            {scenes.map((scene, index) => (
              <motion.div
                key={index}
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: sceneProgress.get() >= index && sceneProgress.get() < index + 1 ? 1 : 0,
                  y: sceneProgress.get() >= index && sceneProgress.get() < index + 1 ? 0 : 50
                }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.h2
                  className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tighter"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {scene.title}
                </motion.h2>
                <motion.p
                  className="text-xl md:text-2xl text-cyan-300 font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {scene.subtitle}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {scenes.map((_, index) => (
              <motion.div
                key={index}
                className="w-3 h-3 rounded-full bg-gray-600"
                animate={{
                  backgroundColor: sceneProgress.get() >= index ? "#00D9FF" : "#374151",
                  scale: sceneProgress.get() >= index && sceneProgress.get() < index + 1 ? 1.2 : 1
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}