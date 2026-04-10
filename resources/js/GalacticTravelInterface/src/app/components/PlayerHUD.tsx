import { motion } from "motion/react";
import { Coins, Rocket, Heart } from "lucide-react";
import { useGame } from "../context/GameContext";
import { useState } from "react";
import Hangar from "./Hangar";

export default function PlayerHUD() {
  const { credits, currentShip, playerStats } = useGame();
  const [showHangar, setShowHangar] = useState(false);

  const healthPercentage = (playerStats.health / playerStats.maxHealth) * 100;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sw-panel sw-glow fixed left-1/2 top-8 z-30 -translate-x-1/2 p-3"
      >
        <div className="flex items-center gap-4">
          {/* Créditos */}
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-400" />
            <div>
              <p className="text-xs uppercase tracking-wider text-amber-300/70">Créditos</p>
              <p className="text-lg font-bold text-amber-400">{credits.toLocaleString()}</p>
            </div>
          </div>

          {/* Salud del jugador */}
          <div className="flex items-center gap-2 border-l-2 border-amber-500/30 pl-4">
            <Heart
              className={`h-5 w-5 ${
                healthPercentage > 60
                  ? "text-green-400"
                  : healthPercentage > 30
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            />
            <div>
              <p className="text-xs uppercase tracking-wider text-amber-300/70">Salud</p>
              <p
                className={`text-sm font-bold ${
                  healthPercentage > 60
                    ? "text-green-400"
                    : healthPercentage > 30
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {playerStats.health}/{playerStats.maxHealth}
              </p>
            </div>
          </div>

          {/* Nivel del jugador */}
          <div className="flex items-center gap-2 border-l-2 border-amber-500/30 pl-4">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
              <span className="text-xs font-bold">{playerStats.level}</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-amber-300/70">Nivel</p>
              <p className="text-sm font-bold text-purple-400">
                {playerStats.experience}/{playerStats.level * 100} EXP
              </p>
            </div>
          </div>

          {/* Indicador de nave con botón */}
          <button
            onClick={() => setShowHangar(true)}
            className="flex items-center gap-2 border-l-2 border-amber-500/30 pl-4 transition-all hover:scale-105"
          >
            <Rocket
              className={`h-5 w-5 ${
                currentShip ? "text-cyan-400 sw-glow-cyan" : "text-slate-600"
              }`}
            />
            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-amber-300/70">Nave</p>
              <p
                className={`text-sm font-bold ${
                  currentShip ? "text-cyan-400" : "text-slate-500"
                }`}
              >
                {currentShip ? currentShip.name : "Ninguna"}
              </p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Modal del Hangar */}
      {showHangar && <Hangar onClose={() => setShowHangar(false)} />}
    </>
  );
}