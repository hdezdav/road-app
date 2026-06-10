import hre from "hardhat";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

/**
 * Deployment script aligned with Celopedia best practices:
 *
 *  1. Deploys RoadAppNFTCards (with baseURI from env or sensible default).
 *  2. Deploys RoadAppDeckManager with the NFTCards address.
 *  3. Deploys RoadAppGameState (EIP-712 enabled).
 *  4. Wires permissions:
 *       - GameState.nftContract = NFTCards
 *       - NFTCards.authorizedMinters[GameState] = true
 *  5. Optionally sets trusted signer if TRUSTED_SIGNER_ADDRESS is provided.
 *  6. Persists addresses to apps/contracts/deployments/<network>.json so the
 *     web app can pick them up via NEXT_PUBLIC_* env vars.
 *
 * Required env:
 *   - PRIVATE_KEY (the deployer EOA)
 * Optional env:
 *   - NFT_BASE_METADATA_URI (defaults to GitHub raw URL placeholder)
 *   - TRUSTED_SIGNER_ADDRESS (sets EIP-712 signer right after deploy)
 *   - ETHERSCAN_API_KEY (for `pnpm verify:celo ...`)
 */
async function main() {
  const network = hre.network.name;
  const publicClient = await hre.viem.getPublicClient();
  const [deployer] = await hre.viem.getWalletClients();
  const deployerAddr = deployer.account.address;

  console.log(`\n=== Road App deployment on "${network}" ===`);
  console.log("Deployer:", deployerAddr);

  // NOTA: los guards de mainnet (TRUSTED_SIGNER_ADDRESS obligatorio y metadata
  // URI no-placeholder) fueron retirados a petición del owner. El despliegue
  // sigue siendo idempotente y el signer puede setearse después con
  // `RoadAppGameState.setTrustedSigner(address)` por el owner. Mientras tanto
  // GameState corre en OPEN MODE (cualquier address puede pasar el quiz).


  const balance = await publicClient.getBalance({ address: deployerAddr });
  console.log("Deployer balance (wei):", balance.toString());
  if (balance === 0n) {
    throw new Error(
      `Deployer has 0 balance on "${network}". Top up the account before retrying.`
    );
  }

  // tokenURI ahora es on-chain (data URI base64 generado dentro del contrato),
  // así que `baseMetadataURI` es solo un fallback opcional para wallets que
  // intenten resolver `${base}{id}.json`. Lo mantenemos por si en el futuro
  // se sube metadata estática a IPFS; sigue pudiendo overridearse con
  // `NFT_BASE_METADATA_URI`.
  const baseMetadataURI =
    process.env.NFT_BASE_METADATA_URI ||
    "https://raw.githubusercontent.com/road-app/metadata/main/";

  // Celopedia note: Celo (OP-stack L2 desde marzo 2025) a veces devuelve el
  // engañoso `contract creation code storage out of gas` cuando el estimador
  // automático multiplica el gas y `gas * gasPrice` supera el balance del
  // deployer. Fijamos un `gas` manual ajustado, medido con `REPORT_GAS=1 pnpm
  // test`:
  //
  //   RoadAppNFTCards    -> 3_013_737 gas
  //   RoadAppDeckManager ->   595_535 gas
  //   RoadAppGameState   -> 1_377_065 gas
  //
  // Padding ~30% por contrato. Total ≈ 6.7M gas; a 25 gwei en mainnet ≈ 0.17
  // CELO.
  const isCeloL2 = network === "celo";
  const gasFor = (n: bigint) => (isCeloL2 ? { gas: n } : {});

  // Optional resume: if a previous run partially succeeded, the user can pass
  // already-deployed addresses via env and we'll skip those steps. This avoids
  // burning faucet CELO for nothing on retries.
  const reuseNFT = process.env.REUSE_NFT_CARDS_ADDRESS as `0x${string}` | undefined;
  const reuseDeck = process.env.REUSE_DECK_MANAGER_ADDRESS as `0x${string}` | undefined;
  const reuseGame = process.env.REUSE_GAME_STATE_ADDRESS as `0x${string}` | undefined;

  // 1. Deploy RoadAppNFTCards
  console.log("\n[1/4] Deploying RoadAppNFTCards ...");
  const nftCards = reuseNFT
    ? await hre.viem.getContractAt("RoadAppNFTCards", reuseNFT)
    : await hre.viem.deployContract("RoadAppNFTCards", [baseMetadataURI], gasFor(4_000_000n));
  console.log("    RoadAppNFTCards:", nftCards.address, reuseNFT ? "(reused)" : "");

  // 2. Deploy RoadAppDeckManager
  console.log("\n[2/4] Deploying RoadAppDeckManager ...");
  const deckManager = reuseDeck
    ? await hre.viem.getContractAt("RoadAppDeckManager", reuseDeck)
    : await hre.viem.deployContract("RoadAppDeckManager", [nftCards.address], gasFor(900_000n));
  console.log("    RoadAppDeckManager:", deckManager.address, reuseDeck ? "(reused)" : "");

  // 3. Deploy RoadAppGameState
  console.log("\n[3/4] Deploying RoadAppGameState ...");
  const gameState = reuseGame
    ? await hre.viem.getContractAt("RoadAppGameState", reuseGame)
    : await hre.viem.deployContract("RoadAppGameState", [], gasFor(1_800_000n));
  console.log("    RoadAppGameState:", gameState.address, reuseGame ? "(reused)" : "");

  // 4. Wire permissions
  console.log("\n[4/4] Wiring permissions ...");
  const h1 = await gameState.write.setNFTContract([nftCards.address]);
  await publicClient.waitForTransactionReceipt({ hash: h1 });
  console.log("    GameState.setNFTContract -> ok");

  const h2 = await nftCards.write.setMinter([gameState.address, true]);
  await publicClient.waitForTransactionReceipt({ hash: h2 });
  console.log("    NFTCards.setMinter(GameState, true) -> ok");

  if (process.env.TRUSTED_SIGNER_ADDRESS) {
    const signer = process.env.TRUSTED_SIGNER_ADDRESS as `0x${string}`;
    const h3 = await gameState.write.setTrustedSigner([signer]);
    await publicClient.waitForTransactionReceipt({ hash: h3 });
    console.log("    GameState.setTrustedSigner ->", signer);
  } else {
    console.log(
      "    (skipped) TRUSTED_SIGNER_ADDRESS not set -> anti-cheat will be in OPEN mode until you call setTrustedSigner."
    );
  }

  // 5. Persist deployment file
  const out = {
    network,
    chainId: hre.network.config.chainId,
    deployer: deployerAddr,
    timestamp: new Date().toISOString(),
    contracts: {
      RoadAppNFTCards: nftCards.address,
      RoadAppGameState: gameState.address,
      RoadAppDeckManager: deckManager.address,
    },
    baseMetadataURI,
    trustedSigner: process.env.TRUSTED_SIGNER_ADDRESS || null,
  };

  const dir = join(__dirname, "..", "deployments");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const file = join(dir, `${network}.json`);
  writeFileSync(file, JSON.stringify(out, null, 2));
  console.log(`\nDeployment saved -> ${file}`);

  // 6. Friendly copy-paste for the web app
  console.log("\n==================================================");
  console.log("Add these to apps/web/.env.local and restart Next.js:");
  console.log(`NEXT_PUBLIC_NFT_CARDS_ADDRESS=${nftCards.address}`);
  console.log(`NEXT_PUBLIC_GAME_STATE_ADDRESS=${gameState.address}`);
  console.log(`NEXT_PUBLIC_DECK_MANAGER_ADDRESS=${deckManager.address}`);
  console.log(`NEXT_PUBLIC_CHAIN_ID=${hre.network.config.chainId}`);
  console.log("==================================================");
  console.log("\nVerify on Celoscan:");
  console.log(
    `  pnpm --filter hardhat verify:${network} ${nftCards.address} "${baseMetadataURI}"`
  );
  console.log(
    `  pnpm --filter hardhat verify:${network} ${gameState.address}`
  );
  console.log(
    `  pnpm --filter hardhat verify:${network} ${deckManager.address} ${nftCards.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
