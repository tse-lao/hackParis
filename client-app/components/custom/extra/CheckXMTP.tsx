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
      //
      //check if the user is on the network
      const checkExist = async function () {
        if (await Client.canMessage(address)) {
          setIsOnNetwork(true);
        }
        setLoading(false);
      };
      checkExist();
    }
  }, [address]);

  if (loading) return <div> Loading... </div>;
  return (
    <div>
      {/* Display XMTP connection options if connected but not initialized */}
      {address && !isOnNetwork ? (
          <Button onClick={initXmtp}>Connect to XMTP</Button>
      ) : (
        <div className="bg-green-500 p-4 rounded-md text-black">You are connect</div>
      )}
    </div>
  );
}
