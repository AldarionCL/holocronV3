import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { Swords, Heart, Shield, Zap, Trophy, X } from "lucide-react";
import { VisitorUser } from "../data/gameData";

interface PvPDuelEncounterProps {
  opponent: VisitorUser;
  onComplete: (playerWon: boolean) => void;
}

interface Combatant {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  agility: number;
}

export default function PvPDuelEncounter({ opponent, onComplete }: PvPDuelEncounterProps) {
  const { player, updatePlayer } = useGame();

  const [playerStats, setPlayerStats] = useState<Combatant>({
    name: "Tú",
    hp: player.hp,
    maxHp: player.hp,
    attack: player.strength,
    defense: player.defense,
    agility: player.agility,
  });

  const [opponentStats, setOpponentStats] = useState<Combatant>({
    name: opponent.username,
    hp: opponent.level * 5 + 50,
    maxHp: opponent.level * 5 + 50,
    attack: opponent.level * 2 + 30,
    defense: opponent.level * 2 + 20,
    agility: opponent.level + 25,
  });

  const [turn, setTurn] = useState<"player" | "opponent">("player");
  const [log, setLog] = useState<string[]>([
    `¡Duelo iniciado contra ${opponent.username}!`,
    "¡Que comience el combate!",
  ]);
  const [battleEnded, setBattleEnded] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Determinar quién ataca primero basado en agilidad
  useEffect(() => {
    if (opponentStats.agility > playerStats.agility) {
      setTurn("opponent");
      setTimeout(() => opponentAttack(), 1000);
    }
  }, []);

  const addLog = (message: string) => {
    setLog((prev) => [...prev, message]);
  };

  const playerAttack = () => {
    if (isAnimating || battleEnded) return;
    setIsAnimating(true);

    // Calcular daño
    const baseDamage = playerStats.attack;
    const damageReduction = Math.floor(opponentStats.defense * 0.3);
    const finalDamage = Math.max(baseDamage - damageReduction, 5);

    // Aplicar daño
    const newHp = Math.max(opponentStats.hp - finalDamage, 0);
    setOpponentStats((prev) => ({ ...prev, hp: newHp }));
    addLog(`Tu ataque causa ${finalDamage} de daño a ${opponent.username}!`);

    setTimeout(() => {
      if (newHp <= 0) {
        // Victoria del jugador
        endBattle(true);
      } else {
        // Turno del oponente
        setTurn("opponent");
        setTimeout(() => opponentAttack(), 1500);
      }
      setIsAnimating(false);
    }, 1000);
  };

  const opponentAttack = () => {
    if (battleEnded) return;
    setIsAnimating(true);

    // Calcular daño
    const baseDamage = opponentStats.attack;
    const damageReduction = Math.floor(playerStats.defense * 0.3);
    const finalDamage = Math.max(baseDamage - damageReduction, 5);

    // Aplicar daño
    const newHp = Math.max(playerStats.hp - finalDamage, 0);
    setPlayerStats((prev) => ({ ...prev, hp: newHp }));
    addLog(`${opponent.username} te causa ${finalDamage} de daño!`);

    setTimeout(() => {
      if (newHp <= 0) {
        // Derrota del jugador
        endBattle(false);
      } else {
        // Turno del jugador
        setTurn("player");
      }
      setIsAnimating(false);
    }, 1000);
  };

  const endBattle = (won: boolean) => {
    setBattleEnded(true);
    setPlayerWon(won);

    if (won) {
      const creditsReward = opponent.level * 50;
      const xpReward = opponent.level * 30;

      addLog(`¡Victoria! Has derrotado a ${opponent.username}!`);
      addLog(`Recompensa: ${creditsReward} créditos y ${xpReward} XP`);

      updatePlayer({
        credits: player.credits + creditsReward,
        xp: player.xp + xpReward,
        hp: playerStats.hp,
      });
    } else {
      addLog(`Derrota... ${opponent.username} te ha vencido.`);
      updatePlayer({
        hp: playerStats.hp,
      });
    }
  };

  const handlePlayerAttack = () => {
    if (turn === "player" && !isAnimating && !battleEnded) {
      playerAttack();
    }
  };

  const handleDefend = () => {
    if (turn === "player" && !isAnimating && !battleEnded) {
      setIsAnimating(true);

      // Aumentar defensa temporalmente
      setPlayerStats(prev => ({ ...prev, defense: prev.defense + 10 }));
      addLog("Te preparas para defender el próximo ataque!");

      setTimeout(() => {
        setTurn("opponent");
        setTimeout(() => {
          opponentAttack();
          // Restaurar defensa
          setPlayerStats(prev => ({ ...prev, defense: prev.defense - 10 }));
        }, 1000);
        setIsAnimating(false);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Fondo de arena de duelo */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')`,
        }}
      />

      <div className="relative z-10 w-full max-w-6xl p-8">
        {/* Header del duelo */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 text-4xl font-bold uppercase tracking-wider text-red-400 sw-text-glow">
            ⚔️ Duelo PvP ⚔️
          </h1>
          <p className="text-xl text-slate-300">
            {playerStats.name} VS {opponentStats.name}
          </p>
        </motion.div>

        {/* Stats de combatientes */}
        <div className="mb-8 grid grid-cols-2 gap-8">
          {/* Jugador */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`sw-panel sw-glow-cyan relative p-6 ${
              turn === "player" && !battleEnded ? "ring-4 ring-cyan-500" : ""
            }`}
          >
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-600 text-3xl">
                👤
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold uppercase text-cyan-400">
                  {playerStats.name}
                </h3>
                <p className="text-sm text-slate-400">Nivel {player.level}</p>
              </div>
            </div>

            {/* HP Bar */}
            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm font-bold text-red-400">
                  <Heart className="h-4 w-4" />
                  HP
                </span>
                <span className="text-sm text-slate-300">
                  {playerStats.hp}/{playerStats.maxHp}
                </span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  animate={{ width: `${(playerStats.hp / playerStats.maxHp) * 100}%` }}
                  className="h-full bg-gradient-to-r from-red-600 to-red-400"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded bg-slate-800 p-2 text-center">
                <Swords className="mx-auto mb-1 h-4 w-4 text-red-400" />
                <p className="text-slate-400">Ataque</p>
                <p className="font-bold text-white">{playerStats.attack}</p>
              </div>
              <div className="rounded bg-slate-800 p-2 text-center">
                <Shield className="mx-auto mb-1 h-4 w-4 text-blue-400" />
                <p className="text-slate-400">Defensa</p>
                <p className="font-bold text-white">{playerStats.defense}</p>
              </div>
              <div className="rounded bg-slate-800 p-2 text-center">
                <Zap className="mx-auto mb-1 h-4 w-4 text-yellow-400" />
                <p className="text-slate-400">Agilidad</p>
                <p className="font-bold text-white">{playerStats.agility}</p>
              </div>
            </div>
          </motion.div>

          {/* Oponente */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`sw-panel sw-glow relative p-6 ${
              turn === "opponent" && !battleEnded ? "ring-4 ring-red-500" : ""
            }`}
          >
            <div className="mb-4 flex items-center gap-4">
              <img
                src={opponent.avatar}
                alt={opponent.username}
                className="h-16 w-16 rounded-full border-2 border-red-400"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold uppercase text-red-400">
                  {opponentStats.name}
                </h3>
                <p className="text-sm text-slate-400">Nivel {opponent.level}</p>
              </div>
            </div>

            {/* HP Bar */}
            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm font-bold text-red-400">
                  <Heart className="h-4 w-4" />
                  HP
                </span>
                <span className="text-sm text-slate-300">
                  {opponentStats.hp}/{opponentStats.maxHp}
                </span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  animate={{ width: `${(opponentStats.hp / opponentStats.maxHp) * 100}%` }}
                  className="h-full bg-gradient-to-r from-red-600 to-red-400"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded bg-slate-800 p-2 text-center">
                <Swords className="mx-auto mb-1 h-4 w-4 text-red-400" />
                <p className="text-slate-400">Ataque</p>
                <p className="font-bold text-white">{opponentStats.attack}</p>
              </div>
              <div className="rounded bg-slate-800 p-2 text-center">
                <Shield className="mx-auto mb-1 h-4 w-4 text-blue-400" />
                <p className="text-slate-400">Defensa</p>
                <p className="font-bold text-white">{opponentStats.defense}</p>
              </div>
              <div className="rounded bg-slate-800 p-2 text-center">
                <Zap className="mx-auto mb-1 h-4 w-4 text-yellow-400" />
                <p className="text-slate-400">Agilidad</p>
                <p className="font-bold text-white">{opponentStats.agility}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Log de combate */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sw-panel sw-glow mb-6 h-48 overflow-y-auto p-4"
        >
          <div className="space-y-2">
            {log.map((entry, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-sm text-slate-300"
              >
                {entry}
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* Botones de acción */}
        <AnimatePresence mode="wait">
          {!battleEnded ? (
            <motion.div
              key="actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center gap-4"
            >
              <button
                onClick={handlePlayerAttack}
                disabled={turn !== "player" || isAnimating}
                className={`sw-button flex items-center gap-2 px-8 py-3 ${
                  turn !== "player" || isAnimating
                    ? "cursor-not-allowed opacity-50"
                    : "hover:scale-105"
                }`}
              >
                <Swords className="h-5 w-5" />
                Atacar
              </button>
              <button
                onClick={handleDefend}
                disabled={turn !== "player" || isAnimating}
                className={`sw-button-cyan flex items-center gap-2 px-8 py-3 ${
                  turn !== "player" || isAnimating
                    ? "cursor-not-allowed opacity-50"
                    : "hover:scale-105"
                }`}
              >
                <Shield className="h-5 w-5" />
                Defender
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1 }}
                className="mx-auto mb-4"
              >
                {playerWon ? (
                  <Trophy className="mx-auto h-24 w-24 text-yellow-400" />
                ) : (
                  <X className="mx-auto h-24 w-24 text-red-400" />
                )}
              </motion.div>
              <h2
                className={`mb-4 text-3xl font-bold uppercase ${
                  playerWon ? "text-green-400" : "text-red-400"
                }`}
              >
                {playerWon ? "¡Victoria!" : "Derrota"}
              </h2>
              <button
                onClick={() => onComplete(playerWon)}
                className="sw-button-cyan px-8 py-3"
              >
                Continuar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
