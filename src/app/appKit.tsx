// import React, { useEffect } from 'react'
// import { createAppKit } from '@reown/appkit'
// import { SolanaAdapter } from '@reown/appkit-adapter-solana'
// import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
// import {
//   arbitrum,
//   mainnet,
//   optimism,
//   polygon,
//   solana,
//   solanaDevnet,
//   solanaTestnet
// } from '@reown/appkit/networks'

// // Get projectId from environment variables (make sure to use NEXT_PUBLIC_ for client-side)
// const projectId =
//   process.env.NEXT_PUBLIC_VITE_PROJECT_ID ||
//   'b56e18d47c72ab683b10814fe9495694' // public projectId for localhost

// const AppKitPage: React.FC = () => {
//   useEffect(() => {
//     // Define supported networks
//     const networks = [
//       mainnet,
//       polygon,
//       arbitrum,
//       optimism,
//       solana,
//       solanaDevnet,
//       solanaTestnet
//     ]

//     // Create adapters for EVM (Wagmi) and Solana
//     const wagmiAdapter = new WagmiAdapter({
//       networks,
//       projectId
//     })

//     const solanaAdapter = new SolanaAdapter()

//     // Instantiate AppKit with the chosen adapters and configuration options
//     const modal = createAppKit({
//       adapters: [wagmiAdapter, solanaAdapter],
//       networks,
//       projectId,
//       themeMode: 'light',
//       features: {
//         analytics: true
//       },
//       featuredWalletIds: [
//         'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa'
//       ],
//       metadata: {
//         name: 'Deginitive Solana Connect',
//         description: 'Solana Connect Example',
//         url: 'https://www.definitive.fi/',
//         icons: ['https://avatars.githubusercontent.com/u/179229932?s=200&v=4']
//       }
//     })

//     // Local state holders (updated via subscriptions)
//     let accountState: any = {}
//     let accountStateEvm: any = {}
//     let accountStateSolana: any = {}
//     let networkState: any = {}
//     let appKitState: any = {}
//     let themeState: any = { themeMode: 'light', themeVariables: {} }
//     let events: any = []
//     let walletInfo: any = {}
//     let eip155Provider: any = null

//     // Helper function to update theme & swap logo
//     const updateTheme = (mode: string) => {
//       document.documentElement.setAttribute('data-theme', mode)
//       document.body.className = mode

//       const reownLogo = document.getElementById('reown-logo') as HTMLImageElement
//       if (reownLogo) {
//         reownLogo.src = mode === 'dark' ? '/reown-logo-white.png' : '/reown-logo.png'
//       }
//     }

//     // Subscribe to state changes and update corresponding DOM elements
//     modal.subscribeAccount(state => {
//       accountState = state
//       const el = document.getElementById('accountState')
//       if (el) el.textContent = JSON.stringify(state, null, 2)
//     })

//     modal.subscribeAccount(state => {
//       accountStateEvm = state
//       const el = document.getElementById('accountStateEvm')
//       if (el) el.textContent = JSON.stringify(state, null, 2)
//     }, 'eip155')

//     modal.subscribeAccount(state => {
//       accountStateSolana = state
//       const el = document.getElementById('accountStateSolana')
//       if (el) el.textContent = JSON.stringify(state, null, 2)
//     }, 'solana')

//     modal.subscribeNetwork(state => {
//       networkState = state
//       const el = document.getElementById('networkState')
//       if (el) el.textContent = JSON.stringify(state, null, 2)
//     })

//     modal.subscribeState(state => {
//       appKitState = state
//       const el = document.getElementById('appKitState')
//       if (el) el.textContent = JSON.stringify(state, null, 2)
//     })

//     modal.subscribeTheme(state => {
//       themeState = state
//       const el = document.getElementById('themeState')
//       if (el) el.textContent = JSON.stringify(state, null, 2)
//       updateTheme(state.themeMode)
//     })

//     modal.subscribeEvents(state => {
//       events = state
//       const el = document.getElementById('events')
//       if (el) el.textContent = JSON.stringify(state, null, 2)
//     })

//     modal.subscribeWalletInfo(state => {
//       walletInfo = state
//       const el = document.getElementById('walletInfo')
//       if (el) el.textContent = JSON.stringify(state, null, 2)
//     })

//     modal.subscribeProviders(state => {
//       eip155Provider = state['eip155']
//     })

//     // Button event listeners (using old‑style document.getElementById)
//     document.getElementById('toggle-theme')?.addEventListener('click', () => {
//       const newTheme = themeState.themeMode === 'dark' ? 'light' : 'dark'
//       modal.setThemeMode(newTheme)
//       themeState = { ...themeState, themeMode: newTheme }
//       updateTheme(newTheme)
//     })

//     document.getElementById('switch-network')?.addEventListener('click', () => {
//       const currentChainId = networkState?.chainId
//       modal.switchNetwork(currentChainId === polygon.id ? mainnet : polygon)
//     })

//     document.getElementById('switch-to-solana')?.addEventListener('click', () => {
//       modal.switchNetwork(solana)
//     })

//     document.getElementById('sign-message')?.addEventListener('click', async () => {
//       if (!accountState.address) {
//         await modal.open()
//         return
//       }
//       signMessage()
//     })

//     document.getElementById('open-modal')?.addEventListener('click', () => {
//       modal.open()
//     })

//     document.getElementById('disconnect')?.addEventListener('click', () => {
//       modal.disconnect()
//     })

//     document.getElementById('switch-to-ethereum')?.addEventListener('click', () => {
//       modal.switchNetwork(mainnet)
//     })

//     async function signMessage() {
//       if (eip155Provider && accountState.address) {
//         try {
//           await eip155Provider.request({
//             method: 'personal_sign',
//             params: ['Hello from AppKit!', accountState.address]
//           })
//         } catch (error) {
//           console.error('Error signing message:', error)
//         }
//       }
//     }

//     // Set initial theme
//     updateTheme(themeState.themeMode)
//   }, [])

//   return (
//     <div className="page-container">
//       <h1 className="page-title">AppKit HTML Example</h1>
//       <div className="logo-container">
//         <img id="reown-logo" alt="Reown Logo" src="/reown-logo.png" />
//       </div>
//       <div className="action-button-list">
//         <button id="toggle-theme">Toggle Theme</button>
//         <button id="switch-network">Switch Network</button>
//         <button id="switch-to-solana">Switch to Solana</button>
//         <button id="sign-message">Sign Message</button>
//         <button id="open-modal">Open Modal</button>
//         <button id="disconnect">Disconnect</button>
//         <button id="switch-to-ethereum">Switch to Ethereum</button>
//       </div>
//       <div className="code-container-wrapper">
//         <div className="code-container">
//           <div className="code-container-title">Account State</div>
//           <pre id="accountState"></pre>
//         </div>
//         <div className="code-container">
//           <div className="code-container-title">Account State (EVM)</div>
//           <pre id="accountStateEvm"></pre>
//         </div>
//         <div className="code-container">
//           <div className="code-container-title">Account State (Solana)</div>
//           <pre id="accountStateSolana"></pre>
//         </div>
//       </div>
//       <div className="code-container-wrapper">
//         <div className="code-container">
//           <div className="code-container-title">Network State</div>
//           <pre id="networkState"></pre>
//         </div>
//         <div className="code-container">
//           <div className="code-container-title">AppKit State</div>
//           <pre id="appKitState"></pre>
//         </div>
//         <div className="code-container">
//           <div className="code-container-title">Theme State</div>
//           <pre id="themeState"></pre>
//         </div>
//       </div>
//       <div className="code-container-wrapper">
//         <div className="code-container">
//           <div className="code-container-title">Events</div>
//           <pre id="events"></pre>
//         </div>
//         <div className="code-container">
//           <div className="code-container-title">Wallet Info</div>
//           <pre id="walletInfo"></pre>
//         </div>
//       </div>

//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

//         :root {
//           --apkt-background-primary: hsl(0 0% 100%);
//           --apkt-background-invert: hsl(0 0% 13%);
//           --apkt-foreground-accent-primary-010: rgba(9, 136, 240, 0.1);
//           --apkt-border: hsl(0 0% 91%);
//           --apkt-border-secondary: hsl(0 0% 82%);
//           --apkt-text-primary: hsl(0 0% 13%);
//           --apkt-text-accent-primary: rgba(9, 136, 240, 1);
//           --apkt-text-secondary: hsl(0 0% 60%);
//           --apkt-border-sm: 8px;
//           --page-background-image-color: hsl(0, 0%, 87%);
//         }

//         .dark {
//           --apkt-background-primary: hsl(0 0% 13%);
//           --apkt-background-invert: hsl(0 0% 100%);
//           --apkt-border: hsl(0 0% 16%);
//           --apkt-border-secondary: hsl(0, 0%, 22%);
//           --apkt-text-primary: hsl(0 0% 100%);
//           --apkt-text-secondary: hsl(0 0% 60%);
//           --page-background-image-color: hsl(0deg 0% 17.25%);
//         }

//         html,
//         body {
//           max-width: 100vw;
//           overflow-x: hidden;
//         }

//         body {
//           color: var(--apkt-text-primary);
//           background: var(--apkt-background-primary);
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
//             Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
//           -webkit-font-smoothing: antialiased;
//           -moz-osx-font-smoothing: grayscale;
//         }

//         ::selection {
//           background: rgba(0, 0, 0, 0.1);
//         }

//         .dark ::selection {
//           background: rgba(255, 255, 255, 0.1);
//         }

//         img {
//           user-drag: none;
//           user-select: none;
//           -moz-user-select: none;
//           -webkit-user-drag: none;
//           -webkit-user-select: none;
//           -ms-user-select: none;
//         }

//         * {
//           box-sizing: border-box;
//           padding: 0;
//           margin: 0;
//         }

//         a {
//           color: inherit;
//           text-decoration: none;
//         }

//         button {
//           display: inline-flex;
//           font-size: 14px;
//           padding: 1rem 1.5rem;
//           justify-content: center;
//           align-items: center;
//           gap: 0.5rem;
//           border-radius: 16px;
//           background: var(--apkt-foreground-accent-primary-010);
//           color: var(--apkt-text-accent-primary);
//           border: none;
//           transition: border-radius 0.3s ease;
//           will-change: border-radius;
//         }

//         button:hover {
//           border-radius: 24px;
//         }

//         button:active {
//           box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.4);
//         }

//         h1 {
//           margin: 20px;
//         }

//         pre {
//           white-space: pre-wrap;
//           word-wrap: break-word;
//           font-family: 'JetBrains Mono', monospace;
//         }

//         a {
//           display: inline-flex;
//           padding: 0px;
//           justify-content: center;
//           align-items: center;
//           color: var(--apkt-text-secondary);
//         }

//         a:active {
//           color: var(--apkt-text-primary);
//         }

//         a:focus {
//           color: var(--apkt-text-accent-primary);
//         }

//         a:hover {
//           text-decoration-line: underline;
//           text-decoration-style: solid;
//           text-decoration-skip-ink: none;
//           text-decoration-thickness: auto;
//           text-underline-offset: auto;
//         }

//         a:disabled {
//           opacity: 0.3;
//         }

//         .page-title {
//           color: var(--apkt-text-secondary);
//           text-align: center;
//         }

//         .page-container {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           gap: 24px;
//           padding: 2rem 1rem;
//           max-width: 1200px;
//           width: 100%;
//           margin: 0 auto;
//         }

//         .logo-container {
//           display: flex;
//           flex-direction: row;
//           align-items: center;
//           justify-content: center;
//           gap: 8px;
//         }

//         .appkit-buttons-container {
//           display: flex;
//           flex-direction: row;
//           align-items: center;
//           justify-content: center;
//           gap: 8px;
//           flex-wrap: wrap;
//           width: 100%;
//           border: 1px solid var(--apkt-border-secondary);
//           border-radius: 8px;
//           padding: 8px;
//           min-height: 200px;
//           background-image: radial-gradient(var(--page-background-image-color) 1px, #ffffff00 1px);
//           background-size: 16px 16px;
//           background-position: -16px -8px;
//         }

//         .action-button-list {
//           display: flex;
//           flex-direction: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 8px;
//           flex-wrap: wrap;
//         }

//         .code-container-wrapper {
//           display: grid;
//           grid-template-columns: repeat(3, minmax(0, 1fr));
//           gap: 16px;
//           max-width: 1200px;
//           width: 100%;
//           margin: 0 auto;
//         }

//         .code-container {
//           border: 1px solid var(--apkt-border-secondary);
//           border-radius: 8px;
//           padding: 8px;
//           margin: 0px;
//           width: 100%;
//         }

//         .code-container-title {
//           font-size: 1.25rem;
//           font-weight: bold;
//           margin-bottom: 10px;
//           padding: 0.25rem;
//           padding-bottom: 0.5rem;
//           border-bottom: 1px solid var(--apkt-border-secondary);
//           font-family: 'JetBrains Mono', monospace;
//         }

//         .code-container-content {
//           font-size: 14px;
//           line-height: 1.5;
//           height: 250px;
//           overflow: auto;
//         }

//         .footer {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           gap: 8px;
//           flex-wrap: wrap;
//         }

//         .warning {
//           color: var(--apkt-text-secondary);
//           font-size: 12px;
//         }

//         @media screen and (max-width: 768px) {
//           .logo-container {
//             flex-direction: column;
//           }
//           .code-container-wrapper {
//             grid-template-columns: 1fr;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }

// export default AppKitPage


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
            params: ['Hello from AppKit!', accountState.address]
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
      <div className="flex flex-col md:flex-row items-center justify-center gap-2">
        <img id="reown-logo" className="w-32" alt="Reown Logo" src="/reown-logo.png" />
      </div>
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
