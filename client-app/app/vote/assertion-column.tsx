"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Assertion = {
  assertionId: string;
  domainId: string;
  claim: string;
  asserter: any;
  identifier: string;
  callbackRecipient: any;
  escalationManager: any;
  caller: any;
  expirationTime: number;
  currency: any;
  bond: number;
  disputer: any;
  settlementPayout: number;
  settlementRecipient: any;
  settlementResolution: boolean;
  assertionTimestamp: number;
  assertionBlockNumber: number;
  assertionHash: any;
  assertionLogIndex: number;
  disputeTimestamp: number;
  disputeBlockNumber: number;
  disputeHash: any;
  disputeLogIndex: number;
  settlementTimestamp: number;
  settlementBlockNumber: number;
  settlementHash: any;
  settlementLogIndex: number;
  status: string;
};

export const assertionColumn: ColumnDef<Assertion>[] = [
  {
    accessorKey: "requestName",
    header: "Name",
    cell: ({ row }) => {
      const assertion = row.original;

      return (
        <Link
          href={`/uma/${assertion.assertionId}`}
          className="text-indigo-700 hover:text-indigo-800"
        >
          {assertion.assertionId}
        </Link>
      );
    },
  },
  {
    accessorKey: "disputer",
    header: "disputer",
  },
  {
    accessorKey: "expirationTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Expiration Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const assertion = row.original;
      const toast = useToast();

      //we can implement it here. s
      const handleDispute = async () => {
        console.log("dispute")
        toast({
          title: "Dispute",
          description: "Dispute",
        })
      }

      switch (assertion.status) {
        case "disputing":
          return (
            <div className="flex gap-4">
              <Button>UP</Button>
              <Button>Down</Button>
            </div>
          );
        case "open":
          return (
            <Button onClick={handleDispute}>Dispute</Button>
          );
        case "ready":
          return (
            <Button onClick={handleDispute}>Execute</Button>
          );
        default:
          return (
            <Button>Finished</Button>
          );  
          }
    },
  },
];
