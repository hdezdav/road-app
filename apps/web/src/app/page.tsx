"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  Trophy, 
  Wallet, 
  Layers, 
  Swords,
  ChevronDown
} from "lucide-react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { BgGradient } from "@/components/ui/bg-gradient";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/game-card";
import { heroCards } from "@/data/cards";

const fanCards = heroCards.slice(0, 3);
const fanLayout = [
  { rotate: -14, x: -150, y: 24, z: 10 },
  { rotate: 0, x: 0, y: -10, z: 30 },
  { rotate: 14, x: 150, y: 24, z: 10 },
];

export default function LandingPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [loading, setLoading] = useState(false);
  const [isMiniPay, setIsMiniPay] = useState(false);

  // Detección de MiniPay (Celopedia §1 "Seamless User Experience" / Zero-Click
  // Connect). Dentro de MiniPay, `wallet-provider.tsx` ya auto-conecta el
  // injected provider; aquí lo usamos solo para ocultar el botón "Conectar
  // Wallet" y evitar la fricción extra que MiniPay explícitamente prohíbe.
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum?.isMiniPay) {
      setIsMiniPay(true);
    }
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    try {
      if (openConnectModal) {
        openConnectModal();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // En MiniPay nunca pedimos "Conectar Wallet" — el provider ya está
  // disponible; el CTA salta directo a abrir el sobre.
  const cta = isConnected || isMiniPay
    ? () => router.push("/pack")
    : handleConnect;

  const tutorialSteps = [
    {
      icon: Wallet,
      title: "La Wallet",
      subtitle: "Es tu Inventario",
      text: "No es solo una billetera. Es tu mochila criptográfica donde se guardan tus cartas (NFTs). Tú tienes el control absoluto de lo que hay dentro.",
      color: "text-blue-500",
      bg: "bg-blue-100",
      borderColor: "border-blue-200"
    },
    {
      icon: Layers,
      title: "Las Cripto",
      subtitle: "Son tus Cartas",
      text: "Los tokens y activos digitales aquí toman forma de cartas. Cada carta que posees tiene una utilidad única y te pertenece de forma comprobable.",
      color: "text-purple-500",
      bg: "bg-purple-100",
      borderColor: "border-purple-200"
    },
    {
      icon: Swords,
      title: "La Blockchain",
      subtitle: "Es el Combate",
      text: "El campo de batalla es la red pública Celo. Cada movimiento táctico que realizas requiere firmar una transacción real y queda registrado para siempre.",
      color: "text-orange-500",
      bg: "bg-orange-100",
      borderColor: "border-orange-200"
    }
  ];

  return (
    <div className={`relative h-[calc(100vh-64px)] w-full overflow-x-hidden overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isConnected ? "snap-y snap-mandatory" : ""}`}>
      
      {/* Fondo fijo */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <BgGradient
          gradientFrom="#ffffff"
          gradientTo="#c3b8ff"
          gradientStop="38%"
          gradientPosition="50% 0%"
        />
      </div>

      {isConnected ? (
        /* =========================================================
           ESTADO LOGGEADO: SCROLL STORYTELLING TUTORIAL
           ========================================================= */
        <div className="flex w-full flex-col">
          
          {/* PANTALLA 1: Bienvenida */}
          <section className="flex h-[calc(100vh-64px)] w-full shrink-0 snap-center flex-col items-center justify-center px-6 text-center relative">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-1.5 text-sm font-bold text-emerald-600 shadow-sm backdrop-blur"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Wallet Conectada con Éxito
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-8 text-3xl font-extrabold leading-tight tracking-tight text-slate-800 sm:text-5xl md:text-7xl"
            >
              Bienvenido al mundo Web3.<br />
              <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">Aquí están las reglas.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl"
            >
              Antes de abrir tu primer sobre, descubre cómo se conectan los conceptos del juego con la tecnología real.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-8 flex flex-col items-center gap-2 sm:bottom-12"
            >
              <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Haz scroll para aprender</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <ChevronDown className="h-8 w-8 text-indigo-600" />
              </motion.div>
            </motion.div>
          </section>

          {/* PANTALLAS 2, 3 y 4: Las Analogías */}
          {tutorialSteps.map((step) => (
            <section 
              key={step.title}
              className="flex h-[calc(100vh-64px)] w-full shrink-0 snap-center flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-20"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`flex max-w-3xl flex-col items-center rounded-[2rem] border ${step.borderColor} bg-white/60 p-6 shadow-xl backdrop-blur-md sm:p-12`}
              >
                <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-3xl ${step.bg} sm:mb-8 sm:h-24 sm:w-24`}>
                  <step.icon className={`h-10 w-10 ${step.color} sm:h-12 sm:w-12`} />
                </div>
                
                <h2 className="text-3xl font-extrabold text-slate-800 sm:text-4xl md:text-6xl">{step.title}</h2>
                <p className="mt-2 text-base font-bold uppercase tracking-widest text-indigo-600 sm:text-lg">{step.subtitle}</p>
                <p className="mt-6 text-lg leading-relaxed text-slate-600 sm:mt-8 sm:text-xl md:text-2xl">
                  {step.text}
                </p>
              </motion.div>
            </section>
          ))}

          {/* PANTALLA 5: Call To Action Final */}
          <section className="flex h-[calc(100vh-64px)] w-full shrink-0 snap-center flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              className="flex max-w-2xl flex-col items-center"
            >
              <Trophy className="mb-6 h-16 w-16 text-yellow-500 drop-shadow-md sm:h-20 sm:w-20" />
              <h2 className="text-4xl font-extrabold text-slate-800 sm:text-5xl md:text-6xl">Todo listo.</h2>
              <p className="mt-6 text-xl text-slate-600 sm:text-2xl">
                Ya conoces las reglas básicas. Es momento de armar tu mazo y prepararte para el combate.
              </p>

              <div className="mt-10 w-full sm:mt-12 sm:w-auto">
                <Button
                  size="lg"
                  onClick={cta}
                  className="group relative inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-8 text-lg font-bold text-white shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 hover:bg-indigo-600 sm:h-16 sm:w-auto sm:px-12 sm:text-xl"
                >
                  Abrir mi primer sobre <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>
          </section>

        </div>
      ) : (

        /* =========================================================
           ESTADO NO LOGGEADO: LANDING ORIGINAL
           ========================================================= */
        <div className="flex w-full flex-col">
          {/* HERO */}
          <section className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col items-center justify-center gap-8 px-6 py-12 sm:gap-12 lg:flex-row">
            <div className="flex-1 text-center lg:text-left">
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-800 shadow-sm backdrop-blur"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
                Aprende Web3 sin morir en el intento
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-800 md:text-6xl"
              >
                Empieza a aprender{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">Blockchain</span>
                <br /> jugando.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mx-auto mt-6 max-w-xl text-lg text-slate-600 lg:mx-0"
              >
                <strong className="text-slate-800 font-bold">Road App</strong> convierte
                cada concepto técnico en una carta. Conecta tu wallet, arma tu mazo y
                domina la blockchain batalla a batalla en Celo.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:items-start lg:justify-start"
              >
                <Button
                  size="lg"
                  onClick={cta}
                  disabled={loading}
                  className="h-12 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 rounded-xl sm:w-auto"
                >
                  {isMiniPay
                    ? "Abrir mi primer sobre"
                    : loading
                      ? "Abriendo…"
                      : "Conectar Wallet para empezar"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/cards")}
                  className="h-12 w-full gap-2 bg-white/60 px-6 text-base backdrop-blur rounded-xl border border-slate-200 sm:w-auto"
                >
                  Ver cartas <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>

              <p className="mt-4 text-xs text-slate-500">
                Conexión Web3 real en Celo. Fricción cero para empezar. ✨
              </p>
            </div>

            <div className="relative flex h-[20rem] w-full flex-1 items-center justify-center sm:h-[26rem]">
              {/* El abanico usa offsets en píxeles fijos (±150px). En mobile
                  escalamos todo el contenedor para que las cartas no se
                  desborden ni se solapen en pantallas angostas (<360px). */}
              <div className="relative flex h-full w-full origin-center scale-[0.62] items-center justify-center sm:scale-90 lg:scale-100">
                {fanCards.map((card, i) => (
                  <motion.div
                    key={card.name}
                    className="absolute"
                    initial={{ opacity: 0, y: 80, rotate: 0 }}
                    animate={{
                      opacity: 1,
                      y: fanLayout[i].y,
                      x: fanLayout[i].x,
                      rotate: fanLayout[i].rotate,
                    }}
                    transition={{
                      delay: 0.3 + i * 0.15,
                      type: "spring",
                      stiffness: 120,
                      damping: 14,
                    }}
                    style={{ zIndex: fanLayout[i].z }}
                  >
                    <GameCard card={card} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* FRANJA DE FEATURES */}
          <section className="relative mx-auto max-w-6xl px-6 pb-20">
            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: BookOpen,
                  title: "Fase 1 · Fundamentos",
                  text: "Bloques, transacciones y wallets en combates equilibrados para no frustrarte.",
                },
                {
                  icon: ShieldCheck,
                  title: "Fase 2 · Seguridad",
                  text: "Scams, phishing y hackeos. Aprende a usar 'counters' contra amenazas reales.",
                },
                {
                  icon: Trophy,
                  title: "Fase 3 · Web3",
                  text: "Smart Contracts, DeFi y gobernanza. Derrota al jefe final del ecosistema.",
                },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg text-left"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <f.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-slate-800">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500">{f.text}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
