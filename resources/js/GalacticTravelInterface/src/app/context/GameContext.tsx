import { createContext, useContext, useState, ReactNode } from 'react';

// Contexto principal del juego que maneja estadísticas, habilidades y economía
export interface Starship {
  id: string;
  name: string;
  type: string;
  price: number;
  speed: number; // 1-10
  cargo: number; // Capacidad de carga
  weapons: number; // 1-10
  description: string;
  image: string;
  owned: boolean;
}

export interface PlayerStats {
  health: number;
  maxHealth: number;
  strength: number; // 1-10 (Daño cuerpo a cuerpo)
  agility: number; // 1-10 (Evasión y precisión)
  defense: number; // 1-10 (Reducción de daño)
  experience: number;
  level: number;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  cooldown: number; // Turnos de espera
  currentCooldown: number;
  type: 'ground' | 'space';
  icon: string;
}

interface GameContextType {
  credits: number;
  hasOwnShip: boolean;
  currentShip: Starship | null;
  availableShips: Starship[];
  playerStats: PlayerStats;
  groundAbilities: Ability[];
  spaceAbilities: Ability[];
  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => boolean;
  buyShip: (shipId: string) => boolean;
  equipShip: (shipId: string) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  addExperience: (amount: number) => void;
  useAbility: (abilityId: string) => boolean;
  resetAbilityCooldowns: () => void;
  reduceAbilityCooldowns: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialShips: Starship[] = [
  {
    id: 'scout',
    name: 'Nave Explorador',
    type: 'Reconocimiento',
    price: 5000,
    speed: 8,
    cargo: 50,
    weapons: 3,
    description: 'Nave rápida y ágil, ideal para reconocimiento y viajes rápidos. Perfecta para empezar tu aventura.',
    image: 'https://images.unsplash.com/photo-1758685296030-d46ee930c898?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    owned: false,
  },
  {
    id: 'cargo',
    name: 'Transportista Pesado',
    type: 'Carga',
    price: 12000,
    speed: 4,
    cargo: 500,
    weapons: 2,
    description: 'Nave robusta con gran capacidad de carga. Ideal para comerciantes y misiones de transporte.',
    image: 'https://images.unsplash.com/photo-1657344956545-8f49e1b1f661?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    owned: false,
  },
  {
    id: 'interceptor',
    name: 'Interceptor Estelar',
    type: 'Velocidad',
    price: 8000,
    speed: 10,
    cargo: 30,
    weapons: 5,
    description: 'La nave más rápida de la galaxia. Excelente maniobrabilidad y velocidad máxima.',
    image: 'https://images.unsplash.com/photo-1762441112136-4dfc6edf58e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    owned: false,
  },
  {
    id: 'fighter',
    name: 'Caza Espacial',
    type: 'Combate',
    price: 15000,
    speed: 7,
    cargo: 100,
    weapons: 10,
    description: 'Nave de combate equipada con armamento pesado. Domina en batallas espaciales.',
    image: 'https://images.unsplash.com/photo-1731579884309-ecb947ca6144?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    owned: false,
  },
  {
    id: 'shuttle',
    name: 'Lanzadera Orbital',
    type: 'Transporte',
    price: 3000,
    speed: 5,
    cargo: 80,
    weapons: 1,
    description: 'Nave básica para transporte. Económica y confiable para viajes cortos.',
    image: 'https://images.unsplash.com/photo-1543000968-1fe3fd3b714e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    owned: false,
  },
];

export function GameProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState(10000); // Comienza con 10000 créditos para poder comprar naves
  const [ships, setShips] = useState<Starship[]>(initialShips);
  const [currentShip, setCurrentShip] = useState<Starship | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    health: 100,
    maxHealth: 100,
    strength: 5,
    agility: 5,
    defense: 5,
    experience: 0,
    level: 1,
  });

  const [groundAbilities, setGroundAbilities] = useState<Ability[]>([
    {
      id: 'force_push',
      name: 'Empuje de la Fuerza',
      description: 'Usa la Fuerza para empujar al enemigo, causando daño y aturdimiento.',
      cooldown: 3,
      currentCooldown: 0,
      type: 'ground',
      icon: '🌀',
    },
    {
      id: 'thermal_detonator',
      name: 'Detonador Térmico',
      description: 'Lanza una granada que causa daño masivo.',
      cooldown: 4,
      currentCooldown: 0,
      type: 'ground',
      icon: '💣',
    },
    {
      id: 'precision_shot',
      name: 'Disparo Preciso',
      description: 'Un disparo certero que ignora la defensa enemiga.',
      cooldown: 2,
      currentCooldown: 0,
      type: 'ground',
      icon: '🎯',
    },
    {
      id: 'combat_stim',
      name: 'Estimulante de Combate',
      description: 'Recupera salud y aumenta temporalmente tus atributos.',
      cooldown: 5,
      currentCooldown: 0,
      type: 'ground',
      icon: '💉',
    },
  ]);

  const [spaceAbilities, setSpaceAbilities] = useState<Ability[]>([
    {
      id: 'evasive_maneuver',
      name: 'Maniobra Evasiva',
      description: 'Realiza una maniobra que aumenta tus posibilidades de evadir el próximo ataque.',
      cooldown: 3,
      currentCooldown: 0,
      type: 'space',
      icon: '🌪️',
    },
    {
      id: 'weapon_overcharge',
      name: 'Sobrecarga de Armas',
      description: 'Sobrecarga tus armas para un ataque devastador.',
      cooldown: 4,
      currentCooldown: 0,
      type: 'space',
      icon: '⚡',
    },
    {
      id: 'emergency_shields',
      name: 'Escudos de Emergencia',
      description: 'Activa escudos que absorben daño durante un turno.',
      cooldown: 5,
      currentCooldown: 0,
      type: 'space',
      icon: '🛡️',
    },
    {
      id: 'torpedo_barrage',
      name: 'Salva de Torpedos',
      description: 'Lanza múltiples torpedos que causan daño garantizado.',
      cooldown: 3,
      currentCooldown: 0,
      type: 'space',
      icon: '🚀',
    },
  ]);

  const hasOwnShip = currentShip !== null;

  const addCredits = (amount: number) => {
    setCredits((prev) => prev + amount);
  };

  const spendCredits = (amount: number): boolean => {
    if (credits >= amount) {
      setCredits((prev) => prev - amount);
      return true;
    }
    return false;
  };

  const buyShip = (shipId: string): boolean => {
    const ship = ships.find((s) => s.id === shipId);
    if (!ship || ship.owned) return false;

    if (credits >= ship.price) {
      setCredits((prev) => prev - ship.price);
      setShips((prev) =>
        prev.map((s) => (s.id === shipId ? { ...s, owned: true } : s))
      );
      
      // Si es la primera nave, equiparla automáticamente
      if (!currentShip) {
        setCurrentShip({ ...ship, owned: true });
      }
      
      return true;
    }
    return false;
  };

  const equipShip = (shipId: string) => {
    const ship = ships.find((s) => s.id === shipId && s.owned);
    if (ship) {
      setCurrentShip(ship);
    }
  };

  const takeDamage = (amount: number) => {
    setPlayerStats((prev) => ({
      ...prev,
      health: Math.max(0, prev.health - amount),
    }));
  };

  const heal = (amount: number) => {
    setPlayerStats((prev) => ({
      ...prev,
      health: Math.min(prev.maxHealth, prev.health + amount),
    }));
  };

  const addExperience = (amount: number) => {
    setPlayerStats((prev) => {
      const newExp = prev.experience + amount;
      const expForNextLevel = prev.level * 100;

      if (newExp >= expForNextLevel) {
        // Subir de nivel
        const remainingExp = newExp - expForNextLevel;
        return {
          ...prev,
          experience: remainingExp,
          level: prev.level + 1,
          maxHealth: prev.maxHealth + 10,
          health: prev.maxHealth + 10,
          strength: prev.strength + 1,
          agility: prev.agility + 1,
          defense: prev.defense + 1,
        };
      }

      return { ...prev, experience: newExp };
    });
  };

  const useAbility = (abilityId: string): boolean => {
    // Verificar si la habilidad existe y está disponible
    const groundAbility = groundAbilities.find((a) => a.id === abilityId);
    const spaceAbility = spaceAbilities.find((a) => a.id === abilityId);
    const ability = groundAbility || spaceAbility;

    if (!ability || ability.currentCooldown > 0) {
      return false;
    }

    // Activar cooldown de la habilidad usada
    if (groundAbility) {
      setGroundAbilities((prev) =>
        prev.map((a) =>
          a.id === abilityId ? { ...a, currentCooldown: a.cooldown } : a
        )
      );
    } else if (spaceAbility) {
      setSpaceAbilities((prev) =>
        prev.map((a) =>
          a.id === abilityId ? { ...a, currentCooldown: a.cooldown } : a
        )
      );
    }

    return true;
  };

  const resetAbilityCooldowns = () => {
    setGroundAbilities((prev) =>
      prev.map((a) => ({ ...a, currentCooldown: 0 }))
    );
    setSpaceAbilities((prev) =>
      prev.map((a) => ({ ...a, currentCooldown: 0 }))
    );
  };

  const reduceAbilityCooldowns = () => {
    setGroundAbilities((prev) =>
      prev.map((a) => ({
        ...a,
        currentCooldown: Math.max(0, a.currentCooldown - 1),
      }))
    );
    setSpaceAbilities((prev) =>
      prev.map((a) => ({
        ...a,
        currentCooldown: Math.max(0, a.currentCooldown - 1),
      }))
    );
  };

  return (
    <GameContext.Provider
      value={{
        credits,
        hasOwnShip,
        currentShip,
        availableShips: ships,
        playerStats,
        groundAbilities,
        spaceAbilities,
        addCredits,
        spendCredits,
        buyShip,
        equipShip,
        takeDamage,
        heal,
        addExperience,
        useAbility,
        resetAbilityCooldowns,
        reduceAbilityCooldowns,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}