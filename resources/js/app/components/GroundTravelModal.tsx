import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import GroundPirateEncounter from "./GroundPirateEncounter";
import { MapPin } from "lucide-react";

interface GroundTravelModalProps {
  fromName: string;
  toName: string;
  hostilityLevel: number;
  onComplete: () => void;
  travelType: 'sector' | 'building';
}

export default function GroundTravelModal({
  fromName,
  toName,
  hostilityLevel,
  onComplete,
  travelType
}: GroundTravelModalProps) {
  const [stage, setStage] = useState<"traveling" | "encounter" | "arrived">("traveling");
  const [hasEncounter, setHasEncounter] = useState(false);

  useEffect(() => {
    // Calcular probabilidad de encuentro según tipo de viaje
    // Sectores: 10% por nivel de hostilidad
    // Edificios: 5% por nivel (más seguros)
    const encounterChance = travelType === 'sector'
      ? hostilityLevel * 10
      : hostilityLevel * 5;

    const willHaveEncounter = Math.random() * 100 < encounterChance;
    setHasEncounter(willHaveEncounter);

    // Animación de viaje (2 segundos)
    const timer = setTimeout(() => {
      if (willHaveEncounter) {
        setStage("encounter");
      } else {
        setStage("arrived");
        setTimeout(onComplete, 1000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [hostilityLevel, travelType, onComplete]);

  const handleEncounterComplete = (success: boolean) => {
    setStage("arrived");
    setTimeout(onComplete, 1000);
  };

  if (stage === "encounter") {
    return (
      <GroundPirateEncounter
        onComplete={handleEncounterComplete}
        hostilityLevel={hostilityLevel}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <AnimatePresence mode="wait">
        {stage === "traveling" && (
          <motion.div
            key="traveling"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            {/* Icono de viaje terrestre */}
            <motion.div
              animate={{
                x: [-100, 100],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="mb-8 flex justify-center"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <MapPin className="h-16 w-16 text-cyan-400" />
                </motion.div>
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-4xl"
                >
                  🚶
                </motion.div>
              </div>
            </motion.div>

            {/* Texto de viaje */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold uppercase tracking-wider text-amber-400">
                Viajando...
              </h2>
              <p className="text-xl text-slate-300">
                De <span className="text-cyan-400">{fromName}</span> a{" "}
                <span className="text-cyan-400">{toName}</span>
              </p>

              {/* Barra de progreso */}
              <div className="mx-auto mt-8 h-2 w-64 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-amber-500"
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        {stage === "arrived" && (
          <motion.div
            key="arrived"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mb-4"
            >
              <MapPin className="h-24 w-24 text-green-400" />
            </motion.div>
            <h2 className="text-3xl font-bold uppercase tracking-wider text-green-400">
              Has llegado
            </h2>
            <p className="mt-2 text-xl text-slate-300">{toName}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
