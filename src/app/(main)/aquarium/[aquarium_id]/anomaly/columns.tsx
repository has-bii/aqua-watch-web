"use client"

import { Database } from "@/types/database"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type Data = Database["public"]["Tables"]["anomalies"]["Row"]

export const columns: ColumnDef<Data>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => <span className="font-mono">{row.index + 1}</span>,
  },
  {
    accessorKey: "data_datetime",
    header: "Data DateTime",
    cell: ({ row }) => <span className="font-mono">{format(row.getValue("data_datetime"), "pp PP")}</span>,
  },
  {
    accessorKey: "anomaly_score",
    header: "Anomaly Score",
    cell: ({ row }) => <span className="font-mono">{row.getValue("anomaly_score")}</span>,
  },
  {
    accessorKey: "parameter",
    header: "Parameter",
    cell: ({ row }) => <span className="font-mono">{row.getValue("parameter")}</span>,
  },
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ row }) => <span className="font-mono">{row.getValue("severity")}</span>,
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => <span className="font-mono">{row.getValue("value")}</span>,
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
]
