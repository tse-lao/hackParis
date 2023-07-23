"use client";
import { Button } from "@/components/ui/button";
import { walletClientToSigner } from "@/lib/toSigner";

import { Client } from "@xmtp/xmtp-js";
import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";

export default function CheckXMTP() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [loading, setLoading] = useState(true);

  const initXmtp = async function () {
    // Create the XMTP client
    //convert wallet client to signer.
    const signer = walletClientToSigner(walletClient);

    const xmtp = await Client.create(signer, { env: "production" });

    setIsOnNetwork(!!xmtp.address);
  };

  useEffect(() => {
    if (address && !isOnNetwork) {
      const getData = async () => {
        const result = await fetch(
          `http://localhost:4000/airstack/hasXMTP?address=${address}`
        );
        const data = await result.json();
        setIsOnNetwork(data);
        setLoading(false);
      }
      getData();
     
    }
  }, [address]);

  if (loading) return <div> Loading... </div>;
  return (
    <div>
      {/* Display XMTP connection options if connected but not initialized */}
      {address && !isOnNetwork ? (
          <Button onClick={initXmtp}>Connect to XMTP</Button>
      ) : (
        <div className="bg-green-500 p-4 rounded-md text-black text-sm">You are connect</div>
      )}
    </div>
  );
}
