"use client";

import { useAccount, useBalance } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Saldos del usuario alineados con los requisitos de listado en MiniPay
 * (`minipay-requirements.md` §2 "Currency & Stablecoin Logic"):
 *
 *  - **Solo stablecoins**: USDm (Mento Dollar / antiguo cUSD), USDC y USDT.
 *    Nunca se muestra CELO en la UI: MiniPay oculta CELO al usuario y la
 *    fee abstraction (CIP-64) paga el "network fee" en stables.
 *  - **Direcciones canónicas** de la tabla oficial en `minipay-guide.md`:
 *      USDm  0x765DE816845861e75A25fCA122bb6898B8B1282a  (18 decimals)
 *      USDC  0xcebA9300f2b948710d2653dD7B07f33A8B32118C  ( 6 decimals)
 *      USDT  0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e  ( 6 decimals)
 *  - **No mostramos la address `0x…` completa** como identidad primaria
 *    (regla §1 "Phone-First Identity"). Mostramos sólo una versión truncada
 *    como pista secundaria. Cuando integremos ODIS+FederatedAttestations
 *    podremos sustituir esto por el número de teléfono del usuario.
 *
 * `wagmi.useBalance` ya formatea según los decimales del token; usamos el
 * campo `formatted` para no hardcodear conversiones por token.
 */
const USDM_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";
const USDC_ADDRESS = "0xcebA9300f2b948710d2653dD7B07f33A8B32118C";
const USDT_ADDRESS = "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e";

function truncate(addr: `0x${string}`) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function BalanceDisplay({
  address,
  token,
  symbol,
}: {
  address: `0x${string}`;
  token: `0x${string}`;
  symbol: string;
}) {
  const { data, isLoading } = useBalance({ address, token });

  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{symbol}</span>
      <span className="font-medium">
        {isLoading ? "…" : `${parseFloat(data?.formatted || "0").toFixed(2)}`}
      </span>
    </div>
  );
}

export function UserBalance() {
  const { address, isConnected } = useAccount();

  if (!isConnected || !address) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Cuenta conectada</CardTitle>
        <p
          className="text-sm text-muted-foreground pt-1"
          title={address}
        >
          {truncate(address)}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 pt-2 border-t">
          <BalanceDisplay address={address} token={USDM_ADDRESS} symbol="USDm" />
          <BalanceDisplay address={address} token={USDC_ADDRESS} symbol="USDC" />
          <BalanceDisplay address={address} token={USDT_ADDRESS} symbol="USDT" />
        </div>
      </CardContent>
    </Card>
  );
}
