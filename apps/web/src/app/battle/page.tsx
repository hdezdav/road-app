"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAccount, useWriteContract, usePublicClient } from "wagmi";
import {
  Swords,
  Shield,
  Zap,
  Trophy,
  Skull,
  RotateCcw,
  ArrowRight,
  Sparkles,
  KeyRound,
  ShieldAlert,
  Loader2,
} from "lucide-react";

import { GameCard } from "@/components/game-card";
import { Button } from "@/components/ui/button";
import { heroCards, type Card } from "@/data/cards";
import { useInventory } from "@/context/InventoryContext";
import { CONTRACT_ADDRESSES, DECK_MANAGER_ABI, GAME_STATE_ABI } from "@/lib/contracts";
import "./battle.css";

/* ─── Constants ─── */
const MAX_HAND_SIZE = 3;
const HP_MULTIPLIER = 1;
const PLAY_DELAY_MS = 1200;
const DAMAGE_DISPLAY_MS = 1400;

/* ─── Helpers ─── */
function computeDamage(card: Card, enemy: Card) {
  const counter = card.counters?.find((c) => c.target === enemy.id);
  const baseDmg = card.stats?.attack ?? card.attack ?? 0;
  if (counter) {
    return {
      damage: Math.round(baseDmg * counter.multiplier),
      isCounter: true,
      multiplier: counter.multiplier,
    };
  }
  return { damage: baseDmg, isCounter: false, multiplier: 1 };
}

function hpBarClass(pct: number) {
  if (pct > 55) return "health-bar__fill--healthy";
  if (pct > 25) return "health-bar__fill--warning";
  return "health-bar__fill--critical";
}

/* ─── Phases ─── */
enum PHASE { 
  PRE = "pre", 
  SAVING_DECK = "saving_deck",
  BATTLE = "battle", 
  RECORDING_VICTORY = "recording_victory",
  POST = "post" 
}

interface LogEntry {
  round: number;
  card: string;
  damage: number;
  isCounter: boolean;
  remainingHp: number;
}

export default function BattlePage() {
  const { isConnected } = useAccount();
  const { 
    ownedCards, 
    currentPhase, 
    hasSeedPhraseBackedUp,
    hasDefeatedPhase3,
    refetch,
    isLoading: isInventoryLoading 
  } = useInventory();

  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  /* ── Game state ── */
  const [phase, setPhase] = useState<PHASE>(PHASE.PRE);
  
  // Pick boss based on current player phase
  const enemy = useMemo(() => {
    // Phase 1 -> Hacker Duplicador (8)
    // Phase 2 -> Ransomware Interceptor (9)
    // Phase 3 -> Monstruo del Gas Alto (10)
    const bossId = currentPhase === 1 ? 8 : currentPhase === 2 ? 9 : 10;
    return heroCards.find((c) => c.tokenId === bossId) || heroCards[heroCards.length - 1];
  }, [currentPhase]);

  // Pre-battle: card selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [savingDeck, setSavingDeck] = useState(false);
  const [backingUp, setBackingUp] = useState(false);

  // Battle state
  const [hand, setHand] = useState<Card[]>([]);
  const [playedIndices, setPlayedIndices] = useState<number[]>([]);
  const [enemyHp, setEnemyHp] = useState(0);
  const [maxHp, setMaxHp] = useState(0);
  const [currentPlay, setCurrentPlay] = useState<Card | null>(null); // card being played
  const [damagePopup, setDamagePopup] = useState<{ damage: number; isCounter: boolean } | null>(null);
  const [counterText, setCounterText] = useState<string | null>(null);
  const [combatLog, setCombatLog] = useState<LogEntry[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shakeEnemy, setShakeEnemy] = useState(false);

  // Recording victory on-chain
  const [victoryError, setVictoryError] = useState("");

  // Post-battle
  const [didWin, setDidWin] = useState(false);

  const roundRef = useRef(0);

  /* ── Card selection toggle ── */
  const toggleCard = useCallback(
    (cardId: string) => {
      setSelectedIds((prev) => {
        if (prev.includes(cardId)) return prev.filter((id) => id !== cardId);
        if (prev.length >= MAX_HAND_SIZE) return prev;
        return [...prev, cardId];
      });
    },
    []
  );

  /* ── Start battle (calls saveDeck on-chain) ── */
  const startBattle = async () => {
    if (selectedIds.length < MAX_HAND_SIZE) return;
    setSavingDeck(true);
    try {
      // Step 1: Save deck on-chain in DeckManager contract
      const ids = selectedIds.map((id) => {
        const card = ownedCards.find((c) => c.id === id);
        return card ? BigInt(card.nftTokenId || 0) : 0n;
      }).filter((id) => id !== 0n);

      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESSES.DECK_MANAGER,
        abi: DECK_MANAGER_ABI,
        functionName: "saveDeck",
        args: [ids],
      });
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: tx });
      }

      // Step 2: Setup local battle state
      const selectedCards = selectedIds.map((id) =>
        ownedCards.find((c) => c.id === id)
      ).filter((c): c is Card => c !== undefined);
      
      const hp = (enemy.stats?.defense ?? enemy.defense ?? 0) * HP_MULTIPLIER;
      
      setHand(selectedCards);
      setPlayedIndices([]);
      setEnemyHp(hp);
      setMaxHp(hp);
      setCurrentPlay(null);
      setDamagePopup(null);
      setCounterText(null);
      setCombatLog([]);
      roundRef.current = 0;
      setPhase(PHASE.BATTLE);
    } catch (err: any) {
      console.error(err);
      alert("Error al registrar y validar tu mazo on-chain: " + (err.message || err));
    } finally {
      setSavingDeck(false);
    }
  };

  /* ── Handle Educational Backup for Phase 2 ── */
  const handleSeedBackup = async () => {
    setBackingUp(true);
    try {
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESSES.GAME_STATE,
        abi: GAME_STATE_ABI,
        functionName: "verifySeedPhraseBackup",
      });
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: tx });
      }
      await refetch();
    } catch (err: any) {
      console.error(err);
      alert("Error al respaldar frase semilla on-chain: " + (err.message || err));
    } finally {
      setBackingUp(false);
    }
  };

  /* ── Record Victory on GameState ── */
  const recordOnChainVictory = useCallback(async () => {
    setVictoryError("");
    try {
      // We pass "0x" (empty bytes) signature fallback since signature verification is only enforced on-chain when trustedSigner is configured
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESSES.GAME_STATE,
        abi: GAME_STATE_ABI,
        functionName: "recordBossDefeat",
        args: [BigInt(currentPhase), "0x"],
      });
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: tx });
      }
      await refetch();
      setDidWin(true);
      setPhase(PHASE.POST);
    } catch (err: any) {
      console.error(err);
      setVictoryError(err.message || "Error al emitir transacción.");
    }
  }, [currentPhase, writeContractAsync, publicClient, refetch]);

  /* ── Play a card ── */
  const playCard = useCallback(
    (index: number) => {
      if (isPlaying || playedIndices.includes(index)) return;
      setIsPlaying(true);

      const card = hand[index];
      const { damage, isCounter, multiplier } = computeDamage(card, enemy);
      roundRef.current += 1;
      const round = roundRef.current;

      // Show card moving to center
      setCurrentPlay(card);
      setPlayedIndices((prev) => [...prev, index]);

      // After a brief delay, show damage
      setTimeout(() => {
        setDamagePopup({ damage, isCounter });
        if (isCounter) {
          setCounterText(`¡COUNTER! ×${multiplier}`);
        }
        setShakeEnemy(true);

        // Update HP
        setEnemyHp((prev) => {
          const newHp = Math.max(0, prev - damage);

          // Add to combat log
          setCombatLog((log) => [
            ...log,
            {
              round,
              card: card.name,
              damage,
              isCounter,
              remainingHp: newHp,
            },
          ]);

          // Check if battle is over (after all 3 cards or enemy dead)
          const allPlayed = round >= MAX_HAND_SIZE;
          if (newHp <= 0 || allPlayed) {
            const won = newHp <= 0;
            if (won) {
              setTimeout(() => {
                setPhase(PHASE.RECORDING_VICTORY);
              }, DAMAGE_DISPLAY_MS + 200);
            } else {
              setTimeout(() => {
                setDidWin(false);
                setPhase(PHASE.POST);
              }, DAMAGE_DISPLAY_MS + 400);
            }
          }

          return newHp;
        });
      }, PLAY_DELAY_MS / 2);

      // Cleanup damage popup
      setTimeout(() => {
        setDamagePopup(null);
        setCounterText(null);
        setShakeEnemy(false);
        setCurrentPlay(null);
        setIsPlaying(false);
      }, PLAY_DELAY_MS + DAMAGE_DISPLAY_MS);
    },
    [hand, enemy, isPlaying, playedIndices]
  );

  // Auto-trigger on-chain victory recording when phase switches to RECORDING_VICTORY
  useEffect(() => {
    if (phase === PHASE.RECORDING_VICTORY) {
      recordOnChainVictory();
    }
  }, [phase, recordOnChainVictory]);

  /* ── Retry ── */
  const retry = useCallback(() => {
    setSelectedIds([]);
    setPhase(PHASE.PRE);
  }, []);

  /* ── Render helpers ── */
  const hpPct = maxHp > 0 ? (enemyHp / maxHp) * 100 : 100;

  /* ════════════════════════════════════════════════════════ */
  return (
    <div className="battle-arena">
      <div className="battle-content">
        {!isConnected ? (
          /* ── Wallet locked ── */
          <div className="battle-locked">
            <span className="battle-locked__icon">🔒</span>
            <h3 className="battle-locked__title text-slate-800">Wallet no conectada</h3>
            <p className="battle-locked__desc text-slate-500">
              Conecta tu wallet para acceder a la arena y luchar contra
              oponentes on-chain.
            </p>
          </div>
        ) : isInventoryLoading ? (
          /* ── Loading state ── */
          <div className="battle-locked">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
            <h3 className="battle-locked__title text-slate-800">Cargando inventario on-chain...</h3>
            <p className="battle-locked__desc text-slate-500">Obteniendo tus cartas y nivel de la blockchain...</p>
          </div>
        ) : currentPhase === 0 ? (
          /* ── Not registered ── */
          <div className="battle-locked">
            <span className="battle-locked__icon">📦</span>
            <h3 className="battle-locked__title text-slate-800">No estás registrado</h3>
            <p className="battle-locked__desc text-slate-500">
              Debes conseguir tus cartas iniciales y registrar tu progreso para combatir.
            </p>
            <Link href="/pack" className="btn-start-battle mt-4">
              Conseguir Starter Pack
            </Link>
          </div>
        ) : hasDefeatedPhase3 || currentPhase > 3 ? (
          /* ── Game Completed ── */
          <div className="battle-locked">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 180 }}
            >
              <Trophy size={72} color="#fbbf24" strokeWidth={1.5} className="mb-4" />
            </motion.div>
            <h3 className="battle-locked__title text-slate-800">¡Leyenda Web3!</h3>
            <p className="battle-locked__desc text-slate-500" style={{ maxWidth: 420 }}>
              Has derrotado a todos los jefes y completado Road App con éxito. 
              Posees las cartas legendarias de Hacker Duplicador, Ransomware Interceptor y Monstruo del Gas Alto.
            </p>
            <div className="flex gap-4 mt-6">
              <Link href="/cards" className="btn-start-battle">
                Ver Colección
              </Link>
              <Link href="/" className="btn-secondary">
                Inicio
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* ═══════ PHASE: PRE-BATTLE ═══════ */}
            <AnimatePresence mode="wait">
              {phase === PHASE.PRE && (
                <motion.div
                  key="pre"
                  className="pre-battle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Header */}
                  <div className="pre-battle__header">
                    <span className="pre-battle__badge">
                      <Swords size={14} className="text-indigo-600" /> Arena de Combate · Fase {currentPhase}
                    </span>
                    <h1 className="pre-battle__title">
                      Elige tu <span>Estrategia</span>
                    </h1>
                    <p className="pre-battle__subtitle">
                      Analiza al enemigo, elige sabiamente tus 3 cartas y
                      entra en batalla.
                    </p>
                  </div>

                  {/* Phase 2 Educational Event Banner */}
                  {currentPhase === 2 && !hasSeedPhraseBackedUp && (
                    <motion.div 
                      className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-50/70 p-6 text-left max-w-xl shadow-sm backdrop-blur"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-amber-100 p-2 text-amber-600">
                          <ShieldAlert size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-amber-700">Alerta de Seguridad: Malware Detectado</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            El <strong>Ransomware Interceptor</strong> tiene la capacidad de congelar y encriptar tu mazo. 
                            Debes respaldar una frase semilla física en la blockchain para inmunizar tu mazo antes de luchar.
                          </p>
                          <Button 
                            className="mt-4 bg-amber-600 hover:bg-amber-700 text-white gap-2 shadow-lg rounded-xl"
                            onClick={handleSeedBackup}
                            disabled={backingUp}
                          >
                            {backingUp ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Creando Respaldo On-Chain...
                              </>
                            ) : (
                              <>
                                <KeyRound size={16} />
                                Respaldar Frase Semilla
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Enemy preview */}
                  <motion.div
                    className="enemy-preview"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <span className="enemy-preview__label">
                      Jefe Actual de la Sala
                    </span>
                    <h2 className="enemy-preview__name">{enemy.name}</h2>
                    <span className="enemy-preview__type">{enemy.type}</span>
                    <p className="enemy-preview__desc">{enemy.description}</p>

                    <div className="enemy-stats">
                      <div className="enemy-stat">
                        <Swords
                          size={16}
                          className="enemy-stat__value--atk"
                        />
                        <span className="enemy-stat__value enemy-stat__value--atk">
                          {enemy.stats?.attack ?? enemy.attack}
                        </span>
                        <span className="enemy-stat__label">Ataque</span>
                      </div>
                      <div className="enemy-stat">
                        <Shield
                          size={16}
                          className="enemy-stat__value--def"
                        />
                        <span className="enemy-stat__value enemy-stat__value--def">
                          {enemy.stats?.defense ?? enemy.defense}
                        </span>
                        <span className="enemy-stat__label">Defensa</span>
                      </div>
                      <div className="enemy-stat">
                        <Zap size={16} className="enemy-stat__value--nrg" />
                        <span className="enemy-stat__value enemy-stat__value--nrg">
                          {enemy.stats?.cost ?? enemy.energy}
                        </span>
                        <span className="enemy-stat__label">Energía</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Card selection */}
                  <div className="card-selection">
                    <p className="card-selection__label">
                      Selecciona <strong>{MAX_HAND_SIZE} cartas</strong> de tu
                      wallet ({selectedIds.length}/{MAX_HAND_SIZE})
                    </p>
                    <div className="card-selection__grid">
                      {ownedCards
                        .filter((c) => c.tokenId !== enemy.tokenId)
                        .map((card, i) => {
                          const isSelected = selectedIds.includes(card.id);
                          const isFull =
                            selectedIds.length >= MAX_HAND_SIZE &&
                            !isSelected;

                          return (
                            <motion.div
                              key={card.id}
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 + i * 0.06 }}
                              className={[
                                "card-select-wrapper",
                                isSelected && "card-select-wrapper--selected",
                                isFull && "card-select-wrapper--disabled",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                              onClick={() => toggleCard(card.id)}
                            >
                              <GameCard card={card} />
                            </motion.div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pre-battle__actions">
                    <button
                      className="btn-start-battle"
                      disabled={selectedIds.length < MAX_HAND_SIZE || (currentPhase === 2 && !hasSeedPhraseBackedUp) || savingDeck}
                      onClick={startBattle}
                    >
                      {savingDeck ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Validando en blockchain...
                        </>
                      ) : (
                        <>
                          <Swords size={18} />
                          Iniciar Combate
                        </>
                      )}
                    </button>
                    {selectedIds.length < MAX_HAND_SIZE && (
                      <span className="pre-battle__hint">
                        Selecciona {MAX_HAND_SIZE - selectedIds.length} carta
                        {MAX_HAND_SIZE - selectedIds.length !== 1 && "s"} más
                      </span>
                    )}
                    {currentPhase === 2 && !hasSeedPhraseBackedUp && (
                      <span className="pre-battle__hint text-amber-600 font-semibold">
                        Debes realizar el respaldo de frase semilla para iniciar
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ═══════ PHASE: BATTLE ═══════ */}
              {phase === PHASE.BATTLE && (
                <motion.div
                  key="battle"
                  className="battle-table"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* Enemy zone */}
                  <div className="enemy-zone">
                    <span className="enemy-zone__name">
                      <Skull size={14} />
                      {enemy.name}
                    </span>

                    <motion.div
                      className={`enemy-card-container ${
                        shakeEnemy ? "enemy-card-container--hit" : ""
                      }`}
                      initial={{ opacity: 0, y: -40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <GameCard card={enemy} />
                    </motion.div>

                    {/* Health bar */}
                    <div className="health-bar-wrap">
                      <div className="health-bar">
                        <div
                          className={`health-bar__fill ${hpBarClass(hpPct)}`}
                          style={{ width: `${hpPct}%` }}
                        />
                      </div>
                      <span className="health-bar__text">
                        HP {enemyHp} / {maxHp}
                      </span>
                    </div>
                  </div>

                  {/* Play zone */}
                  <div className="play-zone">
                    {/* Card being played */}
                    <AnimatePresence>
                      {currentPlay && (
                        <motion.div
                          className="play-zone__card"
                          initial={{ y: 200, opacity: 0, scale: 0.7 }}
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          exit={{ y: -60, opacity: 0, scale: 0.8 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 18,
                          }}
                        >
                          <GameCard card={currentPlay} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Damage popup */}
                    <AnimatePresence>
                      {damagePopup && (
                        <motion.span
                          key="dmg"
                          className={`damage-popup ${
                            damagePopup.isCounter ? "damage-popup--bonus" : ""
                          }`}
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          -{damagePopup.damage}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Counter bonus text */}
                    <AnimatePresence>
                      {counterText && (
                        <motion.span
                          key="counter"
                          className="counter-text"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          {counterText}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Combat log */}
                    {combatLog.length > 0 && (
                      <div className="combat-log">
                        <span className="combat-log__title">
                          Registro de Transacciones
                        </span>
                        {combatLog.map((entry, i) => (
                          <div key={i} className="combat-log__entry">
                            <strong>R{entry.round}:</strong> {entry.card} →{" "}
                            <span className="dmg">-{entry.damage}</span>
                            {entry.isCounter && (
                              <span className="bonus"> ★ Counter</span>
                            )}
                            <br />
                            HP restante: {entry.remainingHp}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Round indicator */}
                  <div className="round-indicator">
                    <span className="round-indicator__text">
                      Ronda <span>{Math.min(playedIndices.length + 1, MAX_HAND_SIZE)}</span> de{" "}
                      {MAX_HAND_SIZE}
                      {!isPlaying &&
                        playedIndices.length < MAX_HAND_SIZE &&
                        " — Elige una carta para jugar"}
                    </span>
                  </div>

                  {/* Player hand */}
                  <div className="player-hand">
                    {hand.map((card, i) => {
                      const wasPlayed = playedIndices.includes(i);
                      return (
                        <motion.div
                          key={card.id}
                          className={[
                            "hand-card-slot",
                            wasPlayed && "hand-card-slot--played",
                            !wasPlayed &&
                              !isPlaying &&
                              "hand-card-slot--active",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          initial={{ opacity: 0, y: 80 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          onClick={() => playCard(i)}
                        >
                          <GameCard card={card} />
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ═══════ PHASE: RECORDING_VICTORY ═══════ */}
              {phase === PHASE.RECORDING_VICTORY && (
                <motion.div
                  key="recording"
                  className="battle-locked"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader2 className="h-16 w-16 animate-spin text-indigo-600 mb-4" />
                  <h3 className="battle-locked__title text-slate-800">¡Victoria Conseguida!</h3>
                  <p className="battle-locked__desc text-slate-500" style={{ maxWidth: 400 }}>
                    Registrando la derrota del jefe y minteando tu NFT de recompensa en Celo Sepolia...
                  </p>
                  
                  {victoryError && (
                    <div className="mt-4 p-4 rounded-xl border border-red-500/20 bg-red-50/70 text-red-600 text-sm">
                      <p className="font-bold">Error al confirmar transacción:</p>
                      <p className="mt-1 text-xs opacity-80">{victoryError}</p>
                      <Button 
                        onClick={recordOnChainVictory}
                        className="mt-3 bg-red-600 hover:bg-red-700 text-white gap-2 rounded-xl"
                      >
                        Reintentar Registro
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══════ PHASE: POST-BATTLE ═══════ */}
              {phase === PHASE.POST && (
                <motion.div
                  key="post"
                  className="post-battle"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {didWin ? (
                    <>
                      {/* Victory confetti */}
                      {Array.from({ length: 24 }).map((_, i) => (
                        <span
                          key={i}
                          className="victory-particle"
                          style={{
                            left: `${(i * 41) % 100}%`,
                            top: 0,
                            background: [
                              "#fbbf24",
                              "#836ef9",
                              "#34d399",
                              "#f472b6",
                              "#60a5fa",
                            ][i % 5],
                            animationDuration: `${3 + (i % 4)}s`,
                            animationDelay: `${(i % 8) * 0.3}s`,
                          } as any}
                        />
                      ))}

                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 180,
                          damping: 12,
                        }}
                      >
                        <Trophy
                          size={72}
                          color="#fbbf24"
                          strokeWidth={1.5}
                        />
                      </motion.div>

                      <h1 className="victory-title text-slate-800">¡Victoria!</h1>
                      <p className="post-battle__subtitle text-slate-500">
                        Has derrotado a {enemy.name}. El jefe y tus nuevas cartas de recompensa han sido transferidos a tu wallet.
                      </p>

                      {/* NFT claimed */}
                      <motion.div
                        className="nft-claimed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <span className="nft-claimed__label">
                          <Sparkles size={14} /> Nuevos NFTs en tu Wallet
                        </span>
                        <GameCard card={enemy} />
                      </motion.div>

                      <div className="post-battle__actions">
                        <Link href="/pack" className="btn-start-battle">
                          Abrir Sobre de Recompensa <ArrowRight size={16} />
                        </Link>
                        <Link href="/cards" className="btn-secondary">
                          Ver Mi Colección
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 180,
                          damping: 12,
                        }}
                      >
                        <Skull size={72} color="#ef4444" strokeWidth={1.5} />
                      </motion.div>

                      <h1 className="defeat-title">Derrota</h1>
                      <p className="post-battle__subtitle text-slate-500">
                        {enemy.name} ha resistido tu ataque. Revisa tu
                        estrategia y vuelve a intentarlo.
                      </p>

                      {/* Battle summary */}
                      <div
                        style={{
                          background: "rgba(0,0,0,0.03)",
                          border: "1px solid rgba(0,0,0,0.08)",
                          borderRadius: 16,
                          padding: 20,
                          maxWidth: 340,
                          width: "100%",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: "rgba(0,0,0,0.4)",
                            display: "block",
                            textAlign: "left"
                          }}
                        >
                          Resumen
                        </span>
                        {combatLog.map((entry, i) => (
                          <div
                            key={i}
                            style={{
                              fontSize: 13,
                              color: "rgba(0,0,0,0.7)",
                              padding: "8px 0",
                              textAlign: "left",
                              borderBottom:
                                i < combatLog.length - 1
                                  ? "1px solid rgba(0,0,0,0.05)"
                                  : "none",
                            }}
                          >
                            <strong style={{ color: "rgba(0,0,0,0.9)" }}>
                              R{entry.round}:
                            </strong>{" "}
                            {entry.card} →{" "}
                            <span style={{ color: "#ef4444", fontWeight: 700 }}>
                              -{entry.damage}
                            </span>
                            {entry.isCounter && (
                              <span
                                style={{ color: "#d97706", fontWeight: 700 }}
                              >
                                {" "}
                                ★ Counter
                              </span>
                            )}
                          </div>
                        ))}
                        <div
                          style={{
                            marginTop: 12,
                            fontSize: 13,
                            color: "#ef4444",
                            fontWeight: 700,
                            textAlign: "left"
                          }}
                        >
                          HP restante del enemigo: {enemyHp}
                        </div>
                      </div>

                      <div className="post-battle__actions">
                        <button className="btn-start-battle" onClick={retry}>
                          <RotateCcw size={16} /> Reintentar
                        </button>
                        <Link href="/" className="btn-secondary">
                          Retirarse
                        </Link>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
