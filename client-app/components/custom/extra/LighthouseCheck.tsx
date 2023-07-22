"use client"
import { Button } from '@/components/ui/button';
import { getLighthouseKeys } from '@/services/lighthouse';
import lighthouse from "@lighthouse-web3/sdk";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Address, useAccount } from 'wagmi';


export default function LighthouseCheck() {
  const {address} = useAccount();  
  const [loggedIn, setloggedIn] = useState(false)
    const [balance, setBalance] = useState(0)  
  useEffect(() => {
    if(address && !loggedIn){
        //check if the user is on the network
        if(localStorage.getItem(`lighthouse-jwt-${address}`)){
            setloggedIn(true)
        }
    }
    
    if(address && loggedIn){
        //we want to get the balance from lighthouse and display it. 
        const getBalance = async function () {
            const lightbalance = await lighthouse.getBalance(address);
            setBalance(Math.round(lightbalance.data.dataUsed / 1200));
        }
        
        getBalance();
    }
    
    
    }, [address]);
    
    const setupLighthouse = async function () {
        await getLighthouseKeys(address as Address);
        toast.success("You are now connected to Lighthouse");
        setloggedIn(true)
        

    }
  return (
    <div>
        {address && !loggedIn ? (
            <Button onClick={setupLighthouse}>Connect to Lighthouse</Button>
        ):(
            <div className="p-2 rounded-md text-black">{balance} /<span className='text-gray-400 text-sm'>1200MB</span></div>
        )
        }
        
    </div>
  )
}
