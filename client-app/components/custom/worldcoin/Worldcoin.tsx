"use client"
import { Button } from '@/components/ui/button'
import { decode } from '@/lib/wld'
import { BigNumber } from "ethers";
import { ABI, CONTRACTS } from '@/services/contracts'
import { Web3Button } from '@web3modal/react'
import { IDKitWidget, ISuccessResult, solidityEncode } from '@worldcoin/idkit'
import { useState } from 'react'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'

export default function Worldcoin() {
	const { address } = useAccount()
	const [proof, setProof] = useState<ISuccessResult | null>(null)

	const { config } = usePrepareContractWrite({
		address: CONTRACTS.mumbai.worldcoin as `0x${string}`,
		abi: ABI.mumbai.worldcoin,
		enabled: proof != null && address != null,
		functionName: 'MintHumanBadge',
		args: [
			address!,
			proof?.merkle_root ? decode<BigNumber>('uint256', proof?.merkle_root ?? '') : BigNumber.from(0),
			proof?.nullifier_hash ? decode<BigNumber>('uint256', proof?.nullifier_hash ?? '') : BigNumber.from(0),
			address!,
			proof?.merkle_root ? decode<BigNumber>('uint256', proof?.merkle_root ?? '') : BigNumber.from(0),
			proof?.nullifier_hash ? decode<BigNumber>('uint256', proof?.nullifier_hash ?? '') : BigNumber.from(0),
			proof?.proof
				? decode<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>(
						'uint256[8]',
						proof?.proof ?? ''
				  )
				: [
						BigNumber.from(0),
						BigNumber.from(0),
						BigNumber.from(0),
						BigNumber.from(0),
						BigNumber.from(0),
						BigNumber.from(0),
						BigNumber.from(0),
						BigNumber.from(0),
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
						app_id="app_17dda298a99fac82b669a6da6405db74" // must be an app set to on-chain
						action={"worldcoin-human-soulbound-token"}
						signal={address}
						onSuccess={setProof}
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