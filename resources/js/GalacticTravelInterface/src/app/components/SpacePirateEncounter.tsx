import { motion, AnimatePresence } from "motion/react";
import { useGame } from "../context/GameContext";
import { Skull, Zap, Shield, Rocket, Coins, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

interface SpacePirateEncounterProps {
  onComplete: (success: boolean) => void;
  hostilityLevel: number;
}

interface PirateShip {
  name: string;
  health: number;
  maxHealth: number;
  weapons: number;
  speed: number;
}

export default function SpacePirateEncounter({
  onComplete,
  hostilityLevel,
}: SpacePirateEncounterProps) {
  const { currentShip, addCredits, addExperience, spaceAbilities, reduceAbilityCooldowns, useAbility } = useGame();
  const [playerShipHealth, setPlayerShipHealth] = useState(100);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [evasionBonus, setEvasionBonus] = useState(0);
  const [shieldActive, setShieldActive] = useState(false);
  const [damageBonus, setDamageBonus] = useState(0);
  const [pirateShip, setPirateShip] = useState<PirateShip>(() => {
    // Generar nave pirata según hostilidad
    const baseHealth = 50 + hostilityLevel * 20;
    return {
      name: getPirateName(hostilityLevel),
      health: baseHealth,
      maxHealth: baseHealth,
      weapons: 3 + hostilityLevel,
      speed: 4 + hostilityLevel,
    };
  });

  function getPirateName(level: number): string {
    const names = [
      ["Saqueador Novato", "Pirata Menor"],
      ["Corsario Espacial", "Bandido Estelar"],
      ["Merodeador Veterano", "Asaltante Experimentado"],
      ["Capitán Pirata", "Saqueador Élite"],
      ["Señor del Vacío", "Destructor Legendario"],
    ];
    const tier = Math.min(level - 1, 4);
    return names[tier][Math.floor(Math.random() * names[tier].length)];
  }

  function addLog(message: string) {
    setCombatLog((prev) => [...prev, message]);
  }

  function handleAttack() {
    if (!currentShip || !isPlayerTurn) return;

    setIsPlayerTurn(false);

    // Reducir cooldowns al iniciar el turno
    reduceAbilityCooldowns();

    // Ataque del jugador
    const playerDamage = Math.floor(
      currentShip.weapons * (0.8 + Math.random() * 0.4) + damageBonus
    );
    const newPirateHealth = Math.max(0, pirateShip.health - playerDamage);
    setPirateShip((prev) => ({ ...prev, health: newPirateHealth }));
    addLog(`¡Disparas y causas ${playerDamage} de daño!`);

    // Verificar si el pirata fue derrotado
    if (newPirateHealth <= 0) {
      setTimeout(() => {
        addLog("¡Has derrotado al pirata!");
        const reward = 100 + hostilityLevel * 50;
        const exp = 50 + hostilityLevel * 20;
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
        pirateShip.weapons * (0.6 + Math.random() * 0.4)
      );
      
      // Posibilidad de evadir basada en velocidad de la nave
      const dodgeChance = (currentShip.speed / 20) * 100;
      const didDodge = Math.random() * 100 < dodgeChance;

      if (didDodge) {
        addLog("¡Evadiste el ataque enemigo!");
      } else {
        const newHealth = Math.max(0, playerShipHealth - pirateDamage);
        setPlayerShipHealth(newHealth);
        addLog(`El pirata te ataca y causa ${pirateDamage} de daño.`);

        if (newHealth <= 0) {
          setTimeout(() => {
            addLog("Tu nave ha sido destruida...");
            setTimeout(() => onComplete(false), 2000);
          }, 1000);
          return;
        }
      }

      setIsPlayerTurn(true);
    }, 1500);
  }

  function handleFlee() {
    if (!currentShip || !isPlayerTurn) return;

    const fleeChance = (currentShip.speed / (currentShip.speed + pirateShip.speed)) * 100;
    const success = Math.random() * 100 < fleeChance;

    if (success) {
      addLog("¡Lograste escapar!");
      setTimeout(() => onComplete(true), 1500);
    } else {
      addLog("¡No lograste escapar!");
      setIsPlayerTurn(false);
      
      // El pirata ataca
      setTimeout(() => {
        const pirateDamage = Math.floor(pirateShip.weapons * 1.2);
        const newHealth = Math.max(0, playerShipHealth - pirateDamage);
        setPlayerShipHealth(newHealth);
        addLog(`El pirata aprovecha y causa ${pirateDamage} de daño.`);

        if (newHealth <= 0) {
          setTimeout(() => {
            addLog("Tu nave ha sido destruida...");
            setTimeout(() => onComplete(false), 2000);
          }, 1000);
        } else {
          setIsPlayerTurn(true);
        }
      }, 1500);
    }
  }

  function handleBribe() {
    const bribeAmount = 200 + hostilityLevel * 100;
    addLog(`Ofreces ${bribeAmount} créditos al pirata...`);
    
    const bribeChance = Math.max(20, 70 - hostilityLevel * 10);
    const success = Math.random() * 100 < bribeChance;

    setTimeout(() => {
      if (success) {
        addLog("¡El pirata acepta el soborno!");
        addCredits(-bribeAmount);
        setTimeout(() => onComplete(true), 1500);
      } else {
        addLog("¡El pirata rechaza el soborno y ataca!");
        setIsPlayerTurn(false);
        
        setTimeout(() => {
          const pirateDamage = Math.floor(pirateShip.weapons * 1.5);
          const newHealth = Math.max(0, playerShipHealth - pirateDamage);
          setPlayerShipHealth(newHealth);
          addLog(`Ataque furioso: ${pirateDamage} de daño!`);

          if (newHealth <= 0) {
            setTimeout(() => {
              addLog("Tu nave ha sido destruida...");
              setTimeout(() => onComplete(false), 2000);
            }, 1000);
          } else {
            setIsPlayerTurn(true);
          }
        }, 1500);
      }
    }, 1500);
  }

  function handleEvasion() {
    if (!currentShip || !isPlayerTurn) return;

    const ability = spaceAbilities.find(a => a.name === "Evasión");
    if (!ability || ability.cooldown > 0) {
      addLog("¡No puedes usar Evasión ahora!");
      return;
    }

    setIsPlayerTurn(false);
    reduceAbilityCooldowns();

    const evasionBoost = Math.floor(Math.random() * 20) + 10;
    setEvasionBonus(evasionBoost);
    addLog(`¡Usas Evasión y aumentas tu evasión en ${evasionBoost}%!`);

    setTimeout(() => {
      setIsPlayerTurn(true);
    }, 1500);
  }

  function handleShield() {
    if (!currentShip || !isPlayerTurn) return;

    const ability = spaceAbilities.find(a => a.name === "Escudo");
    if (!ability || ability.cooldown > 0) {
      addLog("¡No puedes usar Escudo ahora!");
      return;
    }

    setIsPlayerTurn(false);
    reduceAbilityCooldowns();

    setShieldActive(true);
    addLog("¡Usas Escudo para protegerte!");

    setTimeout(() => {
      setShieldActive(false);
      setIsPlayerTurn(true);
    }, 1500);
  }

  function handleAbility(id: string) {
    if (!currentShip || !isPlayerTurn) return;

    const ability = spaceAbilities.find((a) => a.id === id);
    if (!ability || ability.currentCooldown > 0) return;

    // Marcar que se usa la habilidad (esto activa su cooldown)
    const abilityUsed = useAbility(id);
    if (!abilityUsed) return;

    setIsPlayerTurn(false);

    // Aplicar efectos según el ID de la habilidad
    if (id === 'evasive_maneuver') {
      const evasionBoost = 30;
      setEvasionBonus(evasionBoost);
      addLog(`🌪️ Maniobra Evasiva: +${evasionBoost}% de evasión!`);
    } else if (id === 'weapon_overcharge') {
      const damage = Math.floor(currentShip.weapons * 2.5);
      const newPirateHealth = Math.max(0, pirateShip.health - damage);
      setPirateShip((prev) => ({ ...prev, health: newPirateHealth }));
      addLog(`⚡ Sobrecarga de Armas: ${damage} de daño devastador!`);
      
      if (newPirateHealth <= 0) {
        setTimeout(() => {
          addLog("¡Has derrotado al pirata!");
          const reward = 100 + hostilityLevel * 50;
          const exp = 50 + hostilityLevel * 20;
          addCredits(reward);
          addExperience(exp);
          addLog(`+${reward} créditos, +${exp} EXP`);
          setTimeout(() => onComplete(true), 2000);
        }, 1000);
        return;
      }
    } else if (id === 'emergency_shields') {
      setShieldActive(true);
      addLog(`🛡️ Escudos de Emergencia activados!`);
    } else if (id === 'torpedo_barrage') {
      const damage = Math.floor(currentShip.weapons * 1.8);
      const newPirateHealth = Math.max(0, pirateShip.health - damage);
      setPirateShip((prev) => ({ ...prev, health: newPirateHealth }));
      addLog(`🚀 Salva de Torpedos: ${damage} de daño garantizado!`);
      
      if (newPirateHealth <= 0) {
        setTimeout(() => {
          addLog("¡Has derrotado al pirata!");
          const reward = 100 + hostilityLevel * 50;
          const exp = 50 + hostilityLevel * 20;
          addCredits(reward);
          addExperience(exp);
          addLog(`+${reward} créditos, +${exp} EXP`);
          setTimeout(() => onComplete(true), 2000);
        }, 1000);
        return;
      }
    }

    // Turno del pirata (solo si no fue derrotado)
    setTimeout(() => {
      if (pirateShip.health <= 0) return;

      const pirateDamage = Math.floor(
        pirateShip.weapons * (0.6 + Math.random() * 0.4)
      );
      
      // Posibilidad de evadir basada en velocidad + bonus
      const dodgeChance = (currentShip.speed / 20) * 100 + evasionBonus;
      const didDodge = Math.random() * 100 < dodgeChance;

      if (didDodge) {
        addLog("¡Evadiste el ataque enemigo!");
        setEvasionBonus(0); // Resetear bonus de evasión después de usarlo
      } else if (shieldActive) {
        addLog("¡Los escudos absorben el ataque!");
        setShieldActive(false); // Desactivar escudos después de usarlos
      } else {
        const newHealth = Math.max(0, playerShipHealth - pirateDamage);
        setPlayerShipHealth(newHealth);
        addLog(`El pirata te ataca y causa ${pirateDamage} de daño.`);

        if (newHealth <= 0) {
          setTimeout(() => {
            addLog("Tu nave ha sido destruida...");
            setTimeout(() => onComplete(false), 2000);
          }, 1000);
          return;
        }
      }

      setIsPlayerTurn(true);
    }, 1500);
  }

  useEffect(() => {
    addLog(`¡${pirateShip.name} te ha interceptado!`);
    addLog("Prepárate para el combate espacial...");
  }, []);

  if (!currentShip) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-8">
      {/* Estrellas de fondo con efecto de movimiento */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 200 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, -100],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

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
            <Skull className="h-8 w-8 text-red-400" />
            <h2 className="text-3xl font-bold uppercase tracking-wider text-red-400 sw-text-glow">
              ¡Encuentro con Piratas!
            </h2>
            <Skull className="h-8 w-8 text-red-400" />
          </div>
        </motion.div>

        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Panel izquierdo - Tu nave */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="sw-panel sw-glow-cyan flex w-1/3 flex-col p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <Rocket className="h-8 w-8 text-cyan-400" />
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wide text-cyan-400">
                  Tu Nave
                </h3>
                <p className="text-sm text-slate-400">{currentShip.name}</p>
              </div>
            </div>

            {/* Salud de la nave */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm uppercase text-slate-400">Integridad</span>
                <span className="text-lg font-bold text-cyan-400">{playerShipHealth}%</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  animate={{ width: `${playerShipHealth}%` }}
                  className={`h-full ${
                    playerShipHealth > 60
                      ? "bg-gradient-to-r from-green-500 to-cyan-500"
                      : playerShipHealth > 30
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                      : "bg-gradient-to-r from-red-600 to-red-500"
                  }`}
                />
              </div>
            </div>

            {/* Estadísticas */}
            <div className="mb-4 space-y-3">
              <div className="flex items-center justify-between rounded bg-slate-800/50 p-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-slate-300">Armamento</span>
                </div>
                <span className="font-bold text-amber-400">{currentShip.weapons}</span>
              </div>
              <div className="flex items-center justify-between rounded bg-slate-800/50 p-2">
                <div className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm text-slate-300">Velocidad</span>
                </div>
                <span className="font-bold text-cyan-400">{currentShip.speed}</span>
              </div>
            </div>

            {/* Habilidades espaciales */}
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                Habilidades de Pilotaje
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {spaceAbilities.map((ability) => (
                  <motion.button
                    key={ability.id}
                    onClick={() => handleAbility(ability.id)}
                    disabled={!isPlayerTurn || pirateShip.health <= 0 || ability.currentCooldown > 0}
                    whileHover={{ scale: ability.currentCooldown === 0 ? 1.05 : 1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`sw-card relative flex flex-col items-center gap-1 p-2 text-center transition-all ${
                      !isPlayerTurn || pirateShip.health <= 0 || ability.currentCooldown > 0
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

            {/* Imagen de la nave */}
            <div className="overflow-hidden rounded-lg border-2 border-cyan-500/50">
              <img
                src={currentShip.image}
                alt={currentShip.name}
                className="h-40 w-full object-cover"
              />
            </div>
          </motion.div>

          {/* Panel central - Combate */}
          <div className="flex flex-1 flex-col gap-4">
            {/* Nave enemiga */}
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
                      {pirateShip.name}
                    </h3>
                    <p className="text-sm text-red-300/70">Nave Pirata</p>
                  </div>
                </div>
                <Shield className="h-8 w-8 text-red-400" />
              </div>

              {/* Salud del pirata */}
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm uppercase text-slate-400">Integridad</span>
                  <span className="text-lg font-bold text-red-400">
                    {Math.round((pirateShip.health / pirateShip.maxHealth) * 100)}%
                  </span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-slate-800">
                  <motion.div
                    animate={{
                      width: `${(pirateShip.health / pirateShip.maxHealth) * 100}%`,
                    }}
                    className="h-full bg-gradient-to-r from-red-600 to-red-400"
                  />
                </div>
              </div>

              {/* Estadísticas del pirata */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded bg-slate-800/50 p-2 text-center">
                  <div className="text-xs text-slate-400">Armamento</div>
                  <div className="font-bold text-red-400">{pirateShip.weapons}</div>
                </div>
                <div className="rounded bg-slate-800/50 p-2 text-center">
                  <div className="text-xs text-slate-400">Velocidad</div>
                  <div className="font-bold text-red-400">{pirateShip.speed}</div>
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
            <div className="sw-panel grid grid-cols-3 gap-3 p-4">
              <button
                onClick={handleAttack}
                disabled={!isPlayerTurn || pirateShip.health <= 0}
                className={`sw-button flex flex-col items-center gap-2 py-4 ${
                  !isPlayerTurn || pirateShip.health <= 0 ? "opacity-50" : ""
                }`}
              >
                <Zap className="h-6 w-6" />
                <span className="text-sm">Atacar</span>
              </button>
              <button
                onClick={handleFlee}
                disabled={!isPlayerTurn || pirateShip.health <= 0}
                className={`sw-button-cyan flex flex-col items-center gap-2 py-4 ${
                  !isPlayerTurn || pirateShip.health <= 0 ? "opacity-50" : ""
                }`}
              >
                <Rocket className="h-6 w-6" />
                <span className="text-sm">Huir</span>
              </button>
              <button
                onClick={handleBribe}
                disabled={!isPlayerTurn || pirateShip.health <= 0}
                className={`sw-button flex flex-col items-center gap-2 py-4 ${
                  !isPlayerTurn || pirateShip.health <= 0 ? "opacity-50" : ""
                }`}
              >
                <Coins className="h-6 w-6" />
                <span className="text-sm">Sobornar</span>
              </button>
              <button
                onClick={handleEvasion}
                disabled={!isPlayerTurn || pirateShip.health <= 0}
                className={`sw-button flex flex-col items-center gap-2 py-4 ${
                  !isPlayerTurn || pirateShip.health <= 0 ? "opacity-50" : ""
                }`}
              >
                <Rocket className="h-6 w-6" />
                <span className="text-sm">Evasión</span>
              </button>
              <button
                onClick={handleShield}
                disabled={!isPlayerTurn || pirateShip.health <= 0}
                className={`sw-button flex flex-col items-center gap-2 py-4 ${
                  !isPlayerTurn || pirateShip.health <= 0 ? "opacity-50" : ""
                }`}
              >
                <Shield className="h-6 w-6" />
                <span className="text-sm">Escudo</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}