import React, { useEffect } from 'react'
import { createAppKit } from '@reown/appkit'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {
  arbitrum,
  mainnet,
  optimism,
  polygon,
  solana,
  solanaDevnet,
  solanaTestnet
} from '@reown/appkit/networks'

// Get projectId from environment variables (make sure to use NEXT_PUBLIC_ for client-side)
const projectId =
  process.env.NEXT_PUBLIC_VITE_PROJECT_ID ||
  'b56e18d47c72ab683b10814fe9495694' // public projectId for localhost

const AppKitPage: React.FC = () => {
  useEffect(() => {
    // Define supported networks
    const networks = [
      mainnet,
      polygon,
      arbitrum,
      optimism,
      solana,
      solanaDevnet,
      solanaTestnet
    ]

    // Create adapters for EVM (Wagmi) and Solana
    const wagmiAdapter = new WagmiAdapter({
      networks,
      projectId
    })

    const solanaAdapter = new SolanaAdapter()

    // Instantiate AppKit with the chosen adapters and configuration options
    const modal = createAppKit({
      adapters: [wagmiAdapter, solanaAdapter],
      networks,
      projectId,
      themeMode: 'light',
      features: {
        analytics: true
      },
      featuredWalletIds: [
        'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa'
      ],
      metadata: {
        name: 'Definitive Solana App Kit',
        description: 'Solana App Kit Example',
        url: 'https://www.definitive.fi',
        icons: ['https://avatars.githubusercontent.com/u/179229932?s=200&v=4']
      }
    })

    // Local state holders (updated via subscriptions)
    let accountState: any = {}
    let accountStateEvm: any = {}
    let accountStateSolana: any = {}
    let networkState: any = {}
    let appKitState: any = {}
    let themeState: any = { themeMode: 'light', themeVariables: {} }
    let events: any = []
    let walletInfo: any = {}
    let eip155Provider: any = null

    // Helper function to update theme (here we simply toggle a dark class on the <html> element)
    const updateTheme = (mode: string) => {
      document.documentElement.classList.toggle('dark', mode === 'dark')
    }

    // Subscribe to state changes and update corresponding DOM elements
    modal.subscribeAccount(state => {
      accountState = state
      const el = document.getElementById('accountState')
      if (el) el.textContent = JSON.stringify(state, null, 2)
    })

    modal.subscribeAccount(state => {
      accountStateEvm = state
      const el = document.getElementById('accountStateEvm')
      if (el) el.textContent = JSON.stringify(state, null, 2)
    }, 'eip155')

    modal.subscribeAccount(state => {
      accountStateSolana = state
      const el = document.getElementById('accountStateSolana')
      if (el) el.textContent = JSON.stringify(state, null, 2)
    }, 'solana')

    modal.subscribeNetwork(state => {
      networkState = state
      const el = document.getElementById('networkState')
      if (el) el.textContent = JSON.stringify(state, null, 2)
    })

    modal.subscribeState(state => {
      appKitState = state
      const el = document.getElementById('appKitState')
      if (el) el.textContent = JSON.stringify(state, null, 2)
    })

    modal.subscribeTheme(state => {
      themeState = state
      const el = document.getElementById('themeState')
      if (el) el.textContent = JSON.stringify(state, null, 2)
      updateTheme(state.themeMode)
    })

    modal.subscribeEvents(state => {
      events = state
      const el = document.getElementById('events')
      if (el) el.textContent = JSON.stringify(state, null, 2)
    })

    modal.subscribeWalletInfo(state => {
      walletInfo = state
      const el = document.getElementById('walletInfo')
      if (el) el.textContent = JSON.stringify(state, null, 2)
    })

    modal.subscribeProviders(state => {
      eip155Provider = state['eip155']
    })

    // Button event listeners
    document.getElementById('toggle-theme')?.addEventListener('click', () => {
      const newTheme = themeState.themeMode === 'dark' ? 'light' : 'dark'
      modal.setThemeMode(newTheme)
      themeState = { ...themeState, themeMode: newTheme }
      updateTheme(newTheme)
    })

    document.getElementById('switch-network')?.addEventListener('click', () => {
      const currentChainId = networkState?.chainId
      // Switch between Polygon and Mainnet as an example
      modal.switchNetwork(currentChainId === polygon.id ? mainnet : polygon)
    })

    // New button to switch explicitly to Solana
    document.getElementById('switch-to-solana')?.addEventListener('click', () => {
      modal.switchNetwork(solana)
    })

    document.getElementById('sign-message')?.addEventListener('click', async () => {
      if (!accountState.address) {
        await modal.open()
        return
      }
      signMessage()
    })

    document.getElementById('open-modal')?.addEventListener('click', () => {
      modal.open()
    })

    document.getElementById('disconnect')?.addEventListener('click', () => {
      modal.disconnect()
    })

    document.getElementById('switch-to-ethereum')?.addEventListener('click', () => {
      modal.switchNetwork(mainnet)
    })

    async function signMessage() {
      if (eip155Provider && accountState.address) {
        try {
          await eip155Provider.request({
            method: 'personal_sign',
            params: ['Hello from Solana Definitive AppKit!', accountState.address]
          })
        } catch (error) {
          console.error('Error signing message:', error)
        }
      }
    }
  }, [])

  return (
    <div className="max-w-screen-xl mx-auto p-8 flex flex-col items-center gap-6">
      <h1 className="text-center text-gray-600 text-2xl my-5">AppKit HTML Example</h1>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button id="toggle-theme" className="inline-flex text-sm p-4 rounded-lg bg-blue-100 text-blue-600 hover:rounded-xl active:shadow-inner">
          Toggle Theme
        </button>
        <button id="switch-network" className="inline-flex text-sm p-4 rounded-lg bg-blue-100 text-blue-600 hover:rounded-xl active:shadow-inner">
          Switch Network (Polygon/Mainnet)
        </button>
        <button id="switch-to-solana" className="inline-flex text-sm p-4 rounded-lg bg-blue-100 text-blue-600 hover:rounded-xl active:shadow-inner">
          Switch to Solana
        </button>
        <button id="sign-message" className="inline-flex text-sm p-4 rounded-lg bg-blue-100 text-blue-600 hover:rounded-xl active:shadow-inner">
          Sign Message
        </button>
        <button id="open-modal" className="inline-flex text-sm p-4 rounded-lg bg-blue-100 text-blue-600 hover:rounded-xl active:shadow-inner">
          Open Modal
        </button>
        <button id="disconnect" className="inline-flex text-sm p-4 rounded-lg bg-blue-100 text-blue-600 hover:rounded-xl active:shadow-inner">
          Disconnect
        </button>
        <button id="switch-to-ethereum" className="inline-flex text-sm p-4 rounded-lg bg-blue-100 text-blue-600 hover:rounded-xl active:shadow-inner">
          Switch to Ethereum
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="border border-gray-300 rounded-md p-2">
          <div className="text-lg font-bold mb-2 p-1 pb-2 border-b border-gray-300 font-mono">
            Account State
          </div>
          <pre id="accountState" className="whitespace-pre-wrap font-mono text-sm"></pre>
        </div>
        <div className="border border-gray-300 rounded-md p-2">
          <div className="text-lg font-bold mb-2 p-1 pb-2 border-b border-gray-300 font-mono">
            Account State (EVM)
          </div>
          <pre id="accountStateEvm" className="whitespace-pre-wrap font-mono text-sm"></pre>
        </div>
        <div className="border border-gray-300 rounded-md p-2">
          <div className="text-lg font-bold mb-2 p-1 pb-2 border-b border-gray-300 font-mono">
            Account State (Solana)
          </div>
          <pre id="accountStateSolana" className="whitespace-pre-wrap font-mono text-sm"></pre>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="border border-gray-300 rounded-md p-2">
          <div className="text-lg font-bold mb-2 p-1 pb-2 border-b border-gray-300 font-mono">
            Network State
          </div>
          <pre id="networkState" className="whitespace-pre-wrap font-mono text-sm"></pre>
        </div>
        <div className="border border-gray-300 rounded-md p-2">
          <div className="text-lg font-bold mb-2 p-1 pb-2 border-b border-gray-300 font-mono">
            AppKit State
          </div>
          <pre id="appKitState" className="whitespace-pre-wrap font-mono text-sm"></pre>
        </div>
        <div className="border border-gray-300 rounded-md p-2">
          <div className="text-lg font-bold mb-2 p-1 pb-2 border-b border-gray-300 font-mono">
            Theme State
          </div>
          <pre id="themeState" className="whitespace-pre-wrap font-mono text-sm"></pre>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="border border-gray-300 rounded-md p-2">
          <div className="text-lg font-bold mb-2 p-1 pb-2 border-b border-gray-300 font-mono">
            Events
          </div>
          <pre id="events" className="whitespace-pre-wrap font-mono text-sm"></pre>
        </div>
        <div className="border border-gray-300 rounded-md p-2">
          <div className="text-lg font-bold mb-2 p-1 pb-2 border-b border-gray-300 font-mono">
            Wallet Info
          </div>
          <pre id="walletInfo" className="whitespace-pre-wrap font-mono text-sm"></pre>
        </div>
      </div>
    </div>
  )
}

export default AppKitPage
