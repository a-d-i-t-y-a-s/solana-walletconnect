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

// const config = createConfig({
//   chains: [mainnet, base],
//   multiInjectedProviderDiscovery: false,
//   transports: {
//     [mainnet.id]: http(),
//     [base.id]: http(),
//   },
// });


const queryClient = new QueryClient();

export default function Home() {
  const [solanaConnector, setSolanaConnector] = useState<any>(null);

  useEffect(() => {
    async function initProvider() {
      // Initialize the WalletConnect UniversalProvider.
      const universalProvider = await UniversalProvider.init({
        projectId: "YOUR_PROJECT_ID", // your WalletConnect/Reown project ID
        metadata: {
          name: "My Solana App",
          description: "My Solana app using WalletConnect",
          url: "https://example.com",
          icons: ["https://example.com/icon.png"],
        },
      });

      // Instantiate your custom Solana provider.
      const solanaProviderInstance = new SolanaWalletConnectProvider({
        provider: universalProvider,
        chains: [
          // Supply your CAIP chain objects here. For example:
          { caipNetworkId: "solana:mainnet-beta", name: "Solana Mainnet Beta" },
        ],
        getActiveChain: () => {
          // For simplicity, always return the mainnet object.
          return { caipNetworkId: "solana:mainnet-beta", name: "Solana Mainnet Beta" };
        },
      });

      // Wrap your custom provider in a Dynamic connector.
      const connector = SolanaWalletConnectorsWithConfig({
        provider: solanaProviderInstance,
        commitment: "confirmed",
        httpHeaders: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      setSolanaConnector(connector);
    }

    initProvider();
  }, []);

  // Until our connector is ready, render a loading indicator.
  if (!solanaConnector) {
    return <div>Loading...</div>;
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId: "YOUR_DYNAMIC_ENVIRONMENT_ID", // your Dynamic environment ID
        // Use only the Solana connector so that the connect modal uses your custom Solana provider.
        walletConnectors: [solanaConnector],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <div className="flex justify-center items-center min-h-screen">
          <DynamicWidget />
        </div>
      </QueryClientProvider>
    </DynamicContextProvider>
  );

  // return (
  //   <SolanaContext> 
  //     <DynamicContextProvider
  //       settings={{
  //         environmentId: "49fe48ee-7e43-4a46-9027-afba47426527",
  //         // Include the Solana connector in the walletConnectors array.
  //         walletConnectors: [
  //           SolanaWalletConnectorsWithConfig({
  //             commitment: 'confirmed',
  //             httpHeaders: {
  //               'X-Requested-With': 'XMLHttpRequest',
  //             },
  //           }),
  //           //EthereumWalletConnectors,
  //           //BitcoinWalletConnectors,
  //         ],
  //         // Optionally, if your Dynamic Dashboard expects a non‑EVM chain,
  //         // you might use a prop like solNetworks or similar as documented.
  //       }}
  //     >
  //       <WagmiProvider config={config}>
  //         <QueryClientProvider client={queryClient}>
  //           <DynamicWagmiConnector>
  //             <div className="flex justify-center items-center min-h-screen">
  //               <DynamicWidget />
  //             </div>
  //           </DynamicWagmiConnector>
  //         </QueryClientProvider>
  //       </WagmiProvider>
  //     </DynamicContextProvider>
  //   </SolanaContext>
  // );
}