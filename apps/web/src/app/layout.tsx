import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Navbar } from '@/components/navbar';
import { WalletProvider } from "@/components/wallet-provider";
import { InventoryProvider } from "@/context/InventoryContext";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Road App — Aprende Web3 jugando',
  description:
    'Mini App educativa en Celo MiniPay: aprende blockchain capturando cartas NFT por fases.',
  applicationName: 'Road App',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Road App',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
  formatDetection: {
    telephone: false,
  },
};

/**
 * Celopedia / MiniPay requirements:
 *   - El WebView de MiniPay garantiza un ancho mínimo de 360px y altura 640px.
 *     Bloqueamos zoom para evitar que el usuario haga pinch-to-zoom y rompa
 *     el layout mobile-first (regla §4 "Mobile-First Resolution").
 *   - themeColor coincide con el primario indigo del navbar -> integra el
 *     header del WebView con la marca.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4f46e5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // suppressHydrationWarning evita el mismatch causado por extensiones del
  // navegador (LanguageTool inyecta data-lt-installed, Grammarly inyecta
  // data-new-gr-c-s-check-loaded, etc.) que mutan el <html>/<body> antes de
  // que React hidrate. Es la recomendación oficial de Next.js para este caso.
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
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
