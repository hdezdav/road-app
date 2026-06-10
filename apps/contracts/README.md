# road-app — Smart Contracts

Tres contratos Solidity 0.8.28 que potencian el juego **Road App** en MiniPay sobre Celo:

| Contract              | Responsabilidad                                                                |
| --------------------- | ------------------------------------------------------------------------------ |
| `RoadAppNFTCards`     | ERC-721 (Enumerable + URIStorage) **soulbound** con 10 cartas y `tokenURI` on-chain. |
| `RoadAppGameState`    | Máquina de estado del jugador + **EIP-712** anti-trampa (bosses, seed backup). |
| `RoadAppDeckManager`  | Mazo activo persistente (≤ 10 NFT tokenIds) con validación de ownership.       |

Los tres siguen las recomendaciones de Celopedia para despliegues en Celo L2:
`Ownable2Step`, custom errors, EIP-712 typed data con nonces por jugador + deadline,
transfers soulbound, lectura de inventario en una sola RPC (`getOwnedCards`) para la
UX de MiniPay.

---

## 🚀 Quick Start

```bash
pnpm install
pnpm --filter hardhat compile
pnpm --filter hardhat test
```

### Deploy a Celo Mainnet

```bash
# 1. Configura .env (PRIVATE_KEY del deployer)

# 2. Fondea el deployer con CELO real (la cuenta de la PRIVATE_KEY).
#    Coste estimado: ~0.17 CELO @ 25 gwei.

# 3. Deploy
pnpm --filter hardhat deploy:celo
```

El script:
1. Despliega `RoadAppNFTCards` (con `NFT_BASE_METADATA_URI` del `.env` como fallback;
   el `tokenURI` real se genera on-chain como data URI base64).
2. Despliega `RoadAppDeckManager`.
3. Despliega `RoadAppGameState` (EIP-712 domain `RoadAppGameState v1`).
4. Cablea `GameState.setNFTContract(NFTCards)` y `NFTCards.setMinter(GameState, true)`.
5. Opcionalmente llama `GameState.setTrustedSigner(TRUSTED_SIGNER_ADDRESS)`.
6. Guarda direcciones en `deployments/<network>.json` e imprime los `NEXT_PUBLIC_*`
   que debes pegar en `apps/web/.env.local`.

### Verificar en Celoscan

```bash
pnpm --filter hardhat verify:celo <NFT_CARDS_ADDRESS> "https://raw.githubusercontent.com/road-app/metadata/main/"
pnpm --filter hardhat verify:celo <GAME_STATE_ADDRESS>
pnpm --filter hardhat verify:celo <DECK_MANAGER_ADDRESS> <NFT_CARDS_ADDRESS>
```

---

## 🌐 Red

| Network          | Chain ID    | RPC                                              | Explorer                       |
| ---------------- | ----------- | ------------------------------------------------ | ------------------------------ |
| Celo Mainnet     | 42220       | https://forno.celo.org                           | https://celoscan.io            |

> El proyecto solo soporta Celo Mainnet (chainId 42220). Para experimentación local
> usa `pnpm --filter hardhat deploy:localhost` contra un `hardhat node`.

---

## 🛡️ Security model

* **Soulbound NFTs**: `_update` en `RoadAppNFTCards` bloquea todo transfer con
  `from!=0 && to!=0`. Así `DeckManager.validateDeck` nunca queda stale por una venta.
* **EIP-712 anti-trampa**: cada `recordBossDefeat` incluye
  `(player, phase, nonce, deadline)` firmado por `trustedSigner`. La firma está
  atada a `chainId` y `verifyingContract`, así que un payload no se puede replayear
  en otra red.
* **Nonces por jugador**: en `nonces[player]`, leídos off-chain con `getNonce(player)`
  y consumidos en cada firma exitosa.
* **Ownable2Step**: `transferOwnership` requiere `acceptOwnership()` del nuevo owner,
  evitando perder admin por accidente (el incidente más típico en MiniPay: desplegar
  con un burner que luego se borra).
* **Custom errors** en lugar de revert strings: menos gas + decoding estructurado.

### Trusted signer setup

En OPEN MODE (`trustedSigner == address(0)`) las firmas NO son necesarias — solo
para dev/demo. Para activar el anti-trampa:

```ts
await gameState.write.setTrustedSigner(["0xYourBackendSignerEOA"]);
```

El backend off-chain construye el typed payload con viem/ethers usando domain
`{ name: "RoadAppGameState", version: "1", chainId, verifyingContract }` y tipo
`BossDefeat(address player,uint256 phase,uint256 nonce,uint256 deadline)`.
Ver `test/RoadApp.test.ts` para un ejemplo funcionando.

---

## 📁 Layout

```
contracts/
├── RoadAppNFTCards.sol       Soulbound ERC-721 + starter/boss/reward minting + on-chain tokenURI
├── RoadAppGameState.sol      EIP-712 player state machine
└── RoadAppDeckManager.sol    Active deck storage + validation

scripts/
└── deploy.ts                 Deterministic 3-contract deployment + wiring

test/
└── RoadApp.test.ts           Smoke tests (soulbound, EIP-712, deck)

hardhat.config.ts             solc 0.8.28 / evmVersion cancun / Celo Mainnet
```

---

## 🔐 Security notes

* Never commit `.env` con keys reales.
* Para mainnet, ideal usar hardware wallet vía conector Frame/Rabby en vez de
  `PRIVATE_KEY` en plano.

## 📚 Resources

* [Celo Developer Docs](https://docs.celo.org)
* [MiniPay docs](https://docs.celo.org/developer/build-on-minipay)
* [Hardhat](https://hardhat.org/docs)
* [Viem](https://viem.sh)
