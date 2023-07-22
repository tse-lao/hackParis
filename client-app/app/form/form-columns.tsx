"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { Form } from "./types"


export const FormColumns: ColumnDef<Form>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
        const form = row.original
        
        return (
            <Link href={`/form/${form.formID}`} className="text-purple-600 hover:text-purple-800">
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
    
    
  }
]