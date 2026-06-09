import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Navbar } from '@/components/navbar';
{{#if (eq templateType "farcaster-miniapp")}}
import Providers from "@/components/providers"
{{else if (eq walletProvider "rainbowkit")}}
import { WalletProvider } from "@/components/wallet-provider"
{{else if (eq walletProvider "thirdweb")}}
import { WalletProvider } from "@/components/wallet-provider"


const inter = Inter({ subsets: ['latin'] });

{{#if (eq templateType "farcaster-miniapp")}}
const appUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

// Embed metadata for Farcaster sharing
const frame = {
  version: "1",
  imageUrl: `${appUrl}/opengraph-image.png`,
  button: {
    title: "Launch {{#if miniappName}}{{miniappName}}{{else}}road-app",
    action: {
      type: "launch_frame",
      name: "{{#if miniappName}}{{miniappName}}{{else}}road-app",
      url: appUrl,
      splashImageUrl: `${appUrl}/icon.png`,
      splashBackgroundColor: "#ffffff",
    },
  },
};

export const metadata: Metadata = {
  title: '{{#if miniappName}}{{miniappName}}{{else}}road-app',
  description: '{{#if miniappDescription}}{{miniappDescription}}{{else}}a BlockChain Education Project para MiniPay',
  openGraph: {
    title: '{{#if miniappName}}{{miniappName}}{{else}}road-app',
    description: '{{#if miniappDescription}}{{miniappDescription}}{{else}}a BlockChain Education Project para MiniPay',
    images: [`${appUrl}/opengraph-image.png`],
  },
  other: {
    "fc:frame": JSON.stringify(frame),
  },
};
{{else}}
export const metadata: Metadata = {
  title: 'road-app',
  description: 'a BlockChain Education Project para MiniPay',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navbar is included on all pages */}
        <div className="relative flex min-h-screen flex-col">
          {{#if (eq templateType "farcaster-miniapp")}}
          <Providers>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </Providers>
          {{else if (or (eq walletProvider "rainbowkit") (eq walletProvider "thirdweb"))}}
          <WalletProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </WalletProvider>
          {{else}}
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          
        </div>
      </body>
    </html>
  );
}
