# road-app

A **Blockchain Education Mini App** built for **MiniPay** on **Celo**.

Road App is a card-based learning game where players progress through three "phases"
that teach the core security concepts of self-custody on Celo (anti-phishing, seed
backup, smart-contract safety, L2 scaling, fee abstraction). Each phase ends with a
boss battle that, when defeated, mints an on-chain NFT card as proof of learning.

Built with Next.js 14, TypeScript, Hardhat + Viem, Wagmi/RainbowKit, Tailwind and
Turborepo. Designed to satisfy MiniPay's submission requirements (single chain,
stablecoin-only display, no `CELO`/"crypto"/"gas" wording, fee abstraction-ready).

---

## 📜 Deployed Contracts (Celo Mainnet — chainId `42220`)

All three contracts are live on Celo Mainnet and verified. You can inspect them on
[Celoscan](https://celoscan.io) or [Blockscout](https://celo.blockscout.com).

| Contract | Address | Purpose |
|---|---|---|
| **RoadAppNFTCards** | [`0x3e3adfd56091511e2e572e40cbb424d3bda54ca6`](https://celoscan.io/address/0x3e3adfd56091511e2e572e40cbb424d3bda54ca6) | ERC-721 collection of 10 educational cards. **Soulbound** (non-transferable). Metadata 100% on-chain via `data:application/json;base64,…` so MiniPay / MetaMask / OpenSea render it without IPFS gateways. Exposes a gas-efficient `getOwnedCards(player)` for mobile RPC. |
| **RoadAppGameState** | [`0xc977c3c1c48c0a24eff78c866f7fed7bfe5a1ff5`](https://celoscan.io/address/0xc977c3c1c48c0a24eff78c866f7fed7bfe5a1ff5) | Player state machine + anti-cheat. Uses **EIP-712** typed signatures with per-player nonces and `deadline` to gate `recordBossDefeat` and `verifySeedPhraseBackup`, blocking replays cross-chain and after restarts. Maintains a paginated on-chain leaderboard so the frontend never has to scan logs on Forno. |
| **RoadAppDeckManager** | [`0x0233dad6871a563e052cc3a3681264f8e0ce37cb`](https://celoscan.io/address/0x0233dad6871a563e052cc3a3681264f8e0ce37cb) | Stores each player's active battle deck (2–10 NFT cards). Validates ownership against `RoadAppNFTCards` on save and provides a cheap `validateDeck(player)` view for the battle screen. Because cards are soulbound, a saved deck can never become silently invalid. |

> **Security posture (audited against Celopedia `security-patterns`):**
> Ownable2Step on every contract · EIP-712 + nonce + deadline · OZ v5 ERC721Enumerable
> for O(balance) reads · soulbound `_update` hook · checks-effects-interactions ·
> custom errors instead of `require(string)` · no `block.timestamp`-based randomness ·
> no function is `payable` (fee abstraction handles gas in USDC/USDT/USDm).

### Quick contract addresses (env vars)

If you fork this project, set these in `apps/web/.env.local`:

```bash
NEXT_PUBLIC_CHAIN_ID=42220
NEXT_PUBLIC_NFT_CARDS_ADDRESS=0x3e3adfd56091511e2e572e40cbb424d3bda54ca6
NEXT_PUBLIC_GAME_STATE_ADDRESS=0xc977c3c1c48c0a24eff78c866f7fed7bfe5a1ff5
NEXT_PUBLIC_DECK_MANAGER_ADDRESS=0x0233dad6871a563e052cc3a3681264f8e0ce37cb
CELO_RPC_URL=https://forno.celo.org
```

---

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

To test inside MiniPay on a real phone, expose your local server with ngrok and
paste the HTTPS URL into MiniPay's "Open URL" developer flow.

---

## 🗂️ Project Structure

This is a monorepo managed by Turborepo:

- `apps/web` — Next.js 14 App Router frontend (MiniPay-ready)
- `apps/contracts` — Hardhat workspace with the 3 Solidity contracts, tests and deploy scripts
- `scripts/copy-abis.js` — Copies compiled ABIs from `apps/contracts/artifacts` into `apps/web/src/lib/abi` after each compile

---

## 🛠️ Available Scripts

- `pnpm dev` — Start the Next.js dev server
- `pnpm build` — Build all packages and apps
- `pnpm lint` — Lint everything
- `pnpm type-check` — TypeScript type-check

### Smart Contract Scripts

- `pnpm contracts:compile` — Compile Solidity + sync ABIs to the web app
- `pnpm contracts:test` — Run the Hardhat + Viem test suite
- `pnpm contracts:deploy` — Deploy to local Hardhat network
- `pnpm contracts:deploy:celo-sepolia` — Deploy to Celo Sepolia Testnet (chainId `11142220`)
- `pnpm contracts:deploy:celo` — Deploy to Celo Mainnet (chainId `42220`)

### Cloudflare Workers (frontend deployment)

The web app is deployed to **Cloudflare Workers** via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare).
Because this is a Turborepo monorepo, Cloudflare's auto-detection cannot find the project
from the root by itself. The root `package.json` exposes proxy scripts that forward to
`apps/web`, so the standard Cloudflare build settings work out of the box:

| Setting | Value |
|---|---|
| **Root directory** | `/` (repo root) |
| **Build command** | `pnpm run build:cloudflare` |
| **Deploy command** | `pnpm run deploy` |
| **Install command** | `pnpm install --frozen-lockfile` |

Locally you can run:

```bash
pnpm build:cloudflare   # builds apps/web with OpenNext
pnpm preview            # wrangler dev (local Worker preview)
pnpm deploy             # publishes to Cloudflare Workers
```

---

## 🧱 Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Smart Contracts**: Solidity `^0.8.20`, OpenZeppelin v5, Hardhat, Viem
- **Wallet**: Wagmi + RainbowKit (auto-detects MiniPay's injected provider)
- **Monorepo**: Turborepo + PNPM workspaces

---

## 📚 Learn More

- [Celo Documentation](https://docs.celo.org/)
- [MiniPay Developer Docs](https://docs.minipay.xyz/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
