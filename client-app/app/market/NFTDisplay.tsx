"use client"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ABI, CONTRACTS } from "@/services/contracts"
import { useContractWrite } from "wagmi"


interface NFTDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  item: any
  width?: number
  height?: number
}

export function NFTDisplay({
  item,
  width,
  height,
  className,
  ...props
}: NFTDisplayProps) {
    const {write} = useContractWrite({
        address: CONTRACTS.mumbai.form,
        abi: ABI.mumbai.form,
        functionName: 'mint',
        args: [item.formID]
    })
    
  return (
    <div className={cn("space-y-3", className)} {...props}>
          <div className="overflow-hidden rounded-md w-full">

            <Image
              src={`https://ipfs.io/ipfs/bafybeihdmcbjjszphmfsenjq46et63ym2hwnb4kygm35lkxdl3sowgou4i`}
              alt={item.name}
              width={100}
              height={100}
              className={cn(
                "h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"
              )}
            />
          </div>

      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{item.name}</h3>
        <p className="text-xs text-muted-foreground">Contributions {item.totalContributions}</p>
        <Button onClick={() => {write()}}>Mint</Button>
      </div>
     
    </div>
  )
}