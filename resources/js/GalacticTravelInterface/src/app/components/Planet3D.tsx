import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Planet3DProps {
  body: any;
  scale?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
}

export default function Planet3D({ 
  body, 
  scale = 1, 
  autoRotate = true, 
  rotationSpeed = 0.3,
}: Planet3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Animación de rotación
  useFrame((_, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
    if (cloudsRef.current && autoRotate) {
      cloudsRef.current.rotation.y += delta * rotationSpeed * 1.1;
    }
  });

  const hasAtmosphere = body.climate === 'Templado' || body.climate === 'Tropical' || body.climate === 'Gaseoso';

  return (
    <group>
      {/* Planeta principal con mejor sombreado */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[scale, 64, 64]} />
        <meshStandardMaterial
          color={body.color}
          roughness={0.8}
          metalness={0.1}
          emissive={body.color}
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Capa de nubes para planetas con atmósfera */}
      {hasAtmosphere && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[scale * 1.02, 48, 48]} />
          <meshStandardMaterial
            transparent
            opacity={0.3}
            color="#ffffff"
            roughness={1}
            metalness={0}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Resplandor atmosférico más pronunciado */}
      {hasAtmosphere && (
        <mesh>
          <sphereGeometry args={[scale * 1.05, 32, 32]} />
          <meshBasicMaterial
            transparent
            opacity={0.1}
            color={body.color}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
      
      {/* Anillo de luz sutil alrededor del planeta para mejorar profundidad */}
      <pointLight position={[0, 0, 0]} intensity={0.3} color={body.color} distance={scale * 5} />
    </group>
  );
}