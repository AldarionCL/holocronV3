import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { celestialBodies, solarSystems } from "../data/gameData";
import { ArrowLeft, Rocket } from "lucide-react";
import { useState } from "react";
import { useGame } from "../context/GameContext";
import TravelModal from "./TravelModal";
import PlayerHUD from "./PlayerHUD";

export default function SolarSystemView() {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const [selectedBody, setSelectedBody] = useState<string | null>(null);
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [travelDestination, setTravelDestination] = useState<{ id: string; name: string } | null>(null);
  const { credits, hasOwnShip, currentShip, spendCredits } = useGame();

  const system = solarSystems.find((s) => s.id === systemId);
  const bodies = celestialBodies[systemId || ""] || [];

  if (!system) {
    return (
      <div className="flex size-full items-center justify-center bg-black text-white">
        Sistema no encontrado
      </div>
    );
  }

  const handleTravelClick = (body: typeof bodies[0]) => {
    setTravelDestination({ id: body.id, name: body.name });
    setShowTravelModal(true);
  };

  const handleConfirmTravel = () => {
    if (!travelDestination) return;

    // Calcular costo de viaje (100-300 créditos)
    const travelCost = Math.floor(Math.random() * 201) + 100;

    // Si tiene nave o puede pagar, procede
    if (hasOwnShip || spendCredits(travelCost)) {
      setShowTravelModal(false);
      setTimeout(() => {
        navigate(`/system/${systemId}/body/${travelDestination.id}`);
      }, 100);
    }
  };

  // Calcular costo de viaje aleatorio
  const travelCost = Math.floor(Math.random() * 201) + 100;

  return (
    <div className="relative size-full overflow-hidden bg-black">
      {/* Estrellas de fondo */}
      <div className="absolute inset-0">
        {Array.from({ length: 150 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Líneas de escaneo */}
      <div className="sw-scanline" />

      {/* Botón volver */}
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/")}
        className="sw-button absolute left-8 top-8 z-20 flex items-center gap-2 px-4 py-2"
      >
        <ArrowLeft className="h-5 w-5" />
        Salir
      </motion.button>

      {/* Panel lateral izquierdo con tarjetas de planetas */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="sw-panel sw-glow absolute left-8 top-24 z-20 max-h-[calc(100vh-200px)] w-80 space-y-3 overflow-y-auto p-4"
      >
        <div className="mb-4 border-b border-amber-500/30 pb-3">
          <h2 className="mb-1 text-xl font-bold uppercase tracking-wide text-amber-400">Sistema solar</h2>
          <div className="flex items-center gap-2">
            <span className="sw-button px-3 py-1 text-sm">
              {system.name}
            </span>
          </div>
          <p className="mt-2 text-xs uppercase tracking-wider text-amber-300/80">{system.hostility}</p>
          <p className="text-xs text-slate-300">{system.description}</p>
        </div>

        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-amber-400">Cuerpos Celestes</h3>
        
        {bodies.map((body, index) => (
          <motion.div
            key={body.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer rounded-lg border border-slate-700 bg-slate-800/50 p-3 transition-all hover:border-cyan-500/50 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-cyan-500/20"
            onClick={() => {
              setSelectedBody(body.id);
              handleTravelClick(body);
            }}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-10 w-10 rounded-full shadow-lg"
                  style={{
                    backgroundColor: body.color,
                    boxShadow: `0 0 15px ${body.color}60`,
                  }}
                />
                <div>
                  <p className="font-bold text-white">{body.name}</p>
                  <p className="text-xs text-slate-400">
                    {body.type === 'planet' ? 'Planeta' : 'Luna'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Raza:</span>
                <span className="text-white">{body.race}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hostilidad:</span>
                <span className="text-white">{body.hostility}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Facción:</span>
                <span className="text-cyan-400">{body.faction}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Clima:</span>
                <span className="text-cyan-400">{body.climate}</span>
              </div>
            </div>

            <button className="mt-3 flex w-full items-center justify-center gap-1 rounded bg-purple-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-purple-500">
              <Rocket className="h-3 w-3" />
              Viajar a {body.name}
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Sistema solar con sol y planetas en 2D */}
      <div className="relative flex size-full items-center justify-center">
        {/* Sol central */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="absolute z-10 flex size-32 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-orange-500 shadow-2xl shadow-yellow-500/50"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="size-full rounded-full bg-gradient-to-br from-transparent to-orange-600/30"
          />
        </motion.div>

        {/* Planetas y lunas orbitando */}
        {bodies.map((body, index) => {
          const angle = (index / bodies.length) * 360;
          const orbitRadius = body.orbitRadius || 200 + index * 80;

          return (
            <motion.div
              key={body.id}
              className="absolute"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              {/* Órbita */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-slate-600/40"
                style={{
                  width: orbitRadius * 2,
                  height: orbitRadius * 2,
                }}
              />

              {/* Planeta/Luna con animación orbital */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 15 + index * 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  width: orbitRadius * 2,
                  height: orbitRadius * 2,
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2"
                  style={{
                    width: body.size,
                    height: body.size,
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    onClick={() => {
                      setSelectedBody(body.id);
                      handleTravelClick(body);
                    }}
                    className="relative size-full cursor-pointer"
                  >
                    {/* Planeta con textura */}
                    <div
                      className="size-full rounded-full shadow-xl transition-all hover:shadow-2xl"
                      style={{
                        backgroundColor: body.color,
                        boxShadow: `0 0 30px ${body.color}40, inset -10px -10px 40px rgba(0,0,0,0.5), inset 10px 10px 40px rgba(255,255,255,0.1)`,
                      }}
                    >
                      {/* Textura de cráteres/continentes */}
                      <div className="size-full overflow-hidden rounded-full">
                        {/* Capa de iluminación */}
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4) 0%, transparent 50%)`,
                          }}
                        />
                        {/* Manchas de textura */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 rounded-full opacity-40"
                        >
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute rounded-full"
                              style={{
                                width: Math.random() * 30 + 10 + '%',
                                height: Math.random() * 30 + 10 + '%',
                                left: Math.random() * 70 + '%',
                                top: Math.random() * 70 + '%',
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                filter: 'blur(3px)',
                              }}
                            />
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal de viaje */}
      {showTravelModal && travelDestination && (() => {
        const destinationBody = bodies.find((b) => b.id === travelDestination.id);
        return (
          <TravelModal
            isOpen={showTravelModal}
            onClose={() => setShowTravelModal(false)}
            onConfirm={handleConfirmTravel}
            travelCost={travelCost}
            playerCredits={credits}
            hasOwnShip={hasOwnShip}
            currentShip={currentShip}
            destination={travelDestination.name}
            origin={system.name}
            hostilityLevel={destinationBody?.hostilityLevel || system.hostilityLevel}
          />
        );
      })()}

      {/* HUD del jugador */}
      <PlayerHUD />
    </div>
  );
}