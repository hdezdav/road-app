"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAccount } from "wagmi";
import { Gift, PackageOpen } from "lucide-react";

import { BgGradient } from "@/components/ui/bg-gradient";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/game-card";
import { useInventory } from "@/context/InventoryContext";

export default function CardsPage() {
  const { isConnected } = useAccount();
  const { ownedCards, hasOpenedPack } = useInventory();

  return (
    <div className="relative min-h-[calc(100vh-64px)] px-4 py-16 sm:px-6">
      <BgGradient
        gradientFrom="#ffffff"
        gradientTo="#c3b8ff"
        gradientStop="42%"
        gradientPosition="50% 8%"
      />

      <div className="mx-auto max-w-6xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-800 shadow-sm backdrop-blur"
        >
          <Gift className="h-4 w-4 text-indigo-600" /> Colección de Cartas
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl md:text-5xl"
        >
          Tu mazo de <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">Conocimiento</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-xl text-slate-500"
        >
          {isConnected
            ? ownedCards.length > 0
              ? `Tienes ${ownedCards.length} carta${ownedCards.length !== 1 ? "s" : ""} NFT en tu wallet.`
              : "Aún no tienes cartas. ¡Abre tu primer sobre para empezar!"
            : "Conecta tu wallet para visualizar tu colección de cartas NFT reales en Celo."}
        </motion.p>
      </div>

      <div className="mx-auto mt-16 max-w-6xl">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-dashed border-slate-200 bg-white/50 backdrop-blur">
            <span className="text-4xl mb-4">🔒</span>
            <h3 className="text-lg font-bold text-slate-800">Wallet no conectada</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs text-center">
              Conecta tu wallet para visualizar tu colección de cartas NFT reales en Celo.
            </p>
          </div>
        ) : ownedCards.length === 0 ? (
          /* Empty state — no cards yet */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-16 rounded-2xl border border-dashed border-slate-200 bg-white/50 backdrop-blur"
          >
            <PackageOpen className="h-16 w-16 text-slate-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-800">
              Tu colección está vacía
            </h3>
            <p className="text-sm text-slate-500 mt-2 max-w-sm text-center">
              Aún no tienes cartas NFT. Abre tu primer sobre de regalo para
              recibir tu mazo inicial de 4 cartas.
            </p>
            <Button
              asChild
              className="mt-6 shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
            >
              <Link href="/pack">Abrir mi Sobre</Link>
            </Button>
          </motion.div>
        ) : (
          /* Card collection */
          <div className="grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
            {ownedCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <GameCard card={card} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-16 flex flex-wrap justify-center gap-3 px-2 sm:gap-4">
        <Button asChild variant="outline" className="bg-white/60 backdrop-blur rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50">
          <Link href="/">Volver al inicio</Link>
        </Button>
        {ownedCards.length > 0 && (
          <Button asChild className="shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
            <Link href="/battle">Ir a Combate</Link>
          </Button>
        )}
        {!hasOpenedPack && (
          <Button asChild className="shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
            <Link href="/pack">Abrir sobre</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
