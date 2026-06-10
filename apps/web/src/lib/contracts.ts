import NFTCardsArtifact from './abi/RoadAppNFTCards.json';
import GameStateArtifact from './abi/RoadAppGameState.json';

/**
 * Contract addresses for the Road App.
 *
 * **v2 (post-merge)**: solo hay 2 contratos. `RoadAppDeckManager` se fusionó
 * dentro de `RoadAppGameState` para simplificar el despliegue en MiniPay.
 * `saveDeck` / `clearDeck` / `getActiveDeck` / `validateDeck` ahora viven en
 * GAME_STATE_ABI.
 *
 * Celopedia best practice: pin a single supported chain via NEXT_PUBLIC_CHAIN_ID
 * so the frontend cannot accidentally read state from the wrong network (a common
 * cause of "my NFT doesn't show up" in MiniPay). Solo soportamos Celo Mainnet
 * (chainId 42220).
 *
 * Override per environment in `apps/web/.env.local`:
 *   NEXT_PUBLIC_NFT_CARDS_ADDRESS=0x...
 *   NEXT_PUBLIC_GAME_STATE_ADDRESS=0x...
 */
export const SUPPORTED_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID || 42220
);

export const CONTRACT_ADDRESSES = {
  NFT_CARDS: (process.env.NEXT_PUBLIC_NFT_CARDS_ADDRESS ||
    "0x0000000000000000000000000000000000000000") as `0x${string}`,
  GAME_STATE: (process.env.NEXT_PUBLIC_GAME_STATE_ADDRESS ||
    "0x0000000000000000000000000000000000000000") as `0x${string}`,
};

export const NFT_CARDS_ABI = NFTCardsArtifact.abi;
export const GAME_STATE_ABI = GameStateArtifact.abi;
