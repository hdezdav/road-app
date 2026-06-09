import {
  ShieldCheck,
  KeyRound,
  Layers,
  FileCode2,
  Fingerprint,
  Database,
  Zap,
  Terminal,
  Lock,
  Flame,
  type LucideIcon
} from "lucide-react";

export interface Card {
  id: string;
  tokenId: number;
  name: string;
  type: string;
  rarity: "common" | "rare" | "epic" | "legendary" | string;
  description: string;
  image: string;
  tone: string;
  stats: {
    attack: number;
    defense: number;
    cost: number;
  };
  icon: LucideIcon;
  gradient: string;
  counters: Array<{ target: string; multiplier: number }>;
  attack?: number;
  defense?: number;
  energy?: number;
  nftTokenId?: number;
}

export const cardsCatalog: Card[] = [
  // === CARTAS DEL SOBRE INICIAL (ALIADOS / COUNTERS) ===
  {
    id: "anti-phishing",
    tokenId: 1,
    name: "Filtro Anti-Phishing",
    type: "Concepto",
    rarity: "common",
    description: "Analiza enlaces entrantes y contratos antes de firmar. Hace counter fulminante a interfaces clonadas.",
    image: "/images/cards/phishing-filter.png",
    tone: "mint",
    stats: { attack: 30, defense: 50, cost: 1 },
    icon: ShieldCheck,
    gradient: "from-emerald-400 to-teal-600",
    counters: [{ target: "hacker-phishing", multiplier: 2.0 }]
  },
  {
    id: "seed-phrase",
    tokenId: 2,
    name: "Frase Semilla Física",
    type: "Rare",
    rarity: "rare",
    description: "Tus 12 palabras escritas en papel real. Purga estados alterados, congela ciberataques y restaura tu sesión.",
    image: "/images/cards/seed-phrase.png",
    tone: "peach",
    stats: { attack: 0, defense: 90, cost: 3 },
    icon: KeyRound,
    gradient: "from-amber-400 to-orange-600",
    counters: [{ target: "ransomware-session", multiplier: 2.5 }]
  },
  {
    id: "l2-rollup",
    tokenId: 3,
    name: "Canal de Capa 2 (Rollup)",
    type: "Concepto",
    rarity: "common",
    description: "Procesa acciones fuera de la red principal. Reduce a cero el costo de energía (Gas) de tus cartas por 2 turnos.",
    image: "/images/cards/l2-rollup.png",
    tone: "lavender",
    stats: { attack: 20, defense: 20, cost: 1 },
    icon: Layers,
    gradient: "from-sky-400 to-blue-600",
    counters: [{ target: "gas-monster", multiplier: 2.0 }]
  },

  // === CARTAS DE ENEMIGOS / JEFES CAPTURABLES ===
  {
    id: "hacker-phishing",
    tokenId: 8,
    name: "Hacker Duplicador",
    type: "Legendary",
    rarity: "legendary",
    description: "Jefe de la Fase 1. Clona interfaces para robar llaves. Al capturarlo, duplica el efecto de tu próxima carta.",
    image: "/images/cards/hacker-phishing.png",
    tone: "peach",
    stats: { attack: 40, defense: 100, cost: 4 },
    icon: Terminal,
    gradient: "from-slate-700 to-slate-900",
    counters: []
  },
  {
    id: "ransomware-session",
    tokenId: 9,
    name: "Ransomware Interceptor",
    type: "Legendary",
    rarity: "legendary",
    description: "Jefe de la Fase 2. Secuestra sesiones activas y congela el mazo. Al capturarlo, puedes congelar al rival por un turno.",
    image: "/images/cards/ransomware.png",
    tone: "lavender",
    stats: { attack: 60, defense: 150, cost: 4 },
    icon: Lock,
    gradient: "from-red-800 to-stone-900",
    counters: []
  },
  {
    id: "gas-monster",
    tokenId: 10,
    name: "Monstruo del Gas Alto",
    type: "Legendary",
    rarity: "legendary",
    description: "Jefe de la Fase 3. Asfixia la red inundando el Mempool. Al capturarlo, reduce permanentemente el cooldown entre salas.",
    image: "/images/cards/gas-monster.png",
    tone: "mint",
    stats: { attack: 80, defense: 200, cost: 5 },
    icon: Flame,
    gradient: "from-amber-600 to-red-800",
    counters: []
  },

  // === EXTRA: CONCEPTOS FUNDAMENTALES (MAZO COMPLEMENTARIO) ===
  {
    id: "smart-contract",
    tokenId: 4,
    name: "Smart Contract Blindado",
    type: "Concepto",
    rarity: "common",
    description: "Código inmutable que ejecuta acuerdos automáticamente sin intermediarios. Ataque sólido y directo.",
    image: "/images/cards/smart-contract.png",
    tone: "lavender",
    stats: { attack: 45, defense: 30, cost: 2 },
    icon: FileCode2,
    gradient: "from-violet-500 to-indigo-700",
    counters: []
  },
  {
    id: "private-key",
    tokenId: 5,
    name: "Firma Digital (Llave Privada)",
    type: "Rare",
    rarity: "rare",
    description: "Autoriza tus movimientos criptográficos de forma legítima. Duplica tu daño si el contrato enemigo está expuesto.",
    image: "/images/cards/private-key.png",
    tone: "peach",
    stats: { attack: 60, defense: 10, cost: 2 },
    icon: Fingerprint,
    gradient: "from-pink-500 to-rose-600",
    counters: []
  },
  {
    id: "blockchain-ledger",
    tokenId: 6,
    name: "Libro Contable Inmutable",
    type: "Concepto",
    rarity: "common",
    description: "Registro distribuido copiado en miles de nodos. Revela de forma transparente las cartas ocultas del enemigo.",
    image: "/images/cards/ledger.png",
    tone: "mint",
    stats: { attack: 15, defense: 60, cost: 1 },
    icon: Database,
    gradient: "from-cyan-500 to-blue-700",
    counters: []
  },
  {
    id: "celo-speed",
    tokenId: 7,
    name: "Transacción Veloz Celo",
    type: "Legendary",
    rarity: "legendary",
    description: "Transacciones ultra rápidas en Celo usando zk-SNARKs. Te permite jugar 2 cartas ofensivas en el mismo turno.",
    image: "/images/cards/celo-speed.png",
    tone: "mint",
    stats: { attack: 70, defense: 40, cost: 3 },
    icon: Zap,
    gradient: "from-purple-500 to-fuchsia-600",
    counters: []
  }
];

// Map all flat properties for backwards compatibility
export const heroCards: Card[] = cardsCatalog.map(card => ({
  ...card,
  attack: card.stats.attack,
  defense: card.stats.defense,
  energy: card.stats.cost
}));

// Utility helper to search a card by ID
export const getCardById = (id: string) => cardsCatalog.find(card => card.id === id);
