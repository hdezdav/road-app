import hre from "hardhat";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

/**
 * Deployment script aligned with Celopedia best practices.
 *
 * **v2 (post-merge)**: bajamos de 3 a 2 contratos. `RoadAppDeckManager` se
 * fusionó dentro de `RoadAppGameState` (ver el contrato para el racional).
 * Esto elimina 1 deploy + 1 wiring transaction y reduce los puntos de falla
 * del despliegue en mainnet a la mitad.
 *
 *  1. Despliega RoadAppNFTCards (con baseURI desde env o un default sensato).
 *  2. Despliega RoadAppGameState (EIP-712 + deck storage).
 *  3. Wire de permisos:
 *       - GameState.nftContract = NFTCards
 *       - NFTCards.authorizedMinters[GameState] = true
 *  4. Opcional: setea trusted signer si TRUSTED_SIGNER_ADDRESS está definido.
 *  5. Persiste addresses en apps/contracts/deployments/<network>.json para
 *     que la web app las pueda recoger via NEXT_PUBLIC_* env vars.
 *
 * Required env:
 *   - PRIVATE_KEY (la EOA del deployer)
 * Optional env:
 *   - NFT_BASE_METADATA_URI (defaults to GitHub raw URL placeholder)
 *   - TRUSTED_SIGNER_ADDRESS (sets EIP-712 signer right after deploy)
 *   - ETHERSCAN_API_KEY (for `pnpm verify:celo ...`)
 *   - CELO_GAS_PRICE_WEI (override del gasPrice fijo; default 300 gwei)
 *   - REUSE_NFT_CARDS_ADDRESS / REUSE_GAME_STATE_ADDRESS (skip individual
 *     deploys en un retry parcial sin quemar CELO de nuevo).
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

  const isCeloL2 = network === "celo";

  // Celopedia / Celo L2 (OP-stack) gotcha: el `eth_gasPrice` / fee suggestion
  // que devuelve el Forno público suele venir POR DEBAJO del mínimo que exige
  // el sequencer. Cuando viem arma la tx EIP-1559 con esa estimación, el
  // sequencer la rechaza con:
  //   `error_forwarding_sequencer: gas fee cap is below the minimum base fee`
  //
  // Solución: forzamos un `gasPrice` explícito (tx legacy type-0) lo bastante
  // alto para superar siempre el mínimo del sequencer. Pasar `gasPrice` hace
  // que viem NO consulte la fee suggestion de Forno y mande la tx tal cual.
  //
  // Default 300 gwei: en el despliegue real (2026-06-10) el mínimo base fee del
  // sequencer estaba alto; 50/60 gwei eran rechazados y 300 gwei pasó sin
  // problema. Aun así el costo total (~6.4M gas) es ~0.002 CELO. Overridable
  // con CELO_GAS_PRICE_WEI si el mínimo del sequencer cambia.
  const celoGasPrice = BigInt(
    process.env.CELO_GAS_PRICE_WEI || 300_000_000_000 // 300 gwei
  );
  if (isCeloL2) {
    console.log("Gas price (wei):", celoGasPrice.toString(), "(legacy tx)");
  }

  // Deploy overrides: gas limit manual (evita el estimador de Celo que a veces
  // tira `contract creation code storage out of gas`) + gasPrice fijo.
  const deployOpts = (gas: bigint) =>
    isCeloL2 ? { gas, gasPrice: celoGasPrice } : {};
  // Write overrides: solo gasPrice fijo; el gas limit lo estima viem ok para
  // los setters baratos.
  const writeOpts = () => (isCeloL2 ? { gasPrice: celoGasPrice } : {});

  // Optional resume: si un run anterior parcialmente succeeded, el user puede
  // pasar addresses ya desplegadas via env y skip those steps. Evita quemar
  // CELO por nada en retries.
  const reuseNFT = process.env.REUSE_NFT_CARDS_ADDRESS as `0x${string}` | undefined;
  const reuseGame = process.env.REUSE_GAME_STATE_ADDRESS as `0x${string}` | undefined;

  // 1. Deploy RoadAppNFTCards
  console.log("\n[1/3] Deploying RoadAppNFTCards ...");
  const nftCards = reuseNFT
    ? await hre.viem.getContractAt("RoadAppNFTCards", reuseNFT)
    : await hre.viem.deployContract(
        "RoadAppNFTCards",
        [baseMetadataURI],
        deployOpts(4_000_000n)
      );
  console.log("    RoadAppNFTCards:", nftCards.address, reuseNFT ? "(reused)" : "");

  // 2. Deploy RoadAppGameState (incluye DeckManager fusionado)
  console.log("\n[2/3] Deploying RoadAppGameState ...");
  const gameState = reuseGame
    ? await hre.viem.getContractAt("RoadAppGameState", reuseGame)
    : await hre.viem.deployContract(
        "RoadAppGameState",
        [],
        deployOpts(2_400_000n)
      );
  console.log("    RoadAppGameState:", gameState.address, reuseGame ? "(reused)" : "");

  // 3. Wire permissions (cada write también lleva el gasPrice fijo)
  console.log("\n[3/3] Wiring permissions ...");
  const h1 = await gameState.write.setNFTContract([nftCards.address], writeOpts());
  await publicClient.waitForTransactionReceipt({ hash: h1 });
  console.log("    GameState.setNFTContract -> ok");

  const h2 = await nftCards.write.setMinter([gameState.address, true], writeOpts());
  await publicClient.waitForTransactionReceipt({ hash: h2 });
  console.log("    NFTCards.setMinter(GameState, true) -> ok");

  if (process.env.TRUSTED_SIGNER_ADDRESS) {
    const signer = process.env.TRUSTED_SIGNER_ADDRESS as `0x${string}`;
    const h3 = await gameState.write.setTrustedSigner([signer], writeOpts());
    await publicClient.waitForTransactionReceipt({ hash: h3 });
    console.log("    GameState.setTrustedSigner ->", signer);
  } else {
    console.log(
      "    (skipped) TRUSTED_SIGNER_ADDRESS not set -> anti-cheat will be in OPEN mode until you call setTrustedSigner."
    );
  }

  // 4. Persist deployment file
  const out = {
    network,
    chainId: hre.network.config.chainId,
    deployer: deployerAddr,
    timestamp: new Date().toISOString(),
    contracts: {
      RoadAppNFTCards: nftCards.address,
      RoadAppGameState: gameState.address,
    },
    baseMetadataURI,
    trustedSigner: process.env.TRUSTED_SIGNER_ADDRESS || null,
  };

  const dir = join(__dirname, "..", "deployments");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const file = join(dir, `${network}.json`);
  writeFileSync(file, JSON.stringify(out, null, 2));
  console.log(`\nDeployment saved -> ${file}`);

  // 5. Friendly copy-paste para la web app
  console.log("\n==================================================");
  console.log("Add these to apps/web/.env.local and restart Next.js:");
  console.log(`NEXT_PUBLIC_NFT_CARDS_ADDRESS=${nftCards.address}`);
  console.log(`NEXT_PUBLIC_GAME_STATE_ADDRESS=${gameState.address}`);
  console.log(`NEXT_PUBLIC_CHAIN_ID=${hre.network.config.chainId}`);
  console.log("==================================================");
  console.log("\nVerify on Celoscan:");
  console.log(
    `  pnpm --filter hardhat verify:${network} ${nftCards.address} "${baseMetadataURI}"`
  );
  console.log(
    `  pnpm --filter hardhat verify:${network} ${gameState.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
