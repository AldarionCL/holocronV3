import { motion, AnimatePresence } from "motion/react";
import { useGame } from "../context/GameContext";
import { ArrowLeft, Rocket, Zap, Package, Sword, Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HangarProps {
  onClose: () => void;
}

export default function Hangar({ onClose }: HangarProps) {
  const { credits, availableShips, currentShip, buyShip, equipShip } = useGame();
  const [selectedShip, setSelectedShip] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleBuyShip = (shipId: string) => {
    const success = buyShip(shipId);
    if (success) {
      setNotification("¡Nave comprada con éxito!");
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification("Créditos insuficientes");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleEquipShip = (shipId: string) => {
    equipShip(shipId);
    setNotification("Nave equipada");
    setTimeout(() => setNotification(null), 2000);
  };

  const selected = availableShips.find((s) => s.id === selectedShip);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-8">
      {/* Fondo de estrellas */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
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

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative z-10 flex h-full max-h-[900px] w-full max-w-7xl flex-col"
      >
        {/* Header */}
        <div className="sw-panel sw-glow mb-4 flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-amber-400/20 p-3">
              <Rocket className="h-8 w-8 text-amber-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-wider text-amber-400 sw-text-glow">
                Hangar Espacial
              </h2>
              <p className="text-sm uppercase tracking-wider text-amber-300/70">
                Concesionario de Naves
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm uppercase tracking-wider text-slate-400">Créditos</p>
              <p className="text-2xl font-bold text-amber-400">{credits.toLocaleString()}</p>
            </div>
            <button onClick={onClose} className="sw-button px-4 py-2">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Notificación */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="sw-panel sw-glow absolute left-1/2 top-24 z-50 -translate-x-1/2 px-6 py-3"
            >
              <p className="text-lg font-bold uppercase text-amber-400">{notification}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nave actual equipada */}
        {currentShip && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sw-panel sw-glow mb-4 p-4"
          >
            <div className="flex items-center gap-4">
              <div className="h-20 w-32 overflow-hidden rounded-lg">
                <ImageWithFallback
                  src={currentShip.image}
                  alt={currentShip.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm uppercase tracking-wider text-amber-300/70">
                  Nave Equipada
                </p>
                <h3 className="text-xl font-bold uppercase tracking-wide text-amber-400">
                  {currentShip.name}
                </h3>
              </div>
              <div className="rounded-full bg-green-500/20 p-2">
                <Check className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Contenido principal */}
        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Lista de naves */}
          <div className="sw-panel sw-glow flex-1 overflow-y-auto p-6">
            <h3 className="mb-4 text-lg font-bold uppercase tracking-wider text-amber-400">
              Naves Disponibles
            </h3>
            <div className="space-y-3">
              {availableShips.map((ship, index) => (
                <motion.button
                  key={ship.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedShip(ship.id)}
                  className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 text-left transition-all ${
                    selectedShip === ship.id
                      ? "border-amber-400 bg-amber-400/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-amber-400/50"
                  }`}
                >
                  <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded">
                    <ImageWithFallback
                      src={ship.image}
                      alt={ship.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold uppercase tracking-wide text-amber-400">
                        {ship.name}
                      </h4>
                      {ship.owned && (
                        <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs uppercase text-green-400">
                          Propiedad
                        </span>
                      )}
                      {currentShip?.id === ship.id && (
                        <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs uppercase text-amber-400">
                          Equipada
                        </span>
                      )}
                    </div>
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      {ship.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-amber-400">
                      {ship.price.toLocaleString()}
                    </p>
                    <p className="text-xs uppercase text-slate-400">Créditos</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Detalles de nave seleccionada */}
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sw-panel sw-glow w-96 overflow-y-auto p-6"
            >
              <div className="space-y-6">
                {/* Imagen principal */}
                <div className="h-48 overflow-hidden rounded-lg">
                  <ImageWithFallback
                    src={selected.image}
                    alt={selected.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Información */}
                <div>
                  <h3 className="mb-2 text-2xl font-bold uppercase tracking-wide text-amber-400">
                    {selected.name}
                  </h3>
                  <p className="mb-4 text-sm uppercase tracking-wider text-amber-300/70">
                    {selected.type}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-300">{selected.description}</p>
                </div>

                {/* Estadísticas */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-cyan-400" />
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wider text-slate-400">Velocidad</p>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(selected.speed / 10) * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        />
                      </div>
                    </div>
                    <span className="text-lg font-bold text-cyan-400">{selected.speed}/10</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-green-400" />
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wider text-slate-400">Carga</p>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(selected.cargo / 500) * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        />
                      </div>
                    </div>
                    <span className="text-lg font-bold text-green-400">{selected.cargo}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Sword className="h-5 w-5 text-red-400" />
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wider text-slate-400">Armamento</p>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(selected.weapons / 10) * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                        />
                      </div>
                    </div>
                    <span className="text-lg font-bold text-red-400">{selected.weapons}/10</span>
                  </div>
                </div>

                {/* Precio y acciones */}
                <div className="border-t-2 border-amber-400/30 pt-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm uppercase tracking-wider text-slate-400">Precio</span>
                    <span className="text-3xl font-bold text-amber-400">
                      {selected.price.toLocaleString()}
                    </span>
                  </div>

                  {selected.owned ? (
                    currentShip?.id === selected.id ? (
                      <div className="flex items-center justify-center gap-2 rounded-lg bg-green-500/20 py-3">
                        <Check className="h-5 w-5 text-green-400" />
                        <span className="font-bold uppercase text-green-400">Nave Equipada</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEquipShip(selected.id)}
                        className="sw-button-cyan flex w-full items-center justify-center gap-2 py-3"
                      >
                        <Rocket className="h-5 w-5" />
                        Equipar Nave
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handleBuyShip(selected.id)}
                      disabled={credits < selected.price}
                      className={`sw-button flex w-full items-center justify-center gap-2 py-3 ${
                        credits < selected.price ? "opacity-50" : ""
                      }`}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Comprar Nave
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
