"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";
import { GameCard } from "@/components/game-card";
import { type Card } from "@/data/cards";

interface GiftPackProps {
  cards: Card[];
  onOpened: () => void;
  isOpened: boolean;
}

export function GiftPack({ cards, onOpened, isOpened }: GiftPackProps) {
  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.button
            key="pack"
            type="button"
            onClick={onOpened}
            initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.3, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex h-72 w-56 flex-col items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-slate-900 text-white shadow-2xl border border-indigo-700/50 animate-pulse"
          >
            {/* shimmer sweep */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer" />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Gift className="h-24 w-24 drop-shadow-lg" strokeWidth={1.4} />
            </motion.div>
            <p className="mt-4 text-lg font-bold">Starter Pack</p>
            <p className="text-xs text-white/70">Toca para abrir</p>
            <Sparkles className="absolute right-5 top-6 h-5 w-5 text-amber-300 animate-pulse" />
            <Sparkles className="absolute bottom-8 left-6 h-4 w-4 text-amber-200 animate-pulse" />
          </motion.button>
        ) : (
          <motion.div
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {cards.map((card, i) => (
              <motion.div
                key={card.name}
                initial={{ y: 40, opacity: 0, rotate: -6 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 200 }}
              >
                <GameCard card={card} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
