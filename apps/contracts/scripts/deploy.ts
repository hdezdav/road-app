import hre from "hardhat";

async function main() {
  const publicClient = await hre.viem.getPublicClient();
  const [deployer] = await hre.viem.getWalletClients();

  console.log("Deploying contracts with the account:", deployer.account.address);

  // 1. Deploy RoadAppNFTCards
  const baseMetadataURI = "https://raw.githubusercontent.com/road-app/metadata/main/";
  const nftCards = await hre.viem.deployContract("RoadAppNFTCards", [baseMetadataURI]);
  console.log("RoadAppNFTCards deployed to:", nftCards.address);

  // 2. Deploy RoadAppDeckManager
  const deckManager = await hre.viem.deployContract("RoadAppDeckManager", [nftCards.address]);
  console.log("RoadAppDeckManager deployed to:", deckManager.address);

  // 3. Deploy RoadAppGameState
  const gameState = await hre.viem.deployContract("RoadAppGameState", []);
  console.log("RoadAppGameState deployed to:", gameState.address);

  // 4. Setup relationships
  console.log("Setting up contract relationships...");
  
  // Set GameState NFT contract address
  const hash1 = await gameState.write.setNFTContract([nftCards.address]);
  await publicClient.waitForTransactionReceipt({ hash: hash1 });
  console.log("NFT contract set in GameState");

  // Authorize GameState to mint in NFT contract
  const hash2 = await nftCards.write.setMinter([gameState.address, true]);
  await publicClient.waitForTransactionReceipt({ hash: hash2 });
  console.log("GameState authorized as minter in NFTCards");

  console.log("\n==================================================");
  console.log("Deployment and configuration complete!");
  console.log("Copy and update the following addresses in apps/web/src/lib/contracts.ts:");
  console.log(`NFT_CARDS: "${nftCards.address}"`);
  console.log(`GAME_STATE: "${gameState.address}"`);
  console.log(`DECK_MANAGER: "${deckManager.address}"`);
  console.log("==================================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
