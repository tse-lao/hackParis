"use client"
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Button, Web3Modal } from '@web3modal/react'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { arbitrum, mainnet, polygon } from 'wagmi/chains'

const chains = [arbitrum, mainnet, polygon]
const projectId = process.env.NEXT_PUBLIC_WALLET_CLIENT_ID as string;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

export default function App({children}: {children: React.ReactNode}) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
          <div className="fixed top-10 left-[50%]">
            <Web3Button />
          </div>
        {children}
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  )
}