"use client";

import { RainbowKitProvider, connectorsForWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { WagmiProvider, createConfig, http, useConnect, useChainId, useSwitchChain, useAccount } from "wagmi";
import { celo } from "wagmi/chains";
import { SUPPORTED_CHAIN_ID } from "@/lib/contracts";

/**
 * Wallet setup aligned with Celopedia best practices for MiniPay:
 *
 *  - Single source of truth for the active chain (`SUPPORTED_CHAIN_ID` from contracts.ts).
 *    Solo soportamos Celo Mainnet (chainId 42220). Forno es público y rate-limited;
 *    batch en el transport coalescea los reads de wagmi para bajar la presión RPC.
 *  - MiniPay auto-connect via `window.ethereum.isMiniPay`.
 *  - Si una wallet de escritorio está en otra chain, pedimos switch proactivamente;
 *    sino los reads on-chain devuelven vacío en silencio (causa #1 de tickets
 *    "no veo mis NFTs").
 */
const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [injectedWallet],
    },
  ],
  {
    appName: "road-app",
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "placeholder-project-id",
  }
);

const wagmiConfig = createConfig({
  chains: [celo],
  connectors,
  transports: {
    [celo.id]: http(undefined, { batch: { batchSize: 64, wait: 16 } }),
  },
  ssr: true,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10_000,
      retry: 1,
    },
  },
});

function ChainGuard() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (!isConnected) return;
    if (chainId !== SUPPORTED_CHAIN_ID) {
      try {
        switchChain({ chainId: SUPPORTED_CHAIN_ID });
      } catch (e) {
        // MiniPay may reject programmatic chain switches: log and let the user choose manually.
        console.warn("Could not switch to supported chain:", e);
      }
    }
  }, [isConnected, chainId, switchChain]);

  return null;
}

function WalletProviderInner({ children }: { children: React.ReactNode }) {
  const { connect, connectors } = useConnect();

  useEffect(() => {
    // MiniPay injects window.ethereum.isMiniPay. Auto-connect the embedded burner.
    if (typeof window !== "undefined" && (window as any).ethereum?.isMiniPay) {
      const injectedConnector = connectors.find((c) => c.id === "injected");
      if (injectedConnector) {
        connect({ connector: injectedConnector });
      }
    }
  }, [connect, connectors]);

  return (
    <>
      <ChainGuard />
      {children}
    </>
  );
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <WalletProviderInner>{children}</WalletProviderInner>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
