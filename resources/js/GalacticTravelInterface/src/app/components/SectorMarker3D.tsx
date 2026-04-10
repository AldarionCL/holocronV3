import { useState } from 'react';
import * as THREE from 'three';

interface SectorMarker3DProps {
  sector: any;
  position: [number, number, number];
  onClick: () => void;
}

export default function SectorMarker3D({ sector, position, onClick }: SectorMarker3DProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {/* Marcador esférico */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={sector.color}
          emissive={sector.color}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Anillo exterior */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.25, 0.3, 16]} />
        <meshBasicMaterial
          color={sector.color}
          transparent
          opacity={hovered ? 0.6 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Etiqueta flotante simple sin HTML */}
      {hovered && (
        <sprite position={[0, 0.8, 0]} scale={[2, 0.5, 1]}>
          <spriteMaterial 
            color={sector.color} 
            transparent 
            opacity={0.9}
          />
        </sprite>
      )}
    </group>
  );
}
