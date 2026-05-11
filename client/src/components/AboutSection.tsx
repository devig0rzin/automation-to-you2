import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const BLOCK_COUNT = 3500;
const TUNNEL_DEPTH = 350;
const PALETTE = {
  bg: 0x020204,
  chrome: 0x8090a0,
  chromeDark: 0x506070,
  chromeBright: 0xa0b0c0,
  cyan: 0x00b4ff,
  cyanBright: 0x6effff,
  cyanMid: 0x0098d8,
  magenta: 0xff00ff,
  magentaPink: 0xff40c0,
  magentaDeep: 0xc020a0,
  purple: 0x8020ff,
};

function createMaterials() {
  const matChrome = new THREE.MeshPhysicalMaterial({
    color: 0x080810,
    roughness: 0.15,
    metalness: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 1.0,
    envMapIntensity: 2.0,
  });

  const matChromeDark = new THREE.MeshPhysicalMaterial({
    color: 0x040408,
    roughness: 0.25,
    metalness: 1.0,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
    reflectivity: 0.9,
    envMapIntensity: 1.5,
  });

  const matChromeBright = new THREE.MeshPhysicalMaterial({
    color: 0x0c0c14,
    roughness: 0.1,
    metalness: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    reflectivity: 1.0,
    envMapIntensity: 2.5,
  });

  const matCyan = new THREE.MeshPhysicalMaterial({
    color: 0x003850,
    emissive: PALETTE.cyan,
    emissiveIntensity: 0.35,
    roughness: 0.28,
    metalness: 0.55,
    clearcoat: 0.55,
    clearcoatRoughness: 0.08,
  });

  const matMagenta = new THREE.MeshPhysicalMaterial({
    color: 0x400040,
    emissive: PALETTE.magenta,
    emissiveIntensity: 0.22,
    roughness: 0.3,
    metalness: 0.5,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
  });

  return [
    { mat: matChrome, weight: 40 },
    { mat: matChromeDark, weight: 30 },
    { mat: matChromeBright, weight: 15 },
    { mat: matCyan, weight: 8 },
    { mat: matMagenta, weight: 3 },
  ];
}

function pickMaterial(materials: Array<{ mat: THREE.Material; weight: number }>, totalWeight: number) {
  let r = Math.random() * totalWeight;
  for (let i = 0; i < materials.length; i++) {
    r -= materials[i].weight;
    if (r <= 0) return materials[i];
  }
  return materials[0];
}

function buildTunnelPositions() {
  const cellX = 2.2;
  const cellY = 2.2;
  const cellZ = 3.5;
  const halfW = 10;
  const halfH = 7;
  const positions: Array<{ x: number; y: number; z: number }> = [];

  const zSlices = Math.floor(TUNNEL_DEPTH / cellZ);
  const xSlots = Math.floor((halfW * 2) / cellX);
  const ySlots = Math.floor((halfH * 2) / cellY);

  for (let layer = 0; layer < 2; layer++) {
    for (let xi = 0; xi < xSlots; xi++) {
      for (let zi = 0; zi < zSlices; zi++) {
        positions.push({
          x: -halfW + xi * cellX + cellX * 0.5,
          y: -halfH - layer * cellY - cellY * 0.5,
          z: -zi * cellZ,
        });
      }
    }
  }

  for (let layer = 0; layer < 2; layer++) {
    for (let xi = 0; xi < xSlots; xi++) {
      for (let zi = 0; zi < zSlices; zi++) {
        positions.push({
          x: -halfW + xi * cellX + cellX * 0.5,
          y: halfH + layer * cellY + cellY * 0.5,
          z: -zi * cellZ,
        });
      }
    }
  }

  for (let layer = 0; layer < 2; layer++) {
    for (let yi = 0; yi < ySlots; yi++) {
      for (let zi = 0; zi < zSlices; zi++) {
        positions.push({
          x: -halfW - layer * cellX - cellX * 0.5,
          y: -halfH + yi * cellY + cellY * 0.5,
          z: -zi * cellZ,
        });
      }
    }
  }

  for (let layer = 0; layer < 2; layer++) {
    for (let yi = 0; yi < ySlots; yi++) {
      for (let zi = 0; zi < zSlices; zi++) {
        positions.push({
          x: halfW + layer * cellX + cellX * 0.5,
          y: -halfH + yi * cellY + cellY * 0.5,
          z: -zi * cellZ,
        });
      }
    }
  }

  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  return positions.slice(0, BLOCK_COUNT);
}

function TunnelScene({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const { gl, scene, camera } = useThree();

  const envMap = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(50, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide })
    );
    envScene.add(sphere);

    const panelGeo = new THREE.PlaneGeometry(60, 60);

    const cyanMat = new THREE.MeshBasicMaterial({ color: PALETTE.cyan, side: THREE.DoubleSide });
    const blueMat = new THREE.MeshBasicMaterial({ color: 0x00a6ff, side: THREE.DoubleSide });
    const magentaMat = new THREE.MeshBasicMaterial({ color: PALETTE.magenta, side: THREE.DoubleSide });

    const top = new THREE.Mesh(panelGeo, cyanMat);
    top.position.set(0, 30, -25);
    top.rotation.x = Math.PI / 2;
    envScene.add(top);

    const left = new THREE.Mesh(panelGeo, blueMat);
    left.position.set(-30, 0, -15);
    left.rotation.y = Math.PI / 2;
    envScene.add(left);

    const bottom = new THREE.Mesh(panelGeo, magentaMat);
    bottom.position.set(0, -30, -25);
    bottom.rotation.x = Math.PI / 2;
    envScene.add(bottom);

    const right = new THREE.Mesh(panelGeo, magentaMat);
    right.position.set(30, 0, -15);
    right.rotation.y = Math.PI / 2;
    envScene.add(right);

    const back = new THREE.Mesh(panelGeo, blueMat);
    back.position.set(0, 0, -40);
    envScene.add(back);

    const cyanLight = new THREE.PointLight(PALETTE.cyan, 18, 170);
    cyanLight.position.set(14, 12, -20);
    envScene.add(cyanLight);

    const magentaLight = new THREE.PointLight(PALETTE.magenta, 14, 170);
    magentaLight.position.set(-14, -12, -20);
    envScene.add(magentaLight);

    const renderTarget = pmrem.fromScene(envScene, 0.04);
    pmrem.dispose();
    return renderTarget.texture;
  }, [gl]);

  useEffect(() => {
    scene.environment = envMap;
    scene.background = new THREE.Color(PALETTE.bg);
    return () => {
      if (scene.environment) {
        scene.environment.dispose();
        scene.environment = null;
      }
    };
  }, [envMap, scene]);

  const instances = useMemo(() => {
    const positions = buildTunnelPositions();
    const materials = createMaterials();
    const totalWeight = materials.reduce((sum, item) => sum + item.weight, 0);
    const groups = new Map<THREE.Material, Array<{ position: THREE.Vector3; rotation: THREE.Euler; scale: THREE.Vector3 }>>();

    positions.forEach((pos) => {
      const entry = pickMaterial(materials, totalWeight);
      const list = groups.get(entry.mat) ?? [];
      list.push({
        position: new THREE.Vector3(
          pos.x + (Math.random() - 0.5) * 0.24,
          pos.y + (Math.random() - 0.5) * 0.24,
          pos.z + (Math.random() - 0.5) * 0.4,
        ),
        rotation: new THREE.Euler(
          (Math.random() - 0.5) * 0.06,
          (Math.random() - 0.5) * 0.06,
          (Math.random() - 0.5) * 0.03,
        ),
        scale: new THREE.Vector3(
          2.2 * (0.78 + Math.random() * 0.22),
          2.2 * (0.78 + Math.random() * 0.22),
          1.25 + Math.random() * 0.9,
        ),
      });
      groups.set(entry.mat, list);
    });

    return Array.from(groups.entries()).map(([material, list]) => ({ material, list }));
  }, []);

  const boxGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const instancedRefs = useRef<Array<THREE.InstancedMesh | null>>([]);
  const bigBlockRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    instances.forEach((group, index) => {
      const mesh = instancedRefs.current[index];
      if (!mesh) return;
      group.list.forEach((item, i) => {
        dummy.position.copy(item.position);
        dummy.rotation.copy(item.rotation);
        dummy.scale.copy(item.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    });
  }, [instances, dummy]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const targetX = pointer.current.x * 0.35;
    const targetY = pointer.current.y * 0.2;

    groupRef.current.rotation.y += delta * 0.02;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetY, 0.06);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetX * 0.17, 0.06);

    if (bigBlockRef.current) {
      bigBlockRef.current.rotation.x += delta * 0.18;
      bigBlockRef.current.rotation.y += delta * 0.14;
      bigBlockRef.current.rotation.z += delta * 0.05;
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, -4.8, 0.03);
    camera.lookAt(0, 0, -10);
  });

  return (
    <>
      <fog attach="fog" args={[PALETTE.bg, 4, 28]} />
      <ambientLight intensity={0.08} />
      <pointLight position={[10, 12, 8]} intensity={1.25} color="#00b4ff" />
      <pointLight position={[-10, -10, 8]} intensity={1.0} color="#ff00e4" />
      <pointLight position={[0, 6, -6]} intensity={0.5} color="#ffffff" />
      <group ref={groupRef}>
        {instances.map((group, index) => (
          <instancedMesh
            key={index}
            ref={(el) => (instancedRefs.current[index] = el)}
            args={[boxGeometry, group.material, group.list.length]}
          />
        ))}
      </group>
      <mesh ref={bigBlockRef} position={[0, 0, -6]} scale={[6.4, 6.4, 6.4]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color={0x06070c}
          roughness={0.08}
          metalness={1}
          clearcoat={1}
          clearcoatRoughness={0.04}
          reflectivity={1}
          envMapIntensity={2.2}
        />
      </mesh>
      <mesh position={[0, 0, -28]}>
        <planeGeometry args={[24, 10]} />
        <meshStandardMaterial color="#02040a" transparent opacity={0.88} />
      </mesh>
    </>
  );
}

export default function AboutSection() {
  const pointer = useRef({ x: 0, y: 0 });

  return (
    <section className="about-gmx py-24 bg-[#02030a] text-white relative overflow-hidden">
      <span className="about-number text-7xl font-bold text-cyan-400 opacity-20 absolute left-10 top-10 select-none pointer-events-none">01</span>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[1.25fr_0.75fr] gap-16 items-center">
        <div className="about-left relative overflow-hidden rounded-[36px] border border-cyan-400/10 bg-black/20 shadow-[0_0_120px_rgba(0,0,0,0.45)]">
          <Canvas
            className="h-[520px] lg:h-[700px] w-full"
            camera={{ position: [0, 0, 6], fov: 42 }}
            dpr={[1, 1.8]}
            onPointerMove={(event) => {
              pointer.current = {
                x: (event.clientX / window.innerWidth - 0.5) * 2,
                y: (event.clientY / window.innerHeight - 0.5) * 2,
              };
            }}
            onPointerLeave={() => {
              pointer.current = { x: 0, y: 0 };
            }}
          >
            <TunnelScene pointer={pointer} />
          </Canvas>
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(0,180,255,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(0,72,255,0.16),_transparent_26%)]" />
        </div>
        <div className="about-right">
          <div className="premium-text-card space-y-6">
            <motion.span
              className="about-tag inline-block px-5 py-2 bg-white/5 border border-[#00b4ff]/20 rounded-full text-sm uppercase tracking-[0.35em] text-[#00b4ff]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              QUEM SOU EU
            </motion.span>
            <motion.h2
              className="section-title text-4xl lg:text-5xl font-black leading-tight"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
            >
              O universo técnico por trás da<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4ff] via-[#5cc8ff] to-[#a026ff]">
                Automation to You
              </span>
            </motion.h2>
            <motion.div
              className="about-divider w-20 h-1 bg-gradient-to-r from-[#00b4ff] to-[#6d2dff]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.55, delay: 0.22 }}
            />
            <motion.p
              className="section-desc text-lg text-slate-300 leading-relaxed"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32 }}
            >
              Um bloco grande, quase preto, com reflexos azuis criados por um env-map procedural. O que você vê não é a cor do bloco: é a atmosfera azul da ATY refletida nos cromes.
            </motion.p>
            <motion.p
              className="big-text text-xl lg:text-2xl font-semibold text-white leading-relaxed"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.42 }}
            >
              Esse efeito combina PMREM, instanced meshes de alto desempenho e materiais físicos para entregar densidade visual sem perder velocidade.
            </motion.p>
            <motion.div
              className="about-capabilities grid gap-3 text-sm text-slate-300"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.52 }}
            >
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <strong className="text-white">1. PMREMGenerator + env-map procedural</strong>
                <p className="mt-2 text-slate-300">Reflexos criados por uma cena virtual de painéis cyan e magenta — não por uma imagem estática.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <strong className="text-white">2. InstancedMesh por material</strong>
                <p className="mt-2 text-slate-300">3500 blocos com poucas draw calls, mantendo fluidez mesmo em cena densa.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <strong className="text-white">3. MeshPhysicalMaterial quase preto</strong>
                <p className="mt-2 text-slate-300">Color #080810 + metalness 1 + clearcoat 1 + envMapIntensity alto transforma cada bloco em espelho negro.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <strong className="text-white">4. Grid estruturado + shuffle</strong>
                <p className="mt-2 text-slate-300">Posições calculadas para chão, teto e paredes, depois embaralhadas para densidade e variação.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
