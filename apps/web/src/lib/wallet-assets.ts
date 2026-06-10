/**
 * Helpers to ask the connected wallet (EIP-1193 provider) to track our ERC721
 * tokens via `wallet_watchAsset` (EIP-747), and to build Celoscan deep links.
 *
 * MetaMask supports `type: "ERC721"` since v10.18, MiniPay ignores it gracefully.
 * We don't throw on rejection: tracking is a "nice to have" UX boost.
 */

const isBrowser = () => typeof window !== "undefined";

function getInjectedProvider(): any | null {
  if (!isBrowser()) return null;
  // wagmi exposes the active provider on window.ethereum for browser wallets.
  // For WalletConnect/MiniPay this will be undefined and we simply no-op.
  return (window as any).ethereum ?? null;
}

/**
 * Ask the wallet to track a list of ERC721 tokenIds. Returns the number that
 * the wallet acknowledged (best-effort).
 */
export async function watchNFTsInWallet(
  contractAddress: `0x${string}`,
  tokenIds: bigint[]
): Promise<number> {
  const provider = getInjectedProvider();
  if (!provider?.request) return 0;

  let added = 0;
  for (const tokenId of tokenIds) {
    try {
      const ok = await provider.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC721",
          options: {
            address: contractAddress,
            tokenId: tokenId.toString(),
          },
        },
      });
      if (ok) added += 1;
    } catch {
      // User rejected or wallet doesn't support ERC721 watchAsset — ignore.
    }
  }
  return added;
}

/**
 * Build a Celoscan URL pointing at the user's NFT inventory for the given
 * contract. El proyecto solo soporta Celo Mainnet (42220); el parámetro
 * `chainId` se mantiene para forward-compat pero por ahora siempre devuelve
 * celoscan.io.
 */
export function getNftExplorerUrl(
  _chainId: number,
  contractAddress: `0x${string}`,
  holder: `0x${string}`
): string {
  // The "tokenholdings" view filters NFTs held by `holder` on `contractAddress`.
  return `https://celoscan.io/token/${contractAddress}?a=${holder}`;
}
