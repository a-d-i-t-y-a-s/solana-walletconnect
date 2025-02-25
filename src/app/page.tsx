"use client"
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
// import { mainnet } from "viem/chains";
import { mainnet, arbitrum, avalanche, base, optimism, polygon, solana } from '@reown/appkit/networks'
import { BitcoinWalletConnectors } from "@dynamic-labs/bitcoin";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { SolanaWalletConnectorsWithConfig } from '@dynamic-labs/solana';
import { EthereumWalletConnectorsWithConfig } from '@dynamic-labs/ethereum';
import { WalletConnectWalletAdapter } from '@walletconnect/solana-adapter';
import { SolanaContext } from "./walletConnectAdapter";
import { SolanaWalletConnectProvider } from "./solanaWalletConnectProvider";
import React, { useEffect, useState } from "react";
import UniversalProvider from "@walletconnect/universal-provider";
import AppKitPage from "./appKit";


const config = createConfig({
  chains: [mainnet, base],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});


const queryClient = new QueryClient();

export default function Home() {
  return (
      // <DynamicContextProvider
      //   settings={{
      //     environmentId: "49fe48ee-7e43-4a46-9027-afba47426527",
      //     // Include the Solana connector in the walletConnectors array.
      //     walletConnectors: [
      //       SolanaWalletConnectorsWithConfig({
      //         commitment: 'confirmed',
      //         httpHeaders: {
      //           'X-Requested-With': 'XMLHttpRequest',
      //         },
      //       }),
      //       //EthereumWalletConnectors,
      //       //BitcoinWalletConnectors,
      //     ],
      //     // Optionally, if your Dynamic Dashboard expects a non‑EVM chain,
      //     // you might use a prop like solNetworks or similar as documented.
      //   }}
      // >
      //   <WagmiProvider config={config}>
      //     <QueryClientProvider client={queryClient}>
      //       <DynamicWagmiConnector>
      //         <div className="flex justify-center items-center min-h-screen">
      //           <DynamicWidget />
      //         </div>
      //       </DynamicWagmiConnector>
      //     </QueryClientProvider>
      //   </WagmiProvider>
      // </DynamicContextProvider>
      <AppKitPage />
  );
}