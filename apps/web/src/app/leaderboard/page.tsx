"use client";

import { motion } from "framer-motion";
import { BarChart3, Sparkles } from "lucide-react";

import { BgGradient } from "@/components/ui/bg-gradient";

/**
 * Leaderboard temporalmente en "Coming Soon".
 *
 * Decisión de producto: la versión previa leía rankings on-chain de forma
 * que no escalaba bien (lectura por wallet en cada render) y la UX no
 * convencía. Mantenemos la ruta para no romper enlaces del navbar, pero
 * mostramos un placeholder hasta que tengamos:
 *   1. Un indexer/subgraph para Celo que agregue puntuaciones.
 *   2. Diseño de UI estable (top N, filtros por fase, etc.).
 *
 * No se importan hooks de wagmi aquí adrede: así la página es estática y
 * no fuerza al usuario a conectar wallet ni dispara llamadas RPC a Forno.
 */
export default function LeaderboardPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden px-6 py-12">
      <BgGradient
        gradientFrom="#ffffff"
        gradientTo="#c3b8ff"
        gradientStop="30%"
        gradientPosition="50% 0%"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex max-w-xl flex-col items-center text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm">
          <Sparkles className="h-4 w-4" /> Próximamente
        </span>

        <div className="mt-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl">
          <BarChart3 className="h-12 w-12 text-white" />
        </div>

        <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-slate-800 md:text-5xl">
          Leaderboard{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
            Coming Soon
          </span>
        </h1>

        <p className="mt-4 text-lg text-slate-500">
          Estamos preparando una tabla de clasificación on-chain con las mejores
          jugadoras y jugadores de Road App. Vuelve pronto para competir por el
          primer lugar.
        </p>

        <p className="mt-6 text-sm text-slate-400">
          Mientras tanto, sigue ganando combates: tu progreso queda registrado
          en Celo y contará cuando lancemos el ranking.
        </p>
      </motion.div>
    </div>
  );
}
