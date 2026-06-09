import NFTCardsArtifact from './abi/RoadAppNFTCards.json';
import GameStateArtifact from './abi/RoadAppGameState.json';
import DeckManagerArtifact from './abi/RoadAppDeckManager.json';

// Celo Sepolia / Mainnet deployed addresses
// Use environment variables if set, otherwise fallback to the placeholder addresses from Celo composer configuration
export const CONTRACT_ADDRESSES = {
  NFT_CARDS: (process.env.NEXT_PUBLIC_NFT_CARDS_ADDRESS || "0x8337B68cB0b30E88A9F7CbD81a6A7c91abe52688") as `0x${string}`,
  GAME_STATE: (process.env.NEXT_PUBLIC_GAME_STATE_ADDRESS || "0xd5145eAEc7510DFa6cD590e6Ca3e6954e3b3c843") as `0x${string}`,
  DECK_MANAGER: (process.env.NEXT_PUBLIC_DECK_MANAGER_ADDRESS || "0x9d9718E794ec0EA3ac726acbC05920A05f532dFF") as `0x${string}`,
};

export const NFT_CARDS_ABI = NFTCardsArtifact.abi;
export const GAME_STATE_ABI = GameStateArtifact.abi;
export const DECK_MANAGER_ABI = DeckManagerArtifact.abi;
