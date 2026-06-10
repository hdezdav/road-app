"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Sparkles, Trophy, Gift, ExternalLink } from "lucide-react";
import { useAccount, useWriteContract, usePublicClient, useReadContract } from "wagmi";
import { decodeEventLog } from "viem";
import { NFT_CARDS_ABI, GAME_STATE_ABI, CONTRACT_ADDRESSES, SUPPORTED_CHAIN_ID } from "@/lib/contracts";
import { watchNFTsInWallet, getNftExplorerUrl } from "@/lib/wallet-assets";

import { BgGradient } from "@/components/ui/bg-gradient";
import { Button } from "@/components/ui/button";
import { GiftPack } from "@/components/gift-pack";
import { heroCards, type Card } from "@/data/cards";
import { useInventory } from "@/context/InventoryContext";

export default function OpenPackPage() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { 
    hasOpenedPack, 
    currentPhase, 
    hasDefeatedPhase1, 
    hasDefeatedPhase2, 
    hasDefeatedPhase3, 
    ownedCardIds, 
    refetch,
    isLoading: isInventoryLoading
  } = useInventory();

  const [opened, setOpened] = useState(false);
  const [txStep, setTxStep] = useState(0); // 0: Idle, 1: Minting, 2: Registering, 3: Done
  const [errorText, setErrorText] = useState("");
  const [packType, setPackType] = useState<"starter" | "phase1_reward" | "phase2_reward" | "phase3_reward" | "none">("none");
  const [activePackCards, setActivePackCards] = useState<Card[]>([]);

  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  // Lectura on-chain: ¿el usuario ya reclamó el starter pack?
  // Esto evita ofrecer (y revertir) el mint del starter cuando el contrato ya
  // lo bloqueó vía `hasClaimedStarter[to]`.
  const { data: hasClaimedStarter } = useReadContract({
    address: CONTRACT_ADDRESSES.NFT_CARDS,
    abi: NFT_CARDS_ABI,
    functionName: "hasClaimedStarter",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  }) as { data: boolean | undefined };

  // Lectura on-chain: ¿está registrado en GameState? (`isRegistered(address)`)
  // Permite saltarse el paso 2 (registerPlayer) si ya está registrado y así
  // no provocar el revert `AlreadyRegistered()` durante eth_estimateGas.
  const { data: isAlreadyRegistered } = useReadContract({
    address: CONTRACT_ADDRESSES.GAME_STATE,
    abi: GAME_STATE_ABI,
    functionName: "isRegistered",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  }) as { data: boolean | undefined };

  // Determine what pack the user should open
  useEffect(() => {
    if (!isConnected || !address) {
      setPackType("none");
      return;
    }

    // 1. Starter Pack — solo si NO ha sido reclamado on-chain todavía.
    // Antes usábamos `ownedCardIds.length === 0` como fallback, pero eso
    // provocaba que un usuario ya registrado (con cartas aún cargando) viera
    // de nuevo el starter y disparara `StarterAlreadyClaimed`.
    const needsStarter = hasClaimedStarter === false || (currentPhase === 0 && !hasClaimedStarter);
    if (needsStarter) {
      setPackType("starter");
      setActivePackCards([
        heroCards.find((c) => c.tokenId === 1),
        heroCards.find((c) => c.tokenId === 3),
        heroCards.find((c) => c.tokenId === 4),
        heroCards.find((c) => c.tokenId === 6),
      ].filter((c): c is Card => c !== undefined));
      setOpened(false);
      return;
    }

    // 2. Phase 1 Reward Pack (Beaten Boss 1)
    const revealed1 = localStorage.getItem(`revealed_reward_1_${address}`);
    if (hasDefeatedPhase1 && !revealed1) {
      setPackType("phase1_reward");
      setActivePackCards([
        heroCards.find((c) => c.tokenId === 8), // Hacker Duplicador (Boss 1 captured)
        heroCards.find((c) => c.tokenId === 2), // Frase Semilla Física (Reward)
      ].filter((c): c is Card => c !== undefined));
      setOpened(false);
      return;
    }

    // 3. Phase 2 Reward Pack (Beaten Boss 2)
    const revealed2 = localStorage.getItem(`revealed_reward_2_${address}`);
    if (hasDefeatedPhase2 && !revealed2) {
      setPackType("phase2_reward");
      setActivePackCards([
        heroCards.find((c) => c.tokenId === 9), // Ransomware Interceptor (Boss 2 captured)
        heroCards.find((c) => c.tokenId === 5), // Firma Digital (Reward)
      ].filter((c): c is Card => c !== undefined));
      setOpened(false);
      return;
    }

    // 4. Phase 3 Reward Pack (Beaten Boss 3)
    const revealed3 = localStorage.getItem(`revealed_reward_3_${address}`);
    if (hasDefeatedPhase3 && !revealed3) {
      setPackType("phase3_reward");
      setActivePackCards([
        heroCards.find((c) => c.tokenId === 10), // Monstruo del Gas Alto (Boss 3 captured)
        heroCards.find((c) => c.tokenId === 7),  // Transacción Veloz Celo (Reward)
      ].filter((c): c is Card => c !== undefined));
      setOpened(false);
      return;
    }

    setPackType("none");
  }, [
    isConnected,
    address,
    currentPhase,
    hasDefeatedPhase1,
    hasDefeatedPhase2,
    hasDefeatedPhase3,
    ownedCardIds,
    hasClaimedStarter,
  ]);

  const handleOpen = async () => {
    setErrorText("");

    // For starter pack, trigger on-chain transactions
    if (packType === "starter") {
      setTxStep(1);
      try {
        // Edge case: el usuario YA tiene NFTs pero quedó sin registrar en
        // GameState (ej. rechazó la 2da firma en un intento anterior).
        // mintStarterPack revertiría con StarterAlreadyClaimed; saltamos
        // directo al paso 2 ("solo registrar") para no pedirle otra firma +
        // network fee (CIP-64) por algo que ya pagó.
        //
        // Preferimos la lectura on-chain `hasClaimedStarter` (autoridad real)
        // sobre `ownedCardIds.length` porque las cartas podrían no estar
        // cargadas aún en el contexto cuando se hace clic.
        const alreadyClaimedStarter =
          hasClaimedStarter === true || ownedCardIds.length > 0;
        const mintedTokenIds: bigint[] = [];

        if (!alreadyClaimedStarter) {
          // Step 1: Mint Starter Pack
          const mintTx = await writeContractAsync({
            address: CONTRACT_ADDRESSES.NFT_CARDS,
            abi: NFT_CARDS_ABI,
            functionName: 'mintStarterPack',
            args: [address],
          });
          if (publicClient) {
            const receipt = await publicClient.waitForTransactionReceipt({ hash: mintTx });
            // Decode the `CardMinted` events to extract the freshly-minted tokenIds.
            // We then ask the wallet (e.g. MetaMask) to track them via EIP-747.
            for (const log of receipt.logs) {
              try {
                const decoded = decodeEventLog({
                  abi: NFT_CARDS_ABI,
                  data: log.data,
                  topics: log.topics,
                });
                if (decoded.eventName === "CardMinted" && (decoded.args as any)?.tokenId) {
                  mintedTokenIds.push((decoded.args as any).tokenId as bigint);
                }
              } catch {
                // Unrelated log -> ignore
              }
            }
          }

          // Wait a short delay to let wallet provider sync the nonce
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        // Step 2: Register in GameState — solo si el contrato confirma que
        // NO está registrado aún. Si ya está registrado, `registerPlayer`
        // revertiría con `AlreadyRegistered()` durante `eth_estimateGas`
        // (este era el error: "The contract function registerPlayer reverted").
        setTxStep(2);

        // Re-verificamos on-chain por si `isAlreadyRegistered` (hook) aún no
        // reflejaba el estado más fresco al momento del clic.
        let needsRegister = isAlreadyRegistered !== true;
        if (publicClient && address && needsRegister) {
          try {
            const onchainRegistered = await publicClient.readContract({
              address: CONTRACT_ADDRESSES.GAME_STATE,
              abi: GAME_STATE_ABI,
              functionName: "isRegistered",
              args: [address],
            });
            needsRegister = !onchainRegistered;
          } catch (e) {
            console.warn("Could not double-check isRegistered:", e);
          }
        }

        if (needsRegister) {
          const txOptions: { nonce?: number } = {};
          if (publicClient && address) {
            try {
              // Retrieve nonce with 'pending' blockTag to count mempool/unmined transactions
              const nextNonce = await publicClient.getTransactionCount({
                address,
                blockTag: 'pending',
              });
              txOptions.nonce = nextNonce;
            } catch (e) {
              console.warn("Error resolving pending nonce:", e);
              try {
                const nextNonceLatest = await publicClient.getTransactionCount({
                  address,
                  blockTag: 'latest',
                });
                txOptions.nonce = nextNonceLatest;
              } catch (e2) {
                console.warn("Fallback nonce failed:", e2);
              }
            }
          }

          const registerTx = await writeContractAsync({
            address: CONTRACT_ADDRESSES.GAME_STATE,
            abi: GAME_STATE_ABI,
            functionName: 'registerPlayer',
            ...txOptions,
          });
          if (publicClient) {
            await publicClient.waitForTransactionReceipt({ hash: registerTx });
          }
        }

        await refetch();
        setTxStep(3);
        setOpened(true);

        // Ask the connected wallet (MetaMask etc.) to display the new NFTs.
        // Silently no-ops on wallets that don't implement EIP-747 for ERC721.
        if (mintedTokenIds.length > 0) {
          watchNFTsInWallet(CONTRACT_ADDRESSES.NFT_CARDS, mintedTokenIds).catch(() => {});
        }
      } catch (err: any) {
        console.error(err);
        // Distinguir "User rejected" (no es un bug, el usuario decidió no
        // firmar) de errores reales. viem expone `shortMessage` y los códigos
        // 4001 / "User rejected" / "User denied".
        const raw = (err?.shortMessage || err?.message || "").toString();
        const isUserReject =
          err?.code === 4001 ||
          /user rejected|user denied|rejected the request/i.test(raw);
        if (isUserReject) {
          setErrorText(
            "Cancelaste la firma. Toca el sobre cuando quieras reintentar (si ya minteaste las cartas, solo se te pedirá una firma para completar el registro).",
          );
        } else {
          setErrorText(raw || "Error al mintear tu sobre inicial.");
        }
        setTxStep(0);
      }
    } else {
      // For reward packs, they are already minted automatically on-chain when the boss is recorded as defeated!
      // So opening here is just a gorgeous client-side reveal.
      if (address) {
        if (packType === "phase1_reward") {
          localStorage.setItem(`revealed_reward_1_${address}`, "true");
        } else if (packType === "phase2_reward") {
          localStorage.setItem(`revealed_reward_2_${address}`, "true");
        } else if (packType === "phase3_reward") {
          localStorage.setItem(`revealed_reward_3_${address}`, "true");
        }
      }
      setOpened(true);
      refetch();
    }
  };

  const getPackTitle = () => {
    switch (packType) {
      case "starter": return "Sobre de Regalo Inicial";
      case "phase1_reward": return "Sobre del Hacker Capturado";
      case "phase2_reward": return "Sobre del Ransomware Capturado";
      case "phase3_reward": return "Sobre de Campeón Web3";
      default: return "Mis Recompensas";
    }
  };

  const getPackSubtitle = () => {
    switch (packType) {
      case "starter": return "Consigue tus primeras 4 cartas NFT de conceptos blockchain y regístrate.";
      case "phase1_reward": return "¡Fase 1 Superada! Revela el NFT del Hacker Duplicador y la carta Frase Semilla Física.";
      case "phase2_reward": return "¡Fase 2 Superada! Revela el NFT de Ransomware Interceptor y la carta Firma Digital.";
      case "phase3_reward": return "¡Juego Completado! Revela el NFT de Monstruo del Gas Alto y la legendaria Transacción Veloz Celo.";
      default: return "";
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-y-auto px-6 py-12">
      <BgGradient
        gradientFrom="#ffffff"
        gradientTo="#c3b8ff"
        gradientStop="30%"
        gradientPosition="50% 0%"
      />

      {/* Confetti effect when opened */}
      {opened && Array.from({ length: 24 }).map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute top-0 h-2.5 w-2.5 rounded-sm z-50"
          style={{
            left: `${(i * 47) % 100}%`,
            background: ["#836EF9", "#FBBF24", "#34D399", "#F472B6", "#60A5FA"][i % 5],
          }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ y: "100vh", opacity: [0, 1, 1, 0], rotate: 720 }}
          transition={{
            duration: 3.5 + (i % 3),
            repeat: Infinity,
            delay: (i % 6) * 0.3,
            ease: "linear",
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center text-center max-w-3xl"
      >
        {!isConnected ? (
          /* Locked */
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-4">🔒</span>
            <h1 className="text-3xl font-extrabold text-slate-800">Conecta tu Wallet</h1>
            <p className="text-slate-500 mt-2 max-w-sm">
              Vincula tu billetera Celo o abre el juego en MiniPay para abrir sobres de cartas educativos.
            </p>
          </div>
        ) : isInventoryLoading ? (
          /* Loading */
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
            <h2 className="text-xl font-bold text-slate-800">Cargando tus sobres...</h2>
          </div>
        ) : packType !== "none" ? (
          /* Pack active */
          <>
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm backdrop-blur">
              <Gift className="h-4 w-4" /> {getPackTitle()}
            </span>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-800 md:text-5xl">
              ¡Tienes un <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">sobre listo</span>!
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-500">
              {getPackSubtitle()}
            </p>

            {errorText && (
              <p className="mt-4 max-w-md text-sm text-red-500 font-semibold bg-red-50 px-4 py-2 rounded-lg border border-red-200 break-words">
                {errorText}
              </p>
            )}

            <div className="mt-12 relative">
              {txStep > 0 && txStep < 3 && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-3xl bg-black/70 backdrop-blur-sm text-white p-6">
                  <Loader2 className="h-10 w-10 animate-spin mb-3 text-indigo-400" />
                  <span className="text-xs text-slate-300 mt-2 text-center">
                    Confirma la transacción en tu wallet…
                  </span>
                </div>
              )}
              <GiftPack
                cards={activePackCards}
                onOpened={handleOpen}
                isOpened={opened}
              />
            </div>

            {opened && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: activePackCards.length * 0.15 + 0.3 }}
                className="mt-12 flex flex-wrap items-center justify-center gap-4"
              >
                <Button
                  size="lg"
                  onClick={() => router.push("/cards")}
                  className="h-12 gap-2 px-8 text-base shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                >
                  Ver mis cartas <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/battle")}
                  className="h-12 gap-2 px-8 text-base bg-white/60 border border-slate-200 backdrop-blur rounded-xl"
                >
                  Ir a Combate
                </Button>
                {address && (
                  <a
                    href={getNftExplorerUrl(SUPPORTED_CHAIN_ID, CONTRACT_ADDRESSES.NFT_CARDS, address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-6 text-sm font-semibold text-slate-700 backdrop-blur hover:bg-white"
                  >
                    Ver NFTs en Celoscan <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </motion.div>
            )}
          </>
        ) : (
          /* No packs, guide player to next combat phase */
          <div className="flex flex-col items-center">
            {currentPhase === 4 ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 180 }}
                >
                  <Trophy className="h-20 w-20 text-yellow-500 mb-6 drop-shadow-md" />
                </motion.div>
                <h1 className="text-4xl font-extrabold text-slate-800">¡Felicidades, Leyenda!</h1>
                <p className="text-slate-500 mt-3 max-w-md">
                  Has completado todas las fases, capturado a todos los jefes NFT y dominado la seguridad blockchain en Celo MiniPay.
                </p>
                <div className="flex gap-4 mt-8">
                  <Button
                    onClick={() => router.push("/cards")}
                    className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 rounded-xl"
                  >
                    Ver mi Colección
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/")}
                    className="h-12 bg-white/60 border border-slate-200 px-8 rounded-xl"
                  >
                    Ir al Inicio
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Sparkles className="h-16 w-16 text-indigo-600 mb-6 animate-pulse" />
                <h1 className="text-3xl font-extrabold text-slate-800">¡Siguiente Combate Listo!</h1>
                <p className="text-slate-500 mt-3 max-w-md">
                  {currentPhase === 1 
                    ? "Estás en la Fase 1. Prepara tu mazo para derrotar al Hacker Duplicador." 
                    : currentPhase === 2
                      ? "Estás en la Fase 2. Realiza tu respaldo de frase semilla para enfrentar al Ransomware Interceptor."
                      : "Estás en la Fase 3. ¡Prepara tus mejores estrategias para vencer al temible Monstruo del Gas Alto!"}
                </p>
                <div className="flex gap-4 mt-8">
                  <Button
                    onClick={() => router.push("/battle")}
                    className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 rounded-xl gap-2 shadow-lg"
                  >
                    Entrar a la Arena <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/cards")}
                    className="h-12 bg-white/60 border border-slate-200 px-8 rounded-xl"
                  >
                    Revisar Mazo
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
