"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import Link from "next/link"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Form = {
    formID:number
    formCID:string
    category:string
    name:string
    rewardToken:string
    submitionReward:string
    formAdmin:string
    contributions?: Contribution[]
    totalContributions: number
  }



export const FormColumns: ColumnDef<Form>[] = [
  {
    accessorKey: "requestName",
    header: "Name",
    cell: ({ row }) => {
        const form = row.original
        
        return (
            <Link href='#' className="text-green-300 hover:text-green-500">
                {form.name}
            </Link>
        )
    }
  },
  {
    accessorKey: "category",
    header: "category",
  },
  {
    accessorKey: "formAdmin",
    header: "formAdmin",
    
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
    
    
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]