"use client"
import { Button } from '@/components/ui/button'
import { decode } from '@/lib/wld'
import { ABI, CONTRACTS } from '@/services/contracts'
import { Web3Button } from '@web3modal/react'
import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { useState } from 'react'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'

export default function Worldcoin() {
	const { address } = useAccount()
	const [proof, setProof] = useState<ISuccessResult | null>(null)
	const {data: isClaimed, isLoading} = useContractRead({
		address: CONTRACTS.mumbai.worldcoin,
		abi: ABI.mumbai.worldcoin,
		functionName: 'isClaimed',
		args: [address],
	});

	const { config } = usePrepareContractWrite({
		address: CONTRACTS.mumbai.worldcoin as `0x${string}`,
		abi: ABI.mumbai.worldcoin,
		enabled: proof != null && address != null,
		functionName: 'MintHumanBadge',
		args: [
			address!,
			proof?.merkle_root ? decode<BigInt>('uint256', proof?.merkle_root ?? '') : BigInt(0),
			proof?.nullifier_hash ? decode<BigInt>('uint256', proof?.nullifier_hash ?? '') : BigInt(0),
			proof?.proof
				? decode<[BigInt, BigInt, BigInt, BigInt, BigInt, BigInt, BigInt, BigInt]>(
						'uint256[8]',
						proof?.proof ?? ''
				  )
				: [
						BigInt(0),
						BigInt(0),
						BigInt(0),
						BigInt(0),
						BigInt(0),
						BigInt(0),
						BigInt(0),
						BigInt(0),
				  ],
		],
	})
	const { write } = useContractWrite(config)

	if(isLoading) return <div>Loading...</div>
	return (
		<main>
			{address ? (
				isClaimed ? (
				proof ? (
					<Button onClick={write}
                        className="hover:bg-purple-700"
                    >Claim Token</Button>
				) : (
					<IDKitWidget
						app_id="app_17dda298a99fac82b669a6da6405db74" // must be an app set to on-chain
						action="worldcoin-human-soulbound-token"
						signal={address}
						onSuccess={setProof}
					>
						{({ open }) => <Button onClick={open} >Verify</Button>}
					</IDKitWidget>
				)
			):(
				<div className="bg-green-500 p-4 rounded-md text-black text-sm">Worldcoin verified!</div>
			)) : (
				<Web3Button />
			)}
		</main>
	)
}