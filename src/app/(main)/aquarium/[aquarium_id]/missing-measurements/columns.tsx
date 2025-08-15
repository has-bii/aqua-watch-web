"use client"

import { Database } from "@/types/database"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type Data = Database["public"]["Tables"]["missing_measurements"]["Row"]

export const columns: ColumnDef<Data>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => <span className="font-mono">{row.index + 1}</span>,
  },
  {
    accessorKey: "duration_minutes",
    header: "Duration",
    cell: ({ row }) => {
      const duration = row.getValue("duration_minutes") as number
      const hours = Math.floor(duration / 60)
      const minutes = duration % 60
      return <span className="font-mono">{`${hours}h ${minutes}m`}</span>
    },
  },
  {
    accessorKey: "gap_start",
    header: "Gap Start",
    cell: ({ row }) => <span className="font-mono">{format(row.getValue("gap_start"), "pp PP")}</span>,
  },
  {
    accessorKey: "gap_end",
    header: "Gap End",
    cell: ({ row }) => <span className="font-mono">{format(row.getValue("gap_end"), "pp PP")}</span>,
  },
]
