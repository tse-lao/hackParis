"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { RequestCreated } from "./types"


export const FormColumns: ColumnDef<RequestCreated>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
        const form = row.original
        
        return (
            <Link href={`/voteform/${form.formID}`} className="text-purple-600 hover:text-purple-800">
                {form.requestName}
            </Link>
        )
    }
  },
  {
    accessorKey: "category",
    header: "category",
  },
  {
    accessorKey: "creator",
    header: "creator",
    
  }, 
  {
    accessorKey: "totalContributions",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contributions
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    
    
  }
]