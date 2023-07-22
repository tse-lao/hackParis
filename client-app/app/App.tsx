"use client"
import QuickCreateButton from '@/components/custom/extra/QuickCreateButton';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WagmiConfig, createConfig } from 'wagmi';

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Button, Web3Modal } from '@web3modal/react';
import { configureChains } from 'wagmi';
import { goerli, polygon, polygonMumbai } from 'wagmi/chains';

const chains = [goerli, polygonMumbai, polygon]
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string

console.log(projectId);

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
          <div className="fixed top-10 left-10">
            <Web3Button />
          </div>
          {children}
          <QuickCreateButton />
          <ToastContainer />
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />

    </>
  )
}