import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "dotenv/config";

// Normalize the deployer private key: Hardhat requires the `0x` prefix.
// We strip whitespace / accept both `0x...` and bare-hex `...` forms so a
// user-pasted .env keeps working without manual edits.
const rawPk = (process.env.PRIVATE_KEY || "").trim();
const PK = rawPk.length === 0
  ? undefined
  : (rawPk.startsWith("0x") ? rawPk : `0x${rawPk}`) as `0x${string}`;

// Optional manual gas price override (wei). Si se define, se respeta; si no, se
// deja que Hardhat/viem estimen las fees EIP-1559 dinámicamente desde el
// sequencer de Celo. Esto evita el error `gas fee cap is below the minimum base
// fee`: un gasPrice fijo (p.ej. 25 gwei) puede quedar por debajo de la base fee
// actual del bloque y el sequencer L2 rechaza la tx.
const manualGasPrice = process.env.CELO_GAS_PRICE_WEI
  ? Number(process.env.CELO_GAS_PRICE_WEI)
  : undefined;

// Pin solc 0.8.28 + evmVersion `cancun`. Justificación (alineada con Celopedia):
//   - Celo migró a L2 (OP-stack) en marzo 2025 (block 31_056_500) y los RPC
//     oficiales (Forno celo), Quicknode y dRPC ya soportan la upgrade Cancun
//     (MCOPY / TSTORE / TLOAD).
//   - OpenZeppelin v5.6 usa MCOPY en `utils/Bytes.sol`, por lo que compilar contra
//     `shanghai` rompería el build sin tocar a OZ.
//   - No usamos blobs (EIP-4844) ni opcodes que algunos hardware wallets aún no
//     entienden, así que el bytecode resultante es compatible con MiniPay.
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "cancun",
      // viaIR pipeline: required because `RoadAppNFTCards.tokenURI` builds the OpenSea-
      // compatible metadata JSON with `abi.encodePacked`, which otherwise triggers
      // "stack too deep" on the legacy codegen. IR also gives us better optimization
      // for the read-heavy view functions we expose to the MiniPay RPC.
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Celo Mainnet (chainId 42220) — única red de despliegue real del proyecto.
    celo: {
      url: process.env.CELO_RPC_URL || "https://forno.celo.org",
      accounts: PK ? [PK] : [],
      chainId: 42220,
      // Si CELO_GAS_PRICE_WEI no está definido, omitimos `gasPrice` para que
      // Hardhat/viem usen estimación dinámica (EIP-1559) y siempre superen la
      // minimum base fee del sequencer. Con override se respeta el valor fijo.
      ...(manualGasPrice !== undefined ? { gasPrice: manualGasPrice } : {}),
    },
    // Local development (hardhat node).
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    // Etherscan v2 multichain (unified API).
    apiKey: process.env.ETHERSCAN_API_KEY || "",
    customChains: [
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.etherscan.io/v2/api",
          browserURL: "https://celoscan.io",
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};

export default config;
