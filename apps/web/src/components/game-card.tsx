"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Shield, Swords, Zap } from "lucide-react";
import { type Card } from "@/data/cards";

const rarityRing: Record<string, string> = {
  Común: "ring-slate-300",
  common: "ring-slate-300",
  Rara: "ring-sky-400",
  rare: "ring-sky-400",
  Épica: "ring-fuchsia-400",
  epic: "ring-fuchsia-400",
  Legendaria: "ring-amber-400",
  legendary: "ring-amber-400",
};

const rarityBadge: Record<string, string> = {
  Común: "bg-slate-100 text-slate-600",
  common: "bg-slate-100 text-slate-600",
  Rara: "bg-sky-100 text-sky-700",
  rare: "bg-sky-100 text-sky-700",
  Épica: "bg-fuchsia-100 text-fuchsia-700",
  epic: "bg-fuchsia-100 text-fuchsia-700",
  Legendaria: "bg-amber-100 text-amber-700",
  legendary: "bg-amber-100 text-amber-700",
};

interface GameCardProps {
  card: Card;
  className?: string;
  style?: any;
}

export function GameCard({ card, className, style }: GameCardProps) {
  const Icon = card.icon;
  
  // Extract stats supporting both new nested format and legacy format
  const attack = card.stats?.attack ?? card.attack ?? 0;
  const defense = card.stats?.defense ?? card.defense ?? 0;
  const energy = card.stats?.cost ?? card.energy ?? 0;
  
  // Format rarity label for display
  const rarityLabel = 
    card.rarity === "common" ? "Común" : 
    card.rarity === "rare" ? "Rara" : 
    card.rarity === "epic" ? "Épica" : 
    card.rarity === "legendary" ? "Legendaria" : 
    card.rarity;

  return (
    <motion.div
      style={style}
      whileHover={{ y: -14, rotateZ: 0, scale: 1.04 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      className={cn(
        "relative w-40 sm:w-56 select-none overflow-hidden rounded-2xl bg-white p-2 shadow-2xl ring-2",
        rarityRing[card.rarity] || "ring-slate-300",
        className
      )}
    >
      {/* Art panel */}
      <div
        className={cn(
          "relative flex h-28 sm:h-36 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br",
          card.gradient
        )}
      >
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_40%)]" />
        {Icon ? (
          <Icon className="h-12 w-12 sm:h-16 sm:w-16 text-white drop-shadow-lg" strokeWidth={1.5} />
        ) : (
          <span className="text-4xl text-white">🎴</span>
        )}

        <span className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm font-bold text-slate-800 shadow">
          {energy}
        </span>
        <span
          className={cn(
            "absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
            rarityBadge[card.rarity] || "bg-slate-100 text-slate-600"
          )}
        >
          {rarityLabel}
        </span>
      </div>

      {/* Body */}
      <div className="px-1.5 pb-1.5 pt-2 text-left">
        <h3 className="text-sm font-bold leading-tight text-slate-800">
          {card.name}
        </h3>
        <p className="text-[11px] font-medium uppercase tracking-wide text-primary">
          {card.type}
        </p>
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-slate-500">
          {card.description}
        </p>

        <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-xs font-semibold">
          <span className="flex items-center gap-1 text-rose-500">
            <Swords className="h-3.5 w-3.5" /> {attack}
          </span>
          <span className="flex items-center gap-1 text-sky-500">
            <Shield className="h-3.5 w-3.5" /> {defense}
          </span>
          <span className="flex items-center gap-1 text-amber-500">
            <Zap className="h-3.5 w-3.5" /> {energy}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
