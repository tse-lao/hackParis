"use client";

import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WagmiConfig, createConfig } from "wagmi";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Button, Web3Modal } from "@web3modal/react";
import Link from "next/link";
import { configureChains } from "wagmi";
import { goerli, polygon, polygonMumbai } from "wagmi/chains";

const chains = [goerli, polygonMumbai, polygon];
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string;

console.log(projectId);

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

let links = [
  {
    href: "/",
    name: "Overview",
  },
  {
    href: "/form",
    name: "Forms",
  },
  {
    href: "/voteform",
    name: "Vote Form",
  },
  {
    href: "/market",
    name: "Market",
  },
  {
    href: "/create",
    name: "Create Form",
  },
];
export default function App({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // get the params to display active link..
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <nav
          className={
            "flex  w-full my-2 items-center justify-center space-x-8 lg:space-x-12 text-uppercase mt-5"
          }
        >
          {links.map((link:any, index:number) => (
            <Link
              key={index}
              href={link.href}
              className={`text-spacing font-medium uppercase  ${
                pathname == link.href && "text-purple-600"
              } transition-colors hover:text-purple-400`}
            >
              {link.name}
            </Link>
          ))}
  
          <Web3Button />
        </nav>
        <div className="mt-12">{children}</div>
        <ToastContainer />
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
