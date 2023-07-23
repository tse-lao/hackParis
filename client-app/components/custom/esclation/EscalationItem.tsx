"use client"
import { Button } from "@/components/ui/button";
import { ABI, CONTRACTS } from "@/services/contracts";
import { useContractWrite } from "wagmi";
import TimeRemaining from "./TimeRemaining";

export default function EscalationItem({ item }: { item: any }) {
    const {write:dispute} = useContractWrite({
        address: CONTRACTS.mumbai.voteForm,
        abi: ABI.mumbai.voteForm,
        functionName: 'disputeAssertion',
        args: [
            item.assertionId,
        ],
    })
    const {write:execute} = useContractWrite({
        address: CONTRACTS.mumbai.voteForm,
        abi: ABI.mumbai.voteForm,
        functionName: 'settleAssertions',
        args: [
            item.assertionId,
        ],
    })
    const {write:voteUp} = useContractWrite({
        address: CONTRACTS.mumbai.voteForm,
        abi: ABI.mumbai.voteForm,
        functionName: 'voteUp',
        args: [
            true, 
            item.assertionId,
        ],
    })
    const {write:voteDown} = useContractWrite({
        address: CONTRACTS.mumbai.voteForm,
        abi: ABI.mumbai.voteForm,
        functionName: 'voteDown',
        args: [
            false, 
            item.assertionId,
        ],
    })
    
  return (
    <div className="flex items-center justify-between space-x-4 bg-gray-100 p-3">
      <div className="grid grid-cols-6 items-center space-x-4">
        <div className="col-span-1">
          <TimeRemaining timestamp={item.expirationTime} />
        </div>
        <div className="col-span-4">
          <p className="text-sm font-medium leading-none truncate">
            {item.assertionId}
          </p>
          <p className="text-sm text-muted-foreground truncate">{item.claim}</p>
        </div>
        {item.status === "active" && (
             <Button className="col-span-1"
             onClick={(e) => {e.preventDefault; dispute();}}
             >Dispute</Button>
        )}
         {item.status === "expired" && (
             <Button className="col-span-1"
             onClick={(e) => {e.preventDefault; execute();}}
             >Execute</Button>
        )}
         {item.status === "dispute" && (
            <div className="flex flex-col gap-1">
             <Button className="col-span-1 bg-green-600"  onClick={(e) => {e.preventDefault; voteUp();}}>Up</Button>
             <Button className="col-span-1 bg-red-600"  onClick={(e) => {e.preventDefault; voteDown();}}>Down</Button>
            </div>
        )}
       
      </div>
    </div>
  );
}
