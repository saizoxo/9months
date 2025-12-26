
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const skyVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }
  float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;
    return mix(mix(mix(hash(n+0.0), hash(n+1.0), f.x),
                   mix(hash(n+57.0), hash(n+58.0), f.x), f.y),
               mix(mix(hash(n+113.0), hash(n+114.0), f.x),
                   mix(hash(n+170.0), hash(n+171.0), f.x), f.y), f.z);
  }

  void main() {
    // Slower, more visible movement
    vec3 pos = vPosition * 0.15 + time * 0.0008;
    float n = noise(pos * 2.2);
    
    // Significantly more vibrant nebula colors for visibility
    vec3 deepNavy = vec3(0.02, 0.01, 0.08);
    vec3 dawnPurple = vec3(0.06, 0.03, 0.15);
    vec3 skyGold = vec3(0.15, 0.12, 0.05);

    float grad = vPosition.y * 0.5 + 0.5;
    vec3 baseSky = mix(deepNavy, dawnPurple, grad);
    
    // More prominent cloud layer
    float clouds = smoothstep(0.3, 0.85, n);
    vec3 finalColor = mix(baseSky, skyGold, clouds * 0.25);
    
    // Distant twinkling stars logic with higher density
    float twinkleSeed = vPosition.x * 21.0 + vPosition.y * 13.0 + vPosition.z * 17.0;
    float twinkle = hash(twinkleSeed);
    
    float intensity = 0.6 + 0.4 * sin(time * 2.5 + hash(twinkleSeed * 0.3) * 6.28);
    
    if(twinkle > 0.9993) {
        finalColor += vec3(0.6 * intensity);
    }

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const NebulaBackground: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const uniforms = useMemo(() => ({
    time: { value: 0 },
  }), []);

  useFrame((state) => {
    uniforms.time.value = state.clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} scale={[600, 600, 600]}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        vertexShader={skyVertexShader}
        fragmentShader={skyFragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
      />
    </mesh>
  );
};
