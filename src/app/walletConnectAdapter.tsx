import { ReactNode, useMemo, useState } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'

import '@solana/wallet-adapter-react-ui/styles.css'

import { WalletConnectWalletAdapter } from '@walletconnect/solana-adapter'

export const SolanaContext = ({ children }: { children: ReactNode }) => {
	const endpoint = useMemo(() => clusterApiUrl(WalletAdapterNetwork.Mainnet), [])
	console.log("endpoint is: ", endpoint)
	const wallets = useMemo(
		() => [
			new WalletConnectWalletAdapter({
				network: WalletAdapterNetwork.Mainnet,
				options: {
					//id from dynamic dashboard for appkit
					projectId: '7569c63c696a4e8aeb3217c1b1332bd7',
				},
			}),
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	)

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>
					{children}
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	)
}