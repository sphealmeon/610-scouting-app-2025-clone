"use client"

import { AggregateData } from "@/app/interfaces"
import { useState, useEffect } from "react"
import { TeamAggregate } from "@/app/firebase/TeamAggregate"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from "@tanstack/react-table"
   
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

export const columns: ColumnDef<AggregateData>[] = [
    {
        accessorKey: "standing",
        header: "Qual Ranking",
    },
    {
        accessorKey: "autoPPG",
        header: "Auto PPG",
        cell: ({ row }) => (row.getValue("autoPPG") as number).toFixed(2)
    },
    {
        accessorKey: "teleopPPG",
        header: "Teleop PPG",
        cell: ({ row }) => (row.getValue("teleopPPG") as number).toFixed(2)
    },
    {
        accessorKey: "endgamePPG",
        header: "Endgame PPG",
        cell: ({ row }) => (row.getValue("endgamePPG") as number).toFixed(2)
    },
    {
        accessorKey: "coralCyclesScored",
        header: "# of Coral Cycles/Game",
        cell: ({ row }) => (row.getValue("coralCyclesScored") as number).toFixed(2)
    },
    {
        accessorKey: "algaeCyclesScored",
        header: "# of Algae Cycles/Game",
        cell: ({ row }) => (row.getValue("algaeCyclesScored") as number).toFixed(2)
    },
    {
        accessorKey: "teleopL1Accuracy",
        header: "Teleop L1 Accuracy",
        cell: ({ row }) => ((row.getValue("teleopL1Accuracy") as number) * 100).toFixed(1) + "%"
    },
    {
        accessorKey: "teleopL2Accuracy",
        header: "Teleop L2 Accuracy",
        cell: ({ row }) => ((row.getValue("teleopL2Accuracy") as number) * 100).toFixed(1) + "%"
    },
    {
        accessorKey: "teleopL3Accuracy",
        header: "Teleop L3 Accuracy",
        cell: ({ row }) => ((row.getValue("teleopL3Accuracy") as number) * 100).toFixed(1) + "%"
    },
    {
        accessorKey: "teleopL4Accuracy",
        header: "Teleop L4 Accuracy",
        cell: ({ row }) => ((row.getValue("teleopL4Accuracy") as number) * 100).toFixed(1) + "%"
    },
]


export function DataTable({
    teams,
}: {
    teams: number[]
}) {
    const [data, setData] = useState<AggregateData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const aggregateData = await Promise.all(
                    teams.map(team => TeamAggregate({ team }))
                )
                setData(aggregateData.filter(data => data !== undefined))
            } catch (error) {
                console.error("Error fetching team data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [teams])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
   
    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
