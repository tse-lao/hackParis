"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
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


      //we can implement it here. s
      const handleDispute = async () => {
        console.log("dispute")
        toast.info("Dispute submitted")
      }

        return(
          <div className="flex gap-4">
              <Button>UP</Button>
              <Button>Down</Button>
            </div>
        )

    },
  },
];
