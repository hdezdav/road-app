import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Navbar } from '@/components/navbar';
import { WalletProvider } from "@/components/wallet-provider";
import { InventoryProvider } from "@/context/InventoryContext";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Road App',
  description: 'Learn Web3 by playing an interactive card game on Celo MiniPay!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <WalletProvider>
            <InventoryProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
            </InventoryProvider>
          </WalletProvider>
        </div>
      </body>
    </html>
  );
}
