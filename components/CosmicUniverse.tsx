
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Text, Sparkles, Line, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useMemoryStore } from '../hooks/useMemoryStore';
import { NebulaBackground } from './NebulaBackground';
import gsap from 'gsap';

const ShootingStar: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [active, setActive] = useState(false);
  const [speed, setSpeed] = useState(0.4);

  const resetStar = () => {
    const range = 1000;
    const startX = (Math.random() - 0.5) * range;
    const startY = 400 + Math.random() * 50;
    const startZ = (Math.random() - 0.5) * range;
    meshRef.current.position.set(startX, startY, startZ);
    setActive(true);
    setSpeed(0.8 + Math.random() * 1.5);
  };

  useFrame(() => {
    if (!active) {
      if (Math.random() < 0.003) resetStar();
      return;
    }
    meshRef.current.position.x -= speed;
    meshRef.current.position.y -= speed * 0.3;
    if (meshRef.current.position.y < -400) setActive(false);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.3, 8, 8]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  );
};

const SpiritStar: React.FC<{ month: number; position: [number, number, number] }> = ({ month, position }) => {
  const { setFocusedMonth, focusedMonth, setActiveMonth } = useMemoryStore();
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const auraRef = useRef<THREE.Mesh>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);
  const textRef = useRef<any>(null!);
  
  const isFocused = focusedMonth === month;
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle oscillation
      groupRef.current.position.y = position[1] + Math.sin(t * 0.4 + month) * 1.2;
    }
    
    if (coreRef.current && auraRef.current && haloRef.current) {
      const pulse = 1 + Math.sin(t * 1.5 + month) * 0.2;
      const coreScale = (isFocused ? 2.5 : 0.75) * pulse;
      const auraScale = (isFocused ? 8.0 : 4.5) * pulse;
      const haloScale = auraScale * 1.6;
      
      coreRef.current.scale.lerp(new THREE.Vector3(coreScale, coreScale, coreScale), 0.1);
      auraRef.current.scale.lerp(new THREE.Vector3(auraScale, auraScale, auraScale), 0.1);
      haloRef.current.scale.lerp(new THREE.Vector3(haloScale, haloScale, haloScale), 0.1);
      
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, isFocused ? 500 : 180, 0.1);
    }

    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion);
      const worldPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPos);
      const dist = state.camera.position.distanceTo(worldPos);
      const targetFontSize = THREE.MathUtils.mapLinear(dist, 45, 500, 1.0, 3.5);
      const clampedSize = Math.min(Math.max(targetFontSize, 1.2), 4.0);
      
      textRef.current.fontSize = THREE.MathUtils.lerp(textRef.current.fontSize, clampedSize, 0.1);
      textRef.current.opacity = THREE.MathUtils.lerp(textRef.current.opacity, isFocused ? 1 : 0.5, 0.1);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh 
        onClick={(e) => { e.stopPropagation(); setFocusedMonth(month); setActiveMonth(month); }}
        onPointerEnter={() => (document.body.style.cursor = 'pointer')}
        onPointerLeave={() => (document.body.style.cursor = 'auto')}
      >
        <sphereGeometry args={[12, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <mesh ref={coreRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#fffde7" emissiveIntensity={200} toneMapped={false} />
      </mesh>

      <mesh ref={auraRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#ffca28" transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh ref={haloRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#ffd54f" transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      
      <Text
        ref={textRef}
        position={[0, 12, 0]}
        fontSize={1}
        color={isFocused ? "#ffd54f" : "#ffffff"}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        anchorX="center"
        anchorY="bottom"
        transparent
      >
        {`Month ${month}`}
      </Text>
      
      {isFocused && (
        <Sparkles count={500} scale={20} size={10} speed={2.5} opacity={1} color="#fffde7" />
      )}
    </group>
  );
};

const CameraManager: React.FC<{ clusters: any[] }> = ({ clusters }) => {
  const { focusedMonth } = useMemoryStore();
  const { camera } = useThree();
  
  useEffect(() => {
    if (focusedMonth) {
      const target = clusters.find(c => c.month === focusedMonth);
      if (target) {
        // Center the camera perfectly on the month star
        gsap.to(camera.position, {
          x: target.position[0],
          y: target.position[1], // Centered vertically
          z: target.position[2] + 80, // Depth zoom
          duration: 2.2,
          ease: "expo.inOut"
        });
        // Perfect look-at with zero pitch/yaw offset
        gsap.to(camera.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: 2.2,
          ease: "expo.inOut"
        });
      }
    } else {
      // Overview mode
      gsap.to(camera.position, { x: 150, y: 200, z: 500, duration: 3.5, ease: "power2.inOut" });
      gsap.to(camera.rotation, { x: -0.4, y: 0, z: 0, duration: 3.5, ease: "power2.inOut" });
    }
  }, [focusedMonth, clusters, camera]);

  return null;
};

export const CosmicUniverse: React.FC = () => {
  const { memories, focusedMonth, setFocusedMonth, dismissTutorial } = useMemoryStore();
  
  const clusters = useMemo(() => {
    const maxMonthFound = memories.length > 0 ? Math.max(...memories.map(m => m.month)) : 9;
    const count = Math.max(9, maxMonthFound);
    
    return Array.from({ length: count }).map((_, i) => {
      const spacing = 80;
      const x = i * spacing;
      const y = (i % 2 === 0 ? 30 : -30) + (i * 2.5);
      const z = (i % 3 === 0 ? 40 : -20);
      return {
        month: i + 1,
        position: [x, y, z] as [number, number, number]
      };
    });
  }, [memories]);

  // Ensure lines connect precisely to month stars
  const linePoints = useMemo(() => clusters.map(c => new THREE.Vector3(...c.position)), [clusters]);

  const handleNav = (dir: number) => {
    const current = focusedMonth || 1;
    let next = current + dir;
    if (next < 1) next = 1;
    if (next > clusters.length) next = clusters.length;
    setFocusedMonth(next);
  };

  return (
    <div className="w-full h-full fixed top-0 left-0 bg-[#05000d]" onClick={dismissTutorial} onDoubleClick={() => setFocusedMonth(null)}>
      <Canvas dpr={[1, 2]} flat shadowMap>
        <PerspectiveCamera makeDefault position={[150, 200, 500]} fov={35} />
        
        <ambientLight intensity={4.0} />
        <pointLight position={[150, 300, 150]} intensity={120} color="#fff8e1" />
        
        {/* Infinite Cosmic Background */}
        <group>
          <NebulaBackground />
          {/* Multi-layered dense stars */}
          <Stars radius={1000} depth={200} count={80000} factor={20} saturation={1} fade speed={0.5} />
          <Stars radius={1200} depth={300} count={40000} factor={10} saturation={0.5} fade speed={0} />
          
          <Sparkles count={5000} scale={1500} size={4} speed={1.8} opacity={0.6} color="#ffffff" />
          
          {/* The Eternal 'US' Cluster */}
          <group position={[200, 350, -200]}>
            <Sparkles count={2500} scale={300} size={12} speed={3} opacity={0.9} color="#ffd54f" />
            <Text
              position={[0, 60, 0]}
              fontSize={18}
              color="#ffd54f"
              font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
              anchorX="center"
              anchorY="bottom"
              transparent
              opacity={0.4}
            >
              US
            </Text>
          </group>
        </group>
        
        {/* Refined Constellation Path */}
        <Line points={linePoints} color="#ffca28" lineWidth={15} transparent opacity={0.7} />
        <Line points={linePoints} color="#ffffff" lineWidth={4} transparent opacity={1.0} />
        
        {Array.from({ length: 60 }).map((_, i) => <ShootingStar key={i} />)}
        
        {clusters.map((c) => (
          <SpiritStar key={c.month} month={c.month} position={c.position} />
        ))}
        
        {/* Floating Space Dust */}
        <Sparkles count={6000} scale={2000} size={7} speed={0.8} opacity={0.6} color="#fff8e1" />
        
        <CameraManager clusters={clusters} />
      </Canvas>

      {/* Navigation Arrows */}
      <div className="fixed inset-y-0 left-12 w-24 flex items-center justify-center pointer-events-none z-[80]">
        <button 
          onClick={(e) => { e.stopPropagation(); handleNav(-1); }}
          className={`pointer-events-auto p-4 group transition-all duration-1000 ${(!focusedMonth || focusedMonth <= 1) ? 'opacity-0 scale-50' : 'opacity-40 hover:opacity-100 hover:scale-125'}`}
        >
          <svg className="w-20 h-20 text-white font-thin drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="fixed inset-y-0 right-32 w-24 flex items-center justify-center pointer-events-none z-[80]">
        <button 
          onClick={(e) => { e.stopPropagation(); handleNav(1); }}
          className={`pointer-events-auto p-4 group transition-all duration-1000 ${(focusedMonth && focusedMonth >= clusters.length) ? 'opacity-0 scale-50' : 'opacity-40 hover:opacity-100 hover:scale-125'}`}
        >
          <svg className="w-20 h-20 text-white font-thin drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="fixed bottom-36 left-1/2 -translate-x-1/2 pointer-events-none text-[9px] uppercase tracking-[3.5em] text-white/10 animate-pulse text-center w-full select-none">
        Guided by the stars of our love
      </div>
    </div>
  );
};
