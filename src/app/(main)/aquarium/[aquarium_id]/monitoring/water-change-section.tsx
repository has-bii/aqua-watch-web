import useGetWaterChanges from "@/hooks/water-change/use-get-water-changes"
import TSupabaseClient from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"
import React, { memo, useMemo } from "react"
import WaterChangeDialog from "./water-change-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  aquarium_id: string
  supabase: TSupabaseClient
}

const WaterChangeSection = memo(function WaterChangeSection({ ...props }: Props) {
  const { data } = useGetWaterChanges(props)

  const lastWaterChange = useMemo(() => {
    if (!data || data.length === 0) return "No water changes recorded yet"

    const lastChange = data[0]
    return `Last changed: ${formatDistanceToNow(lastChange.changed_at, { addSuffix: true })}`
  }, [data])

  return (
    // <div className="space-y-4">
    //   <h2 className="text-xl font-bold">Water Changes</h2>

    //   <div className="flex w-full flex-row items-center justify-between rounded-xl bg-white px-4 py-3 shadow">
    //     <p className="text-muted-foreground text-sm font-medium">{lastWaterChange}</p>

    //     {/* Feed handler */}
    //     <WaterChangeDialog {...props} />
    //   </div>

    //   <div className="flex w-full flex-row items-center justify-between rounded-xl bg-white px-4 py-3 shadow">
    //     <Table>
    //       <TableHeader>
    //         <TableRow>
    //           <TableHead className="w-[50px]">#</TableHead>
    //           <TableHead className="text-center">Percentage Changed</TableHead>
    //           <TableHead className="text-right">Changed At</TableHead>
    //         </TableRow>
    //       </TableHeader>
    //       <TableBody>
    //         {data === undefined ? (
    //           <TableRow>
    //             <TableCell colSpan={2} className="text-center font-medium">
    //               {error ? error.message : "Loading water changing data..."}
    //             </TableCell>
    //           </TableRow>
    //         ) : data.length === 0 ? (
    //           <TableRow>
    //             <TableCell colSpan={2} className="text-center font-medium">
    //               No water changes recorded yet
    //             </TableCell>
    //           </TableRow>
    //         ) : (
    //           data.map((water, index) => (
    //             <TableRow key={water.id}>
    //               <TableCell className="font-medium">{index + 1}</TableCell>
    //               <TableCell className="text-center">{water.percentage_changed * 100}%</TableCell>
    //               <TableCell className="text-right">{format(water.changed_at, "p PP")}</TableCell>
    //             </TableRow>
    //           ))
    //         )}
    //       </TableBody>
    //     </Table>
    //   </div>
    // </div>
    <Card>
      <CardHeader>
        <CardTitle>Water Changes</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex w-full flex-row items-center justify-between">
          <p className="text-muted-foreground text-sm font-medium">{lastWaterChange}</p>
          {/* Feed handler */}
          <WaterChangeDialog {...props} />
        </div>
      </CardContent>
    </Card>
  )
})

export default WaterChangeSection
