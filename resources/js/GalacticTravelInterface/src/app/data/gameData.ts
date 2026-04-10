// Datos del juego

export interface SolarSystem {
  id: string;
  name: string;
  description: string;
  hostility: string;
  hostilityLevel: number; // 1-5 (1=Seguro, 5=Muy Peligroso)
  faction: string;
}

export interface CelestialBody {
  id: string;
  name: string;
  type: 'planet' | 'moon';
  race: string;
  hostility: string;
  hostilityLevel: number; // 1-5 (1=Seguro, 5=Muy Peligroso)
  faction: string;
  climate: string;
  color: string;
  size: number;
  orbitRadius?: number;
}

export interface Sector {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Building {
  id: string;
  name: string;
  type: string;
  icon: string;
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  dialogue: string[];
  missions: Mission[];
  items: Item[];
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  description: string;
}

// Sistemas Solares
export const solarSystems: SolarSystem[] = [
  {
    id: 'sol',
    name: 'Sistema Solar',
    description: 'Sistema principal',
    hostility: 'Facción: Jedi',
    hostilityLevel: 1,
    faction: 'Jedi'
  },
  {
    id: 'alpha-centauri',
    name: 'Alpha Centauri',
    description: 'Sistema cercano',
    hostility: 'Facción: Comerciantes',
    hostilityLevel: 2,
    faction: 'Comerciantes'
  },
  {
    id: 'sirius',
    name: 'Sirius',
    description: 'Sistema binario',
    hostility: 'Facción: Imperio',
    hostilityLevel: 5,
    faction: 'Imperio'
  }
];

// Cuerpos celestes por sistema solar
export const celestialBodies: { [systemId: string]: CelestialBody[] } = {
  sol: [
    {
      id: 'tierra',
      name: 'Tierra',
      type: 'planet',
      race: 'Humanos',
      hostility: 'Baja',
      hostilityLevel: 1,
      faction: 'Alianza',
      climate: 'Templado',
      color: '#3b82f6',
      size: 80,
      orbitRadius: 200
    },
    {
      id: 'marte',
      name: 'Marte',
      type: 'planet',
      race: 'Colonos',
      hostility: 'Media',
      hostilityLevel: 3,
      faction: 'Neutral',
      climate: 'Árido',
      color: '#ef4444',
      size: 60,
      orbitRadius: 280
    },
    {
      id: 'jupiter',
      name: 'Júpiter',
      type: 'planet',
      race: 'N/A',
      hostility: 'Alta',
      hostilityLevel: 5,
      faction: 'Desconocida',
      climate: 'Gaseoso',
      color: '#f59e0b',
      size: 120,
      orbitRadius: 380
    },
    {
      id: 'luna',
      name: 'Luna',
      type: 'moon',
      race: 'Humanos',
      hostility: 'Baja',
      hostilityLevel: 1,
      faction: 'Alianza',
      climate: 'Árido',
      color: '#9ca3af',
      size: 40,
      orbitRadius: 240
    }
  ],
  'alpha-centauri': [
    {
      id: 'proxima-b',
      name: 'Proxima B',
      type: 'planet',
      race: 'Alienígenas',
      hostility: 'Media',
      hostilityLevel: 3,
      faction: 'Comerciantes',
      climate: 'Tropical',
      color: '#10b981',
      size: 70,
      orbitRadius: 220
    },
    {
      id: 'proxima-c',
      name: 'Proxima C',
      type: 'planet',
      race: 'Robots',
      hostility: 'Baja',
      hostilityLevel: 1,
      faction: 'Comerciantes',
      climate: 'Helado',
      color: '#06b6d4',
      size: 90,
      orbitRadius: 300
    }
  ],
  sirius: [
    {
      id: 'sirius-prime',
      name: 'Sirius Prime',
      type: 'planet',
      race: 'Imperio',
      hostility: 'Alta',
      hostilityLevel: 5,
      faction: 'Imperio',
      climate: 'Volcánico',
      color: '#dc2626',
      size: 100,
      orbitRadius: 250
    }
  ]
};

// Sectores por planeta/luna
export const sectors: { [bodyId: string]: Sector[] } = {
  tierra: [
    { id: 'norte', name: 'Sector Norte', description: 'Zona industrial', color: '#3b82f6' },
    { id: 'sur', name: 'Sector Sur', description: 'Zona residencial', color: '#10b981' },
    { id: 'este', name: 'Sector Este', description: 'Zona comercial', color: '#f59e0b' },
    { id: 'oeste', name: 'Sector Oeste', description: 'Zona militar', color: '#ef4444' }
  ],
  marte: [
    { id: 'olympus', name: 'Monte Olympus', description: 'Base científica', color: '#dc2626' },
    { id: 'valles', name: 'Valles Marineris', description: 'Colonia minera', color: '#f59e0b' },
    { id: 'polar', name: 'Casquete Polar', description: 'Estación de hielo', color: '#06b6d4' }
  ],
  luna: [
    { id: 'crater', name: 'Cráter Central', description: 'Puerto espacial', color: '#6b7280' },
    { id: 'base', name: 'Base Lunar', description: 'Complejo habitacional', color: '#9ca3af' }
  ],
  'proxima-b': [
    { id: 'jungle', name: 'Selva Verde', description: 'Zona natural', color: '#10b981' },
    { id: 'city', name: 'Ciudad Capital', description: 'Centro urbano', color: '#8b5cf6' }
  ],
  'proxima-c': [
    { id: 'factory', name: 'Complejo Industrial', description: 'Fábricas de robots', color: '#64748b' }
  ],
  'sirius-prime': [
    { id: 'fortress', name: 'Fortaleza Imperial', description: 'Sede del Imperio', color: '#dc2626' },
    { id: 'mines', name: 'Minas de Cristal', description: 'Extracción de recursos', color: '#a855f7' }
  ],
  jupiter: [
    { id: 'station', name: 'Estación Orbital', description: 'Base flotante', color: '#f59e0b' }
  ]
};

// Edificios por sector
export const buildings: { [sectorId: string]: Building[] } = {
  norte: [
    { id: 'factory1', name: 'Fábrica de Componentes', type: 'Industria', icon: 'Factory' },
    { id: 'warehouse1', name: 'Almacén Central', type: 'Almacén', icon: 'Warehouse' },
    { id: 'lab1', name: 'Laboratorio Tech', type: 'Investigación', icon: 'FlaskConical' }
  ],
  sur: [
    { id: 'market1', name: 'Mercado de la Paz', type: 'Comercio', icon: 'Store' },
    { id: 'hospital1', name: 'Centro Médico', type: 'Salud', icon: 'Heart' },
    { id: 'cantina1', name: 'Cantina del Viajero', type: 'Social', icon: 'Beer' }
  ],
  este: [
    { id: 'trade1', name: 'Centro de Comercio', type: 'Comercio', icon: 'Coins' },
    { id: 'bank1', name: 'Banco Galáctico', type: 'Finanzas', icon: 'Landmark' },
    { id: 'shop1', name: 'Tienda de Equipamiento', type: 'Tienda', icon: 'ShoppingBag' }
  ],
  oeste: [
    { id: 'barracks1', name: 'Cuartel Militar', type: 'Militar', icon: 'Shield' },
    { id: 'armory1', name: 'Armería', type: 'Armamento', icon: 'Sword' },
    { id: 'hq1', name: 'Comando Central', type: 'Mando', icon: 'Castle' }
  ],
  olympus: [
    { id: 'research1', name: 'Centro de Investigación', type: 'Ciencia', icon: 'Microscope' },
    { id: 'observatory1', name: 'Observatorio', type: 'Astronomía', icon: 'Telescope' }
  ],
  valles: [
    { id: 'mine1', name: 'Mina Principal', type: 'Minería', icon: 'Pickaxe' },
    { id: 'refinery1', name: 'Refinería', type: 'Procesamiento', icon: 'Factory' }
  ],
  polar: [
    { id: 'ice-station', name: 'Estación Polar', type: 'Investigación', icon: 'Snowflake' }
  ],
  crater: [
    { id: 'spaceport1', name: 'Puerto Espacial', type: 'Transporte', icon: 'Rocket' },
    { id: 'hangar1', name: 'Hangar de Naves', type: 'Naves', icon: 'Plane' }
  ],
  base: [
    { id: 'habitat1', name: 'Módulo Habitacional', type: 'Vivienda', icon: 'Home' },
    { id: 'gym1', name: 'Centro de Entrenamiento', type: 'Entrenamiento', icon: 'Dumbbell' }
  ],
  jungle: [
    { id: 'outpost1', name: 'Puesto Avanzado', type: 'Exploración', icon: 'Tent' },
    { id: 'research2', name: 'Estación Biológica', type: 'Biología', icon: 'Leaf' }
  ],
  city: [
    { id: 'palace1', name: 'Palacio del Gobernador', type: 'Gobierno', icon: 'Crown' },
    { id: 'market2', name: 'Mercado Alien', type: 'Comercio', icon: 'Store' }
  ],
  factory: [
    { id: 'assembly1', name: 'Línea de Ensamblaje', type: 'Producción', icon: 'Cog' },
    { id: 'ai-core', name: 'Núcleo IA', type: 'Tecnología', icon: 'Cpu' }
  ],
  fortress: [
    { id: 'throne1', name: 'Sala del Trono', type: 'Poder', icon: 'Crown' },
    { id: 'prison1', name: 'Prisión Imperial', type: 'Seguridad', icon: 'Lock' }
  ],
  mines: [
    { id: 'crystal-mine', name: 'Mina de Cristales', type: 'Extracción', icon: 'Gem' }
  ],
  station: [
    { id: 'control1', name: 'Centro de Control', type: 'Mando', icon: 'Radio' }
  ]
};

// NPCs por edificio
export const npcs: { [buildingId: string]: NPC[] } = {
  market1: [
    {
      id: 'merchant1',
      name: 'Zara la Comerciante',
      role: 'Vendedora',
      dialogue: [
        '¡Bienvenido viajero! Tengo los mejores precios de la galaxia.',
        '¿Buscas algo especial? Quizás tengo lo que necesitas.',
        'Los tiempos están difíciles, pero siempre hay oportunidades para el comercio.'
      ],
      missions: [
        {
          id: 'trade1',
          title: 'Ruta Comercial',
          description: 'Necesito que entregues un paquete a Marte. Te pagaré bien.',
          reward: '500 créditos'
        }
      ],
      items: [
        { id: 'medkit', name: 'Kit Médico', price: 50, description: 'Restaura 50 puntos de salud' },
        { id: 'rations', name: 'Raciones', price: 20, description: 'Comida para el viaje' },
        { id: 'scanner', name: 'Scanner Básico', price: 150, description: 'Detecta recursos cercanos' }
      ]
    },
    {
      id: 'info-broker',
      name: 'Sombra',
      role: 'Informante',
      dialogue: [
        'Tengo información que podría interesarte... por un precio.',
        'He oído rumores sobre algo grande en el Sector Oeste.',
        'La información es poder, y yo tengo mucho de ambos.'
      ],
      missions: [
        {
          id: 'intel1',
          title: 'Espionaje',
          description: 'Necesito que investigues las actividades en el Cuartel Militar.',
          reward: 'Información valiosa + 300 créditos'
        }
      ],
      items: [
        { id: 'map', name: 'Mapa Estelar', price: 100, description: 'Revela ubicaciones secretas' },
        { id: 'codes', name: 'Códigos de Acceso', price: 250, description: 'Acceso a áreas restringidas' }
      ]
    }
  ],
  cantina1: [
    {
      id: 'bartender1',
      name: 'Rex el Cantinero',
      role: 'Cantinero',
      dialogue: [
        '¿Qué te sirvo, viajero? Tenemos de todo.',
        'Esta cantina ha visto pasar muchas historias...',
        'Si buscas trabajo, habla con los clientes. Siempre hay alguien con un problema.'
      ],
      missions: [],
      items: [
        { id: 'drink1', name: 'Bebida Energética', price: 15, description: 'Recupera energía' },
        { id: 'info', name: 'Rumores Locales', price: 30, description: 'Información sobre misiones' }
      ]
    }
  ],
  armory1: [
    {
      id: 'weapons-dealer',
      name: 'Comandante Kross',
      role: 'Maestro de Armas',
      dialogue: [
        'Solo vendo a quien demuestre su valor.',
        'Estas armas no son juguetes. Son herramientas de supervivencia.',
        'El Imperio siempre está buscando reclutas. ¿Interesado?'
      ],
      missions: [
        {
          id: 'combat1',
          title: 'Prueba de Combate',
          description: 'Derrota a 10 enemigos en el simulador de combate.',
          reward: 'Arma básica + 200 créditos'
        }
      ],
      items: [
        { id: 'pistol', name: 'Pistola Láser', price: 300, description: 'Arma básica de energía' },
        { id: 'rifle', name: 'Rifle de Plasma', price: 800, description: 'Arma avanzada' },
        { id: 'armor', name: 'Armadura Ligera', price: 500, description: '+20 puntos de defensa' }
      ]
    }
  ],
  spaceport1: [
    {
      id: 'pilot1',
      name: 'Capitana Nova',
      role: 'Piloto',
      dialogue: [
        'Necesitas un transporte rápido? Soy la mejor piloto de la Luna.',
        'He volado por toda la galaxia. No hay lugar al que no pueda llevarte.',
        'El espacio es peligroso, pero también hermoso.'
      ],
      missions: [
        {
          id: 'escort1',
          title: 'Misión de Escolta',
          description: 'Acompáñame en una misión de transporte peligrosa.',
          reward: '600 créditos + experiencia de vuelo'
        }
      ],
      items: [
        { id: 'fuel', name: 'Combustible Extra', price: 80, description: 'Para viajes largos' },
        { id: 'navigation', name: 'Sistema de Navegación', price: 400, description: 'Mejora la navegación' }
      ]
    }
  ],
  research1: [
    {
      id: 'scientist1',
      name: 'Dr. Vex',
      role: 'Científico Jefe',
      dialogue: [
        'Estamos al borde de un gran descubrimiento.',
        'La ciencia es la clave para entender el universo.',
        'Necesitamos más muestras para continuar nuestra investigación.'
      ],
      missions: [
        {
          id: 'research-mission1',
          title: 'Recolección de Muestras',
          description: 'Recolecta 5 muestras minerales de diferentes planetas.',
          reward: 'Tecnología avanzada + 400 créditos'
        }
      ],
      items: [
        { id: 'analyzer', name: 'Analizador Científico', price: 350, description: 'Analiza muestras' },
        { id: 'upgrade', name: 'Mejora de Escáner', price: 450, description: 'Mejora tu escáner' }
      ]
    }
  ],
  palace1: [
    {
      id: 'governor',
      name: 'Gobernador Xal',
      role: 'Líder Planetario',
      dialogue: [
        'Bienvenido a nuestro mundo. Espero que tus intenciones sean pacíficas.',
        'Nuestro pueblo ha prosperado gracias al comercio intergaláctico.',
        'Si demuestras ser digno de confianza, podría tener trabajo para ti.'
      ],
      missions: [
        {
          id: 'diplomatic1',
          title: 'Misión Diplomática',
          description: 'Entrega un mensaje importante al líder de otro sistema.',
          reward: '1000 créditos + reputación'
        }
      ],
      items: [
        { id: 'permit', name: 'Permiso Diplomático', price: 500, description: 'Acceso a zonas diplomáticas' }
      ]
    }
  ],
  throne1: [
    {
      id: 'emperor',
      name: 'Lord Vador',
      role: 'Emperador',
      dialogue: [
        'Has mostrado valentía al venir aquí.',
        'El Imperio recompensa a quienes sirven fielmente.',
        'Únete a nosotros o enfréntate a las consecuencias.'
      ],
      missions: [
        {
          id: 'imperial1',
          title: 'Misión Imperial',
          description: 'Elimina a los rebeldes que amenazan al Imperio.',
          reward: '1500 créditos + rango imperial'
        }
      ],
      items: [
        { id: 'imperial-badge', name: 'Insignia Imperial', price: 1000, description: 'Símbolo del Imperio' }
      ]
    }
  ]
};