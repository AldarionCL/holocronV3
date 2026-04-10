import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from 'three';
import Planet3D from "./Planet3D";
import SectorMarker3D from "./SectorMarker3D";

interface PlanetCanvas3DProps {
  body: any;
  planetSectors: any[];
  systemId: string;
  bodyId: string;
  navigate: any;
}

// Componente de estrellas
function Stars() {
  const starsRef = useRef<THREE.Points | null>(null);
  
  useEffect(() => {
    if (!starsRef.current) return;
    
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    
    for (let i = 0; i < 1500; i++) {
      positions.push(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
      );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
    if (starsRef.current.geometry) {
      starsRef.current.geometry.dispose();
    }
    starsRef.current.geometry = geometry;
  }, []);
  
  return (
    <points ref={starsRef}>
      <bufferGeometry />
      <pointsMaterial size={0.5} color="#ffffff" sizeAttenuation />
    </points>
  );
}

// Controles de cámara
function CameraControls() {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    const canvas = gl.domElement;
    let isMouseDown = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };
    
    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      
      // Rotar la cámara alrededor del origen
      const radius = camera.position.length();
      const theta = Math.atan2(camera.position.x, camera.position.z);
      const phi = Math.acos(camera.position.y / radius);
      
      const newTheta = theta - deltaX * 0.01;
      const newPhi = Math.max(0.1, Math.min(Math.PI - 0.1, phi + deltaY * 0.01));
      
      camera.position.x = radius * Math.sin(newPhi) * Math.sin(newTheta);
      camera.position.y = radius * Math.cos(newPhi);
      camera.position.z = radius * Math.sin(newPhi) * Math.cos(newTheta);
      
      camera.lookAt(0, 0, 0);
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };
    
    const onMouseUp = () => {
      isMouseDown = false;
    };
    
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.01;
      const newRadius = Math.max(6, Math.min(15, camera.position.length() + delta));
      camera.position.normalize().multiplyScalar(newRadius);
      camera.lookAt(0, 0, 0);
    };
    
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [camera, gl]);
  
  return null;
}

function PlanetScene({ body, planetSectors, systemId, bodyId, navigate }: PlanetCanvas3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Rotación lenta y continua del grupo completo
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <>
      {/* Estrellas de fondo */}
      <Stars />
      
      {/* Controles de cámara */}
      <CameraControls />
      
      {/* Iluminación mejorada para destacar la forma 3D */}
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5} 
        castShadow
      />
      <directionalLight 
        position={[-10, -5, -5]} 
        intensity={0.6} 
        color="#4488ff"
      />
      <hemisphereLight
        color="#ffffff"
        groundColor="#000033"
        intensity={0.4}
      />
      <pointLight position={[0, 0, 0]} intensity={0.5} color={body.color} />

      <group ref={groupRef}>
        {/* Planeta principal en el centro */}
        <Planet3D
          body={body}
          scale={3}
          autoRotate={true}
          rotationSpeed={0.2}
        />

        {/* Marcadores de sectores distribuidos en una esfera alrededor del planeta */}
        {planetSectors.map((sector: any, index: number) => {
          const totalSectors = planetSectors.length;
          
          // Distribución esférica usando ángulos phi y theta
          const phi = Math.acos(-1 + (2 * index) / totalSectors);
          const theta = Math.sqrt(totalSectors * Math.PI) * phi;
          
          const radius = 5.5; // Distancia desde el centro del planeta
          const x = radius * Math.cos(theta) * Math.sin(phi);
          const y = radius * Math.sin(theta) * Math.sin(phi);
          const z = radius * Math.cos(phi);

          return (
            <SectorMarker3D
              key={sector.id}
              sector={sector}
              position={[x, y, z]}
              onClick={() => {
                navigate(`/system/${systemId}/body/${bodyId}/sector/${sector.id}`);
              }}
            />
          );
        })}
      </group>
    </>
  );
}

export default function PlanetCanvas3D(props: PlanetCanvas3DProps) {
  return (
    <Canvas
      camera={{ position: [8, 5, 8], fov: 60 }}
      gl={{ 
        antialias: true, 
        alpha: false,
      }}
    >
      <PlanetScene {...props} />
    </Canvas>
  );
}