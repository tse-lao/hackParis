"use client"
import { Button } from '@/components/ui/button';
import {
  AuthType,
  ClaimRequest,
  useSismoConnect
} from "@sismo-core/sismo-connect-react";
import { FC, useEffect, useState } from "react";
import { encodeAbiParameters } from 'viem';
import { useAccount } from "wagmi";
const CONFIG_SISMO = {
  config: {
    appId: process.env.NEXT_PUBLIC_SISMO || "",
  },

};
  
  export const AUTHS = [{ authType: AuthType.VAULT }];
  
  export const CLAIMS: ClaimRequest[] = [
    {
      // Sismo Community Members
      groupId: "0xa565351b9db92b09f52ef99600a55921",
      isSelectableByUser: true,
    }, 
    {
      // Sismo Community Members
      groupId: "0xa565351b9db92b09f52ef99600a55921",
      isSelectableByUser: true,
    }
  ];
  
  
  
  interface ContributionAccessProps {
      nextStep: (step: number) => void
      getProof: (proof: string) => void
      claims: any
  }

   
  const ContributionAccess: FC<ContributionAccessProps> = ({nextStep, getProof, claims}) => {
    const { address } = useAccount();
    const [loading, setLoading] = useState(false);
    const { sismoConnect, responseBytes: sismoProof } = useSismoConnect(CONFIG_SISMO);


      const onSismoConnect = () => {
        if (!address) {
          return;
        }
    
    
        setLoading(true);
       
    
        sismoConnect.request({
          auths: AUTHS,
          claims: claims,
          signature: { message: encodeAbiParameters([{ type: 'address' }], [address]) },
        });
        setLoading(false);
      };
      
      useEffect(() => {

        if (sismoProof) {
          getProof(sismoProof);
        }
    
      }, [sismoProof]);
    
      return (
      <div className="flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md border flex flex-col gap-4">
          <span className="text-gray-600 text-md">
               Please provided that you have the corresponding access based on the following conditions: 
          </span>
          <ul className="list-disc list-inside text-md m-2 ">
              <li>You are in the possession of a WorldID</li>
              <li>You are a contributor to the developer hackathon-fvm</li>
          </ul>
          
      </div>
      {sismoProof ? (
        <Button disabled={loading} onClick={() => getProof(sismoProof)} >
          Proof accepted | continue
        </Button >
      ) : (
        <Button onClick={onSismoConnect} disabled={loading}>
          Sismo Connect
        </Button>
      )}
      </div>
      
      );
  }
   
  export default ContributionAccess;