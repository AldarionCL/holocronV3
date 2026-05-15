import { motion, AnimatePresence } from "motion/react";
import { useGame } from "../context/GameContext";
import { Skull, Sword, Shield, Heart, Coins, TrendingUp, Users } from "lucide-react";
import { useState, useEffect } from "react";

interface GroundPirateEncounterProps {
  onComplete: (success: boolean) => void;
  hostilityLevel: number;
}

interface Pirate {
  name: string;
  health: number;
  maxHealth: number;
  strength: number;
  defense: number;
}

export default function GroundPirateEncounter({
  onComplete,
  hostilityLevel,
}: GroundPirateEncounterProps) {
  const { playerStats, addCredits, addExperience, takeDamage, heal, groundAbilities, reduceAbilityCooldowns, useAbility } = useGame();
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [evasionBonus, setEvasionBonus] = useState(0);
  const [pirate, setPirate] = useState<Pirate>(() => {
    // Generar pirata según hostilidad
    const baseHealth = 30 + hostilityLevel * 15;
    return {
      name: getPirateName(hostilityLevel),
      health: baseHealth,
      maxHealth: baseHealth,
      strength: 3 + hostilityLevel,
      defense: 2 + hostilityLevel,
    };
  });

  function getPirateName(level: number): string {
    const names = [
      ["Bandido Callejero", "Ladrón Novato"],
      ["Mercenario", "Saqueador"],
      ["Pirata Veterano", "Asaltante Peligroso"],
      ["Capitán Bandido", "Líder de Banda"],
      ["Señor del Crimen", "Jefe Pirata Legendario"],
    ];
    const tier = Math.min(level - 1, 4);
    return names[tier][Math.floor(Math.random() * names[tier].length)];
  }

  function addLog(message: string) {
    setCombatLog((prev) => [...prev, message]);
  }

  function handleAttack() {
    if (!isPlayerTurn) return;

    setIsPlayerTurn(false);

    // Reducir cooldowns al iniciar el turno
    reduceAbilityCooldowns();

    // Ataque del jugador
    const playerDamage = Math.floor(
      playerStats.strength * (0.7 + Math.random() * 0.6)
    );

    const hitChance = (playerStats.agility / 15) * 100;
    const didHit = Math.random() * 100 < hitChance;

    if (didHit) {
      const newPirateHealth = Math.max(0, pirate.health - playerDamage);
      setPirate((prev) => ({ ...prev, health: newPirateHealth }));
      addLog(`¡Atacas y causas ${playerDamage} de daño!`);
    } else {
      addLog("¡Fallaste tu ataque!");
    }

    // Verificar si el pirata fue derrotado
    if (pirate.health <= 0) {
      setTimeout(() => {
        addLog("¡Has derrotado al pirata!");
        const reward = 50 + hostilityLevel * 30;
        const exp = 30 + hostilityLevel * 15;
        addCredits(reward);
        addExperience(exp);
        addLog(`+${reward} créditos, +${exp} EXP`);
        setTimeout(() => onComplete(true), 2000);
      }, 1000);
      return;
    }

    // Turno del pirata
    setTimeout(() => {
      const pirateDamage = Math.floor(
        pirate.strength * (0.7 + Math.random() * 0.6)
      );
      
      // Posibilidad de evadir basada en agilidad
      const dodgeChance = (playerStats.agility / 20) * 100 + evasionBonus;
      const didDodge = Math.random() * 100 < dodgeChance;

      if (didDodge) {
        addLog("¡Evades el ataque enemigo!");
      } else {
        const reducedDamage = Math.max(
          1,
          pirateDamage - Math.floor(playerStats.defense / 2)
        );
        takeDamage(reducedDamage);
        addLog(`El pirata te golpea y causa ${reducedDamage} de daño.`);

        if (playerStats.health - reducedDamage <= 0) {
          setTimeout(() => {
            addLog("Has sido derrotado...");
            setTimeout(() => {
              heal(playerStats.maxHealth); // Revivir con salud completa
              onComplete(false);
            }, 2000);
          }, 1000);
          return;
        }
      }

      setIsPlayerTurn(true);
    }, 1500);
  }

  function handleDefend() {
    if (!isPlayerTurn) return;

    setIsPlayerTurn(false);
    
    // Reducir cooldowns al iniciar el turno
    reduceAbilityCooldowns();
    
    addLog("Adoptas una posición defensiva...");

    // Turno del pirata con daño reducido
    setTimeout(() => {
      const pirateDamage = Math.floor(
        pirate.strength * (0.5 + Math.random() * 0.3)
      );
      
      const reducedDamage = Math.max(
        1,
        pirateDamage - playerStats.defense
      );
      takeDamage(reducedDamage);
      addLog(`El pirata ataca pero reduces el daño a ${reducedDamage}.`);

      if (playerStats.health - reducedDamage <= 0) {
        setTimeout(() => {
          addLog("Has sido derrotado...");
          setTimeout(() => {
            heal(playerStats.maxHealth);
            onComplete(false);
          }, 2000);
        }, 1000);
        return;
      }

      setIsPlayerTurn(true);
    }, 1500);
  }

  function handleFlee() {
    if (!isPlayerTurn) return;

    const fleeChance = (playerStats.agility / (playerStats.agility + pirate.strength)) * 100;
    const success = Math.random() * 100 < fleeChance;

    if (success) {
      addLog("¡Logras escapar!");
      setTimeout(() => onComplete(true), 1500);
    } else {
      addLog("¡No logras escapar!");
      setIsPlayerTurn(false);
      
      // El pirata ataca
      setTimeout(() => {
        const pirateDamage = Math.floor(pirate.strength * 1.3);
        const reducedDamage = Math.max(
          1,
          pirateDamage - Math.floor(playerStats.defense / 2)
        );
        takeDamage(reducedDamage);
        addLog(`El pirata aprovecha y causa ${reducedDamage} de daño.`);

        if (playerStats.health - reducedDamage <= 0) {
          setTimeout(() => {
            addLog("Has sido derrotado...");
            setTimeout(() => {
              heal(playerStats.maxHealth);
              onComplete(false);
            }, 2000);
          }, 1000);
        } else {
          setIsPlayerTurn(true);
        }
      }, 1500);
    }
  }

  function handleBribe() {
    const bribeAmount = 100 + hostilityLevel * 50;
    addLog(`Ofreces ${bribeAmount} créditos al pirata...`);
    
    const bribeChance = Math.max(30, 80 - hostilityLevel * 10);
    const success = Math.random() * 100 < bribeChance;

    setTimeout(() => {
      if (success) {
        addLog("¡El pirata acepta el soborno y se va!");
        addCredits(-bribeAmount);
        setTimeout(() => onComplete(true), 1500);
      } else {
        addLog("¡El pirata rechaza el soborno y ataca furioso!");
        setIsPlayerTurn(false);
        
        setTimeout(() => {
          const pirateDamage = Math.floor(pirate.strength * 1.5);
          const reducedDamage = Math.max(
            1,
            pirateDamage - Math.floor(playerStats.defense / 2)
          );
          takeDamage(reducedDamage);
          addLog(`Ataque furioso: ${reducedDamage} de daño!`);

          if (playerStats.health - reducedDamage <= 0) {
            setTimeout(() => {
              addLog("Has sido derrotado...");
              setTimeout(() => {
                heal(playerStats.maxHealth);
                onComplete(false);
              }, 2000);
            }, 1000);
          } else {
            setIsPlayerTurn(true);
          }
        }, 1500);
      }
    }, 1500);
  }

  function handleAbility(abilityId: string) {
    if (!isPlayerTurn) return;

    const ability = groundAbilities.find((a) => a.id === abilityId);
    if (!ability || ability.currentCooldown > 0) return;

    // Marcar que se usa la habilidad (esto activa su cooldown)
    const abilityUsed = useAbility(abilityId);
    if (!abilityUsed) return;

    setIsPlayerTurn(false);

    // Aplicar efectos de habilidades
    if (abilityId === 'force_push') {
      const damage = Math.floor(playerStats.strength * 1.5 + playerStats.level * 2);
      const newPirateHealth = Math.max(0, pirate.health - damage);
      setPirate((prev) => ({ ...prev, health: newPirateHealth }));
      addLog(`🌀 Usas el Empuje de la Fuerza causando ${damage} de daño!`);
      
      if (newPirateHealth <= 0) {
        setTimeout(() => {
          addLog("¡Has derrotado al pirata!");
          const reward = 50 + hostilityLevel * 30;
          const exp = 30 + hostilityLevel * 15;
          addCredits(reward);
          addExperience(exp);
          addLog(`+${reward} créditos, +${exp} EXP`);
          setTimeout(() => onComplete(true), 2000);
        }, 1000);
        return;
      }
    } else if (abilityId === 'thermal_detonator') {
      const damage = Math.floor(playerStats.strength * 2.5);
      const newPirateHealth = Math.max(0, pirate.health - damage);
      setPirate((prev) => ({ ...prev, health: newPirateHealth }));
      addLog(`💣 ¡Granada térmica! ${damage} de daño masivo!`);
      
      if (newPirateHealth <= 0) {
        setTimeout(() => {
          addLog("¡Has derrotado al pirata!");
          const reward = 50 + hostilityLevel * 30;
          const exp = 30 + hostilityLevel * 15;
          addCredits(reward);
          addExperience(exp);
          addLog(`+${reward} créditos, +${exp} EXP`);
          setTimeout(() => onComplete(true), 2000);
        }, 1000);
        return;
      }
    } else if (abilityId === 'precision_shot') {
      const damage = Math.floor(playerStats.strength * 1.8);
      setPirate((prev) => ({ ...prev, health: Math.max(0, prev.health - damage) }));
      addLog(`🎯 Disparo preciso que ignora la defensa: ${damage} de daño!`);
    } else if (abilityId === 'combat_stim') {
      const healAmount = Math.floor(playerStats.maxHealth * 0.4);
      heal(healAmount);
      addLog(`💉 Usas un estimulante: +${healAmount} HP!`);
    }

    // Reducir cooldowns y activar el cooldown de la habilidad usada
    reduceAbilityCooldowns();

    // Turno del pirata (solo si no fue derrotado)
    setTimeout(() => {
      if (pirate.health <= 0) return;

      const pirateDamage = Math.floor(
        pirate.strength * (0.7 + Math.random() * 0.6)
      );
      
      const dodgeChance = (playerStats.agility / 20) * 100 + evasionBonus;
      const didDodge = Math.random() * 100 < dodgeChance;

      if (didDodge) {
        addLog("¡Evades el ataque enemigo!");
      } else {
        const reducedDamage = Math.max(
          1,
          pirateDamage - Math.floor(playerStats.defense / 2)
        );
        takeDamage(reducedDamage);
        addLog(`El pirata te golpea y causa ${reducedDamage} de daño.`);

        if (playerStats.health - reducedDamage <= 0) {
          setTimeout(() => {
            addLog("Has sido derrotado...");
            setTimeout(() => {
              heal(playerStats.maxHealth);
              onComplete(false);
            }, 2000);
          }, 1000);
          return;
        }
      }

      setIsPlayerTurn(true);
    }, 1500);
  }

  useEffect(() => {
    addLog(`¡${pirate.name} te ha emboscado!`);
    addLog("Prepárate para el combate...");
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-8">
      {/* Fondo con textura */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-black opacity-50" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex h-full max-h-[800px] w-full max-w-6xl flex-col gap-4"
      >
        {/* Header de alerta */}
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="sw-panel border-2 border-red-500 bg-red-950/50 p-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Users className="h-8 w-8 text-red-400" />
            <h2 className="text-3xl font-bold uppercase tracking-wider text-red-400 sw-text-glow">
              ¡Emboscada Pirata!
            </h2>
            <Users className="h-8 w-8 text-red-400" />
          </div>
        </motion.div>

        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Panel izquierdo - Tu personaje */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="sw-panel sw-glow-cyan flex w-1/3 flex-col p-6"
          >
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-bold uppercase tracking-wide text-cyan-400">
                Tu Personaje
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <TrendingUp className="h-4 w-4" />
                <span>Nivel {playerStats.level}</span>
              </div>
            </div>

            {/* Salud */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-400" />
                  <span className="text-sm uppercase text-slate-400">Salud</span>
                </div>
                <span className="text-lg font-bold text-cyan-400">
                  {playerStats.health}/{playerStats.maxHealth}
                </span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  animate={{
                    width: `${(playerStats.health / playerStats.maxHealth) * 100}%`,
                  }}
                  className={`h-full ${
                    (playerStats.health / playerStats.maxHealth) * 100 > 60
                      ? "bg-gradient-to-r from-green-500 to-cyan-500"
                      : (playerStats.health / playerStats.maxHealth) * 100 > 30
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                      : "bg-gradient-to-r from-red-600 to-red-500"
                  }`}
                />
              </div>
            </div>

            {/* Experiencia */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-400" />
                  <span className="text-sm uppercase text-slate-400">Experiencia</span>
                </div>
                <span className="text-sm font-bold text-amber-400">
                  {playerStats.experience}/{playerStats.level * 100}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  animate={{
                    width: `${(playerStats.experience / (playerStats.level * 100)) * 100}%`,
                  }}
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-500"
                />
              </div>
            </div>

            {/* Estadísticas */}
            <div className="mb-4 space-y-3">
              <div className="flex items-center justify-between rounded bg-slate-800/50 p-2">
                <div className="flex items-center gap-2">
                  <Sword className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-slate-300">Fuerza</span>
                </div>
                <span className="font-bold text-red-400">{playerStats.strength}</span>
              </div>
              <div className="flex items-center justify-between rounded bg-slate-800/50 p-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-300">Defensa</span>
                </div>
                <span className="font-bold text-blue-400">{playerStats.defense}</span>
              </div>
              <div className="flex items-center justify-between rounded bg-slate-800/50 p-2">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </motion.div>
                  <span className="text-sm text-slate-300">Agilidad</span>
                </div>
                <span className="font-bold text-green-400">{playerStats.agility}</span>
              </div>
            </div>

            {/* Habilidades */}
            <div className="flex-1">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                Habilidades
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {groundAbilities.map((ability) => (
                  <motion.button
                    key={ability.id}
                    onClick={() => handleAbility(ability.id)}
                    disabled={!isPlayerTurn || pirate.health <= 0 || ability.currentCooldown > 0}
                    whileHover={{ scale: ability.currentCooldown === 0 ? 1.05 : 1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`sw-card relative flex flex-col items-center gap-1 p-2 text-center transition-all ${
                      !isPlayerTurn || pirate.health <= 0 || ability.currentCooldown > 0
                        ? "cursor-not-allowed opacity-40"
                        : "hover:border-purple-400"
                    }`}
                  >
                    <div className="text-2xl">{ability.icon}</div>
                    <span className="text-[10px] font-bold uppercase leading-tight text-purple-400">
                      {ability.name}
                    </span>
                    {ability.currentCooldown > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center rounded bg-black/70">
                        <span className="text-xl font-bold text-red-400">
                          {ability.currentCooldown}
                        </span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Panel central - Combate */}
          <div className="flex flex-1 flex-col gap-4">
            {/* Enemigo */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="sw-panel border-2 border-red-500 bg-red-950/30 p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skull className="h-8 w-8 text-red-400" />
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-wide text-red-400">
                      {pirate.name}
                    </h3>
                    <p className="text-sm text-red-300/70">Pirata Terrestre</p>
                  </div>
                </div>
                <Users className="h-8 w-8 text-red-400" />
              </div>

              {/* Salud del pirata */}
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm uppercase text-slate-400">Salud</span>
                  <span className="text-lg font-bold text-red-400">
                    {pirate.health}/{pirate.maxHealth}
                  </span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-slate-800">
                  <motion.div
                    animate={{
                      width: `${(pirate.health / pirate.maxHealth) * 100}%`,
                    }}
                    className="h-full bg-gradient-to-r from-red-600 to-red-400"
                  />
                </div>
              </div>

              {/* Estadísticas del pirata */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded bg-slate-800/50 p-2 text-center">
                  <div className="text-xs text-slate-400">Fuerza</div>
                  <div className="font-bold text-red-400">{pirate.strength}</div>
                </div>
                <div className="rounded bg-slate-800/50 p-2 text-center">
                  <div className="text-xs text-slate-400">Defensa</div>
                  <div className="font-bold text-red-400">{pirate.defense}</div>
                </div>
              </div>
            </motion.div>

            {/* Log de combate */}
            <div className="sw-panel flex-1 overflow-hidden p-4">
              <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-amber-400">
                Registro de Combate
              </h4>
              <div className="h-full space-y-1 overflow-y-auto">
                <AnimatePresence>
                  {combatLog.slice().reverse().map((log, index) => (
                    <motion.div
                      key={combatLog.length - 1 - index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="rounded bg-slate-800/30 p-2 text-sm text-slate-300"
                    >
                      <span className="text-amber-400/70">&gt;</span> {log}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Controles de combate */}
            <div className="sw-panel grid grid-cols-4 gap-3 p-4">
              <button
                onClick={handleAttack}
                disabled={!isPlayerTurn || pirate.health <= 0}
                className={`sw-button flex flex-col items-center gap-2 py-4 ${
                  !isPlayerTurn || pirate.health <= 0 ? "opacity-50" : ""
                }`}
              >
                <Sword className="h-6 w-6" />
                <span className="text-sm">Atacar</span>
              </button>
              <button
                onClick={handleDefend}
                disabled={!isPlayerTurn || pirate.health <= 0}
                className={`sw-button-cyan flex flex-col items-center gap-2 py-4 ${
                  !isPlayerTurn || pirate.health <= 0 ? "opacity-50" : ""
                }`}
              >
                <Shield className="h-6 w-6" />
                <span className="text-sm">Defender</span>
              </button>
              <button
                onClick={handleFlee}
                disabled={!isPlayerTurn || pirate.health <= 0}
                className={`sw-button flex flex-col items-center gap-2 py-4 ${
                  !isPlayerTurn || pirate.health <= 0 ? "opacity-50" : ""
                }`}
              >
                <TrendingUp className="h-6 w-6 rotate-90" />
                <span className="text-sm">Huir</span>
              </button>
              <button
                onClick={handleBribe}
                disabled={!isPlayerTurn || pirate.health <= 0}
                className={`sw-button flex flex-col items-center gap-2 py-4 ${
                  !isPlayerTurn || pirate.health <= 0 ? "opacity-50" : ""
                }`}
              >
                <Coins className="h-6 w-6" />
                <span className="text-sm">Sobornar</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}