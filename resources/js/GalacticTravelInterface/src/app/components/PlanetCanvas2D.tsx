import { useEffect, useRef, useState } from "react";

interface PlanetCanvas2DProps {
  body: any;
  planetSectors: any[];
  systemId: string;
  bodyId: string;
  navigate: any;
}

interface SectorPosition {
  x: number;
  y: number;
  angle: number;
  sector: any;
}

export default function PlanetCanvas2D({
  body,
  planetSectors,
  systemId,
  bodyId,
  navigate,
}: PlanetCanvas2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const rotationRef = useRef(0);
  const sectorPositionsRef = useRef<SectorPosition[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configurar canvas
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const centerX = canvas.width / (2 * window.devicePixelRatio);
    const centerY = canvas.height / (2 * window.devicePixelRatio);
    const planetRadius = 150;

    // Animación
    let animationId: number;
    
    const animate = () => {
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar fondo negro espacial
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      // Dibujar estrellas de fondo
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 150; i++) {
        const x = (i * 123.456) % (canvas.width / window.devicePixelRatio);
        const y = (i * 789.012) % (canvas.height / window.devicePixelRatio);
        const size = ((i * 17) % 3) * 0.5;
        ctx.globalAlpha = 0.3 + ((i * 31) % 70) / 100;
        ctx.fillRect(x, y, size, size);
      }
      ctx.globalAlpha = 1;

      // Dibujar resplandor del planeta
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        planetRadius * 0.8,
        centerX,
        centerY,
        planetRadius * 1.8
      );
      gradient.addColorStop(0, body.color + "40");
      gradient.addColorStop(0.5, body.color + "20");
      gradient.addColorStop(1, body.color + "00");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, planetRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Dibujar planeta principal
      const planetGradient = ctx.createRadialGradient(
        centerX - planetRadius * 0.3,
        centerY - planetRadius * 0.3,
        planetRadius * 0.2,
        centerX,
        centerY,
        planetRadius
      );
      planetGradient.addColorStop(0, lightenColor(body.color, 40));
      planetGradient.addColorStop(0.5, body.color);
      planetGradient.addColorStop(1, darkenColor(body.color, 40));
      
      ctx.fillStyle = planetGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, planetRadius, 0, Math.PI * 2);
      ctx.fill();

      // Dibujar sombra del planeta
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.beginPath();
      ctx.ellipse(
        centerX + planetRadius * 0.3,
        centerY,
        planetRadius * 0.7,
        planetRadius,
        0,
        Math.PI * 0.5,
        Math.PI * 1.5
      );
      ctx.fill();

      // Actualizar y dibujar sectores DENTRO del planeta
      sectorPositionsRef.current = planetSectors.map((sector, index) => {
        // Distribuir sectores uniformemente dentro del planeta - FIJOS, sin rotación
        const angle = (index / planetSectors.length) * Math.PI * 2;
        // Radio variable para distribuir en diferentes profundidades dentro del planeta
        const radiusVariation = 0.5 + ((index * 73) % 30) / 100; // Entre 0.5 y 0.8 del radio
        const distanceFromCenter = planetRadius * radiusVariation;
        
        const x = centerX + Math.cos(angle) * distanceFromCenter;
        const y = centerY + Math.sin(angle) * distanceFromCenter;

        const isHovered = hoveredSector === sector.id;
        const sectorRadius = isHovered ? 20 : 14;

        // Resplandor del sector
        const sectorGlow = ctx.createRadialGradient(x, y, 0, x, y, sectorRadius * 2.5);
        sectorGlow.addColorStop(0, sector.color + "AA");
        sectorGlow.addColorStop(0.5, sector.color + "40");
        sectorGlow.addColorStop(1, sector.color + "00");
        ctx.fillStyle = sectorGlow;
        ctx.beginPath();
        ctx.arc(x, y, sectorRadius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Sector principal
        ctx.fillStyle = sector.color;
        ctx.shadowColor = sector.color;
        ctx.shadowBlur = isHovered ? 20 : 10;
        ctx.beginPath();
        ctx.arc(x, y, sectorRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Borde del sector
        ctx.strokeStyle = lightenColor(sector.color, 30);
        ctx.lineWidth = isHovered ? 3 : 2;
        ctx.beginPath();
        ctx.arc(x, y, sectorRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Pulso de anillo si está hover
        if (isHovered) {
          ctx.strokeStyle = sector.color;
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(x, y, sectorRadius + 6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Tooltip para sector hover fuera del planeta
        if (isHovered) {
          ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
          ctx.strokeStyle = sector.color;
          ctx.lineWidth = 2;
          
          const tooltipWidth = 200;
          const tooltipHeight = 70;
          
          // Posicionar tooltip según posición del sector
          let tooltipX = x - tooltipWidth / 2;
          let tooltipY = y < centerY ? y + sectorRadius + 15 : y - sectorRadius - tooltipHeight - 15;
          
          // Ajustar si se sale del canvas
          if (tooltipX < 10) tooltipX = 10;
          if (tooltipX + tooltipWidth > canvas.width / window.devicePixelRatio - 10) {
            tooltipX = canvas.width / window.devicePixelRatio - tooltipWidth - 10;
          }
          
          ctx.beginPath();
          ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 8);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 16px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(sector.name, tooltipX + tooltipWidth / 2, tooltipY + 28);
          
          ctx.fillStyle = "#94a3b8";
          ctx.font = "12px sans-serif";
          const descText = sector.description.length > 30 
            ? sector.description.substring(0, 30) + "..." 
            : sector.description;
          ctx.fillText(descText, tooltipX + tooltipWidth / 2, tooltipY + 50);
        }

        return { x, y, angle, sector };
      });

      // Ya no necesitamos incrementar rotación
      // rotationRef.current += 0.003;

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [body, planetSectors, hoveredSector]);

  // Detectar hover y click en sectores
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let found = false;
      for (const pos of sectorPositionsRef.current) {
        const distance = Math.sqrt(
          Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
        );
        if (distance < 20) {
          setHoveredSector(pos.sector.id);
          canvas.style.cursor = "pointer";
          found = true;
          break;
        }
      }

      if (!found) {
        setHoveredSector(null);
        canvas.style.cursor = "default";
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (const pos of sectorPositionsRef.current) {
        const distance = Math.sqrt(
          Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
        );
        if (distance < 20) {
          navigate(
            `/system/${systemId}/body/${bodyId}/sector/${pos.sector.id}`
          );
          break;
        }
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, [systemId, bodyId, navigate]);

  return <canvas ref={canvasRef} className="size-full" />;
}

// Funciones helper para colores
function lightenColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, ((num >> 16) & 0xff) + amt);
  const G = Math.min(255, ((num >> 8) & 0xff) + amt);
  const B = Math.min(255, (num & 0xff) + amt);
  return `#${((R << 16) | (G << 8) | B).toString(16).padStart(6, "0")}`;
}

function darkenColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, ((num >> 16) & 0xff) - amt);
  const G = Math.max(0, ((num >> 8) & 0xff) - amt);
  const B = Math.max(0, (num & 0xff) - amt);
  return `#${((R << 16) | (G << 8) | B).toString(16).padStart(6, "0")}`;
}