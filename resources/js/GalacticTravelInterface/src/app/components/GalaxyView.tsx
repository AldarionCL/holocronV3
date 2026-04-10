import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { solarSystems } from "../data/gameData";
import { Rocket } from "lucide-react";
import PlayerHUD from "./PlayerHUD";

export default function GalaxyView() {
  const navigate = useNavigate();

  return (
    <div className="relative size-full overflow-hidden bg-black">
      {/* Estrellas de fondo */}
      <div className="absolute inset-0">
        {Array.from({ length: 200 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Líneas de escaneo */}
      <div className="sw-scanline" />

      {/* HUD del jugador */}
      <PlayerHUD />

      {/* Contenido principal */}
      <div className="relative z-10 flex size-full flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-6xl font-bold uppercase tracking-wider text-amber-400 sw-text-glow">
            Exploración Galáctica
          </h1>
          <p className="text-xl uppercase tracking-wide text-amber-300/80">
            Selecciona un sistema solar para comenzar tu viaje
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {solarSystems.map((system, index) => (
            <motion.div
              key={system.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer"
              onClick={() => navigate(`/system/${system.id}`)}
            >
              <div className="sw-card sw-glow p-8 transition-all hover:sw-glow">
                {/* Icono de cohete */}
                <div className="mb-4 flex items-center justify-center">
                  <div className="rounded-full bg-amber-500/20 p-4 sw-glow">
                    <Rocket className="h-12 w-12 text-amber-400" />
                  </div>
                </div>

                <h2 className="mb-3 text-center text-2xl font-bold uppercase tracking-wide text-amber-400">
                  {system.name}
                </h2>
                
                <p className="mb-4 text-center text-slate-300">
                  {system.description}
                </p>

                <div className="sw-panel mt-4 space-y-2 p-3">
                  <p className="text-center text-sm uppercase tracking-wider text-amber-300">
                    {system.hostility}
                  </p>
                </div>

                {/* Botón de viajar */}
                <div className="mt-6 flex justify-center">
                  <button className="sw-button flex items-center gap-2 px-6 py-3">
                    <Rocket className="h-5 w-5" />
                    Viajar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}