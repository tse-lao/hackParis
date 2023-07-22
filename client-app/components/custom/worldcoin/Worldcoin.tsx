"use client"
import { Button } from '@/components/ui/button'
import { decode } from '@/lib/wld'
import { ABI, CONTRACTS } from '@/services/contracts'
import { Web3Button } from '@web3modal/react'
import { IDKitWidget, ISuccessResult, solidityEncode } from '@worldcoin/idkit'
import { useState } from 'react'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'

export default function Worldcoin() {
	const { address } = useAccount()
	const [proof, setProof] = useState<ISuccessResult | null>(null)

	const { config } = usePrepareContractWrite({
		address: CONTRACTS.mumbai.worldcoin,
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

	return (
		<main>
			{address ? (
				proof ? (
					<Button onClick={write}
                        className="hover:bg-purple-700"
                    >Claim Token</Button>
				) : (
					<IDKitWidget
                        signal={address}
						action={solidityEncode(['uint256'], ["WHST"])}
						onSuccess={setProof}
						app_id={process.env.NEXT_PUBLIC_APP_ID!}
                        enableTelemetry
					>
						{({ open }) => <Button onClick={open} >verify with world id</Button>}
					</IDKitWidget>
				)
			) : (
				<Web3Button />
			)}
		</main>
	)
}