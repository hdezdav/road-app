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
    },
    // Local development (hardhat node).
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    // Etherscan v2 multichain (unified API).
    apiKey: {
      celo: process.env.ETHERSCAN_API_KEY || "",
    },
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
