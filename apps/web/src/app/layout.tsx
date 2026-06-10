import type { Metadata, Viewport } from 'next';
import './globals.css';

import { Navbar } from '@/components/navbar';
import { WalletProvider } from "@/components/wallet-provider";
import { InventoryProvider } from "@/context/InventoryContext";

/**
 * NOTE: We intentionally do NOT use `next/font/google` (Inter) here.
 *
 * OpenNext on Cloudflare Workers cannot reliably fetch Google Fonts during
 * SSR — the missing font subset turns into a 500 "Internal Server Error" on
 * the very first request. Loading the stylesheet via <link> in <head> is the
 * recommended workaround and gives the exact same visual result (Inter falls
 * back gracefully to the system sans-serif while the woff2 streams in).
 */

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
  // Icons are auto-detected by Next.js from `app/icon.svg` and
  // `app/apple-icon.svg` — no need to list them here.
  formatDetection: {
    telephone: false,
  },
  // Talent Protocol (talentapp.xyz) domain ownership verification. Required
  // for the project to claim its Builder Score / Talent profile. The token
  // value is unique per project and was issued by Talent Protocol; rotating
  // it requires re-verifying ownership of the domain.
  other: {
    'talentapp:project_verification':
      '796bb2ef87b1084ba83f13810fa1fab3a8cb70dbdc744c9bf9b9a6ee03babf48db2ebb361f06f5b8e1af2c33305dfd61caf5ab0eaa9a9d37bf5c6f54d5ee2143',
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
      <head>
        {/*
          Preconnect + Inter stylesheet served by Google Fonts CDN. This is the
          Cloudflare-Workers-safe replacement for `next/font/google`.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body
        className="font-sans"
        style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
        suppressHydrationWarning
      >
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
