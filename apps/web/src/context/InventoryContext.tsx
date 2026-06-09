"use client";

import { createContext, useContext, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { heroCards, type Card } from '@/data/cards';
import { CONTRACT_ADDRESSES, NFT_CARDS_ABI, GAME_STATE_ABI } from '@/lib/contracts';

interface OwnedCardOnChain {
  tokenId: bigint | number;
  cardCatalogId: bigint | number;
  attack: bigint | number;
  defense: bigint | number;
}

interface PlayerStateOnChain {
  currentPhase: bigint;
  hasSeedPhraseBackedUp: boolean;
  hasDefeatedPhase1: boolean;
  hasDefeatedPhase2: boolean;
  hasDefeatedPhase3: boolean;
}

interface InventoryContextType {
  address: `0x${string}` | undefined;
  ownedCardIds: string[];
  ownedCards: Card[];
  hasOpenedPack: boolean;
  currentPhase: number;
  hasSeedPhraseBackedUp: boolean;
  hasDefeatedPhase1: boolean;
  hasDefeatedPhase2: boolean;
  hasDefeatedPhase3: boolean;
  isLoading: boolean;
  ownsCard: (cardId: string | number) => boolean;
  refetch: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();

  // 1. Fetch owned cards (ERC721) using our optimized view function
  const { data: ownedCardsData, refetch: refetchBalances, isLoading: isLoadingBalances } = useReadContract({
    address: CONTRACT_ADDRESSES.NFT_CARDS,
    abi: NFT_CARDS_ABI,
    functionName: 'getOwnedCards',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  }) as { data: OwnedCardOnChain[] | undefined, refetch: any, isLoading: boolean };

  // 2. Fetch PlayerState from GAME_STATE contract on-chain
  const { data: playerState, refetch: refetchGameState, isLoading: isLoadingGameState } = useReadContract({
    address: CONTRACT_ADDRESSES.GAME_STATE,
    abi: GAME_STATE_ABI,
    functionName: 'getPlayerState',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  }) as { data: [bigint, boolean, boolean, boolean, boolean] | PlayerStateOnChain | undefined, refetch: any, isLoading: boolean };

  // Resolve full card objects from the catalog matching on cardCatalogId
  const ownedCards = useMemo(() => {
    console.log("DEBUG: ownedCardsData from Celo:", ownedCardsData);
    if (!ownedCardsData) return [];
    
    return ownedCardsData.map((item, idx) => {
      console.log(`DEBUG: Raw item [${idx}] from getOwnedCards:`, item);
      
      // Support array tuple, camelCase object, snake_case object, and index-based fallback
      const tokenId = Number(
        Array.isArray(item)
          ? item[0]
          : (item.tokenId ?? (item as any).token_id ?? (item as any)[0] ?? 0)
      );
      const cardCatalogId = Number(
        Array.isArray(item)
          ? item[1]
          : (item.cardCatalogId ?? (item as any).card_catalog_id ?? (item as any)[1] ?? 0)
      );
      
      console.log(`DEBUG: Parsed item [${idx}] -> tokenId:`, tokenId, "cardCatalogId:", cardCatalogId);
      
      const baseCard = heroCards.find((c) => c.tokenId === cardCatalogId);
      if (!baseCard) {
        console.log(`DEBUG: No baseCard found in heroCards for cardCatalogId: ${cardCatalogId}`);
        return null;
      }
      
      return {
        ...baseCard,
        id: `${baseCard.id}-${tokenId}`, // Unique string ID for React keys and selection
        nftTokenId: tokenId,            // Unique on-chain NFT tokenId
        tokenId: cardCatalogId,         // Base catalog ID (1 to 10)
      };
    }).filter(Boolean) as Card[];
  }, [ownedCardsData]);

  const ownedCardIds = useMemo(() => {
    return ownedCards.map((c) => c.id);
  }, [ownedCards]);

  // Check if player has registered / opened their pack
  const hasOpenedPack = useMemo(() => {
    if (!playerState) return false;
    if (Array.isArray(playerState)) {
      return Number(playerState[0] || 0) > 0;
    }
    return Number(playerState.currentPhase || 0) > 0;
  }, [playerState]);

  // Extract other game states from playerState
  const currentPhase = useMemo(() => {
    if (!playerState) return 0;
    if (Array.isArray(playerState)) {
      return Number(playerState[0] || 0);
    }
    return Number(playerState.currentPhase || 0);
  }, [playerState]);

  const hasSeedPhraseBackedUp = useMemo(() => {
    if (!playerState) return false;
    if (Array.isArray(playerState)) {
      return !!playerState[1];
    }
    return !!playerState.hasSeedPhraseBackedUp;
  }, [playerState]);

  const hasDefeatedPhase1 = useMemo(() => {
    if (!playerState) return false;
    if (Array.isArray(playerState)) {
      return !!playerState[2];
    }
    return !!playerState.hasDefeatedPhase1;
  }, [playerState]);

  const hasDefeatedPhase2 = useMemo(() => {
    if (!playerState) return false;
    if (Array.isArray(playerState)) {
      return !!playerState[3];
    }
    return !!playerState.hasDefeatedPhase2;
  }, [playerState]);

  const hasDefeatedPhase3 = useMemo(() => {
    if (!playerState) return false;
    if (Array.isArray(playerState)) {
      return !!playerState[4];
    }
    return !!playerState.hasDefeatedPhase3;
  }, [playerState]);

  // Refetch all on-chain states
  const refetchAll = useCallback(async () => {
    await Promise.all([
      refetchBalances(),
      refetchGameState()
    ]);
  }, [refetchBalances, refetchGameState]);

  // Refetch automatically when address changes
  useEffect(() => {
    if (address) {
      refetchAll();
    }
  }, [address, refetchAll]);

  const ownsCard = useCallback(
    (cardId: string | number) => {
      // Support checking by string ID or numeric tokenId
      return ownedCards.some(
        (c) => c.id === cardId || c.id.split('-')[0] === String(cardId) || c.tokenId === Number(cardId)
      );
    },
    [ownedCards]
  );

  const value = useMemo(
    () => ({
      address,
      ownedCardIds,
      ownedCards,
      hasOpenedPack,
      currentPhase,
      hasSeedPhraseBackedUp,
      hasDefeatedPhase1,
      hasDefeatedPhase2,
      hasDefeatedPhase3,
      isLoading: isLoadingBalances || isLoadingGameState,
      ownsCard,
      refetch: refetchAll,
    }),
    [
      address,
      ownedCardIds,
      ownedCards,
      hasOpenedPack,
      currentPhase,
      hasSeedPhraseBackedUp,
      hasDefeatedPhase1,
      hasDefeatedPhase2,
      hasDefeatedPhase3,
      isLoadingBalances,
      isLoadingGameState,
      ownsCard,
      refetchAll
    ]
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) {
    throw new Error('useInventory must be used within <InventoryProvider>');
  }
  return ctx;
}
