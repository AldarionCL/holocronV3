import { motion, AnimatePresence } from "motion/react";
import { Rocket, Plane, Coins, X, CheckCircle } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Starship } from "../context/GameContext";
import SpacePirateEncounter from "./SpacePirateEncounter";

interface TravelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  travelCost: number;
  playerCredits: number;
  hasOwnShip: boolean;
  currentShip?: Starship | null;
  destination: string;
  origin: string;
  hostilityLevel: number;
}

export default function TravelModal({
  isOpen,
  onClose,
  onConfirm,
  travelCost,
  playerCredits,
  hasOwnShip,
  currentShip,
  destination,
  origin,
  hostilityLevel,
}: TravelModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPirateEncounter, setShowPirateEncounter] = useState(false);
  const canAfford = playerCredits >= travelCost;

  const handleConfirm = () => {
    if (hasOwnShip || canAfford) {
      setIsAnimating(true);
      
      // Calcular probabilidad de encuentro con piratas basado en hostilidad
      const encounterChance = hostilityLevel * 15; // 15% por nivel de hostilidad
      const hasEncounter = hasOwnShip && Math.random() * 100 < encounterChance;

      setTimeout(() => {
        if (hasEncounter) {
          // Mostrar encuentro con piratas
          setIsAnimating(false);
          setShowPirateEncounter(true);
        } else {
          // Viaje exitoso sin encuentros
          onConfirm();
          setIsAnimating(false);
        }
      }, 3000); // Duración de la animación
    }
  };

  const handlePirateEncounterComplete = (success: boolean) => {
    setShowPirateEncounter(false);
    if (success) {
      // Si sobrevive al encuentro, continuar viaje
      onConfirm();
    } else {
      // Si pierde, cerrar modal
      onClose();
    }
  };

  if (showPirateEncounter) {
    return (
      <SpacePirateEncounter
        onComplete={handlePirateEncounterComplete}
        hostilityLevel={hostilityLevel}
      />
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            className="sw-panel sw-glow relative w-full max-w-2xl p-8"
          >
            {!isAnimating ? (
              <>
                {/* Botón cerrar */}
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-full bg-slate-800 p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="mb-6 text-center">
                  <h2 className="mb-2 text-3xl font-bold uppercase tracking-wider text-amber-400 sw-text-glow">
                    Sistema de Viaje
                  </h2>
                  <p className="text-slate-300">
                    <span className="text-amber-300">Origen:</span> {origin} →{" "}
                    <span className="text-amber-300">Destino:</span> {destination}
                  </p>
                </div>

                {/* Información del jugador */}
                <div className="mb-6 flex items-center justify-center gap-2">
                  <Coins className="h-5 w-5 text-amber-400" />
                  <span className="text-xl font-bold text-amber-400">
                    {playerCredits} Créditos
                  </span>
                </div>

                {/* Opciones de viaje */}
                <div className="space-y-4">
                  {hasOwnShip ? (
                    // Tiene nave propia
                    <div className="sw-card sw-glow-cyan border-2 border-cyan-500 p-6">
                      <div className="mb-4 flex items-center justify-center">
                        <div className="rounded-full bg-cyan-500/20 p-4 sw-glow-cyan">
                          <Rocket className="h-12 w-12 text-cyan-400" />
                        </div>
                      </div>
                      <h3 className="mb-2 text-center text-xl font-bold uppercase tracking-wide text-cyan-400">
                        Nave Propia
                      </h3>
                      <p className="mb-4 text-center text-slate-300">
                        Puedes viajar gratuitamente en tu propia nave
                      </p>
                      <div className="flex items-center justify-center gap-2 text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-lg font-bold uppercase">Gratis</span>
                      </div>
                    </div>
                  ) : (
                    // Necesita comprar ticket
                    <div className="sw-card border-2 border-amber-500 p-6">
                      <div className="mb-4 flex items-center justify-center">
                        <div className="rounded-full bg-amber-500/20 p-4 sw-glow">
                          <Plane className="h-12 w-12 text-amber-400" />
                        </div>
                      </div>
                      <h3 className="mb-2 text-center text-xl font-bold uppercase tracking-wide text-amber-400">
                        Transbordador Público
                      </h3>
                      <p className="mb-4 text-center text-slate-300">
                        Compra un ticket de viaje en transbordador comercial
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <Coins className="h-5 w-5 text-amber-400" />
                        <span className="text-lg font-bold text-amber-400">
                          {travelCost} Créditos
                        </span>
                      </div>
                      {!canAfford && (
                        <p className="mt-3 text-center text-sm text-red-400">
                          ⚠️ No tienes suficientes créditos
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="mt-8 flex gap-4">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-lg border-2 border-slate-600 bg-slate-800/50 px-6 py-3 uppercase tracking-wider text-slate-300 transition-colors hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={!hasOwnShip && !canAfford}
                    className={`sw-button-cyan flex-1 px-6 py-3 ${
                      !hasOwnShip && !canAfford ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {hasOwnShip ? "Despegar" : "Comprar Ticket"}
                  </button>
                </div>
              </>
            ) : (
              // Animación de viaje
              <div className="flex flex-col items-center justify-center py-12">
                {hasOwnShip ? (
                  // Animación de nave despegando
                  <>
                    <motion.div
                      initial={{ y: 0, scale: 1, rotate: 0 }}
                      animate={{
                        y: [-500],
                        scale: [1, 1.2, 0.5, 0],
                        rotate: [0, -10, 5, 0],
                      }}
                      transition={{
                        duration: 2.5,
                        ease: "easeInOut",
                      }}
                      className="mb-8"
                    >
                      <Rocket className="h-32 w-32 text-cyan-400 sw-glow-cyan" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 1, 0] }}
                      transition={{
                        duration: 3,
                        times: [0, 0.2, 0.8, 1],
                      }}
                    >
                      <h3 className="text-2xl font-bold uppercase tracking-wider text-cyan-400 sw-text-glow-cyan">
                        Despegando...
                      </h3>
                      <p className="mt-2 text-slate-300">Iniciando motores de la nave</p>
                    </motion.div>
                  </>
                ) : (
                  // Animación de abordaje de transbordador
                  <>
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: 1,
                        ease: "easeInOut",
                      }}
                      className="mb-8"
                    >
                      <Plane className="h-32 w-32 text-amber-400 sw-glow" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 1, 1] }}
                      transition={{
                        duration: 3,
                      }}
                    >
                      <h3 className="text-2xl font-bold uppercase tracking-wider text-amber-400 sw-text-glow">
                        Abordando Transbordador...
                      </h3>
                      <p className="mt-2 text-slate-300">Ticket adquirido exitosamente</p>
                      <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span>Pagado: {travelCost} créditos</span>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}