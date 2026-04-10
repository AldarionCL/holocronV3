import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { celestialBodies, sectors } from "../data/gameData";
import { ArrowLeft, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import PlayerHUD from "./PlayerHUD";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import GroundPirateEncounter from "./GroundPirateEncounter";

export default function PlanetView() {
  const { systemId, bodyId } = useParams<{ systemId: string; bodyId: string }>();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const [showPirateEncounter, setShowPirateEncounter] = useState(false);

  const body = celestialBodies[systemId || ""]?.find((b) => b.id === bodyId);
  const planetSectors = sectors[bodyId || ""] || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
      
      // Probabilidad de encuentro al entrar al planeta basado en hostilidad
      const encounterChance = (body?.hostilityLevel || 1) * 12; // 12% por nivel
      if (Math.random() * 100 < encounterChance) {
        setTimeout(() => {
          setShowPirateEncounter(true);
        }, 1000);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [body]);

  const handleSectorClick = (sectorId: string) => {
    // Probabilidad de encuentro al moverse entre sectores
    const encounterChance = (body?.hostilityLevel || 1) * 8; // 8% por nivel
    if (Math.random() * 100 < encounterChance) {
      setShowPirateEncounter(true);
    } else {
      navigate(`/system/${systemId}/body/${bodyId}/sector/${sectorId}`);
    }
  };

  const handlePirateEncounterComplete = (success: boolean) => {
    setShowPirateEncounter(false);
    // Independientemente del resultado, el jugador permanece en el planeta
  };

  if (!body) {
    return (
      <div className="flex size-full items-center justify-center bg-black text-white">
        Planeta no encontrado
      </div>
    );
  }

  if (showPirateEncounter) {
    return (
      <GroundPirateEncounter
        onComplete={handlePirateEncounterComplete}
        hostilityLevel={body.hostilityLevel}
      />
    );
  }

  // Mapear planetas a imágenes según características
  const getPlanetImage = () => {
    const climate = body.climate.toLowerCase();
    
    if (body.type === 'moon') {
      return "https://images.unsplash.com/photo-1709408634703-c44e7c29006e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
    }
    
    if (climate.includes('desértico') || climate.includes('árido')) {
      return "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
    }
    
    if (climate.includes('helado') || climate.includes('frío')) {
      return "https://images.unsplash.com/photo-1769965409597-b57ef72d8bc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
    }
    
    if (climate.includes('tropical') || climate.includes('templado')) {
      return "https://images.unsplash.com/photo-1727363584291-433dcd86a0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
    }
    
    if (climate.includes('tormentoso') || climate.includes('lluvioso')) {
      return "https://images.unsplash.com/photo-1755024324097-64832c4d2334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
    }
    
    // Imagen por defecto
    return "https://images.unsplash.com/photo-1615627121117-e3278bc8b1db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
  };

  // Generar posiciones para los sectores en una malla sobre el planeta
  const getSectorPositions = () => {
    const positions: { [key: string]: { x: number; y: number } } = {};
    const numSectors = planetSectors.length;
    
    // Distribuir sectores en diferentes zonas del planeta
    const zones = [
      { x: 25, y: 20 },  // Noroeste
      { x: 75, y: 20 },  // Noreste
      { x: 50, y: 35 },  // Norte Centro
      { x: 20, y: 50 },  // Oeste
      { x: 50, y: 50 },  // Centro
      { x: 80, y: 50 },  // Este
      { x: 30, y: 70 },  // Suroeste
      { x: 70, y: 70 },  // Sureste
      { x: 50, y: 80 },  // Sur Centro
    ];

    planetSectors.forEach((sector, index) => {
      const zone = zones[index % zones.length];
      positions[sector.id] = zone;
    });

    return positions;
  };

  const sectorPositions = getSectorPositions();

  return (
    <div className="relative size-full overflow-hidden bg-black">
      {/* HUD del jugador */}
      <PlayerHUD />

      {/* Botón volver */}
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(`/system/${systemId}`)}
        className="sw-button absolute left-8 top-8 z-20 flex items-center gap-2 px-4 py-2"
      >
        <ArrowLeft className="h-5 w-5" />
        Volver
      </motion.button>

      {/* Información del planeta */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="sw-panel sw-glow absolute right-8 top-8 z-20 p-4"
      >
        <h2 className="mb-2 text-2xl font-bold uppercase tracking-wider text-amber-400 sw-text-glow">{body.name}</h2>
        <div className="space-y-1 text-sm">
          <p className="text-slate-300">
            <span className="uppercase tracking-wider text-amber-300/70">Tipo:</span> {body.type === 'planet' ? 'Planeta' : 'Luna'}
          </p>
          <p className="text-slate-300">
            <span className="uppercase tracking-wider text-amber-300/70">Raza:</span> {body.race}
          </p>
          <p className="text-slate-300">
            <span className="uppercase tracking-wider text-amber-300/70">Clima:</span> {body.climate}
          </p>
          <p className="text-slate-300">
            <span className="uppercase tracking-wider text-amber-300/70">Hostilidad:</span>{" "}
            <span
              className={
                body.hostilityLevel === 1
                  ? "text-green-400"
                  : body.hostilityLevel <= 2
                  ? "text-yellow-400"
                  : body.hostilityLevel <= 3
                  ? "text-orange-400"
                  : "text-red-400"
              }
            >
              {body.hostility}
            </span>
          </p>
          <p className="text-cyan-400">
            <span className="text-slate-400">Facción:</span> {body.faction}
          </p>
        </div>
      </motion.div>

      {/* Tooltip del sector hovereado - Posicionado debajo del panel del planeta */}
      {hoveredSector && (() => {
        const sector = planetSectors.find((s) => s.id === hoveredSector);
        if (!sector) return null;
        return (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sw-panel absolute right-8 top-[200px] z-20 w-80 border-2 p-4"
            style={{
              borderColor: sector.color,
              boxShadow: `0 0 20px ${sector.color}80`,
            }}
          >
            <div className="mb-2 flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: sector.color }}
              >
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wide text-amber-400">
                {sector.name}
              </h3>
            </div>
            <p className="text-sm text-slate-300">{sector.description}</p>
          </motion.div>
        );
      })()}

      {/* Instrucciones */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="sw-panel absolute bottom-8 left-1/2 z-20 -translate-x-1/2 px-6 py-3 text-center"
      >
        <p className="text-sm uppercase tracking-wider text-amber-300">
          👆 Click en los puntos para explorar sectores
        </p>
      </motion.div>

      {/* Planeta 3D mejorado con sectores sobre la imagen */}
      {isReady && (
        <div className="flex size-full items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative"
          >
            {/* Planeta principal */}
            <div className="relative h-[700px] w-[700px]">
              {/* Contenedor que gira - incluye imagen, overlay, sectores y rejilla */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 120,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0"
              >
                {/* Imagen del planeta */}
                <div
                  className="absolute inset-0 overflow-hidden rounded-full"
                  style={{
                    boxShadow: `0 0 80px ${body.color}80, inset 0 0 80px ${body.color}40`,
                  }}
                >
                  <ImageWithFallback
                    src={getPlanetImage()}
                    alt={body.name}
                    className="size-full rounded-full object-cover"
                  />
                  
                  {/* Overlay de atmósfera */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${body.color}20, transparent 60%)`,
                    }}
                  />
                </div>

                {/* Marcadores de sectores sobre el planeta - AHORA ROTAN */}
                {planetSectors.map((sector, index) => {
                  const position = sectorPositions[sector.id];
                  return (
                    <motion.div
                      key={sector.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 0.5 + index * 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                      style={{
                        position: "absolute",
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      className="z-10"
                    >
                      {/* Contenedor que contra-rota para mantener los iconos verticales */}
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 120,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <button
                          onClick={() => handleSectorClick(sector.id)}
                          onMouseEnter={() => setHoveredSector(sector.id)}
                          onMouseLeave={() => setHoveredSector(null)}
                          className="group relative"
                        >
                          {/* Pulso animado */}
                          <motion.div
                            animate={{
                              scale: [1, 1.8, 1],
                              opacity: [0.6, 0, 0.6],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: index * 0.2,
                            }}
                            className="absolute inset-0 rounded-full"
                            style={{
                              backgroundColor: sector.color,
                              filter: "blur(8px)",
                            }}
                          />

                          {/* Punto del sector */}
                          <motion.div
                            whileHover={{ scale: 1.3 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-white shadow-lg transition-all group-hover:border-amber-400"
                            style={{
                              backgroundColor: sector.color,
                              boxShadow: `0 0 20px ${sector.color}, 0 0 40px ${sector.color}80`,
                            }}
                          >
                            <MapPin className="h-6 w-6 text-white drop-shadow-lg" />
                          </motion.div>

                          {/* Etiqueta del sector */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: hoveredSector === sector.id ? 1 : 0, y: 0 }}
                            className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border-2 border-amber-400 bg-black/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-400 shadow-xl backdrop-blur-sm"
                            style={{
                              boxShadow: "0 0 20px rgba(251, 191, 36, 0.5)",
                            }}
                          >
                            {sector.name}
                          </motion.div>

                          {/* Líneas de conexión desde el centro (opcional) */}
                          <svg
                            className="pointer-events-none absolute"
                            style={{
                              left: "50%",
                              top: "50%",
                              width: "200px",
                              height: "200px",
                              transform: "translate(-50%, -50%)",
                              opacity: hoveredSector === sector.id ? 0.3 : 0,
                              transition: "opacity 0.3s",
                            }}
                          >
                            <line
                              x1="100"
                              y1="100"
                              x2="100"
                              y2="0"
                              stroke={sector.color}
                              strokeWidth="2"
                              strokeDasharray="5,5"
                            />
                          </svg>
                        </button>
                      </motion.div>
                    </motion.div>
                  );
                })}

                {/* Rejilla de latitud/longitud - AHORA ROTA */}
                <div className="pointer-events-none absolute inset-0">
                  <svg
                    className="size-full"
                    style={{ opacity: 0.15 }}
                  >
                    {/* Líneas horizontales (paralelos) */}
                    {[20, 35, 50, 65, 80].map((y) => (
                      <ellipse
                        key={`h-${y}`}
                        cx="350"
                        cy="350"
                        rx="340"
                        ry={y * 2.5}
                        fill="none"
                        stroke={body.color}
                        strokeWidth="1.5"
                      />
                    ))}
                    {/* Líneas verticales (meridianos) */}
                    {[0, 30, 60, 90, 120, 150].map((angle) => (
                      <ellipse
                        key={`v-${angle}`}
                        cx="350"
                        cy="350"
                        rx="340"
                        ry="340"
                        fill="none"
                        stroke={body.color}
                        strokeWidth="1.5"
                        style={{
                          transform: `rotate(${angle}deg)`,
                          transformOrigin: "350px 350px",
                        }}
                        opacity="0.4"
                      />
                    ))}
                  </svg>
                </div>
              </motion.div>

              {/* Anillo de brillo exterior - NO ROTA */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  boxShadow: `0 0 100px 20px ${body.color}60`,
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}